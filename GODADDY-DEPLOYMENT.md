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

### Windows One-Click Deploy (optional)

Use the helper script to build, package, and optionally upload via WinSCP:

```bat
REM From the website folder
website\deploy-prod.bat

REM To enable FTP upload via WinSCP, set these first:
set USE_WINSCP=1
set FTP_HOST=your-ftp-host
set FTP_USER=your-ftp-username
set FTP_PASS=your-ftp-password
set FTP_TARGET=/public_html
website\deploy-prod.bat
```

Notes:
- The script creates a ZIP under `website/deploy/` named `montreal4rent-prod-YYYYMMDD-HHMM.zip`.
- If WinSCP is available and `USE_WINSCP=1` is set with credentials, the script will mirror `dist/montreal4rent/` to `/public_html`.
- You can change `FTP_TARGET` to deploy to a subfolder (e.g., `/public_html/test`).

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

4. **Important:** Upload the `.htaccess` file (see configuration below). For subfolders, ensure `.htaccess` uses relative routing rules.

### Deploying to a Subfolder (e.g., https://yourdomain.com/test/)

If you upload the build into a subdirectory like `public_html/test`, you must build with a matching base href; otherwise you’ll see a white page because the JS bundles load from the wrong path.

**IMPORTANT: To avoid white pages, always use the correct deploy command for your target folder.**

#### Quick Deploy to /test/ (Recommended)

Use the dedicated helper script that automatically builds with `/test/` base-href:

```bat
cd website
deploy-test.bat
```

This prevents the common white-page error by ensuring assets load from `/test/` instead of the domain root.

#### Manual Deploy to Any Subfolder

1. Build with the base href set to your subfolder path:

  ```powershell
  cd website
  # For /test/ subfolder
  .\deploy-prod.bat test

  # For any other subfolder (e.g., /staging/)
  .\deploy-prod.bat staging
  ```

2. Upload the contents of `website/dist/montreal4rent/` into `public_html/<your-subdir>`

3. Ensure a `.htaccess` file exists inside that subfolder as well (same rules as below)

Note: If you deploy to the domain root, use `.\deploy-prod.bat` without arguments (defaults to `/`).

### Option 2: Using File Manager in cPanel

1. Log into your GoDaddy hosting account
2. Access cPanel
3. Open File Manager
4. Navigate to public_html
5. Upload all files from `website/dist/montreal4rent/`
6. Upload the `.htaccess` file

## Required .htaccess Configuration

Create a `.htaccess` file in your `public_html` (or subfolder) with directory-relative rules (works for root and subfolders):

```apache
# Enable Rewrite Engine
RewriteEngine On

# Redirect all requests to index.html for Angular routing
# Use relative target so this works in subfolders
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . index.html [L]

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

To enable the contact form to send email on GoDaddy Economy hosting:

- Upload the PHP endpoints from `website/php/` to your server root (`public_html`):
  - `contact.php` (handles sending email to info@montreal4rent.com)
  - `email-history.php` (persists and lists submission logs)
- Ensure the server-side history directory exists and is writable:
  - `public_html/history/emails/`
  - Create it if missing; default permissions `0775` are fine on cPanel.
- The Angular app posts to `/contact.php`. No Node server is required in production.
- Optional: Update `website/src/assets/data/emailhostserver.json` for reference; browsers do not use SMTP directly.

Notes:
- This setup uses PHP's native `mail()` for simplicity. Deliverability depends on your domain SPF/DMARC records and GoDaddy mail policies.
- For improved deliverability, you can replace `mail()` with PHPMailer over SMTP (Office365 or GoDaddy SMTP) later.

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

**For /test/ subfolder deployment:**
- [ ] Run `deploy-test.bat` (this builds with correct base-href automatically)
- [ ] Upload `dist/montreal4rent/*` to `public_html/test/`
- [ ] Upload `php/contact.php` and `php/email-history.php` to `public_html/`
- [ ] Create `public_html/history/emails/` (writable) for server-side logs
- [ ] Verify .htaccess is in `public_html/test/`

**For root domain deployment:**
- [ ] Run `deploy-prod.bat` (without arguments)
- [ ] Upload `dist/montreal4rent/*` to `public_html/`
- [ ] Upload PHP endpoints to `public_html/`
- [ ] Create history folder as above

**General checklist:**
- [ ] Domain DNS pointing to GoDaddy hosting
- [ ] Website tested in browser
- [ ] All routes tested
- [ ] Contact form tested (if applicable)
- [ ] Mobile responsiveness verified
