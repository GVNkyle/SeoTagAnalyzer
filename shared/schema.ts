import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// SEO Analysis related schemas
export const seoAnalyses = pgTable("seo_analyses", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  totalScore: integer("total_score").notNull(),
  metaTagsScore: integer("meta_tags_score").notNull(),
  socialMediaScore: integer("social_media_score").notNull(),
  technicalSeoScore: integer("technical_seo_score").notNull(),
  analyzedAt: timestamp("analyzed_at").notNull().defaultNow(),
});

export const insertSeoAnalysisSchema = createInsertSchema(seoAnalyses).pick({
  url: true,
  totalScore: true,
  metaTagsScore: true,
  socialMediaScore: true,
  technicalSeoScore: true,
});

export type InsertSeoAnalysis = z.infer<typeof insertSeoAnalysisSchema>;
export type SeoAnalysis = typeof seoAnalyses.$inferSelect;

// Schema for SEO analysis result
export const seoAnalysisResultSchema = z.object({
  url: z.string().url(),
  analyzedAt: z.string(),
  totalScore: z.number().min(0).max(100),
  scoreRating: z.enum(['Poor', 'Fair', 'Good', 'Excellent']),
  metaTags: z.object({
    score: z.number().min(0).max(100),
    items: z.array(z.object({
      name: z.string(),
      value: z.string().optional(),
      status: z.enum(['success', 'warning', 'error']),
      message: z.string().optional(),
    })),
  }),
  socialMedia: z.object({
    score: z.number().min(0).max(100),
    items: z.array(z.object({
      name: z.string(),
      value: z.string().optional(),
      status: z.enum(['success', 'warning', 'error']),
      message: z.string().optional(),
    })),
  }),
  technicalSeo: z.object({
    score: z.number().min(0).max(100),
    items: z.array(z.object({
      name: z.string(),
      value: z.string().optional(),
      status: z.enum(['success', 'warning', 'error']),
      message: z.string().optional(),
    })),
  }),
  previews: z.object({
    google: z.object({
      title: z.string(),
      url: z.string(),
      description: z.string(),
      titleLength: z.number(),
      descriptionLength: z.number(),
      isTitleLengthOptimal: z.boolean(),
      isDescriptionLengthOptimal: z.boolean(),
    }),
    social: z.object({
      title: z.string(),
      description: z.string(),
      image: z.string().optional(),
      isOpenGraphComplete: z.boolean(),
      isTwitterCardComplete: z.boolean(),
    }),
  }),
  recommendations: z.array(z.object({
    priority: z.enum(['high', 'medium', 'low']),
    title: z.string(),
    description: z.string(),
    code: z.string().optional(),
  })),
});

export type SeoAnalysisResult = z.infer<typeof seoAnalysisResultSchema>;
