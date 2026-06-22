---
title: "Export and file formats — download and use your work"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "Learn the file formats Runway supports for Export, how to download your work, and managing Assets in the system, including the URL time-limit caution"
readTime: "5 min"
readers: "0"
locked: false
order: 12
---

# Export and file formats — download and use your work

> Work created with Runway must be downloaded and stored yourself within 24-48 hours, because the Link expires.

---

## Output file formats Runway supports

### Video Output
| Format | Description | Use |
|---|---|---|
| **MP4** (H.264) | The video standard, supported everywhere | General use, YouTube, Social |
| **MP4** (H.265/HEVC) | Better compression, smaller size | Economical Storage |
| **WebM** | For the web | Streaming on the web |

### Image Output
| Format | Description |
|---|---|
| **PNG** | High quality, supports a transparent background (Transparency) |
| **JPEG/JPG** | Smaller size, good for the web |
| **WebP** | Good compression, high quality |

### Audio Output
| Format | Description |
|---|---|
| **MP3** | Standard, small, good for general use |
| **WAV** | Highest quality, uncompressed, large size |
| **AAC** | Apple format, good quality |
| **FLAC** | Lossless compression, quality comparable to WAV |

---

## How to download your work

### Download from the Web UI

1. After Generate finishes, the work appears on the page
2. Click the **"Download"** button
3. Choose the file format if options are given
4. The file saves to your machine

### Download from Assets

1. Go to the **"Assets"** page
2. Find the work you want
3. Right-click or click the Download icon

---

## Important: the URL expires!

**Very important:** The URL of work Runway creates **expires within 24-48 hours**.

This means:
- If you don't download in time, the file becomes inaccessible
- Don't share the URL directly with others to use in an application — the URL expires
- Always download and store it in your own Storage

### For API developers:
After creating work via the API, you must download and store it in your own Storage immediately, e.g.:
- **AWS S3** (Amazon Simple Storage Service — Amazon's file-storage service)
- **Google Cloud Storage**
- **Azure Blob Storage** (Microsoft's file-storage service)
- Or your own Server Storage

---

## Managing Assets

### Assets Library
Runway has an Assets management system for:
- Uploaded images
- Created videos
- Audio files
- Reference Images

### Organize with Projects
**Projects** (groups of work organized together) help organize your work:
- Separate each project's work
- Share Assets within a team
- Find old work easily

---

## Resolution and Quality Settings

### Video resolutions Runway can create

| Model | Resolution | Format |
|---|---|---|
| Gen-4.5 | 1280x720 (HD), 720x1280 (Portrait HD) | Landscape/Portrait |
| Gen-4 Turbo | 1280x720, 720x1280 | Landscape/Portrait |
| Veo3 | Up to 1080p | Many Ratios |

### Image resolutions

| Model | Resolution |
|---|---|
| Gen4 Image (720p) | 1280x720 or 720x1280 |
| Gen4 Image (1080p) | 1920x1080 or 1080x1920 |
| Magnific Upscaler | Up to 4096px (standard) |

---

## Attribution

When using the Runway API to create work, you **must show Attribution** in your application:

> **"Powered by Runway"** with a Link to [runwayml.com](https://runwayml.com)

Runway provides a Logo to download:
- **Dark Version** (white background)
- **Light Version** (black background)

Formats: PNG and SVG (a Vector image format that scales without quality loss)

---

## Recommended Workflow

### For a Content Creator
```
1. Create work in Runway
2. Download immediately
3. Store in Cloud Storage (Dropbox, Google Drive, iCloud)
4. Edit further in a Video Editor
5. Export for the destination Platform
```

### For an API developer
```
1. Call the API to create work
2. Receive a Task ID
3. Poll until SUCCEEDED
4. Download from the Output URL immediately
5. Store in your own Storage
6. Remove the temporary URL, use the URL from your Storage instead
```

---

## Prepare files for each Platform

### YouTube
- Resolution: 1920x1080 (Full HD) or 3840x2160 (4K)
- Format: MP4 (H.264)
- Frame Rate: 24, 25, or 30fps

### Instagram / TikTok
- Resolution: 1080x1920 (9:16 Portrait)
- Format: MP4
- Length: 15-60 seconds

### Instagram Feed
- Resolution: 1080x1080 (1:1) or 1080x1350 (4:5)
- Format: MP4 or MOV

### Twitter/X
- Resolution: up to 1280x720
- Format: MP4
- File size: no more than 512MB

---

## Using Ephemeral Uploads for large files

An **Ephemeral Upload** (a temporary upload — a way to send large files to the Runway API) is used when an Input file is larger than a normal URL can handle.

- Normal URL: upload up to **32MB**
- Ephemeral Upload: upload up to **200MB**
- The resulting URI is a `runway://` URI, usable for **24 hours**

---

## Summary

Export and file management is an important step often overlooked. The biggest caution is the URL expiring — you must download and store your work immediately after creating it. You should also choose the file format to suit the destination Platform for the best quality.
