#!/bin/bash

# CloudForge - Site Creation Script
# Usage: ./create_site.sh domain.com [type]

set -e

# Configuration
SITES_DIR="/var/www"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"
PHP_VERSION="8.1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Check if domain is provided
if [ -z "$1" ]; then
    log_error "Please provide a domain name"
    echo "Usage: ./create_site.sh domain.com [type]"
    echo "Types: wordpress, static, php, nodejs"
    exit 1
fi

DOMAIN=$1
SITE_TYPE=${2:-static}
SITE_PATH="$SITES_DIR/$DOMAIN"

# Check if site already exists
if [ -d "$SITE_PATH" ]; then
    log_error "Site directory already exists: $SITE_PATH"
    exit 1
fi

log_info "Creating site: $DOMAIN (Type: $SITE_TYPE)"

# Create site directory
log_info "Creating site directory..."
sudo mkdir -p "$SITE_PATH/public"
sudo mkdir -p "$SITE_PATH/logs"
sudo mkdir -p "$SITE_PATH/backups"

# Set permissions
sudo chown -R $USER:$USER "$SITE_PATH"
sudo chmod -R 755 "$SITE_PATH"

# Create index file based on type
log_info "Creating index file..."
case $SITE_TYPE in
    wordpress)
        cat > "$SITE_PATH/public/index.php" << 'EOF'
<?php
// WordPress placeholder
define('WP_USE_THEMES', true);
require('./wp-blog-header.php');
EOF

        # Download WordPress
        log_info "Downloading WordPress..."
        cd /tmp
        wget https://wordpress.org/latest.tar.gz
        tar -xzf latest.tar.gz
        cp -r wordpress/* "$SITE_PATH/public/"
        rm -rf wordpress latest.tar.gz
        
        # Create wp-config
        cp "$SITE_PATH/public/wp-config-sample.php" "$SITE_PATH/public/wp-config.php"
        chmod 644 "$SITE_PATH/public/wp-config.php"
        ;;
        
    php)
        cat > "$SITE_PATH/public/index.php" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>PHP Site - <?php echo $_SERVER['HTTP_HOST']; ?></title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #333; }
        .info { background: #f4f4f4; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Welcome to <?php echo $_SERVER['HTTP_HOST']; ?></h1>
    <div class="info">
        <h2>PHP Information</h2>
        <p>PHP Version: <?php echo phpversion(); ?></p>
        <p>Server Software: <?php echo $_SERVER['SERVER_SOFTWARE']; ?></p>
        <p>Document Root: <?php echo $_SERVER['DOCUMENT_ROOT']; ?></p>
    </div>
</body>
</html>
EOF
        ;;
        
    nodejs)
        cat > "$SITE_PATH/public/server.js" << 'EOF'
const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
EOF

        # Create package.json
        cat > "$SITE_PATH/package.json" << 'EOF'
{
  "name": "nodejs-site",
  "version": "1.0.0",
  "main": "public/server.js",
  "scripts": {
    "start": "node public/server.js",
    "dev": "nodemon public/server.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF
        ;;
        
    static)
    cat > "$SITE_PATH/public/index.html" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to CloudForge</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        
        .container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 1rem;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            max-width: 600px;
            margin: 2rem;
        }
        
        h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            font-weight: 700;
        }
        
        p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            line-height: 1.6;
        }
        
        .info {
            background: rgba(255, 255, 255, 0.15);
            padding: 1.5rem;
            border-radius: 0.5rem;
            margin-top: 2rem;
        }
        
        .info p {
            margin-bottom: 0.5rem;
            font-size: 1rem;
        }
        
        .domain {
            font-size: 1.5rem;
            font-weight: 600;
            color: #ffd700;
            margin: 1rem 0;
        }
        
        @media (max-width: 768px) {
            h1 { font-size: 2rem; }
            p { font-size: 1rem; }
            .container { margin: 1rem; padding: 1.5rem; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Site Created Successfully!</h1>
        <p>Your static website has been deployed on CloudForge platform.</p>
        
        <div class="domain">
            <?php echo htmlspecialchars($_SERVER['HTTP_HOST'] ?? $DOMAIN); ?>
        </div>
        
        <div class="info">
            <p><strong>Server:</strong> CloudForge Platform</p>
            <p><strong>Type:</strong> Static Website</p>
            <p><strong>Location:</strong> <?php echo $SITE_PATH; ?></p>
            <p><strong>Created:</strong> <?php echo date('Y-m-d H:i:s'); ?></p>
        </div>
        
        <p style="margin-top: 2rem; font-size: 0.9rem;">
            Edit this page at: <code><?php echo $SITE_PATH; ?>/public/index.html</code>
        </p>
    </div>
</body>
</html>
EOF
        ;;
esac

# Create Nginx configuration
log_info "Creating Nginx configuration..."

cat > "/tmp/$DOMAIN" << EOF
server {
    listen 80;
    listen [::]:80;
    
    server_name $DOMAIN www.$DOMAIN;
    
    root $SITE_PATH/public;
    index index.html index.htm index.php;
    
    access_log $SITE_PATH/logs/access.log;
    error_log $SITE_PATH/logs/error.log;
    
    location / {
        try_files \$uri \$uri/ /index.php?\$args;
    }
    
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php$PHP_VERSION-fpm.sock;
    }
    
    location ~ /\.ht {
        deny all;
    }
    
    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
EOF

# Enable site
sudo mv "/tmp/$DOMAIN" "$NGINX_AVAILABLE/$DOMAIN"
sudo ln -sf "$NGINX_AVAILABLE/$DOMAIN" "$NGINX_ENABLED/$DOMAIN"

# Test Nginx configuration
log_info "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    log_info "Nginx reloaded successfully"
else
    log_error "Nginx configuration test failed"
    exit 1
fi

# Setup SSL with Let's Encrypt
log_info "Would you like to setup SSL? (y/n)"
read -r setup_ssl

if [ "$setup_ssl" = "y" ] || [ "$setup_ssl" = "Y" ]; then
    log_info "Setting up SSL certificate..."
    sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN"
fi

# Create backup script
cat > "$SITE_PATH/backup.sh" << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/sites"
SITE_NAME=$(basename $(pwd))
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR/$SITE_NAME"
tar -czf "$BACKUP_DIR/$SITE_NAME/$DATE.tar.gz" public/
echo "Backup created: $BACKUP_DIR/$SITE_NAME/$DATE.tar.gz"
EOF

chmod +x "$SITE_PATH/backup.sh"

log_info "✅ Site created successfully!"
log_info "Site path: $SITE_PATH"
log_info "Site URL: http://$DOMAIN"
log_info ""
log_info "Next steps:"
log_info "1. Upload your files to $SITE_PATH/public/"
log_info "2. Configure your DNS to point to this server"
log_info "3. Run backup script: $SITE_PATH/backup.sh"
log_info ""
log_info "For WordPress sites, complete installation at: http://$DOMAIN/wp-admin/install.php"