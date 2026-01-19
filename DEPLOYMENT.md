# GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

## ⚠️ ONE-TIME SETUP REQUIRED

After the first deployment, you need to configure GitHub Pages to serve from the `gh-pages` branch:

1. Go to your repository: `https://github.com/danieloseguin67/montreal4rent`
2. Click **Settings** → **Pages**
3. Under **Source**, select **"Deploy from a branch"**
4. Choose **`gh-pages`** branch and **`/ (root)`** folder
5. Click **Save**

**Your website will then be available at: `https://danieloseguin67.github.io/montreal4rent/`**

## 🚀 Automatic Deployment

The deployment workflow automatically creates and updates the `gh-pages` branch when code is pushed to main.

## Deployment Setup

The deployment workflow is configured in `.github/workflows/deploy.yml` and will automatically deploy the website to GitHub Pages when code is pushed to the main branch.

### Manual Deployment

To deploy manually from your local machine:

1. Install dependencies:
   ```bash
   cd website
   npm install
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy:ghpages
   ```

### Configuration

- The website will be available at: `https://danieloseguin67.github.io/montreal4rent/`
- Base href is set to `/montreal4rent/` for GitHub Pages
- 404.html is configured to handle Angular routing
- GitHub Actions workflow handles automatic deployment

### Repository Settings

**IMPORTANT**: You must enable GitHub Pages in your repository settings first:

1. Go to your repository on GitHub: `https://github.com/danieloseguin67/montreal4rent`
2. Click **Settings** → **Pages**
3. Under **Source**, select **"GitHub Actions"**
4. Click **Save**

If you get a "Not Found" error during deployment, GitHub Pages isn't enabled yet. Follow these steps:

#### Alternative Setup:
1. Go to **Settings** → **Pages**
2. Under **Source**, temporarily select **"Deploy from a branch"** 
3. Choose **"main"** branch and **"/ (root)"** folder
4. Click **Save**
5. Wait a moment, then change **Source** back to **"GitHub Actions"**
6. Click **Save** again

This will initialize Pages for your repository.

## Local Development

To run locally:
```bash
cd website
npm install
npm start
```

The application will be available at `http://localhost:4200`