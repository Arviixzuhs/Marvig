import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatMessage, ToolDeclaration } from '../interfaces/types';

@Injectable()
export class GroqProvider {
  private readonly logger = new Logger(GroqProvider.name);
  private readonly apiKey: string;
  private readonly modelName: string;
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GROQ_API_KEY') || '';
    this.modelName = this.configService.get<string>('GROQ_MODEL') || 'llama-3.3-70b-versatile';
  }

  async generateResponse(systemPrompt: string, history: ChatMessage[], tools?: ToolDeclaration[]): Promise<any> {
    if (!this.apiKey) {
      this.logger.error('GROQ_API_KEY no configurada');
      throw new Error('GROQ_API_KEY no configurada');
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(msg => {
        const mapped: any = {
          role: msg.role === 'assistant' ? 'assistant' : msg.role,
          content: msg.content || null,
        };
        if (msg.toolCalls) {
          mapped.tool_calls = msg.toolCalls.map(tc => ({
            id: tc.id,
            type: 'function',
            function: {
              name: tc.name,
              arguments: JSON.stringify(tc.args),
            }
          }));
        }
        if (msg.role === 'tool') {
          mapped.tool_call_id = msg.toolCallId;
        }
        return mapped;
      })
    ];

    const payload: any = {
      model: this.modelName,
      messages: messages,
      stream: false,
    };

    if (tools && tools.length > 0) {
      payload.tools = tools.map(t => ({
        type: 'function',
        function: {
          name: t.name,
          description: t.description,
          parameters: {
            type: 'object',
            properties: t.parameters.properties,
            required: t.parameters.required || [],
          }
        }
      }));
      payload.tool_choice = 'auto';
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(`Groq Error ${response.status}: ${errorBody}`);
        throw new Error(`Groq API Error`);
      }

      const data = await response.json();
      const message = data.choices[0].message;

      if (message.tool_calls && message.tool_calls.length > 0) {
        return {
          content: message.content || '',
          toolCalls: message.tool_calls.map((tc: any) => ({
            id: tc.id,
            name: tc.function.name,
            args: JSON.parse(tc.function.arguments),
          }))
        };
      }

      return { content: message.content || '' };
    } catch (error: any) {
      this.logger.error(`Error Groq: ${error.message}`);
      throw error;
    }
  }
}
