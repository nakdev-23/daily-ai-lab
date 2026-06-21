---
title: "Files API — upload a file once, reuse it many times"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "The Files API lets you upload a file once and reference it by file_id in every API call, reducing payload size, saving time, and lowering cost for frequently used documents"
readTime: "8 min"
readers: "0"
locked: false
order: 16
---

## What is the Files API?

The Files API (a file-management system via the API — an interface between programs) is a feature that lets you **upload files to store at Anthropic** and reference them in every Messages API call by `file_id` (a file ID used instead of sending the actual file), instead of sending the whole file each time.

### The problem the Files API solves

Before the Files API:
- You had to convert documents to base64 (encoding a file as text characters so it can be sent via the API) every time you called the API
- The request size was very large, slow, and wasted bandwidth (the amount of data sent over the network)
- If you used the same document 100 times, you had to send it 100 times

After the Files API:
- Upload once, get a `file_id`
- Use the `file_id` in the request instead of sending the actual file
- Faster, saves a lot of bandwidth

> **Note:** The Files API is still in beta (the test version); you must add the header `anthropic-beta: files-api-2025-04-14`

---

## Supported file types

| File type | MIME Type | Content Block | Used for |
|-----------|----------|---------------|---------|
| **PDF** | `application/pdf` | `document` | Document analysis |
| **Plain Text** | `text/plain` | `document` | Text analysis |
| **JPEG** | `image/jpeg` | `image` | Image analysis |
| **PNG** | `image/png` | `image` | Image analysis |
| **GIF** | `image/gif` | `image` | Image analysis |
| **WebP** | `image/webp` | `image` | Image analysis |
| **CSV, Excel, others** | varies | `container_upload` | Code execution tool |

---

## Uploading a file

### Python

```python
import anthropic

client = anthropic.Anthropic()

# Upload a PDF (a document file format)
with open("annual_report.pdf", "rb") as f:
    uploaded = client.beta.files.upload(
        file=("annual_report.pdf", f, "application/pdf"),
    )

print(f"File ID: {uploaded.id}")
print(f"Filename: {uploaded.filename}")
print(f"Size: {uploaded.size_bytes} bytes")
```

### cURL

```bash
FILE_ID=$(curl -X POST https://api.anthropic.com/v1/files \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: files-api-2025-04-14" \
  -F "file=@annual_report.pdf" \
  | jq -r '.id')

echo "File ID: $FILE_ID"
```

### The response you receive

```json
{
  "id": "file_011CNha8iCJcU1wXNR6q4V8w",
  "type": "file",
  "filename": "annual_report.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 1024000,
  "created_at": "2025-06-10T00:00:00Z",
  "downloadable": false
}
```

---

## Using a File in Messages

### Use with a PDF Document

```python
response = client.beta.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Summarize the key points in this annual report"
                },
                {
                    "type": "document",
                    "source": {
                        "type": "file",
                        "file_id": "file_011CNha8iCJcU1wXNR6q4V8w"
                    },
                    "title": "Annual Report 2025",  # optional
                    "citations": {"enabled": True}   # enable citations (source references), optional
                }
            ],
        }
    ],
    betas=["files-api-2025-04-14"],
)
```

### Use with an Image

```python
response = client.beta.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Describe what you see in this image"
                },
                {
                    "type": "image",
                    "source": {
                        "type": "file",
                        "file_id": "file_imageXXXXXX"
                    }
                }
            ],
        }
    ],
    betas=["files-api-2025-04-14"],
)
```

---

## A real example: a Document Q&A System

```python
import anthropic

client = anthropic.Anthropic()

class DocumentQASystem:
    def __init__(self):
        self.documents = {}  # {name: file_id}
    
    def upload_document(self, name: str, file_path: str) -> str:
        """Upload a document and store the file_id"""
        with open(file_path, "rb") as f:
            filename = file_path.split("/")[-1]
            mime_type = "application/pdf" if file_path.endswith(".pdf") else "text/plain"
            uploaded = client.beta.files.upload(
                file=(filename, f, mime_type),
            )
        self.documents[name] = uploaded.id
        print(f"Uploaded '{name}': {uploaded.id}")
        return uploaded.id
    
    def ask(self, doc_name: str, question: str) -> str:
        """Ask a question about a document"""
        if doc_name not in self.documents:
            return f"Document '{doc_name}' not found"
        
        file_id = self.documents[doc_name]
        
        response = client.beta.messages.create(
            model="claude-opus-4-8",
            max_tokens=2048,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": question},
                        {
                            "type": "document",
                            "source": {"type": "file", "file_id": file_id}
                        }
                    ],
                }
            ],
            betas=["files-api-2025-04-14"],
        )
        return response.content[0].text

# Usage
qa = DocumentQASystem()
qa.upload_document("policy", "company_policy.pdf")
qa.upload_document("report", "annual_report.pdf")

# Ask questions without re-uploading
print(qa.ask("policy", "What is the vacation leave policy?"))
print(qa.ask("report", "What was the total revenue in 2025?"))
print(qa.ask("policy", "What are the dress code rules?"))  # reuses the same file
```

---

## Managing files

### List all files

```python
files = client.beta.files.list()
for file in files.data:
    print(f"{file.id}: {file.filename} ({file.size_bytes} bytes)")
```

### View a file's Metadata

Metadata (data describing the file, e.g. name, size, creation date):

```python
file_info = client.beta.files.retrieve_metadata("file_011CNha8iCJcU1wXNR6q4V8w")
print(f"Filename: {file_info.filename}")
print(f"Created: {file_info.created_at}")
print(f"Size: {file_info.size_bytes}")
```

### Delete a file

```python
result = client.beta.files.delete("file_011CNha8iCJcU1wXNR6q4V8w")
print("File deleted successfully")
```

---

## Downloading files

You can download only files **created by skills or the code execution tool** (not files you uploaded yourself):

```python
# Download a file the code execution tool created
file_content = client.beta.files.download("file_output_XXXXX")
with open("output_chart.png", "wb") as f:
    f.write(file_content.read())
```

---

## Storage Limits

| Limit | Value |
|---------|-----|
| Max file size per file | 500 MB |
| Total storage per organization | 500 GB |
| Rate limit on API calls | ~100 requests/minute |
| Data retention period | Until deleted |

---

## Cost

| Operation | Price |
|-----------|------|
| Upload a file | Free |
| Download a file | Free |
| List / Get metadata | Free |
| Delete a file | Free |
| **Use a file in Messages** | Charged at normal tokens |

The main cost is the tokens generated from the file's content when sent in the Messages API.

---

## Error Handling

```python
import anthropic

client = anthropic.Anthropic()

try:
    response = client.beta.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Analyze this document"},
                    {
                        "type": "document",
                        "source": {"type": "file", "file_id": "file_XXXXX"}
                    }
                ],
            }
        ],
        betas=["files-api-2025-04-14"],
    )
    
except anthropic.NotFoundError:
    print("File not found, it may have been deleted or the file_id is incorrect")
    
except anthropic.BadRequestError as e:
    if "invalid file type" in str(e):
        print("The file type doesn't match the content block")
    elif "exceeds context window" in str(e):
        print("The file is larger than the context window (the temporary memory size)")
    else:
        print(f"Request error: {e}")
```

### Common Error Codes

| Error | Cause | How to fix |
|-------|--------|---------|
| 404 Not Found | file_id not found | Check that the upload succeeded |
| 400 Invalid file type | The file type doesn't match the content block | Use an image block for images, a document block for PDFs |
| 400 Exceeds context window | The file is too large | Trim the file smaller, or use a model with a larger context window |
| 413 File too large | The file is over 500 MB | Reduce the file size |
| 403 Storage limit exceeded | The organization hit 500 GB | Delete unused files |

---

## Files API vs Base64 Inline

| Criterion | Files API | Base64 Inline |
|-------|----------|---------------|
| **Single use** | Not recommended (overhead) | Better suited |
| **Reused many times** | Strongly recommended | Must resend every time |
| **Request size** | Very small (just the file_id) | Very large |
| **Upload speed** | Upload once | Every request |
| **Cost** | Same tokens | Same tokens |

---

## Best Practices

1. **Store the file_id in a database** — don't re-upload the same file
2. **Delete unused files** — to not exceed the storage limit
3. **Verify the file_id** before use, with `retrieve_metadata`
4. **Group files** with a naming convention in the custom_id or metadata
5. **Handle errors in all cases**, especially 404 because the file may have been deleted by someone else

---

## Summary

The Files API is good for:

- **Knowledge base** — policy documents, frequently used manuals
- **Document processing** — analyze reports, contracts
- **Multimodal apps** — systems that reuse images
- **Code execution** — send a dataset to run analysis

Upload once, use forever, saving both time and bandwidth.
