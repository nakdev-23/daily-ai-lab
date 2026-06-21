---
title: "Advanced use cases — examples of using DALL·E in real projects"
tool: "DALL·E"
icon: "icon-docs"
level: "pro"
summary: "Examples of using the DALL·E API in real projects, covering automatic image systems, combining with ChatGPT, and building a content pipeline"
readTime: "9 min"
readers: "0"
locked: false
order: 12
---
# Advanced use cases — examples of using DALL·E in real projects

> Primary reference: [OpenAI Images Guide](https://platform.openai.com/docs/guides/images)

---

## Overview

This chapter shows examples of using the DALL·E API in real situations, combining DALL·E with GPT and other tools to build high-performance systems.

---

## Use Case 1: an automatic blog image system

### The problem

A blog needs article illustrations automatically. When an editor saves an article, the system creates a thumbnail (a small preview image of the article) automatically.

### The approach

```python
from openai import OpenAI

client = OpenAI()

def generate_blog_thumbnail(article_title: str, article_summary: str) -> str:
    """
    Create a thumbnail for a blog article automatically
    Use GPT to build the prompt from the title and summary first
    Then use DALL·E to create the image
    """
    
    # Step 1: use GPT to build a suitable prompt
    prompt_response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": """You are an expert at creating DALL·E prompts for blog thumbnails.
                Create a concise, vivid image prompt (max 200 chars) that:
                - Represents the article visually
                - Uses photorealistic or illustration style
                - Avoids text in the image
                - Has professional, clean composition"""
            },
            {
                "role": "user",
                "content": f"Article title: {article_title}\nSummary: {article_summary}"
            }
        ],
        max_tokens=200,
    )
    
    image_prompt = prompt_response.choices[0].message.content
    print(f"Generated prompt: {image_prompt}")
    
    # Step 2: create the image with DALL·E 3
    image_response = client.images.generate(
        model="dall-e-3",
        prompt=image_prompt,
        size="1792x1024",  # landscape for a blog thumbnail
        quality="standard",
        style="vivid",
    )
    
    return image_response.data[0].url

# Test
url = generate_blog_thumbnail(
    article_title="10 ways to save energy at home",
    article_summary="An article recommending ways to cut your electricity bill and save energy at home with simple techniques"
)
print(f"Thumbnail URL: {url}")
```

---

## Use Case 2: an e-commerce product image system

### The problem

An online store wants to create product images in several backgrounds and styles automatically.

```python
import os
from openai import OpenAI

client = OpenAI()

PRODUCT_BACKGROUNDS = {
    "minimal_white": "clean white background, studio lighting, professional product photography",
    "lifestyle_kitchen": "modern kitchen counter, natural window light, lifestyle photography",
    "outdoor_natural": "outdoor setting with natural greenery, soft sunlight",
    "dark_luxury": "dark marble surface, dramatic lighting, luxury product photography",
    "seasonal_christmas": "festive holiday background with bokeh lights, warm atmosphere",
}

def generate_product_images(product_description: str, backgrounds: list = None) -> dict:
    """Create product images in several backgrounds"""
    
    if backgrounds is None:
        backgrounds = list(PRODUCT_BACKGROUNDS.keys())
    
    results = {}
    
    for bg_key in backgrounds:
        bg_desc = PRODUCT_BACKGROUNDS.get(bg_key, bg_key)
        
        prompt = f"""
        Professional product photography of {product_description},
        {bg_desc},
        sharp focus, high resolution, commercial quality,
        no text or watermarks
        """
        
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt.strip(),
            size="1024x1024",
            quality="hd",
            style="natural",  # natural suits product images
        )
        
        results[bg_key] = {
            "url": response.data[0].url,
            "revised_prompt": response.data[0].revised_prompt,
        }
        
        print(f"Created image {bg_key} successfully")
    
    return results

# Usage
product_images = generate_product_images(
    product_description="a handcrafted ceramic coffee mug with blue geometric patterns",
    backgrounds=["minimal_white", "lifestyle_kitchen", "dark_luxury"]
)

for bg, data in product_images.items():
    print(f"\n{bg}:")
    print(f"  URL: {data['url']}")
```

---

## Use Case 3: create avatars for a social app

### The problem

A social app wants to create avatars (user profile pictures — images representing the user in the system) automatically from a user's description.

```python
AVATAR_STYLES = {
    "cartoon": "cute cartoon style, vibrant colors, simple design, digital illustration",
    "pixel": "pixel art style, 32x32 grid aesthetic, retro video game character",
    "anime": "anime style, clean line art, expressive eyes, Studio Ghibli inspired",
    "watercolor": "soft watercolor portrait, artistic, gentle colors",
    "3d_render": "3D rendered character, Pixar-like style, detailed, appealing",
}

def create_avatar(
    description: str,
    style: str = "cartoon",
    mood: str = "happy"
) -> str:
    """
    Create an avatar from a user's description
    description: e.g. "young woman with curly red hair and glasses"
    """
    
    style_desc = AVATAR_STYLES.get(style, style)
    
    prompt = f"""
    Profile avatar portrait of {description},
    {mood} expression,
    {style_desc},
    centered composition, suitable for social media profile picture,
    square format, clean background
    """
    
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt.strip(),
        size="1024x1024",
        quality="standard",
        style="vivid",
    )
    
    return response.data[0].url

# Usage
avatar_url = create_avatar(
    description="friendly robot with a round head and big blue eyes",
    style="cartoon",
    mood="cheerful"
)
print(f"Avatar: {avatar_url}")
```

---

## Use Case 4: an automatic inpainting system for editing images

### The problem

A photography service wants a system that removes the background from a product image automatically, then fills in a desired new background.

```python
from PIL import Image, ImageDraw
import numpy as np

def remove_background_with_dalle(
    image_path: str,
    new_background: str,
    output_path: str
) -> str:
    """
    Use DALL·E 2 Edit to change the background
    Requires a mask specifying the background area
    """
    
    # Open the original image
    original = Image.open(image_path).convert("RGBA")
    width, height = original.size
    
    # Create a mask (you must create it by hand or use a separate background-removal API)
    # In this example we assume a mask already exists
    mask = Image.open("background_mask.png").convert("RGBA")
    
    # Call the API
    with open(image_path, "rb") as img_file, \
         open("background_mask.png", "rb") as mask_file:
        
        response = client.images.edit(
            model="dall-e-2",
            image=img_file,
            mask=mask_file,
            prompt=f"Replace background with: {new_background}, maintain the main subject",
            size="1024x1024",
        )
    
    # Download and save
    import requests
    img_data = requests.get(response.data[0].url).content
    with open(output_path, "wb") as f:
        f.write(img_data)
    
    return output_path
```

---

## Use Case 5: a Content Pipeline for Social Media

### The problem

An ad agency wants a pipeline (an automated workflow — a set of steps that run in sequence automatically) that takes a brief from a client and creates several images for each platform (the various social media channels).

```python
PLATFORM_SPECS = {
    "instagram_post": {"size": "1024x1024", "style": "vivid"},
    "instagram_story": {"size": "1024x1792", "style": "vivid"},
    "facebook_banner": {"size": "1792x1024", "style": "natural"},
    "linkedin_post": {"size": "1024x1024", "style": "natural"},
}

def create_social_media_set(
    campaign_brief: str,
    brand_style: str = "modern, professional",
    platforms: list = None
) -> dict:
    """
    Create a set of social media images for several platforms from a single brief
    """
    
    if platforms is None:
        platforms = list(PLATFORM_SPECS.keys())
    
    # Step 1: have GPT build a prompt for each platform
    prompt_gen_response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "Create concise DALL·E image prompts for social media campaigns. Return JSON only."
            },
            {
                "role": "user",
                "content": f"""
                Campaign brief: {campaign_brief}
                Brand style: {brand_style}
                
                Create image prompts for: {', '.join(platforms)}
                Format: {{"platform_name": "image prompt"}}
                """
            }
        ],
        response_format={"type": "json_object"},
    )
    
    import json
    prompts = json.loads(prompt_gen_response.choices[0].message.content)
    
    # Step 2: create the image for each platform
    results = {}
    
    for platform in platforms:
        if platform not in prompts:
            continue
        
        specs = PLATFORM_SPECS.get(platform, {"size": "1024x1024", "style": "vivid"})
        
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompts[platform],
            size=specs["size"],
            quality="standard",
            style=specs["style"],
        )
        
        results[platform] = {
            "url": response.data[0].url,
            "prompt_used": prompts[platform],
            "specs": specs,
        }
        
        print(f"Created image {platform} successfully")
    
    return results

# Usage
campaign_images = create_social_media_set(
    campaign_brief="Summer Sale promotion, 50% off Fashion products for Gen Z",
    brand_style="vibrant, youthful, trendy, colorful",
    platforms=["instagram_post", "instagram_story", "facebook_banner"]
)

for platform, data in campaign_images.items():
    print(f"\n{platform}:")
    print(f"  URL: {data['url']}")
    print(f"  Prompt: {data['prompt_used'][:80]}...")
```

---

## Use Case 6: an interactive image generation web app

### The problem

Build a web application where the user types a prompt and sees the image immediately, using Next.js and the DALL·E API.

### API Route (the server-side code that receives requests from the client)

```typescript
// app/api/generate/route.ts (Next.js App Router)
import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, size = "1024x1024", quality = "standard", style = "vivid" } = 
      await request.json();
    
    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt cannot be empty" },
        { status: 400 }
      );
    }
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size,
      quality,
      style,
      n: 1,
    });
    
    return NextResponse.json({
      url: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt,
    });
    
  } catch (error: any) {
    if (error.code === "content_policy_violation") {
      return NextResponse.json(
        { error: "The prompt violates the content policy. Please edit the prompt." },
        { status: 400 }
      );
    }
    
    if (error.code === "rate_limit_exceeded") {
      return NextResponse.json(
        { error: "The API exceeded its limit. Please wait a moment and try again." },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 }
    );
  }
}
```

### Frontend Component

```typescript
// components/ImageGenerator.tsx
"use client";
import { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [revisedPrompt, setRevisedPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          size: "1024x1024",
          quality: "standard",
          style: "vivid",
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error);
      }
      
      setImageUrl(data.url);
      setRevisedPrompt(data.revisedPrompt);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">DALL·E Image Generator</h1>
      
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image you want..."
        className="w-full p-3 border rounded-lg h-24 resize-none"
      />
      
      <button
        onClick={generateImage}
        disabled={loading || !prompt.trim()}
        className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Creating image..." : "Create image"}
      </button>
      
      {error && (
        <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {imageUrl && (
        <div className="mt-6">
          <img src={imageUrl} alt="Generated" className="w-full rounded-lg shadow-lg" />
          {revisedPrompt && (
            <p className="mt-2 text-sm text-gray-500">
              Prompt actually used: {revisedPrompt}
            </p>
          )}
          <a href={imageUrl} download className="mt-2 inline-block text-blue-600 hover:underline">
            Download image
          </a>
        </div>
      )}
    </div>
  );
}
```

---

## Summary

These use cases show that the DALL·E API can be integrated with a variety of systems, whether an automatic blog system, an e-commerce platform, a social media pipeline, or an interactive web application. Combining DALL·E with GPT to build prompts automatically is a powerful and very popular approach for building a complete AI image-generation system.
