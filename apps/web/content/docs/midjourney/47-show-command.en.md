---
title: "Show Command — bring an image back"
tool: "Midjourney"
icon: "tool-midjourney"
level: "pro"
summary: "How to use the /show command to bring an already-created image back in Discord from a Job ID, to edit or continue working on it"
readTime: "3 min"
readers: "0"
locked: false
order: 47
---

# Show Command — bring an image back

> Main reference: [Show Command](https://docs.midjourney.com/hc/en-us/articles/32635695384461-Show-Command)

---

## What is /show

The `/show` command (showing previous work — bringing an already-created job back in Discord using its Job ID) lets you pull up old images along with the Upscale, Vary, and other option buttons.

---

## What is a Job ID

A Job ID (a unique number and letters identifying each image-creation job) is the unique code of each piece of work, in a format like `a1b2c3d4-e5f6-...`.

---

## How to find the Job ID

### On Discord
1. Click the ✉️ Emoji on the image message
2. The Midjourney Bot sends a DM with the Job ID

### On the web
1. Go to the Archive
2. Click the image
3. See the Job ID in the image details
4. Copy the URL, which contains the Job ID

---

## How to use /show

```
/show job_id: [the job's Job ID]
```

**Example:**
```
/show job_id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

The Midjourney Bot sends the image back with all the buttons (Upscale, Vary, etc.)

---

## Cases for using /show

1. **The image is gone from the screen** — Discord doesn't load and show old messages
2. **You want to Upscale an old image** — work created long ago
3. **Share a Job ID with others** — others can pull the work to build on it
4. **Moved Servers** — bring old work into a new room

---

## Sharing work with a Job ID

A Job ID lets you share work with others:

**Share with a friend:**
1. Find the work's Job ID
2. Send the Job ID to your friend
3. Your friend uses `/show job_id: [ID]` to see the work and build on it

---

## The job's URL

Besides the Job ID, there's a direct URL to the work:
```
https://www.midjourney.com/jobs/[Job ID]
```

Use it to share a direct link for others to see the work on the web.

---

## Things to know

- `/show` is usable only in Discord
- Private work cannot be Shown in a public room
- A Job ID works forever as long as the work is still in the system

---

## Cases where a Job ID doesn't work

- The work was deleted from the system
- The work is Private and you don't have permission
- You typed the Job ID wrong — check again

---

## Summary

`/show` is a useful command for bringing old work back in Discord to edit or build on. Use it with the Job ID obtained from clicking ✉️ on the work, and you can also share work with friends by sending each other the Job ID.
