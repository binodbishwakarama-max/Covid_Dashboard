# Deployment Guide 🚀

This guide will walk you through deploying your **Portfolio** to the web using **Vercel** (recommended) or **Netlify**. Both are free, fast, and perfect for React/Vite projects.

## Prerequisites

1.  **GitHub Repository**: Ensure your code is pushed to a GitHub repository.
    - If you haven't pushed it yet:
      ```bash
      git init
      git add .
      git commit -m "Initial commit"
      # Create a new repo on GitHub.com and copy the remote URL
      git remote add origin <YOUR_GITHUB_REPO_URL>
      git push -u origin main
      ```

---

## Option 1: Vercel (Recommended)

Vercel is the creators of Next.js and provides the best experience for React apps.

1.  **Sign Up**: Go to [vercel.com](https://vercel.com) and sign up with **GitHub**.
2.  **Add New Project**:
    - Click **"Add New..."** > **"Project"**.
    - Select your portfolio repository from the list.
    - Click **"Import"**.
3.  **Configure Project**:
    - **Framework Preset**: Vercel usually detects `Vite` automatically. If not, select `Vite`.
    - **Build Command**: `npm run build`
    - **Output Directory**: `dist`
    - **Environment Variables**: None needed currently.
4.  **Deploy**: Click **"Deploy"**. Vercel will build your site and give you a live URL (e.g., `binod-portfolio.vercel.app`).

### Custom Domain on Vercel
1.  Go to your Project Dashboard > **Settings** > **Domains**.
2.  Enter your custom domain (e.g., `binod.dev`).
3.  Vercel will give you DNS records (A Record and CNAME) to add to your domain registrar (GoDaddy, Namecheap, etc.).
    - **Type**: `A` | **Name**: `@` | **Value**: `76.76.21.21`
    - **Type**: `CNAME` | **Name**: `www` | **Value**: `cname.vercel-dns.com`

---

## Option 2: Netlify

1.  **Sign Up**: Go to [netlify.com](https://netlify.com) and sign up with **GitHub**.
2.  **Add New Site**:
    - Click **"Add new site"** > **"Import an existing project"**.
    - Select **GitHub**.
    - Authorize Netlify and choose your repository.
3.  **Build Settings**:
    - **Base directory**: (leave empty)
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`
4.  **Deploy**: Click **"Deploy site"**.

### Custom Domain on Netlify
1.  Go to **Site configuration** > **Domain management**.
2.  Click **"Add a domain"**.
3.  Follow the instructions to verify ownership and update DNS records.

---

## Updating Your Site

Since you have set up continuous deployment:
1.  Make changes locally in VS Code.
2.  Commit and push to GitHub:
    ```bash
    git add .
    git commit -m "Update portfolio content"
    git push origin main
    ```
3.  Vercel/Netlify will detecting the push and **automatically redeploy** your site within seconds.
