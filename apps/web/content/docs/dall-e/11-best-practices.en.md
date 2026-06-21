---
title: "Best Practices"
tool: "DALL·E"
icon: "icon-docs"
level: "pro"
summary: "A collection of best practices for using the DALL·E API in real projects, covering effective prompting, system design, and cost management"
readTime: "8 min"
readers: "0"
locked: false
order: 11
---
# Best Practices

> Primary reference: [OpenAI Images Guide — Best Practices](https://platform.openai.com/docs/guides/images)

---

## Overview

Using the DALL·E API in a real project requires considering many factors, from effective prompting to designing a system that supports real use. This chapter collects best practices (the methods experts recommend from real experience) that help you use DALL·E effectively and economically.

---

## Section 1: Professional prompting

### 1.1 Use English for the best results

Even though DALL·E 3 supports Thai prompts, English usually gives better results because the model was trained mainly on English data.

```python
# Better
prompt = "A serene Thai mountain village at dawn, mist rolling through valley, traditional wooden houses, photorealistic"

# Works but may not be as good
prompt = "A Thai mountain village at dawn, mist floating in the valley, traditional wooden houses, realistic"
```

### 1.2 A systematic prompt structure

Create a template (a reusable prompt structure) for each kind of work:

```python
def build_product_prompt(product: str, setting: str, style: str = "photorealistic") -> str:
    """Build a prompt for product images"""
    return f"""
    Professional product photography of {product},
    {setting},
    studio lighting with soft shadows,
    white or neutral background,
    {style} style,
    high resolution, commercial advertisement quality
    """.strip()

def build_portrait_prompt(subject: str, mood: str, setting: str) -> str:
    """Build a prompt for portraits"""
    return f"""
    Portrait of {subject},
    {mood} mood and expression,
    {setting},
    professional photography, natural lighting,
    sharp focus, bokeh background
    """.strip()

# Usage
product_prompt = build_product_prompt(
    product="a sleek black leather wallet",
    setting="on a wooden surface with autumn leaves",
    style="photorealistic"
)
```

### 1.3 Keep a library of frequently used prompts

```python
PROMPT_TEMPLATES = {
    "hero_banner": "Wide cinematic landscape of {subject}, golden hour lighting, photorealistic, 8K quality",
    "social_post": "Square format illustration of {subject}, vibrant colors, modern flat design style",
    "blog_thumbnail": "Minimal clean illustration of {subject}, pastel colors, simple background",
    "product_shot": "Professional product photography of {subject}, white background, studio lighting",
}

def get_prompt(template_name: str, **kwargs) -> str:
    template = PROMPT_TEMPLATES.get(template_name)
    if not template:
        raise ValueError(f"Template not found: {template_name}")
    return template.format(**kwargs)
```

---

## Section 2: API system design

### 2.1 Manage the API Key securely

```python
import os
from dotenv import load_dotenv  # pip install python-dotenv

# Load values from the .env file
load_dotenv()

# Bad — write the key directly in code
client = OpenAI(api_key="sk-xxxxx")

# Good — use an environment variable
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

# Best — check the key exists before using it
api_key = os.environ.get("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY not found — please set the environment variable")
client = OpenAI(api_key=api_key)
```

The `.env` file:
```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

The `.gitignore` file (tells Git not to track this file):
```
.env
*.env
```

### 2.2 Save images immediately after creating

The image URL expires in 1 hour, so download and save it right away:

```python
import os
import time
import requests
from openai import OpenAI
from pathlib import Path

client = OpenAI()

def generate_and_save(prompt: str, output_dir: str = "generated_images") -> str:
    """Create an image and save it immediately"""
    
    # Create the folder if it doesn't exist
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    
    # Build a filename from a timestamp
    timestamp = int(time.time())
    filename = f"image_{timestamp}.png"
    filepath = os.path.join(output_dir, filename)
    
    # Call the API
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        response_format="b64_json",  # receive the data directly, no need to rely on a URL
    )
    
    # Save the file immediately
    import base64
    image_data = base64.b64decode(response.data[0].b64_json)
    
    with open(filepath, "wb") as f:
        f.write(image_data)
    
    print(f"Saved: {filepath}")
    return filepath
```

### 2.3 Implement a Queue for Batch Processing

```python
import asyncio
import time
from typing import List

async def generate_batch(prompts: List[str], delay_seconds: float = 12.0) -> List[str]:
    """
    Create several images with a gap, to avoid the rate limit
    DALL·E 3: 5 RPM = 1 image every 12 seconds
    """
    results = []
    
    for i, prompt in enumerate(prompts):
        print(f"Creating image {i+1}/{len(prompts)}: {prompt[:50]}...")
        
        try:
            response = client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
            )
            results.append(response.data[0].url)
            
        except Exception as e:
            print(f"Error on image {i+1}: {e}")
            results.append(None)
        
        # Wait before creating the next image (except the last)
        if i < len(prompts) - 1:
            await asyncio.sleep(delay_seconds)
    
    return results

# Usage
prompts = [
    "A sunrise over the ocean",
    "A quiet forest path in autumn",
    "A futuristic city at night",
]

# Run asyncio
urls = asyncio.run(generate_batch(prompts))
```

---

## Section 3: Image management

### 3.1 Name files systematically

```python
import re
import time

def sanitize_filename(prompt: str, max_length: int = 50) -> str:
    """Create a readable filename from the prompt"""
    # Keep only letters, numbers, and spaces
    clean = re.sub(r'[^a-zA-Z0-9\s-]', '', prompt.lower())
    # Replace spaces with underscores
    clean = re.sub(r'\s+', '_', clean.strip())
    # Truncate it shorter
    clean = clean[:max_length]
    
    timestamp = int(time.time())
    return f"{timestamp}_{clean}.png"

# Example
filename = sanitize_filename("A beautiful sunset over the mountains")
# output: "1703123456_a_beautiful_sunset_over_the_mountains.png"
```

### 3.2 Save metadata with the image

```python
import json
from datetime import datetime

def save_image_with_metadata(response, prompt: str, parameters: dict, output_path: str):
    """Save the image with metadata (extra info describing the image — e.g. the prompt used, creation time)"""
    
    # Save the image
    import base64
    image_data = base64.b64decode(response.data[0].b64_json)
    with open(output_path, "wb") as f:
        f.write(image_data)
    
    # Save the metadata too
    metadata = {
        "created_at": datetime.now().isoformat(),
        "original_prompt": prompt,
        "revised_prompt": response.data[0].revised_prompt,
        "parameters": parameters,
        "file": output_path,
    }
    
    metadata_path = output_path.replace(".png", "_metadata.json")
    with open(metadata_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)
    
    print(f"Saved image: {output_path}")
    print(f"Saved metadata: {metadata_path}")
```

---

## Section 4: Testing prompts

### 4.1 Use small DALL·E 2 for testing

```python
def test_prompt(prompt: str):
    """Test a prompt at the lowest cost"""
    response = client.images.generate(
        model="dall-e-2",   # much cheaper than DALL·E 3
        prompt=prompt,
        size="256x256",     # smallest size, cheapest
        n=1,
    )
    return response.data[0].url

def produce_final(prompt: str):
    """Create the final image after the prompt has been tested"""
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="hd",
        style="vivid",
    )
    return response.data[0].url

# Recommended steps:
# 1. Test the prompt
test_url = test_prompt("A cozy cabin in the mountains")

# 2. Look at the result; if you're happy, create the final
final_url = produce_final("A cozy cabin in the mountains, surrounded by pine trees, snow-covered landscape")
```

### 4.2 Compare Style and Quality

```python
def compare_styles(prompt: str):
    """Create 2 styles to compare"""
    results = {}
    
    for style in ["vivid", "natural"]:
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            style=style,
        )
        results[style] = response.data[0].url
    
    return results

# Usage
urls = compare_styles("A mountain landscape at sunset")
print("Vivid:", urls["vivid"])
print("Natural:", urls["natural"])
```

---

## Section 5: Monitoring and Logging

### 5.1 Log usage

```python
import logging
from datetime import datetime

# Set up the logger (a logging system — keeps a history of the program's activity)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('dall_e_usage.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def generate_with_logging(prompt: str, **kwargs) -> str:
    """Create an image with logging"""
    
    logger.info(f"Starting image creation | Prompt: {prompt[:100]}...")
    start_time = time.time()
    
    try:
        response = client.images.generate(prompt=prompt, **kwargs)
        elapsed = time.time() - start_time
        
        logger.info(f"Success | Time: {elapsed:.2f}s | Model: {kwargs.get('model', 'default')}")
        return response.data[0].url
        
    except Exception as e:
        logger.error(f"Error | {type(e).__name__}: {e}")
        raise
```

### 5.2 Track cost

```python
PRICE_PER_IMAGE = {
    ("dall-e-3", "1024x1024", "standard"): 0.040,
    ("dall-e-3", "1024x1024", "hd"): 0.080,
    ("dall-e-3", "1792x1024", "standard"): 0.080,
    ("dall-e-3", "1792x1024", "hd"): 0.120,
    ("dall-e-3", "1024x1792", "standard"): 0.080,
    ("dall-e-3", "1024x1792", "hd"): 0.120,
    ("dall-e-2", "1024x1024", "standard"): 0.020,
    ("dall-e-2", "512x512", "standard"): 0.018,
    ("dall-e-2", "256x256", "standard"): 0.016,
}

class CostTracker:
    """Track DALL·E API usage cost"""
    
    def __init__(self):
        self.total_cost = 0.0
        self.image_count = 0
    
    def track(self, model: str, size: str, quality: str = "standard", n: int = 1):
        key = (model, size, quality)
        price = PRICE_PER_IMAGE.get(key, 0)
        cost = price * n
        
        self.total_cost += cost
        self.image_count += n
        
        print(f"This image's cost: ${cost:.4f} | Total: ${self.total_cost:.4f} ({self.image_count} images)")
        return cost

tracker = CostTracker()
tracker.track("dall-e-3", "1024x1024", "hd")
tracker.track("dall-e-3", "1024x1024", "standard", n=3)
```

---

## Checklist summary for real projects

- [ ] Store the API key in an environment variable, not in code
- [ ] Add `.env` to `.gitignore`
- [ ] Use `b64_json` or download the image immediately after creating (the URL expires in 1 hour)
- [ ] Implement retry logic for rate-limit errors
- [ ] Test prompts with small DALL·E 2 first
- [ ] Save metadata with the image
- [ ] Set a spending limit in the OpenAI Dashboard
- [ ] Log usage
- [ ] Track cost
- [ ] Respect the Content Policy and test with a variety of prompts

---

## Summary

These best practices make using the DALL·E API in a real project reliable, secure, and cost-efficient. The most important things are managing the API key securely, saving images immediately, and planning rate-limit handling appropriately.
