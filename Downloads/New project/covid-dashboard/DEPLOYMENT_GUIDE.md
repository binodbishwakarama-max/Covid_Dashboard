# 🚀 Enterprise Deployment Guide

This repository is configured for a **Cloud PaaS** deployment strategy.
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render / Railway (Node.js + Express)

## 1. Backend Deployment (Render.com)
The backend must be deployed first to get the `API URL`.

1.  **Fork/Clone** this repository to your GitHub.
2.  Login to [RenderDashboard](https://dashboard.render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Configuration**:
    *   **Root Directory**: `server`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install && npm run build`
    *   **Start Command**: `npm start`
6.  **Environment Variables**:
    *   `NODE_ENV`: `production`
    *   `CORS_ORIGIN`: * (or your Vercel URL after frontend deploy)
7.  **Deploy**.
8.  **Copy the Service URL** (e.g., `https://covid-api.onrender.com`).

---

## 2. Frontend Deployment (Vercel)
1.  Login to [Vercel](https://vercel.com).
2.  **Add New** -> **Project**.
3.  Select the same repository.
4.  **Framework Preset**: Vite (should detect automatically).
5.  **Environment Variables**:
    *   `VITE_API_BASE_URL`: Paste your Render Backend URL (e.g., `https://covid-api.onrender.com/api`)
    *   **IMPORTANT**: Append `/api` if your backend routes are served under `/api`.
6.  **Deploy**.

---

## 3. Production Verification checks
Once live, verify:
- [ ] **Health Check**: Visit `https://<backend-url>/health` -> should return `200 OK`.
- [ ] **Secure**: Ensure `https` lock icon is present on both.
- [ ] **Data Flow**: Dashboard loads data without "Network Error".
- [ ] **Refresh**: Refreshing deep links (e.g., `/dashboard`) should not 404.

## 4. Troubleshooting
**"Network Error" or "CORS Error"**:
- Check `VITE_API_BASE_URL` in Vercel settings. It must allow the dashboard origin.
- Check `CORS_ORIGIN` in Render settings.

**"500 Internal Server Error"**:
- Check Render Logs.
