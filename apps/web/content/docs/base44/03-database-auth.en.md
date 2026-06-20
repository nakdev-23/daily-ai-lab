---
title: "Base44: Database & Auth — data and the membership system"
tool: "Base44"
icon: "tool-base44"
level: "intermediate"
summary: "Manage data (Entities) and the user/login system that comes built into Base44"
readTime: "5 min"
readers: "0"
locked: false
order: 3
---

# Database & Auth — the heart of a real app 🗄️

> Adapted from the official documentation at [docs.base44.com](https://docs.base44.com/)

Base44's strength is that it has the database and membership system **built in** — nothing to set up yourself.

## 🧱 Database & Entities

An **Entity** is a "data type/table" in the app, e.g. products, customers, bookings.

- Base44 creates Entities automatically based on how you describe the app
- Each Entity has fields (e.g. name, price, date)
- Add/edit fields just by describing it in text

## 👤 Users & Auth (membership system)

- A **sign-up/login** system ready to go
- Set **permissions** for who can see/edit what data
- Easily make an app where "each user sees only their own data"

## 🔒 Access permissions (important)

Set them tightly:
- Who can read/write each data type
- Private data must never leak to others

> 💡 Check permissions carefully before making the app public — it's a common mistake.

## ▶️ Example prompt

> "Add a 'Booking' Entity with fields for customer, service, date/time, and let customers see only their own bookings"

## 🔗 Reference

- Official docs: https://docs.base44.com/
