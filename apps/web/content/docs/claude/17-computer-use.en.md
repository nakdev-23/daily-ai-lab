---
title: "Computer Use — Claude controls the computer automatically"
tool: "Claude"
icon: "tool-claude"
level: "pro"
summary: "The Computer Use tool lets Claude see the screen, click the mouse, press the keyboard, and do work on the computer for humans automatically"
readTime: "10 min"
readers: "0"
locked: false
order: 17
---

## What is Computer Use?

Computer Use is a feature of Claude that allows the model (the AI's brain) to **control the desktop environment** (the computer screen environment) like a human, using:

- **Screenshot** — see what's displayed on the screen
- **Mouse control** — click, drag, and move the cursor
- **Keyboard input** — type text and use keyboard shortcuts

Claude can do multi-step work automatically, e.g. open programs, fill in forms, browse the web, and interact with any UI (a program's interface).

> **Note:** Computer Use is still in beta (the test version); you must add the beta header to enable it.

---

## Main capabilities

| Capability | Detail |
|-----------|-----------|
| **Screenshot** | Capture the current screen |
| **Click** | left/right/double click at position x,y |
| **Type** | Type text |
| **Key** | Press special keys (Enter, Ctrl+C, Tab, etc.) |
| **Mouse move** | Move the cursor without clicking |
| **Drag** | Click and hold, then drag |
| **Scroll** | Move the scroll wheel |

---

## Supported models

| Beta Header | Usable models |
|------------|---------------|
| `computer-use-2025-11-24` | Opus 4.8, 4.7, 4.6, Sonnet 4.6, Opus 4.5 |
| `computer-use-2025-01-24` | Sonnet 4.5, Haiku 4.5, older versions |

---

## Use Cases

### Desktop Automation
- Fill in repetitive forms automatically
- Extract data from programs without an API
- Do data entry from documents
- Create reports from multiple programs

### Web Automation
- Browse the web and collect data
- Fill in online application forms
- Test web applications with E2E testing (end-to-end testing)
- Monitor a dashboard and alert

### Software Testing
- Test UIs automatically
- Screenshot comparison testing
- Regression testing (re-testing to check that edits didn't break other parts) in legacy systems

### Research
- Search for information from many websites
- Summarize results from many applications
- Automatic competitive analysis

---

## Implementing Computer Use

### Basic steps

1. Set up a virtual machine (a simulated computer) or container (an isolated environment) for Claude to control
2. Send a request with the computer_use tool
3. Loop: Claude sends an action → you run the action → send a screenshot back → Claude decides what's next

### Python code example

```python
import anthropic
import base64
import subprocess
from pathlib import Path

client = anthropic.Anthropic()

def take_screenshot() -> str:
    """Capture the screen and return it as base64 (encoded text)"""
    # In real use, use a library like pyautogui or scrot
    # This is just pseudo-code
    subprocess.run(["scrot", "/tmp/screenshot.png"])
    with open("/tmp/screenshot.png", "rb") as f:
        return base64.b64encode(f.read()).decode()

def execute_action(action: dict) -> str:
    """Run the action Claude instructed and return a new screenshot"""
    action_type = action.get("type")
    
    if action_type == "screenshot":
        return take_screenshot()
    
    elif action_type == "left_click":
        x, y = action["coordinate"]
        subprocess.run(["xdotool", "click", "--clearmodifiers", 
                       f"--window", "root", str(x), str(y)])
    
    elif action_type == "type":
        text = action["text"]
        subprocess.run(["xdotool", "type", "--clearmodifiers", text])
    
    elif action_type == "key":
        key = action["key"]
        subprocess.run(["xdotool", "key", "--clearmodifiers", key])
    
    return take_screenshot()

# Define the computer tool
computer_tool = {
    "type": "computer_20251124",
    "name": "computer",
    "display_width_px": 1920,
    "display_height_px": 1080,
    "display_number": 1
}

# Start the task
messages = [
    {
        "role": "user",
        "content": "Open Firefox, go to google.com, then search for 'Claude AI Anthropic'"
    }
]

# Agentic Loop (the AI's automatic work cycle)
while True:
    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=4096,
        tools=[computer_tool],
        messages=messages,
        betas=["computer-use-2025-11-24"]
    )
    
    # Add the response to messages
    messages.append({"role": "assistant", "content": response.content})
    
    # If Claude has finished answering, stop
    if response.stop_reason == "end_turn":
        print("Task completed!")
        break
    
    # Process tool calls
    tool_results = []
    for block in response.content:
        if block.type == "tool_use" and block.name == "computer":
            action = block.input
            
            # Run the action and get a screenshot
            new_screenshot = execute_action(action)
            
            tool_results.append({
                "type": "tool_result",
                "tool_use_id": block.id,
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": new_screenshot
                        }
                    }
                ]
            })
    
    # Send the tool results back
    if tool_results:
        messages.append({"role": "user", "content": tool_results})
    else:
        break
```

---

## All Action Types

### Mouse Actions

```json
// left click
{"type": "left_click", "coordinate": [x, y]}

// right click  
{"type": "right_click", "coordinate": [x, y]}

// double click
{"type": "double_click", "coordinate": [x, y]}

// scroll
{"type": "scroll", "coordinate": [x, y], "direction": "down", "amount": 3}

// drag
{"type": "drag", "start_coordinate": [x1, y1], "end_coordinate": [x2, y2]}
```

### Keyboard Actions

```json
// type text
{"type": "type", "text": "Hello World"}

// press special keys
{"type": "key", "key": "Return"}
{"type": "key", "key": "ctrl+c"}
{"type": "key", "key": "ctrl+v"}
{"type": "key", "key": "ctrl+shift+t"}
{"type": "key", "key": "alt+F4"}
```

### Screen Action

```json
// capture the screen
{"type": "screenshot"}
```

---

## Computer Use cost

Computer Use uses extra tokens:

| Item | Token |
|--------|-------|
| Beta system prompt overhead | 466–499 tokens |
| Computer tool definition | 735 tokens (Claude 4.x) |
| Each screenshot | depends on resolution |

### Estimating cost

A 1920x1080 screenshot ≈ 1,000–1,500 tokens

A task with 20 steps (20 screenshots + actions):
- Screenshots: 20 × 1,200 tokens = 24,000 tokens
- Text/actions: ~5,000 tokens
- Approximate cost (Opus 4.8): ~$0.15 per task

---

## Best Practices

### 1. Use an appropriate Resolution

Lower the resolution to save tokens but keep it clear enough for Claude to see:
- For general work: 1280×800 is enough
- For detailed work: 1920×1080

### 2. Set a Timeout

```python
import threading

def run_with_timeout(func, timeout=300):
    """Run a function with a 5-minute timeout"""
    result = [None]
    exception = [None]
    
    def target():
        try:
            result[0] = func()
        except Exception as e:
            exception[0] = e
    
    thread = threading.Thread(target=target)
    thread.start()
    thread.join(timeout)
    
    if thread.is_alive():
        raise TimeoutError("Task exceeded timeout")
    
    if exception[0]:
        raise exception[0]
    
    return result[0]
```

### 3. Handle Errors carefully

Computer Use may fail for many reasons:
- The element (an item on screen) doesn't appear on screen
- The application is slow or hangs (freezes)
- The UI changes along the way

### 4. Add Verification Steps

```
After each step, take a screenshot to verify it succeeded before continuing.
If it's not as expected, report it and stop.
```

### 5. Be careful with Destructive Actions (irreversible actions)

```
Before deleting a file, closing a program, or doing anything irreversible,
always ask the user first.
```

---

## Limitations to know

### Visual Hallucination (the AI sees something that isn't really there)
Claude may "see" something not on the real screen, or misunderstand the UI; you should add verification.

### Performance
- Each step takes several seconds
- Screenshot + API call + action ≈ 5–15 seconds per step
- A 20-step task may take 5–10 minutes

### Desktop only
Computer Use doesn't support mobile devices directly; you must use an emulator (a device-simulation program).

### Security
Don't let Claude access systems with sensitive data without human oversight, because unintended actions may occur.

---

## Example Use Case: Web Scraping (collecting data from the web)

```python
task_prompt = """
Go to the website https://example-jobs.com
Search for 'Python Developer' jobs in Bangkok
Collect the job title, company, and salary from the first 5 positions
Then summarize them in a table for me
"""
```

---

## Summary

Computer Use opens up automation that was never possible before, especially for:

| Use Case | Benefit |
|----------|---------|
| Legacy systems | Old systems with no API |
| Complex workflows | Complex multi-app work |
| Testing | Automated E2E testing |
| Research | Multi-source data collection |

Start with simple tasks and verify the result at every step, before expanding to more complex and fully autonomous work.
