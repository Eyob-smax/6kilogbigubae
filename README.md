# ፮ኪሎ ግቢ ጉባኤ — 6 Kilo Gibi Gubae

A demo web app showcasing a community / events / parcel-like tracking UI and dashboard experience.

 Live demo: [https://6kilogbigubae.vercel.app/](https://6kilogbigubae.vercel.app/) (production preview)

## Table of Contents

## About

`6 Kilo Gibi Gubae` is a demo web application that provides a modern, responsive UI for community/parcel/event management workflows. The demo highlights an interactive dashboard, item (parcel or event) listing, detail pages, and role-oriented actions (create, update, track).

This README gives a complete developer-friendly guide so anyone can clone, run, and extend the app locally, plus sample code for frontend components and a suggested backend API.

Live demo title and preview were pulled from the production site. :contentReference[oaicite:1]{index=1}

## Live Demo

Open the hosted demo:

 [https://6kilogbigubae.vercel.app/](https://6kilogbigubae.vercel.app/) — please use it as the reference for intended look & feel. :contentReference[oaicite:2]{index=2}

## Key Features

* Responsive dashboard and listing pages
* Create / edit / delete items (shipments, events or community posts)
* Item detail views with status and history timeline
* Search and filter capability (by id, status, or date)
* Client-focused UX: clear CTA, simple forms, confirmation dialogs
* Ready for integration with a backend API (examples included below)

## Tech Stack

Primary technologies assumed for this demo (adjust if your repo differs):

* Frontend : React or Next.js (TypeScript recommended)
* Styling : Tailwind CSS (or plain CSS with utility classes)
* State management : Redux Toolkit or React Context
* HTTP client : Axios or fetch
* Forms : React Hook Form or controlled components
* Icons / UI : Heroicons / Font Awesome / custom SVGs
* Deployment : Vercel

## Design & UX Notes

* Focus on minimal onboarding friction and clear CTAs.
* Use large tappable areas for mobile and keep forms short.
* Use subtle motion for state changes (status update, success toast).
* Keep colors high-contrast for readability and accessibility.

## Getting Started (Full Setup)

Below are detailed steps to run the app locally and an optional minimal backend to simulate API responses.

### Prerequisites

- Node.js (v16+) and npm or yarn
- Git
- Optional: MongoDB (local / Atlas) or PostgreSQL if you want to persist data

### Install & Run (Frontend Only)
