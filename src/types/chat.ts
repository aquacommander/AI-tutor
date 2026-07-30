import type { AgeGroupId } from './learner';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
}

/** Request body accepted by `POST /api/ai-tutor`. */
export interface TutorRequest {
  ageGroup: AgeGroupId;
  messages: Array<Pick<ChatMessage, 'role' | 'content'>>;
}
