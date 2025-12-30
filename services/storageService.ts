import { User, Artwork } from '../types';

/**
 * Mock Database Layer
 * Simulates asynchronous MongoDB operations.
 * In a real app, these methods would use fetch() or axios to hit a Node/Express API.
 */

const DB_DELAY = 600; // Simulate network latency

const SEED_ARTWORKS: Artwork[] = [
  {
    _id: '65f1a2b3c4d5e6f7g8h9i0j1',
    userId: 'demo_user_id',
    authorName: 'Demo Artist',
    title: 'Neon Dreams',
    description: 'A cyberpunk inspired city street at night.',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    createdAt: new Date().toISOString(),
    tags: ['cyberpunk', 'neon', 'city'],
  },
  {
    _id: '65f1a2b3c4d5e6f7g8h9i0j2',
    userId: 'demo_user_id',
    authorName: 'Demo Artist',
    title: 'Serenity',
    description: 'A calm lake reflecting the mountains.',
    imageUrl: 'https://picsum.photos/600/800?random=2',
    createdAt: new Date().toISOString(),
    tags: ['nature', 'calm', 'blue'],
  },
  {
    _id: '65f1a2b3c4d5e6f7g8h9i0j3',
    userId: 'demo_user_id',
    authorName: 'Demo Artist',
    title: 'Abstract Thoughts',
    description: 'Chaos and order mixed in color.',
    imageUrl: 'https://picsum.photos/800/800?random=3',
    createdAt: new Date().toISOString(),
    tags: ['abstract', 'art', 'colorful'],
  },
];

const SEED_USERS: User[] = [
  {
    _id: 'demo_user_id',
    username: 'demo_artist',
    email: 'demo@example.com',
    bio: 'I create digital dreams.',
    avatar: 'https://picsum.photos/200/200?random=10'
  }
];

// Helper to simulate async delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Internal storage keys (mimicking Collections)
const COLLECTION_USERS = 'db_users';
const COLLECTION_ARTWORKS = 'db_artworks';
const SESSION_KEY = 'active_session';

const initDB = () => {
  if (!localStorage.getItem(COLLECTION_ARTWORKS)) {
    localStorage.setItem(COLLECTION_ARTWORKS, JSON.stringify(SEED_ARTWORKS));
  }
  if (!localStorage.getItem(COLLECTION_USERS)) {
    localStorage.setItem(COLLECTION_USERS, JSON.stringify(SEED_USERS));
  }
};

initDB();

// --- Database Operations ---

export const db = {
  // Users Collection
  users: {
    async findOne(query: { email?: string; username?: string; _id?: string }): Promise<User | null> {
      await delay(DB_DELAY);
      const users: User[] = JSON.parse(localStorage.getItem(COLLECTION_USERS) || '[]');
      
      return users.find(u => 
        (query.email && u.email === query.email) ||
        (query.username && u.username === query.username) ||
        (query._id && u._id === query._id)
      ) || null;
    },

    async insertOne(user: User): Promise<User> {
      await delay(DB_DELAY);
      const users: User[] = JSON.parse(localStorage.getItem(COLLECTION_USERS) || '[]');
      users.push(user);
      localStorage.setItem(COLLECTION_USERS, JSON.stringify(users));
      return user;
    }
  },

  // Artworks Collection
  artworks: {
    async find(): Promise<Artwork[]> {
      await delay(DB_DELAY);
      return JSON.parse(localStorage.getItem(COLLECTION_ARTWORKS) || '[]');
    },

    async findByUserId(userId: string): Promise<Artwork[]> {
      await delay(DB_DELAY);
      const all: Artwork[] = JSON.parse(localStorage.getItem(COLLECTION_ARTWORKS) || '[]');
      return all.filter(a => a.userId === userId);
    },

    async insertOne(artwork: Artwork): Promise<Artwork> {
      await delay(DB_DELAY);
      const all: Artwork[] = JSON.parse(localStorage.getItem(COLLECTION_ARTWORKS) || '[]');
      all.unshift(artwork); // Newest first
      localStorage.setItem(COLLECTION_ARTWORKS, JSON.stringify(all));
      return artwork;
    }
  },

  // Auth Service (Session Management)
  auth: {
    async login(email: string): Promise<User | null> {
      const user = await db.users.findOne({ email });
      if (user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        return user;
      }
      return null;
    },

    async logout(): Promise<void> {
      localStorage.removeItem(SESSION_KEY);
      await delay(200);
    },

    async getSession(): Promise<User | null> {
      // Fast check, usually no network delay for local session token check
      const stored = localStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    }
  }
};
