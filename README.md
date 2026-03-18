# Portfolio Website

This repository contains two portfolio implementations:

- Root app: static HTML/CSS/JS site
- modern-portfolio: React + Vite + Tailwind site

## Resume

Current resume file in the repository root:

- Gowtham_Reddy_Resume.pdf

## Local Development

Run the React portfolio locally:

```bash
cd modern-portfolio
npm install
npm run dev
```

## Production Build

```bash
npm --prefix modern-portfolio run build
```

## Vercel Deployment

This repo is configured for Vercel using the root vercel.json file.

- Install command: npm --prefix modern-portfolio ci
- Build command: npm --prefix modern-portfolio run build
- Output directory: modern-portfolio/dist

After connecting this GitHub repository in Vercel, deployments should work without additional build configuration.