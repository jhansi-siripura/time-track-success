import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transcript, videoData, userId } = await req.json();
    
    if (!transcript || !videoData || !userId) {
      throw new Error('Missing required data: transcript, videoData, and userId are required');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Generate summary using OpenAI
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at creating concise, informative summaries of YouTube video transcripts. 
            Create a well-structured summary that captures the key points, main themes, and important insights.
            Format your response as a clean, readable summary with bullet points for key concepts.
            Also suggest 3-5 relevant tags for categorization.`
          },
          {
            role: 'user',
            content: `Please summarize this YouTube video transcript and suggest relevant tags:

Video Title: ${videoData.title}

Transcript:
${transcript}

Please provide:
1. A comprehensive summary (2-3 paragraphs)
2. Key points (bullet format)
3. 3-5 relevant tags for categorization`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      }),
    });

    if (!summaryResponse.ok) {
      throw new Error(`OpenAI API error: ${await summaryResponse.text()}`);
    }

    const summaryData = await summaryResponse.json();
    const summary = summaryData.choices[0].message.content;

    // Extract tags from the summary (simple approach)
    const tagMatch = summary.match(/tags?:\s*(.+?)(?:\n|$)/i);
    const suggestedTags = tagMatch ? 
      tagMatch[1].split(',').map(tag => tag.trim().replace(/^["']|["']$/g, '')) : 
      ['youtube', 'summary'];

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Save summary to database
    const { data, error } = await supabase
      .from('youtube_summaries')
      .insert({
        user_id: userId,
        video_id: videoData.videoId,
        video_title: videoData.title,
        video_url: videoData.url,
        video_thumbnail: videoData.thumbnail,
        transcript: transcript,
        summary: summary,
        tags: suggestedTags,
        duration: videoData.duration
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to save summary to database');
    }

    return new Response(JSON.stringify({
      success: true,
      summary: data,
      generatedSummary: summary,
      tags: suggestedTags
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-summary function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});