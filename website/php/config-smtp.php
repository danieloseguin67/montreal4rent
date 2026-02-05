<?php
/**
 * SMTP Configuration for email sending
 * 
 * IMPORTANT: Fill in your Office365/Outlook credentials below
 * 
 * To get an app password for Office365:
 * 1. Go to https://account.microsoft.com/security
 * 2. Enable 2FA if not already enabled
 * 3. Go to "App passwords"
 * 4. Generate a new app password
 * 5. Use that password below (not your regular password)
 */

return [
    'smtp_host' => 'smtp.office365.com',
    'smtp_port' => 587,
    'smtp_secure' => 'tls', // 'tls' or 'ssl'
    'smtp_auth' => true,
    'smtp_username' => 'info@montreal4rent.com', // Your full email address
    'smtp_password' => '', // YOUR APP PASSWORD HERE - keep this file secure!
    'from_email' => 'info@montreal4rent.com',
    'from_name' => 'Montreal4Rent',
];
