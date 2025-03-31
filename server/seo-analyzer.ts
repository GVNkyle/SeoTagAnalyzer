import * as cheerio from 'cheerio';
import { SeoAnalysisResult } from '@shared/schema';
import { format } from 'date-fns';

interface MetaTag {
  name: string;
  value?: string;
  status: 'success' | 'warning' | 'error';
  message?: string;
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  code?: string;
}

export async function fetchWebsite(url: string): Promise<string> {
  // Validate and normalize URL
  try {
    // Ensure URL has protocol
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    
    // Basic URL validation
    new URL(url);
    
    // Handle known sites that block scraping
    const domain = new URL(url).hostname.toLowerCase();
    if (domain.includes('facebook.com') || 
        domain.includes('instagram.com') || 
        domain.includes('twitter.com') ||
        domain.includes('x.com')) {
      throw new Error(`Unable to analyze ${domain}. This website blocks external requests. Please try a different URL.`);
    }
    
    // Attempt to fetch with timeout and proper headers
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout
    
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(`Access forbidden: The website ${domain} doesn't allow external requests.`);
        } else if (response.status === 404) {
          throw new Error(`Page not found: The URL ${url} doesn't exist.`);
        } else {
          throw new Error(`Failed to fetch website: ${response.status} ${response.statusText}`);
        }
      }
      
      const html = await response.text();
      
      // Check if we actually got HTML content
      if (!html || html.trim().length === 0) {
        throw new Error('Received empty response from website');
      }
      
      return html;
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      throw fetchErr;
    }
  } catch (error) {
    console.error('Error fetching website:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: The website took too long to respond. Please try again later.');
      } else if (error.message.includes('Failed to fetch') || 
          error.message.includes('fetch failed') || 
          error.message.includes('unable to verify') || 
          error.message.includes('certificate')) {
        throw new Error(`Connection error: Unable to access the website. This could be due to a secure connection issue or the site may be blocking requests.`);
      } else if (error instanceof TypeError && error.message.includes('URL')) {
        throw new Error(`Invalid URL format: ${url}. Please enter a valid website address.`);
      }
      throw error; // Pass through custom errors we've already formatted
    }
    throw new Error('Unknown error occurred while fetching the website');
  }
}

export async function analyzeSeo(url: string): Promise<SeoAnalysisResult> {
  try {
    const html = await fetchWebsite(url);
    const $ = cheerio.load(html);
    
    // Extract domain name for display
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
    const domain = urlObj.hostname;
    
    // Core meta tags analysis
    const metaTags = analyzeMetaTags($);
    
    // Social media tags analysis
    const socialMedia = analyzeSocialMediaTags($);
    
    // Technical SEO analysis
    const technicalSeo = analyzeTechnicalSeo($, url);
    
    // Calculate scores
    const metaTagsScore = calculateScore(metaTags.items);
    const socialMediaScore = calculateScore(socialMedia.items);
    const technicalSeoScore = calculateScore(technicalSeo.items);
    
    // Calculate total score (weighted average)
    const totalScore = Math.round(
      (metaTagsScore * 0.4) + (socialMediaScore * 0.3) + (technicalSeoScore * 0.3)
    );
    
    // Determine score rating
    const scoreRating = getScoreRating(totalScore);
    
    // Generate previews
    const previews = generatePreviews($, domain);
    
    // Generate recommendations
    const recommendations = generateRecommendations(metaTags.items, socialMedia.items, technicalSeo.items, domain);
    
    return {
      url: domain,
      analyzedAt: format(new Date(), 'PPP, p'),
      totalScore,
      scoreRating,
      metaTags: {
        score: metaTagsScore,
        items: metaTags.items
      },
      socialMedia: {
        score: socialMediaScore,
        items: socialMedia.items
      },
      technicalSeo: {
        score: technicalSeoScore,
        items: technicalSeo.items
      },
      previews,
      recommendations
    };
  } catch (error) {
    throw new Error(`Error analyzing SEO: ${(error as Error).message}`);
  }
}

function analyzeMetaTags($: cheerio.CheerioAPI): { items: MetaTag[] } {
  const items: MetaTag[] = [];
  
  // Title tag
  const title = $('title').text().trim();
  if (title) {
    const titleLength = title.length;
    if (titleLength < 30 || titleLength > 60) {
      items.push({
        name: 'Title',
        value: title,
        status: 'warning',
        message: titleLength < 30 
          ? 'Title is too short (optimal: 50-60 characters)' 
          : titleLength > 60 
            ? 'Title is too long (optimal: 50-60 characters)' 
            : undefined
      });
    } else {
      items.push({
        name: 'Title',
        value: title,
        status: 'success'
      });
    }
  } else {
    items.push({
      name: 'Title',
      status: 'error',
      message: 'Missing title tag'
    });
  }
  
  // Meta description
  const metaDescription = $('meta[name="description"]').attr('content');
  if (metaDescription) {
    const descLength = metaDescription.length;
    if (descLength < 120 || descLength > 160) {
      items.push({
        name: 'Description',
        value: metaDescription,
        status: 'warning',
        message: descLength < 120 
          ? 'Description is too short (optimal: 150-160 characters)' 
          : descLength > 160 
            ? 'Description is too long (optimal: 150-160 characters)' 
            : undefined
      });
    } else {
      items.push({
        name: 'Description',
        value: metaDescription,
        status: 'success'
      });
    }
  } else {
    items.push({
      name: 'Description',
      status: 'error',
      message: 'Missing meta description'
    });
  }
  
  // Canonical URL
  const canonical = $('link[rel="canonical"]').attr('href');
  if (canonical) {
    items.push({
      name: 'Canonical URL',
      value: canonical,
      status: 'success'
    });
  } else {
    items.push({
      name: 'Canonical URL',
      status: 'error',
      message: 'Missing canonical URL'
    });
  }
  
  // Robots
  const robots = $('meta[name="robots"]').attr('content');
  if (robots) {
    if (robots.includes('noindex') || robots.includes('nofollow')) {
      items.push({
        name: 'Robots',
        value: robots,
        status: 'warning',
        message: 'Page may not be fully indexed by search engines'
      });
    } else {
      items.push({
        name: 'Robots',
        value: robots,
        status: 'success'
      });
    }
  } else {
    items.push({
      name: 'Robots',
      value: 'index, follow (default)',
      status: 'success'
    });
  }
  
  // Viewport
  const viewport = $('meta[name="viewport"]').attr('content');
  if (viewport) {
    items.push({
      name: 'Viewport',
      value: viewport,
      status: 'success'
    });
  } else {
    items.push({
      name: 'Viewport',
      status: 'error',
      message: 'Missing viewport meta tag'
    });
  }
  
  return { items };
}

function analyzeSocialMediaTags($: cheerio.CheerioAPI): { items: MetaTag[] } {
  const items: MetaTag[] = [];
  
  // Open Graph title
  const ogTitle = $('meta[property="og:title"]').attr('content');
  if (ogTitle) {
    items.push({
      name: 'og:title',
      value: ogTitle,
      status: 'success'
    });
  } else {
    items.push({
      name: 'og:title',
      status: 'error',
      message: 'Missing og:title'
    });
  }
  
  // Open Graph description
  const ogDescription = $('meta[property="og:description"]').attr('content');
  if (ogDescription) {
    items.push({
      name: 'og:description',
      value: ogDescription,
      status: 'success'
    });
  } else {
    items.push({
      name: 'og:description',
      status: 'error',
      message: 'Missing og:description'
    });
  }
  
  // Open Graph image
  const ogImage = $('meta[property="og:image"]').attr('content');
  if (ogImage) {
    items.push({
      name: 'og:image',
      value: ogImage,
      status: 'success'
    });
  } else {
    items.push({
      name: 'og:image',
      status: 'error',
      message: 'Missing og:image'
    });
  }
  
  // Open Graph type
  const ogType = $('meta[property="og:type"]').attr('content');
  if (ogType) {
    items.push({
      name: 'og:type',
      value: ogType,
      status: 'success'
    });
  } else {
    items.push({
      name: 'og:type',
      status: 'warning',
      message: 'Missing og:type'
    });
  }
  
  // Twitter card
  const twitterCard = $('meta[name="twitter:card"]').attr('content');
  if (twitterCard) {
    if (twitterCard === 'summary' && ogImage) {
      items.push({
        name: 'twitter:card',
        value: twitterCard,
        status: 'warning',
        message: 'Consider using "summary_large_image"'
      });
    } else {
      items.push({
        name: 'twitter:card',
        value: twitterCard,
        status: 'success'
      });
    }
  } else {
    items.push({
      name: 'twitter:card',
      status: 'error',
      message: 'Missing twitter:card'
    });
  }
  
  // Twitter image
  const twitterImage = $('meta[name="twitter:image"]').attr('content');
  if (twitterImage) {
    items.push({
      name: 'twitter:image',
      value: twitterImage,
      status: 'success'
    });
  } else {
    items.push({
      name: 'twitter:image',
      status: ogImage ? 'warning' : 'error',
      message: ogImage ? 'Falls back to og:image, but dedicated Twitter image recommended' : 'Missing twitter:image'
    });
  }
  
  return { items };
}

function analyzeTechnicalSeo($: cheerio.CheerioAPI, url: string): { items: MetaTag[] } {
  const items: MetaTag[] = [];
  
  // Language
  const htmlLang = $('html').attr('lang');
  if (htmlLang) {
    items.push({
      name: 'Language',
      value: htmlLang,
      status: 'success'
    });
  } else {
    items.push({
      name: 'Language',
      status: 'error',
      message: 'Missing language attribute'
    });
  }
  
  // Charset
  const charset = $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content');
  if (charset) {
    items.push({
      name: 'Charset',
      value: charset.includes('charset=') ? charset.split('charset=')[1] : charset,
      status: 'success'
    });
  } else {
    items.push({
      name: 'Charset',
      status: 'error',
      message: 'Missing charset declaration'
    });
  }
  
  // Favicon
  const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr('href');
  if (favicon) {
    items.push({
      name: 'Favicon',
      value: 'Present',
      status: 'success'
    });
  } else {
    items.push({
      name: 'Favicon',
      status: 'warning',
      message: 'Missing favicon'
    });
  }
  
  // SSL (determined by URL)
  if (url.startsWith('https://')) {
    items.push({
      name: 'SSL Certificate',
      value: 'Valid',
      status: 'success'
    });
  } else {
    items.push({
      name: 'SSL Certificate',
      value: 'Not using HTTPS',
      status: 'error',
      message: 'Site is not using HTTPS'
    });
  }
  
  // Mobile Friendly (based on viewport)
  const viewport = $('meta[name="viewport"]').attr('content');
  if (viewport && viewport.includes('width=device-width')) {
    items.push({
      name: 'Mobile Friendly',
      value: 'Yes',
      status: 'success'
    });
  } else {
    items.push({
      name: 'Mobile Friendly',
      value: 'No',
      status: 'error',
      message: 'Site appears not to be mobile friendly'
    });
  }
  
  return { items };
}

function calculateScore(items: MetaTag[]): number {
  if (items.length === 0) return 0;
  
  // Calculate score based on status
  let totalPoints = 0;
  const weights = {
    success: 1,
    warning: 0.5,
    error: 0
  };
  
  for (const item of items) {
    totalPoints += weights[item.status];
  }
  
  return Math.round((totalPoints / items.length) * 100);
}

function getScoreRating(score: number): 'Poor' | 'Fair' | 'Good' | 'Excellent' {
  if (score < 50) return 'Poor';
  if (score < 70) return 'Fair';
  if (score < 90) return 'Good';
  return 'Excellent';
}

function generatePreviews($: cheerio.CheerioAPI, domain: string): SeoAnalysisResult['previews'] {
  const title = $('title').text().trim() || 'No Title';
  const metaDescription = $('meta[name="description"]').attr('content') || 'No description provided.';
  const ogTitle = $('meta[property="og:title"]').attr('content') || title;
  const ogDescription = $('meta[property="og:description"]').attr('content') || metaDescription;
  const ogImage = $('meta[property="og:image"]').attr('content');
  
  const hasOgTitle = !!$('meta[property="og:title"]').attr('content');
  const hasOgDescription = !!$('meta[property="og:description"]').attr('content');
  const hasOgImage = !!ogImage;
  
  const hasTwCard = !!$('meta[name="twitter:card"]').attr('content');
  const hasTwImage = !!$('meta[name="twitter:image"]').attr('content');
  
  return {
    google: {
      title,
      url: domain,
      description: metaDescription,
      titleLength: title.length,
      descriptionLength: metaDescription.length,
      isTitleLengthOptimal: title.length >= 30 && title.length <= 60,
      isDescriptionLengthOptimal: metaDescription.length >= 120 && metaDescription.length <= 160
    },
    social: {
      title: ogTitle,
      description: ogDescription,
      image: ogImage,
      isOpenGraphComplete: hasOgTitle && hasOgDescription && hasOgImage,
      isTwitterCardComplete: hasTwCard && (hasTwImage || hasOgImage)
    }
  };
}

function generateRecommendations(
  metaTags: MetaTag[], 
  socialMedia: MetaTag[], 
  technicalSeo: MetaTag[],
  domain: string
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  // Process meta tags errors
  for (const tag of metaTags) {
    if (tag.status === 'error') {
      const rec: Recommendation = {
        priority: 'high',
        title: '',
        description: ''
      };
      
      if (tag.name === 'Title') {
        rec.title = 'Add a title tag';
        rec.description = 'The title tag is crucial for SEO. It appears in search engine results and browser tabs.';
        rec.code = `<title>Your Website Title | ${domain}</title>`;
      } else if (tag.name === 'Description') {
        rec.title = 'Add a meta description';
        rec.description = 'Meta descriptions provide a brief summary of the page content and appear in search results.';
        rec.code = `<meta name="description" content="Brief description of your webpage content." />`;
      } else if (tag.name === 'Canonical URL') {
        rec.title = 'Add a canonical URL tag';
        rec.description = 'You should add a canonical URL to indicate the preferred version of this page and prevent duplicate content issues.';
        rec.code = `<link rel="canonical" href="https://${domain}/" />`;
      } else if (tag.name === 'Viewport') {
        rec.title = 'Add a viewport meta tag';
        rec.description = 'The viewport meta tag is essential for responsive design and mobile-friendly pages.';
        rec.code = `<meta name="viewport" content="width=device-width, initial-scale=1" />`;
      }
      
      if (rec.title) recommendations.push(rec);
    } else if (tag.status === 'warning') {
      const rec: Recommendation = {
        priority: 'medium',
        title: '',
        description: ''
      };
      
      if (tag.name === 'Title') {
        rec.title = 'Optimize your title tag length';
        rec.description = 'Your title is ' + tag.value?.length + ' characters long. The optimal length is between 50-60 characters for better visibility in search results.';
      } else if (tag.name === 'Description') {
        rec.title = 'Optimize your meta description length';
        rec.description = 'Your description is ' + tag.value?.length + ' characters long. The optimal length is between 150-160 characters for better visibility in search results.';
      }
      
      if (rec.title) recommendations.push(rec);
    }
  }
  
  // Process social media tag errors
  for (const tag of socialMedia) {
    if (tag.status === 'error') {
      const rec: Recommendation = {
        priority: 'medium',
        title: '',
        description: ''
      };
      
      if (tag.name === 'og:title') {
        rec.title = 'Add Open Graph title tag';
        rec.description = 'Open Graph tags help control how your content appears when shared on social media.';
        rec.code = `<meta property="og:title" content="Your Page Title" />`;
      } else if (tag.name === 'og:description') {
        rec.title = 'Add Open Graph description tag';
        rec.description = 'This helps provide context when your content is shared on social platforms.';
        rec.code = `<meta property="og:description" content="Description of your page content" />`;
      } else if (tag.name === 'og:image') {
        rec.title = 'Add Open Graph image tag';
        rec.description = 'Images make your shared content more engaging on social media.';
        rec.code = `<meta property="og:image" content="https://${domain}/your-image.jpg" />`;
      } else if (tag.name === 'twitter:card') {
        rec.title = 'Add Twitter Card meta tag';
        rec.description = 'Twitter Cards enhance the appearance of shared links on Twitter.';
        rec.code = `<meta name="twitter:card" content="summary_large_image" />`;
      } else if (tag.name === 'twitter:image') {
        rec.title = 'Add Twitter image meta tag';
        rec.description = 'A dedicated Twitter image ensures optimal display when your content is shared on Twitter.';
        rec.code = `<meta name="twitter:image" content="https://${domain}/your-twitter-image.jpg" />`;
      }
      
      if (rec.title) recommendations.push(rec);
    } else if (tag.status === 'warning' && tag.name === 'twitter:card' && tag.value === 'summary') {
      recommendations.push({
        priority: 'low',
        title: 'Upgrade Twitter Card type',
        description: 'Consider using "summary_large_image" instead of "summary" for better visibility on Twitter.',
        code: `<meta name="twitter:card" content="summary_large_image" />`
      });
    }
  }
  
  // Process technical SEO errors
  for (const tag of technicalSeo) {
    if (tag.status === 'error') {
      const rec: Recommendation = {
        priority: tag.name === 'SSL Certificate' ? 'high' : 'medium',
        title: '',
        description: ''
      };
      
      if (tag.name === 'Language') {
        rec.title = 'Add language attribute to HTML tag';
        rec.description = 'The language attribute helps search engines and screen readers determine the language of your content.';
        rec.code = `<html lang="en">`;
      } else if (tag.name === 'Charset') {
        rec.title = 'Add charset meta tag';
        rec.description = 'Defining the character encoding ensures proper rendering of your content.';
        rec.code = `<meta charset="UTF-8" />`;
      } else if (tag.name === 'SSL Certificate') {
        rec.title = 'Enable HTTPS';
        rec.description = 'HTTPS is essential for security and is a ranking factor for search engines.';
      } else if (tag.name === 'Mobile Friendly') {
        rec.title = 'Make your site mobile-friendly';
        rec.description = 'A responsive design is crucial for mobile users and search engine rankings.';
        rec.code = `<meta name="viewport" content="width=device-width, initial-scale=1" />`;
      }
      
      if (rec.title) recommendations.push(rec);
    }
  }
  
  return recommendations;
}
