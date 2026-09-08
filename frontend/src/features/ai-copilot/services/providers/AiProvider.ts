import { AiContext, AiResponse } from '../../types/ai';

export interface AiProvider {
  readonly id: string;
  readonly name: string;
  generateResponse(prompt: string, context: AiContext): Promise<AiResponse>;
}
