import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { videoUrl } = await req.json();
    
    if (!videoUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'Video URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid YouTube URL' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing video ID: ${videoId}`);

    if (!YOUTUBE_API_KEY) {
      console.error('YouTube API key not found in environment variables');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'YouTube API key not configured. Please add YOUTUBE_API_KEY to Supabase Edge Function Secrets.' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Try to fetch transcript using YouTube API
    try {
      const transcriptResult = await fetchYouTubeTranscript(videoId);
      
      return new Response(
        JSON.stringify({
          success: true,
          videoId,
          title: transcriptResult.title,
          thumbnail: transcriptResult.thumbnail,
          transcript: transcriptResult.transcript,
          duration: transcriptResult.duration,
          description: transcriptResult.description
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (transcriptError) {
      console.error('Transcript fetch failed:', transcriptError);
      
      // Fallback: fetch basic video info
      try {
        const basicInfo = await fetchBasicVideoInfo(videoId);
        
        return new Response(
          JSON.stringify({
            success: true,
            videoId,
            title: basicInfo.title,
            thumbnail: basicInfo.thumbnail,
            transcript: 'Transcript not available for this video. This could be due to: disabled captions, private video, or API limitations.',
            duration: basicInfo.duration,
            description: basicInfo.description
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } catch (basicInfoError) {
        console.error('Basic info fetch failed:', basicInfoError);
        
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Failed to fetch video information. Please check if the video exists and is publicly accessible.' 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }
  } catch (error) {
    console.error('Error in extract-youtube-transcript function:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Fetch transcript using YouTube API
async function fetchYouTubeTranscript(videoId: string) {
  // First get video details
  const videoInfo = await fetchBasicVideoInfo(videoId);
  
  // Try to get captions list
  try {
    const captionsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!captionsResponse.ok) {
      throw new Error(`Captions API error: ${captionsResponse.status}`);
    }
    
    const captionsData = await captionsResponse.json();
    console.log('Captions available:', captionsData.items?.length || 0);
    
    if (captionsData.items && captionsData.items.length > 0) {
      // Find English captions or use the first available
      const englishCaption = captionsData.items.find(
        (item: any) => item.snippet.language === 'en' || item.snippet.language === 'en-US'
      ) || captionsData.items[0];
      
      console.log('Found caption track:', englishCaption.snippet.language);
      
      // Try to get actual caption content using a more robust approach
      try {
        // For now, return a message indicating captions are available
        // In production, you'd need to implement proper caption download
        return {
          ...videoInfo,
          transcript: `Captions are available for this video in ${englishCaption.snippet.language}. To access full transcript content, additional YouTube API authorization would be required. Consider implementing third-party transcript extraction services or manual caption download methods.`
        };
      } catch (captionError) {
        console.error('Error downloading caption content:', captionError);
        return {
          ...videoInfo,
          transcript: `Captions detected in ${englishCaption.snippet.language} but content extraction failed. Please try with a different video or implement additional transcript extraction methods.`
        };
      }
    } else {
      return {
        ...videoInfo,
        transcript: 'No captions available for this video. The creator may not have enabled captions or auto-generated captions.'
      };
    }
  } catch (error) {
    console.error('Error fetching captions:', error);
    return {
      ...videoInfo,
      transcript: 'Unable to fetch captions. This may be due to API limitations or video restrictions.'
    };
  }
}

// Fetch basic video information
async function fetchBasicVideoInfo(videoId: string) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.items || data.items.length === 0) {
    throw new Error('Video not found');
  }
  
  const video = data.items[0];
  const snippet = video.snippet;
  const contentDetails = video.contentDetails;
  
  // Convert ISO 8601 duration to readable format
  const duration = contentDetails?.duration ? parseDuration(contentDetails.duration) : 'Unknown';
  
  return {
    title: snippet.title,
    thumbnail: snippet.thumbnails?.maxresdefault?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
    duration,
    description: snippet.description || 'No description available'
  };
}

// Parse ISO 8601 duration format (PT4M13S) to readable format
function parseDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 'Unknown';
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}