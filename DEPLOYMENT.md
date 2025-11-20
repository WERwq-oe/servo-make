# Deploying to GitHub Pages

This guide will help you deploy your Servo Make survey application to GitHub Pages for free hosting.

## Prerequisites

- A GitHub account
- Git installed on your computer
- Your survey application code

## Step-by-Step Deployment Instructions

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the **+** icon in the top right and select **New repository**
3. Name your repository (e.g., `servo-make` or `survey-app`)
4. Choose **Public** (required for free GitHub Pages)
5. Click **Create repository**

### 2. Push Your Code to GitHub

Open your terminal in the project directory and run:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit"

# Add your GitHub repository as remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically run and deploy your site

### 4. Wait for Deployment

1. Go to the **Actions** tab in your repository
2. You'll see the "Deploy to GitHub Pages" workflow running
3. Wait for it to complete (usually takes 1-2 minutes)
4. Once complete, your site will be live!

### 5. Access Your Deployed Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

For example: `https://johndoe.github.io/servo-make/`

## Updating Your Site

Every time you push changes to the `main` branch, GitHub Actions will automatically rebuild and redeploy your site:

```bash
git add .
git commit -m "Updated survey features"
git push
```

## Important Notes

### Firebase Configuration

Make sure your Firebase configuration in `src/firebase.js` is set up correctly:
- Your Firebase project should allow web access
- Firestore rules should be configured properly
- The Firebase config should use environment variables or be committed (it's safe to commit as it's client-side config)

### Custom Domain (Optional)

If you want to use a custom domain:
1. Go to **Settings** → **Pages** in your repository
2. Under **Custom domain**, enter your domain
3. Follow GitHub's instructions to configure DNS

### Troubleshooting

**Build fails:**
- Check the Actions tab for error messages
- Ensure all dependencies are in `package.json`
- Make sure `npm run build` works locally

**Site shows 404:**
- Wait a few minutes after deployment
- Check that GitHub Pages is enabled in Settings
- Verify the correct branch is selected

**Blank page:**
- Check browser console for errors
- Verify Firebase configuration
- Ensure `base: './'` is set in `vite.config.js`

**Routing issues:**
- The app uses HashRouter which works with GitHub Pages
- URLs will have `#` in them (e.g., `/#/create`)

## Alternative: Deploy to Netlify or Vercel

If you prefer other free hosting options:

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Build command: `npm run build`
5. Publish directory: `dist`

### Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite settings
5. Click "Deploy"

Both platforms offer automatic deployments on every push, similar to GitHub Pages.
