# SEO Setup Guide

## 1. OG Images (Social Media Previews)

You need to create these image files in the `/public` folder:

### og-image.png
- **Size:** 1200x630 pixels (required for Facebook/LinkedIn)
- **Path:** `/public/og-image.png`
- **Content:** 
  - Your name "Kush Kumar"
  - "CallOfCoders"
  - "Full Stack Developer"
  - Brief tagline about online compiler
  - Your photo (optional)

### twitter-image.png  
- **Size:** 1200x600 pixels
- **Path:** `/public/twitter-image.png`
- **Same content as og-image** (can be the same file)

### Tools to create:
- Canva (free templates for OG images)
- Figma (design custom images)
- Remove.bg (for background removal)
- Or use AI: "Create an OG image for CallOfCoders by Kush Kumar - Full Stack Developer"

## 2. Google Sitelinks (Sub-links in Search)

I've added:
✅ **sitemap.xml** - Helps Google understand your site structure
✅ **robots.txt** - Controls what Google can crawl
✅ **JSON-LD Structured Data** - Tells Google about your site

### To get sitelinks:
1. **Clear site structure** ✅ (you have this)
2. **Important pages:**
   - Home (/)
   - About (/about)
   - Compiler (/compiler)
   - Login/Signup

3. **Submit to Google Search Console:**
   - Go to: https://search.google.com/search-console
   - Add property: kushkumar.me
   - Verify ownership (use HTML file or DNS method)
   - Submit sitemap: https://kushkumar.me/sitemap.xml

4. **Internal linking:**
   - Link to important pages from homepage
   - Use descriptive anchor text
   - Footer with main navigation

5. **Wait for Google:**
   - Sitelinks appear automatically (1-4 weeks)
   - Only for sites Google trusts
   - Need good traffic and engagement

## 3. Quick Wins:

### Get your Google verification code:
1. Go to Google Search Console
2. Choose "HTML tag" verification method
3. Copy the code like: `google-site-verification=ABC123XYZ`
4. Update in /app/layout.tsx (line 110)

### Update social links in JSON-LD:
Edit /app/layout.tsx around line 129:
- Add your real GitHub URL
- Add your real LinkedIn URL  
- Add your real Twitter URL

## 4. After deploying:

✅ Deploy to production (Vercel/Netlify)
✅ Test OG images: https://www.opengraph.xyz
✅ Test structured data: https://search.google.com/test/rich-results
✅ Submit to Google Search Console
✅ Share on social media to test previews

## Expected Results:

- **OG Images:** Show up when sharing on social media
- **Sitelinks:** Appear in Google after 1-4 weeks with good rankings
- **Rich Snippets:** Better click-through rates
- **Faster indexing:** Google understands your site better
