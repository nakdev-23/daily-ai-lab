---
title: "API Characters and Avatars — create an AI Digital Persona"
tool: "Runway"
icon: "tool-runway"
level: "pro"
summary: "Learn to use the Runway Characters API to create a Real-time Digital Persona that can speak and show emotion, good for Customer Support, Education, and Brand Engagement"
readTime: "10 min"
readers: "0"
locked: false
order: 18
---

# API Characters and Avatars — create an AI Digital Persona

> **Runway Characters** lets developers create a Digital Persona that can converse in Real-time, from a single image.

---

## What is Runway Characters?

**Runway Characters** (a Real-time digital character system) is a Platform for creating a Conversational AI Persona that:
- Can speak and show emotion in Real-time
- Is created from a single image (no 3D model or Fine-tuning needed)
- Supports human, cartoon, and Non-human characters
- Is powered by **GWM-1** (Runway's first-generation General World Model)

---

## Main Use Cases

### Customer Support
- A Branded Avatar representing your Brand
- Answer customer questions in Real-time
- Works 24 hours a day

### Educational Content
- An AI teacher with emotion and personality
- A Tutor that responds to students' questions
- An engaging Training Program

### Brand Engagement
- A talking Mascot
- A Virtual Ambassador
- An Interactive Product Demo

### Gaming
- An NPC that can really converse
- An AI Game Master
- Story-driven interaction

---

## Runway Characters architecture

```
User ←→ Your App ←→ Runway Characters API ←→ GWM-1 Model
```

The system works via **WebRTC** (a technology for Real-time communication through the browser) or **LiveKit** (a Framework for Real-time Video/Audio).

---

## Getting started with the Characters API

### Quickstart

```bash
# Install the Runway Avatars SDK
npm install @runwayml/avatars-sdk-react
```

### Basic Components (React)

```tsx
import { RunwayAvatar } from '@runwayml/avatars-sdk-react';

function MyApp() {
  return (
    <RunwayAvatar
      apiKey={process.env.RUNWAY_API_KEY}
      characterId="your-character-id"
      onMessage={(message) => {
        console.log('Avatar said:', message);
      }}
    />
  );
}
```

---

## Creating a Custom Character

### Step 1: Prepare the character image

**Character image requirements:**
- The face facing straight or slightly tilted
- Good lighting, with clearly visible facial features
- At least 512x512 resolution
- Formats: JPEG, PNG

**Supports all character types:**
- Real people (Photorealistic)
- Cartoon / Illustration
- Animals or Non-human

### Step 2: Define the Personality

The **Personality** is defined with a System Prompt:

```javascript
const character = await runwayClient.characters.create({
  imageUri: 'https://example.com/character.jpg',
  name: 'Aria',
  personality: `
    You are Aria, a friendly customer support AI for TechCorp.
    You are helpful, professional, and speak in a warm tone.
    You specialize in software troubleshooting.
  `,
  voice: 'warm_female_voice_id',
  language: 'en-US'
});
```

### Step 3: Knowledge Base

The **Knowledge Base** (documents the character will know) is the set of documents the character uses to answer questions.

```javascript
// Add a document to the knowledge base
await runwayClient.characters.documents.upload(characterId, {
  file: fs.createReadStream('/path/to/manual.pdf'),
  name: 'Product Manual'
});
```

Supported document types:
- PDF
- TXT
- Markdown
- Word Documents

---

## Custom Voices

### Creating a Custom Voice

A **Custom Voice** gives the character a unique voice.

```javascript
// Create a Custom Voice from voice samples
const voice = await runwayClient.characters.voices.create({
  name: 'MyBrandVoice',
  samples: [
    { uri: 'https://example.com/voice-sample-1.mp3' },
    { uri: 'https://example.com/voice-sample-2.mp3' },
  ]
});

console.log('Voice ID:', voice.id);
```

### Custom Voice limitations
- You must have rights to the source voice
- Don't clone others' voices without permission
- The source voice should total at least 30 seconds

---

## Embedded Widget

The **Embedded Widget** (a Component that's easy to embed in a website) lets you add an Avatar to your website without developing the UI yourself.

```html
<!-- Add the Script Tag -->
<script src="https://cdn.runwayml.com/avatars-widget.js"></script>

<!-- Place the Widget -->
<div 
  id="runway-avatar"
  data-character-id="your-character-id"
  data-api-key="your-public-key"
  style="width: 400px; height: 600px;"
></div>
```

---

## Tool Calling — let the Avatar work with your system

**Tool Calling** (letting the AI Avatar work with external APIs) lets the Avatar do more than just chat.

### Client Tools

Run in the browser or Client application:

```javascript
const widget = new RunwayAvatarWidget({
  characterId: 'your-character-id',
  tools: [
    {
      name: 'search_products',
      description: 'Search for products in the catalog',
      parameters: {
        query: { type: 'string', description: 'Search query' }
      },
      handler: async ({ query }) => {
        const results = await searchProductDatabase(query);
        return results;
      }
    }
  ]
});
```

### Server Tools

Run on your Backend Server — safer for Sensitive data:

```javascript
// Define a Server Tool
const tools = [
  {
    name: 'get_order_status',
    description: 'Get the status of a customer order',
    parameters: {
      orderId: { type: 'string' }
    },
    // The URL Runway will call to get the result
    serverUrl: 'https://api.yourcompany.com/order-status'
  }
];

// Runway POSTs to the serverUrl with the parameters
```

---

## Video Meeting Integration

**Video Meeting** lets the Avatar join a video meeting.

```javascript
// Start a Video Meeting Session
const meeting = await runwayClient.characters.videoMeeting.start({
  characterId: 'your-character-id',
  roomUrl: 'https://meet.example.com/room/123',
  // or
  callId: 'webrtc-call-id'
});
```

---

## LiveKit Integration

**LiveKit** (a Platform for Real-time Audio/Video) is for developers who want to control the Audio/Video Pipeline themselves.

```javascript
import { RunwayAvatarLiveKit } from '@runwayml/avatars-sdk-react';

function LiveAvatarRoom() {
  return (
    <RunwayAvatarLiveKit
      livekitUrl={process.env.LIVEKIT_URL}
      token={livekitToken}
      characterId="your-character-id"
    />
  );
}
```

---

## Camera and Screen Sharing

The Avatar can "see" what the user shares:

```javascript
// Enable Camera Sharing
await avatarSession.enableCameraShare({
  onCapture: (frame) => {
    // The Avatar receives Visual context from the Camera
  }
});

// Enable Screen Sharing
await avatarSession.enableScreenShare({
  sourceId: 'entire-screen'
});
```

---

## Characters API pricing

**GWM-1 Avatars Pricing:**
- 2 credits when starting a Session
- 2 credits per 6 seconds of interaction

**Examples:**
- A 1-minute conversation = 2 + (60/6 × 2) = 2 + 20 = **22 credits**
- A 10-minute conversation = 2 + (600/6 × 2) = 2 + 200 = **202 credits**

---

## Troubleshooting

### The Avatar doesn't speak / audio is silent
- Check the Browser Permissions for Audio
- Check the Character has a defined Voice
- Check the Network Connection

### The Avatar's lips don't match the audio (Lip Sync)
- Check the Network Latency
- Lower the Video Quality if the Connection is slow

### The Character doesn't respond to questions
- Check the Personality Prompt is comprehensive enough
- Check the Knowledge Base has relevant information

---

## Summary

The Runway Characters API opens the chance to create unique experiences, from a Customer Support Avatar to an Interactive Game Character. With Tool Calling, characters can not only speak but work with your real systems, expanding the Use Cases endlessly.
