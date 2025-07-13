
import { VideoMetadata, TranscriptSegment } from '../types/youtube';

export class NewYouTubeService {
  static extractVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  static async getVideoMetadata(videoId: string): Promise<VideoMetadata> {
    try {
      // Use YouTube oEmbed API to get basic video info
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      
      if (response.ok) {
        const data = await response.json();
        return {
          title: data.title || `Video: ${videoId}`,
          channel: data.author_name || 'Unknown Channel',
          duration: 'Unknown',
          thumbnail: data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          videoId,
          url: `https://www.youtube.com/watch?v=${videoId}`
        };
      }
    } catch (error) {
      console.log('oEmbed API failed, using fallback metadata');
    }

    // Fallback metadata
    return {
      title: `Video: ${videoId}`,
      channel: 'Unknown Channel',
      duration: 'Unknown',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`
    };
  }

  static async getTranscript(videoId: string): Promise<TranscriptSegment[]> {
    try {
      const response = await fetch(
        `https://51479b1d-d8ee-42b4-a76c-12e5aa9ffc57-00-vf94yjagbeq9.pike.replit.dev/transcript?video_id=${videoId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const transcript = await response.json();

      return transcript.map((item: any) => ({
        text: item.text,
        start: item.start,
        duration: item.duration
      }));
    } catch (error) {
      console.error('Failed to fetch transcript:', error);
      throw new Error('Could not fetch transcript. Video may not have captions or the API failed.');
    }
  }

  static formatTranscriptText(segments: TranscriptSegment[]): string {
    return segments.map(segment => segment.text).join(' ');
  }
}
