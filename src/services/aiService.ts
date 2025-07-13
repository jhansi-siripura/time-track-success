import { AIConfig, TranscriptSegment } from '../types/youtube';

export class AIService {
  private config: AIConfig;

  constructor(config: AIConfig) {
    this.config = config;
  }

  async generateSummaryCards(transcript: string, segments: TranscriptSegment[]) {
    const prompt = this.buildSummarizationPrompt(transcript);
    
    try {
      const response = await this.callAI(prompt);
      return this.parseAIResponse(response, segments);
    } catch (error) {
      console.error('AI summarization failed:', error);
      throw new Error('Failed to generate summary. Please check your API key and try again.');
    }
  }

  private buildSummarizationPrompt(transcript: string): string {
    return `You are a professional note-taker helping students understand educational YouTube content.

Your task is to generate **clean, well-formatted notes** from the transcript below.

📝 Please follow these formatting rules strictly:
1. Start with a **main title** (4–10 words).
2. Use **Markdown-style formatting**:
   - One H1 heading using \`#\` for the main title
   - Use \`##\` for each major section (e.g., components, hooks)
   - Under each \`##\` heading, include **bullet points** using \`- \` (hyphen and space) — no long paragraphs
3. Add **a blank line between sections** to improve readability.
4. Keep the tone instructional and student-friendly — like class notes.
5. Do **not** include timestamps or raw transcript lines.
6. Total word count should be around 400–600 words.

🎯 Your goal is to make this feel like smartly written study notes someone can revise from.

Transcript:
${transcript}

Output only a JSON array with one object like this:

[
  {
    "title": "string (main summary card title)",
    "content": "string (formatted notes with headings and bullet points)",
    "startTime": 0,
    "endTime": number (estimated video duration in seconds)
  }
]

⚠️ Format your response strictly as valid JSON. Do not include any explanation or extra text.`;
  }

  private async callAI(prompt: string): Promise<string> {
    const { provider, apiKey, model } = this.config;
    
    console.log('AI Config:', { provider, hasApiKey: !!apiKey, model });
    
    // Normalize provider to lowercase to avoid case sensitivity issues
    const normalizedProvider = provider?.toLowerCase().trim();
    
    switch (normalizedProvider) {
      case 'openai':
        return this.callOpenAI(prompt, apiKey, model);
      case 'anthropic':
        return this.callAnthropic(prompt, apiKey, model);
      case 'perplexity':
        return this.callPerplexity(prompt, apiKey, model);
      case 'cohere':
        return this.callCohere(prompt, apiKey, model);
      case 'gemini':
        return this.callGemini(prompt, apiKey, model);
      default:
        console.error('Unsupported AI provider:', provider, 'normalized:', normalizedProvider);
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  private async callOpenAI(prompt: string, apiKey: string, model: string): Promise<string> {
    console.log('Calling OpenAI with model:', model || 'gpt-4o-mini');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callAnthropic(prompt: string, apiKey: string, model: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model || 'claude-3-haiku-20240307',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0].text;
  }

  private async callPerplexity(prompt: string, apiKey: string, model: string): Promise<string> {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'llama-3.1-sonar-small-128k-online',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  private async callCohere(prompt: string, apiKey: string, model: string): Promise<string> {
    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'command',
        prompt: prompt,
        max_tokens: 2000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.generations[0].text;
  }

  private async callGemini(prompt: string, apiKey: string, model: string): Promise<string> {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-pro'}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  private parseAIResponse(response: string, segments: TranscriptSegment[]) {
    try {
      const cleanResponse = response.trim().replace(/```json\n?|```\n?/g, '');
      const summaryData = JSON.parse(cleanResponse);
      
      // Ensure we only return one summary card
      const firstSummary = Array.isArray(summaryData) ? summaryData[0] : summaryData;
      
      return [{
        id: `summary-${Date.now()}`,
        title: firstSummary.title || 'Video Summary',
        content: firstSummary.content || 'Summary not available',
        timestamp: this.formatTimestamp(firstSummary.startTime || 0, firstSummary.endTime || segments.length * 10),
        startTime: firstSummary.startTime || 0,
        endTime: firstSummary.endTime || segments.length * 10,
      }];
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      // Fallback to single summary if AI response parsing fails
      return this.fallbackSummary(segments);
    }
  }

  private fallbackSummary(segments: TranscriptSegment[]) {
    const fullText = segments.map(s => s.text).join(' ');
    
    return [{
      id: `fallback-${Date.now()}`,
      title: 'Video Summary',
      content: fullText.substring(0, 500) + (fullText.length > 500 ? '...' : ''),
      timestamp: `0:00 - ${Math.floor(segments.length * 10 / 60)}:${(segments.length * 10 % 60).toString().padStart(2, '0')}`,
      startTime: 0,
      endTime: segments.length * 10,
    }];
  }

  private formatTimestamp(start: number, end: number): string {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    return `${formatTime(start)} - ${formatTime(end)}`;
  }
}
