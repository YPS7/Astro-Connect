import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data, messages, kundaliData } = await req.json();
    
    const DEEPSEEK_API_KEY = Deno.env.get("DEEPSEEK_API_KEY");
    if (!DEEPSEEK_API_KEY) {
      throw new Error("DEEPSEEK_API_KEY is not configured");
    }

    if (type === "kundali") {
      // Generate Kundali based on birth details
      const systemPrompt = `You are an expert Vedic astrologer. Based on the birth details provided, generate a personalized Kundali (birth chart) analysis. You must respond with ONLY a valid JSON object (no markdown, no extra text) with this exact structure:
{
  "sunSign": "zodiac sign",
  "moonSign": "moon sign/rashi",
  "ascendant": "rising sign/lagna",
  "nakshatra": "birth star",
  "rashi": "moon sign in Hindi",
  "personality": "2-3 sentence personality description",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "challenges": ["challenge 1", "challenge 2", "challenge 3"],
  "luckyElements": {
    "number": "lucky number",
    "color": "lucky color",
    "day": "lucky day",
    "gemstone": "recommended gemstone"
  }
}`;

      const userPrompt = `Generate a Kundali for:
Name: ${data.name}
Gender: ${data.gender}
Date of Birth: ${data.dateOfBirth}
Time of Birth: ${data.timeOfBirth}
Place of Birth: ${data.birthPlace}

Calculate their Vedic astrological chart and provide insights.`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-v3.1-terminus",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("DeepSeek API error:", response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content;
      
      let kundali;
      try {
        // Try to parse the JSON response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          kundali = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON found in response");
        }
      } catch (parseError) {
        console.error("Parse error:", parseError, "Content:", content);
        // Fallback kundali if parsing fails
        kundali = {
          sunSign: "Aries",
          moonSign: "Taurus",
          ascendant: "Leo",
          nakshatra: "Rohini",
          rashi: "Vrishabha",
          personality: "Based on your birth details, you have a strong and determined personality with natural leadership qualities.",
          strengths: ["Natural leader", "Creative thinker", "Emotionally resilient"],
          challenges: ["Can be stubborn", "May overthink decisions", "Needs to balance work and rest"],
          luckyElements: {
            number: "7",
            color: "Gold",
            day: "Sunday",
            gemstone: "Ruby"
          }
        };
      }

      return new Response(JSON.stringify({ kundali }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (type === "chat") {
      // AI Chat for astrology questions
      let systemPrompt = `You are an expert Vedic astrologer and spiritual guide. You provide insightful, compassionate guidance on astrology, horoscopes, planetary influences, Kundali matching, auspicious timings (muhurat), doshas, and spiritual matters. 

Keep responses concise but informative. Use Hindi terms where appropriate (like Rashi, Nakshatra, Graha) with English explanations. Add relevant emojis occasionally. Be warm and respectful, addressing users with "Namaste" when appropriate.`;

      if (kundaliData) {
        systemPrompt += `\n\nThe user has provided their birth details:
Name: ${kundaliData.name}
Gender: ${kundaliData.gender}
Date of Birth: ${kundaliData.dateOfBirth}
Time of Birth: ${kundaliData.timeOfBirth}
Place of Birth: ${kundaliData.birthPlace}

Use this information to provide personalized astrological insights when relevant.`;
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-v3.1-terminus",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          temperature: 0.8,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("DeepSeek API error:", response.status, errorText);
        throw new Error(`AI API error: ${response.status}`);
      }

      const result = await response.json();
      const message = result.choices[0]?.message?.content || "I apologize, I couldn't generate a response.";

      return new Response(JSON.stringify({ message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Invalid request type");

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
