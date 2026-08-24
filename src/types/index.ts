export type PostType = 'バグ' | '要望' | '相談' | '改修報告' | 'その他';

export type CategoryColor =
  | 'blue'
  | 'emerald'
  | 'teal'
  | 'indigo'
  | 'purple'
  | 'amber'
  | 'rose'
  | 'cyan'
  | 'orange'
  | 'pink';

export interface Tool {
  id: string;
  name: string;
  category: string;
  color?: CategoryColor;
  description: string;
  url: string;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface Post {
  id: string;
  type: PostType;
  content: string;
  author_name: string;
  author_email: string;
  created_at: string;
  updated_at?: string;
}

export interface Favorite {
  id: string;
  user_email: string;
  tool_id: string;
  created_at?: string;
}

export interface UserSession {
  name: string;
  email: string;
  image?: string;
  isAdmin: boolean;
}
