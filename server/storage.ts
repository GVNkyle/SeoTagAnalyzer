import { seoAnalyses, users, type User, type InsertUser, type SeoAnalysis, type InsertSeoAnalysis } from "@shared/schema";

// Modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis>;
  getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined>;
  getRecentSeoAnalyses(limit?: number): Promise<SeoAnalysis[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private seoAnalyses: Map<number, SeoAnalysis>;
  currentUserId: number;
  currentAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.seoAnalyses = new Map();
    this.currentUserId = 1;
    this.currentAnalysisId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveSeoAnalysis(analysis: InsertSeoAnalysis): Promise<SeoAnalysis> {
    const id = this.currentAnalysisId++;
    const newAnalysis: SeoAnalysis = { 
      ...analysis, 
      id, 
      analyzedAt: new Date() 
    };
    this.seoAnalyses.set(id, newAnalysis);
    return newAnalysis;
  }

  async getSeoAnalysis(id: number): Promise<SeoAnalysis | undefined> {
    return this.seoAnalyses.get(id);
  }

  async getRecentSeoAnalyses(limit = 10): Promise<SeoAnalysis[]> {
    return Array.from(this.seoAnalyses.values())
      .sort((a, b) => {
        // Sort by analyzedAt in descending order (most recent first)
        return new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime();
      })
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
