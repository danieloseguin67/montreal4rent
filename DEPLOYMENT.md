# GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

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

Make sure the following settings are configured in your GitHub repository:

1. Go to Settings > Pages
2. Source should be set to "GitHub Actions"
3. The workflow will automatically deploy on push to main branch

## Local Development

To run locally:
```bash
cd website
npm install
npm start
```

The application will be available at `http://localhost:4200`