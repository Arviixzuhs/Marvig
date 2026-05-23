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

export class ChatRequestDto {
  message: string;
  history?: ChatMessage[];
}


export interface UserPayload {
  userId: number;
  username: string;
  email: string;
  role: string;
}
