# GoDaddy Economy Linux Hosting Deployment Guide

## Prerequisites

1. GoDaddy Economy Linux Hosting account
2. FTP/SSH access credentials from GoDaddy
3. Your domain name configured in GoDaddy

## Build for Production

The production build has been created in `website/dist/montreal4rent/`

To rebuild if needed:
```bash
cd website
npm run build:prod
```

## Deployment Steps

### Option 1: Using FTP/SFTP (Recommended for Economy Hosting)

1. **Connect to your GoDaddy hosting via FTP:**
   - Host: Your domain or FTP address from GoDaddy
   - Port: 21 (FTP) or 22 (SFTP)
   - Username: Your GoDaddy FTP username
   - Password: Your GoDaddy FTP password

2. **Navigate to the public_html directory** (or public_html_ssl for SSL)

3. **Upload all files from `website/dist/montreal4rent/` to the root of public_html:**
   - 404.html
   - favicon.ico
   - favicon.svg
   - index.html
   - All .js files (main.*.js, polyfills.*.js, runtime.*.js)
   - All .css files (styles.*.css)
   - assets/ folder (complete directory)

4. **Important:** Upload the `.htaccess` file (see configuration below)

### Option 2: Using File Manager in cPanel

1. Log into your GoDaddy hosting account
2. Access cPanel
3. Open File Manager
4. Navigate to public_html
5. Upload all files from `website/dist/montreal4rent/`
6. Upload the `.htaccess` file

## Required .htaccess Configuration

Create a `.htaccess` file in your public_html directory with the following content:

```apache
# Enable Rewrite Engine
RewriteEngine On

# Redirect all requests to index.html for Angular routing
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Enable GZIP compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Enable browser caching
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>

# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

## Post-Deployment Steps

1. **Clear your browser cache** before testing
2. **Test the website** at your domain (e.g., https://yourdomain.com)
3. **Test all routes** to ensure Angular routing works correctly:
   - /home
   - /apartments
   - /contact
   - /students
   - /property-owners
   - etc.

4. **Verify 404 handling** - Angular should catch invalid routes

## Troubleshooting

### Issue: Blank page or 404 errors
**Solution:** Ensure .htaccess file is uploaded and mod_rewrite is enabled in your hosting

### Issue: Routes don't work (404 on refresh)
**Solution:** Verify .htaccess RewriteRule is correct and uploaded to the correct directory

### Issue: Assets not loading
**Solution:** Check that the assets/ folder was uploaded correctly with all subdirectories

### Issue: CSS/JS files not loading
**Solution:** Verify all hashed files (e.g., main.c2f16fabba13720c.js) were uploaded

## File Structure on Server

Your public_html should look like:
```
public_html/
├── .htaccess
├── 404.html
├── favicon.ico
├── favicon.svg
├── index.html
├── main.c2f16fabba13720c.js
├── polyfills.893840c0695a4358.js
├── runtime.8bb30c1eb7e73477.js
├── styles.ca2f8db27f85605c.css
└── assets/
    ├── data/
    │   ├── apartments.json
    │   ├── areas.json
    │   ├── emailhostserver.json
    │   ├── toggles.json
    │   ├── translations.json
    │   └── unittypes.json
    └── images/
        └── (your image files)
```

## SSL/HTTPS Configuration

If you have an SSL certificate from GoDaddy:

1. Ensure your files are in `public_html_ssl` (or use the SSL domain path)
2. Update your .htaccess to force HTTPS:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

## Performance Optimization

Your build is already optimized with:
- Minified JavaScript and CSS
- Tree-shaking (unused code removed)
- Output hashing for cache busting
- Production mode Angular compilation

## Email Service Configuration

Update `website/src/assets/data/emailhostserver.json` with your GoDaddy email server details if using the contact form.

## Build Information

Latest build:
- Date: February 3, 2026
- Bundle size: 684.18 kB (raw) / 133.80 kB (gzipped)
- Angular version: 19.0.0
- Build hash: 53ed966b5607cef4

## Support

For GoDaddy-specific hosting issues:
- Contact GoDaddy support
- Check GoDaddy's cPanel documentation
- Verify PHP/Apache settings in cPanel

## Quick Deployment Checklist

- [ ] Production build completed (`npm run build:prod`)
- [ ] FTP/SFTP credentials ready
- [ ] .htaccess file created
- [ ] All files from dist/montreal4rent/ uploaded
- [ ] .htaccess file uploaded
- [ ] Domain DNS pointing to GoDaddy hosting
- [ ] Website tested in browser
- [ ] All routes tested
- [ ] Contact form tested (if applicable)
- [ ] Mobile responsiveness verified
