export interface User {
  _id: string; // MongoDB convention
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Artwork {
  _id: string; // MongoDB convention
  userId: string;
  authorName: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  tags: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
