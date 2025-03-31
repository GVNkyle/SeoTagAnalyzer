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
        return res.status(400).json({ 
          message: "URL is required",
          userMessage: "Please enter a website URL to analyze" 
        });
      }
      
      // Basic URL validation
      try {
        if (!url.startsWith('http')) {
          new URL(`https://${url}`);
        } else {
          new URL(url);
        }
      } catch (e) {
        return res.status(400).json({ 
          message: "Invalid URL format",
          userMessage: "Please enter a valid website URL (e.g., example.com or https://example.com)" 
        });
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
          errors: error.errors,
          userMessage: "The analysis format is invalid. Our team has been notified of this issue."
        });
      }
      
      // More specific user-friendly error messages
      let userMessage = "An error occurred while analyzing the URL. Please try again.";
      let statusCode = 500;
      
      const errorMessage = (error as Error).message || "";
      
      if (errorMessage.includes("Invalid URL format")) {
        userMessage = "Please enter a valid website URL (e.g., example.com)";
        statusCode = 400;
      } else if (errorMessage.includes("Connection error") || errorMessage.includes("Failed to fetch")) {
        userMessage = "Could not connect to the website. Please check the URL and try again.";
        statusCode = 400;
      } else if (errorMessage.includes("Request timeout")) {
        userMessage = "The website took too long to respond. Please try again later.";
        statusCode = 408;
      } else if (errorMessage.includes("Received empty response")) {
        userMessage = "The website returned an empty response. Please try another URL.";
        statusCode = 400;
      }
      
      return res.status(statusCode).json({ 
        message: errorMessage, 
        userMessage
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
