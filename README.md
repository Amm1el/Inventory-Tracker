# Inventory Tracker

A web-based inventory manager with live item search, running totals, and a recent-activity log, backed by Firebase Firestore.

**Live site:** https://inventory-tracker-delta.vercel.app

## Features

- Add items, or increase the quantity of an item that already exists.
- Remove items one unit at a time; an item is deleted when its quantity reaches zero.
- Search the inventory by item name.
- Running totals for total quantity, unique items, additions, and deletions.
- A recent-activity log of every add and remove.

## How it works

Each item is a document in a Firestore `inventory` collection, keyed by item name, with a `quantity` field. Every add or remove reads the document, updates the quantity, and refreshes the totals.

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | Next.js 14, React, Material UI |
| Database | Firebase Firestore |
| Hosting | Vercel |

## Run locally

```bash
git clone https://github.com/Amm1el/Inventory-Tracker.git
cd Inventory-Tracker
npm install
npm run dev
```

Firebase project settings live in `firebase.js`.

## Context

Built during the Headstarter AI Software Engineering Fellowship (Summer 2024).

## Author

Ammiel Bowen · [ammielbowen.com](https://ammielbowen.com) · [LinkedIn](https://www.linkedin.com/in/ammielbowen/)
