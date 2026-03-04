#!/bin/bash
# CloudForge - Auto Installer & Setup for Linux

echo "?? Starting CloudForge Setup on Linux..."

# Update System
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Install Core Services (Nginx, MySQL, Docker)
sudo apt install -y nginx mysql-server certbot python3-certbot-nginx

# Setup Permissions for CloudForge
USER=$(whoami)
echo "$USER ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/cloudforge
sudo chmod 0440 /etc/sudoers.d/cloudforge

# Setup Default Folders
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www

echo "? Linux Setup Complete! You can now run CloudForge with: npm run dev"

