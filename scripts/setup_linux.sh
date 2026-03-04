#!/bin/bash
# CloudForge - Advanced Linux Setup

echo "?? Optimizing CloudForge for Linux..."

# Install Core
sudo apt update && sudo apt install -y nginx mysql-server docker.io python3 python3-pip

# Permissions for Data & Backups
mkdir -p data backups
sudo chmod -R 775 data backups
sudo chown -R $USER:$USER data backups

# Allow Sudo for API
USER=$(whoami)
echo "$USER ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/cloudforge
sudo chmod 0440 /etc/sudoers.d/cloudforge

echo "? Linux optimization complete! Folder data/ and backups/ are now writable."

