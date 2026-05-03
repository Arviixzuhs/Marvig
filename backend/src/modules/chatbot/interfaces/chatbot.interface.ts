export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  toolCalls?: any[];
  toolCallId?: string;
}

export interface ToolDeclaration {
  name: string;
  description: string;
  parameters: {
    properties: Record<string, any>;
    required?: string[];
  };
}

export interface ChatRequestDto {
  message: string;
  history?: ChatMessage[];
}
