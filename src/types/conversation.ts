export interface Message {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}
