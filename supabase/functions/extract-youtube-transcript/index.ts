import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { videoUrl } = await req.json();
    
    if (!videoUrl) {
      throw new Error('Video URL is required');
    }

    // Extract video ID from YouTube URL
    const extractVideoId = (url: string) => {
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
      const match = url.match(regex);
      return match ? match[1] : null;
    };

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Get video information using YouTube API (you could also use a transcript extraction service)
    // For now, we'll use a third-party service or extract manually
    
    // Using youtube-transcript-api alternative approach
    const transcriptResponse = await fetch(`https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${Deno.env.get('YOUTUBE_API_KEY')}`, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!transcriptResponse.ok) {
      // Fallback: Try to extract basic video info and generate a mock transcript
      // In production, you'd use a proper transcript extraction service
      const videoInfoResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${Deno.env.get('YOUTUBE_API_KEY')}`);
      
      if (!videoInfoResponse.ok) {
        throw new Error('Failed to fetch video information');
      }

      const videoInfo = await videoInfoResponse.json();
      const video = videoInfo.items[0];
      
      if (!video) {
        throw new Error('Video not found');
      }

      // For demonstration, return basic video info
      // In production, implement proper transcript extraction
      return new Response(JSON.stringify({
        videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
        duration: video.contentDetails.duration,
        transcript: `This is a placeholder transcript for the video "${video.snippet.title}". In a production environment, this would contain the actual transcript extracted from the video's captions or generated using speech-to-text technology.`,
        description: video.snippet.description
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const transcriptData = await transcriptResponse.json();
    
    return new Response(JSON.stringify({
      videoId,
      transcript: transcriptData,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in extract-youtube-transcript function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});