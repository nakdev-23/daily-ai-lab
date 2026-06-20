---
title: "Data Analysis & Code Interpreter"
tool: "ChatGPT"
icon: "tool-chatgpt"
level: "intermediate"
summary: "Analyze data, create graphs, and run Python code directly in ChatGPT, with no programming background needed"
readTime: "8 min"
readers: "0"
locked: false
order: 9
---

# Data Analysis & Code Interpreter

> Primary reference: [OpenAI Help Center — ChatGPT](https://help.openai.com/en/collections/3742473-chatgpt)

---

## What is Data Analysis

**Advanced Data Analysis** (formerly Code Interpreter) is a feature that lets ChatGPT actually run Python code (instructions written to make a computer work) in an isolated sandbox environment (a separate workspace — working safely without affecting external systems) and analyze data from the files you upload.

This means ChatGPT doesn't just "tell you" how to analyze data — it **actually runs the code** and shows you the results immediately, including creating graphs and exporting (saving the results as a file for further use) result files.

---

## Supported file types

| Type | Examples |
|---|---|
| **Data** | .csv, .xlsx, .json, .parquet |
| **Documents** | .pdf, .docx, .txt |
| **Images** | .png, .jpg, .jpeg, .gif |
| **Code** | .py, .js, .html, .css |
| **Audio** | .mp3, .mp4, .wav (some plans) |
| **Compressed** | .zip, .tar.gz |

---

## Core abilities

### 1. Data Cleaning (checking and fixing erroneous or incomplete data)
Upload a CSV or Excel file and tell ChatGPT what you want:
- **Find missing values**: check which columns have empty data, and fill or remove them
- **Check data types**: verify the date column is formatted correctly
- **Find outliers** (abnormal values — data unusually different from others): find unusual values with statistics or graphs
- **Deduplication**: find and remove duplicate data

**Example command:**
> *"Check this CSV for which columns have missing values, and suggest how to handle them"*

### 2. Exploratory Data Analysis — EDA (exploring data to understand it before real analysis)
Analyze the data preliminarily to understand it before building a model (the trained AI program):
- Summarize basic statistics (Mean, Median, Std, Min, Max)
- Distribution (where most of the data sits) of each column
- Correlation matrix (a table showing which variables affect each other) between variables
- Interesting trends and patterns

**Example command:**
> *"Analyze this sales data and tell me which product sells best, what time periods have high sales, and what trends are interesting"*

### 3. Data Visualization (creating graphs from data — making data easier to see)
ChatGPT creates many kinds of graphs with Matplotlib, Seaborn, or Plotly (names of Python code libraries for making graphs):
- **Bar Chart / Column Chart**: compare categories
- **Line Chart**: show trends over time
- **Scatter Plot**: see the relationship between two variables
- **Pie Chart**: show proportions
- **Heatmap** (uses color to show data intensity): show correlation or 2D data
- **Box Plot**: show distribution and outliers
- **Histogram**: show distribution

**Example command:**
> *"Create a line chart of this year's monthly sales, with a trend line too"*

### 4. Statistical Analysis
- T-test, Chi-square test, ANOVA (statistical tests for comparing groups of data)
- Regression analysis (finding relationships between variables to predict values), both linear and logistic
- Time series analysis (analyzing data over time periods)
- Hypothesis testing

### 5. Feature Engineering (creating new variables from existing data — so the AI learns better)
Create new variables from existing data:
- Split a date into day/month/year/day-of-week
- Compute the rate of change (growth rate)
- Normalize or scale (adjust data scale — making values fall in the same range) the data

### 6. Export the results
- Export graphs as .png or .pdf
- Export result tables as .csv
- Create a report as .html or a Word document

---

## How to use Data Analysis

### Basic steps

1. **Upload a file**: click the **paperclip** icon or **"+"** and choose a file
2. **State what you want**: type a command for what you want to analyze
3. **See the results**: ChatGPT runs the code and shows the output
4. **Ask more**: you can keep asking based on the results
5. **Download**: click Download to save a graph or file

### Frequently used commands

```
"Analyze this data and tell me what's interesting"
"Create a chart of monthly sales comparing this year to last year"
"Find which columns correlate with Revenue"
"Make a summary report of this data as a PDF"
"Fix the Python code that gave this error after running"
```

---

## Real use-case examples

### For business
- Analyze sales by branch and find branches performing below average
- Analyze customer data for customer segmentation (grouping customers by similar characteristics)
- Create an automatic dashboard report (an overview report showing key data on one page) from an Excel file

### For students/researchers
- Analyze survey data from a Google Form
- Create graphs for a report or thesis
- Test statistical hypotheses

### For developers
- Debug (find and fix errors in) Python code without setting up an environment (the programs and settings needed to run code)
- Test an algorithm (a problem-solving procedure — a set of step-by-step instructions for the computer) on sample data
- Convert and transform (change the format of) data between formats

---

## Limits to know

| Topic | Details |
|---|---|
| **File size** | Limited to 512 MB per file (may vary by plan) |
| **Session duration** (period of use) | The sandbox resets each session; variables you created are lost |
| **Internet connection** | Code Interpreter runs isolated; it can't pull data from the internet |
| **Libraries** (ready-made code you can use directly) | Supports major libraries like pandas, numpy, matplotlib, scipy, but not all |
| **Supported plans** | Plus, Pro, Team, Enterprise (Free is limited) |

---

## Data Analysis tips

- **Explain the context** (the surrounding info that helps make meaning clear): tell ChatGPT what this data is and what each column means, for more accurate results
- **Ask in steps**: break questions into small parts rather than asking everything at once
- **Look at the code it ran**: click "Show code" to see what Python ChatGPT ran — it helps you learn too
- **Verify the results**: the AI can hallucinate (interpret or generate incorrect data — it thinks it's right but it's actually wrong); always check results against the real data
- **Upload a sample file first**: if you're unsure what to ask, try uploading a small file first to see whether ChatGPT understands the data structure correctly
