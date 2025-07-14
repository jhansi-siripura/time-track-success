import { VideoMetadata, TranscriptSegment } from '../types/youtube';
import { YoutubeTranscript } from 'youtube-transcript'; // npm install youtube-transcript

export class NewYouTubeService {
  static extractVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  static async getVideoMetadata(videoId: string): Promise<VideoMetadata> {
    try {
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

    return {
      title: `Video: ${videoId}`,
      channel: 'Unknown Channel',
      duration: 'Unknown',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`
    };
  }

  // ✅ Option 1: Replit-based transcript fetch
  static async getTranscriptFromReplit(videoId: string): Promise<TranscriptSegment[]> {
    try {
      const response = await fetch(
        `https://8b62a8e1-2179-417d-ba6e-fbd005e34411-00-19r1v2dshk7ui.sisko.replit.dev/transcript?video_id=${videoId}`
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
      console.error('Replit fetch failed:', error);
      throw new Error('Could not fetch transcript from Replit.');
    }
  }

  // ✅ Option 2: Frontend-only using `youtube-transcript`
  static async getTranscriptFromFrontend(videoId: string): Promise<TranscriptSegment[]> {
    try {
      const transcript = await YoutubeTranscript.fetchTranscript(videoId);
      return transcript.map((item: any) => ({
        text: item.text,
        start: item.start,
        duration: item.duration
      }));
    } catch (error) {
      console.error('Frontend transcript fetch failed:', error);
      throw new Error('Could not fetch transcript using frontend method.');
    }
  }

  // 🔜 Option 3: Placeholder for paid services like AssemblyAI
  static async getTranscriptFromAssemblyAI(videoUrl: string): Promise<TranscriptSegment[]> {
    throw new Error('AssemblyAI integration not implemented yet.');
    // You can add logic to upload audio + get transcript from AssemblyAI later
  }

  // ✅ Common formatter
  static formatTranscriptText(segments: TranscriptSegment[]): string {
    return segments.map(segment => segment.text).join(' ');
  }
}
