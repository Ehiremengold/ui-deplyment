export interface Message {
  id: string;
  user: string;
  text: string;
  avatar: string;
  timestamp: number;
}

export interface SendMessageData {
  type: 'SEND' | 'EDIT' | 'DELETE' | 'CLEAR_ALL';
  avatar?: string;
  timestamp?: number;
  user?: string;
  message?: string;
  id?: string;
  newText?: string;
}
