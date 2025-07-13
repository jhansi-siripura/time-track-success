import { supabase } from "@/integrations/supabase/client";

export interface VideoTranscriptData {
  videoId: string;
  title: string;
  thumbnail?: string;
  transcript: string;
  duration?: string;
  description?: string;
  url: string;
}

export interface SummaryData {
  id: string;
  video_id: string;
  video_title: string;
  video_url: string;
  video_thumbnail?: string;
  transcript: string;
  summary: string;
  tags: string[];
  duration?: number;
  created_at: string;
  updated_at: string;
}

export class YouTubeService {
  
  static async extractTranscript(videoUrl: string): Promise<VideoTranscriptData> {
    const { data, error } = await supabase.functions.invoke('extract-youtube-transcript', {
      body: { videoUrl }
    });

    if (error) {
      throw new Error(`Failed to extract transcript: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to extract transcript');
    }

    return {
      videoId: data.videoId,
      title: data.title,
      thumbnail: data.thumbnail,
      transcript: data.transcript,
      duration: data.duration,
      description: data.description,
      url: videoUrl
    };
  }

  static async generateSummary(
    transcript: string, 
    videoData: VideoTranscriptData, 
    userId: string
  ): Promise<{ summary: SummaryData; generatedSummary: string; tags: string[] }> {
    const { data, error } = await supabase.functions.invoke('generate-summary', {
      body: { 
        transcript, 
        videoData, 
        userId 
      }
    });

    if (error) {
      throw new Error(`Failed to generate summary: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate summary');
    }

    return {
      summary: data.summary,
      generatedSummary: data.generatedSummary,
      tags: data.tags
    };
  }

  static async getSavedSummaries(userId: string): Promise<SummaryData[]> {
    const { data, error } = await supabase
      .from('youtube_summaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch saved summaries: ${error.message}`);
    }

    return data || [];
  }

  static async deleteSummary(summaryId: string): Promise<void> {
    const { error } = await supabase
      .from('youtube_summaries')
      .delete()
      .eq('id', summaryId);

    if (error) {
      throw new Error(`Failed to delete summary: ${error.message}`);
    }
  }

  static extractVideoId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}