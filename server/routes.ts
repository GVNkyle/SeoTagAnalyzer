import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeSeo } from "./seo-analyzer";
import { seoAnalysisResultSchema, SeoAnalysisResult } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint to analyze a website's SEO
  app.post("/api/analyze", async (req, res) => {
    try {
      // Extract URL from request body
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ message: "URL is required" });
      }
      
      // Analyze the website
      const result = await analyzeSeo(url);
      
      // Validate the result against our schema
      const validatedResult = seoAnalysisResultSchema.parse(result);
      
      // Save the analysis result
      await storage.saveSeoAnalysis({
        url: validatedResult.url,
        totalScore: validatedResult.totalScore,
        metaTagsScore: validatedResult.metaTags.score,
        socialMediaScore: validatedResult.socialMedia.score,
        technicalSeoScore: validatedResult.technicalSeo.score,
      });
      
      // Return the result to the client
      return res.status(200).json(validatedResult);
    } catch (error) {
      console.error("Error analyzing URL:", error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid analysis result format", 
          errors: error.errors 
        });
      }
      
      return res.status(500).json({ 
        message: (error as Error).message || "An error occurred while analyzing the URL" 
      });
    }
  });

  // API endpoint to get recent analyses
  app.get("/api/recent-analyses", async (req, res) => {
    try {
      const analyses = await storage.getRecentSeoAnalyses();
      return res.status(200).json(analyses);
    } catch (error) {
      console.error("Error fetching recent analyses:", error);
      return res.status(500).json({ 
        message: (error as Error).message || "An error occurred while fetching recent analyses" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
