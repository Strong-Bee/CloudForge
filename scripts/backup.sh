#!/bin/bash

# CloudForge - Backup Script
# Usage: ./backup.sh [site_name] [type]

set -e

# Configuration
BACKUP_ROOT="/var/backups"
SITES_DIR="/var/www"
DATABASES_DIR="/var/lib/mysql"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/cloudforge/backup.log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create log directory
mkdir -p "$(dirname "$LOG_FILE")"

# Logging function
log() {
    echo -e "${2:-$GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

# Error handling
error_exit() {
    log "ERROR: $1" "$RED" >&2
    exit 1
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    error_exit "Please run as root"
}

# Create backup directories
create_backup_dirs() {
    local type=$1
    local name=$2
    
    BACKUP_DIR="$BACKUP_ROOT/$type/$name/$DATE"
    mkdir -p "$BACKUP_DIR"
    echo "$BACKUP_DIR"
}

# Backup website files
backup_website() {
    local site=$1
    local site_path="$SITES_DIR/$site"
    
    log "Backing up website: $site" "$BLUE"
    
    if [ ! -d "$site_path" ]; then
        log "Site directory not found: $site_path" "$YELLOW"
        return 1
    fi
    
    local backup_dir=$(create_backup_dirs "websites" "$site")
    
    # Backup files
    log "  - Backing up files..."
    tar -czf "$backup_dir/files.tar.gz" -C "$site_path" . 2>/dev/null
    
    # Backup database if WordPress detected
    if [ -f "$site_path/wp-config.php" ]; then
        log "  - WordPress detected, backing up database..."
        
        # Extract database credentials
        DB_NAME=$(grep DB_NAME "$site_path/wp-config.php" | cut -d"'" -f4)
        DB_USER=$(grep DB_USER "$site_path/wp-config.php" | cut -d"'" -f4)
        DB_PASS=$(grep DB_PASSWORD "$site_path/wp-config.php" | cut -d"'" -f4)
        
        if [ ! -z "$DB_NAME" ]; then
            mysqldump -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$backup_dir/database.sql"
            log "  - Database backup complete: $DB_NAME"
        fi
    fi
    
    # Create manifest
    cat > "$backup_dir/manifest.json" << EOF
{
    "type": "website",
    "name": "$site",
    "date": "$(date -Iseconds)",
    "files": "files.tar.gz",
    "size": "$(du -sh "$backup_dir" | cut -f1)",
    "checksum": "$(sha256sum "$backup_dir/files.tar.gz" | cut -d' ' -f1)"
}
EOF
    
    log "✅ Website backup complete: $site" "$GREEN"
    log "  Location: $backup_dir"
    log "  Size: $(du -sh "$backup_dir" | cut -f1)"
}

# Backup database
backup_database() {
    local db_name=$1
    
    log "Backing up database: $db_name" "$BLUE"
    
    # Get all databases if not specified
    if [ -z "$db_name" ] || [ "$db_name" = "all" ]; then
        databases=$(mysql -e "SHOW DATABASES;" | grep -Ev "(Database|information_schema|performance_schema|mysql|sys)")
    else
        databases=$db_name
    fi
    
    for db in $databases; do
        log "  - Backing up: $db"
        
        local backup_dir=$(create_backup_dirs "databases" "$db")
        
        # Backup database
        mysqldump --single-transaction --routines --triggers --events "$db" | \
            gzip > "$backup_dir/database.sql.gz"
        
        # Create manifest
        cat > "$backup_dir/manifest.json" << EOF
{
    "type": "database",
    "name": "$db",
    "date": "$(date -Iseconds)",
    "file": "database.sql.gz",
    "size": "$(du -sh "$backup_dir/database.sql.gz" | cut -f1)",
    "checksum": "$(sha256sum "$backup_dir/database.sql.gz" | cut -d' ' -f1)"
}
EOF
        
        log "  ✅ Database backup complete: $db"
    done
}

# Backup configuration files
backup_configs() {
    log "Backing up configuration files" "$BLUE"
    
    local backup_dir=$(create_backup_dirs "system" "configs")
    
    # Backup important configs
    configs=(
        "/etc/nginx"
        "/etc/php"
        "/etc/mysql"
        "/etc/ssh"
        "/etc/hosts"
        "/etc/hostname"
    )
    
    for config in "${configs[@]}"; do
        if [ -e "$config" ]; then
            log "  - Backing up: $config"
            tar -rf "$backup_dir/configs.tar" "$config" 2>/dev/null
        fi
    done
    
    # Compress
    gzip "$backup_dir/configs.tar"
    
    log "✅ Config backup complete" "$GREEN"
}

# Clean old backups
clean_old_backups() {
    log "Cleaning backups older than $RETENTION_DAYS days" "$YELLOW"
    
    find "$BACKUP_ROOT" -type d -name "20*" -mtime +$RETENTION_DAYS -exec rm -rf {} \;
    
    log "Cleanup complete"
}

# Send notification
send_notification() {
    local status=$1
    local message=$2
    
    # You can implement various notification methods here
    # Email, Slack, Discord, etc.
    
    log "Notification: $status - $message" "$BLUE"
}

# Main execution
main() {
    local backup_type=${1:-"all"}
    local target=${2:-""}
    
    log "🚀 Starting backup process..." "$GREEN"
    log "Type: $backup_type"
    log "Target: ${target:-all}"
    
    case $backup_type in
        "website")
            if [ -z "$target" ]; then
                # Backup all websites
                for site in $(ls "$SITES_DIR"); do
                    backup_website "$site"
                done
            else
                backup_website "$target"
            fi
            ;;
            
        "database")
            backup_database "$target"
            ;;
            
        "config")
            backup_configs
            ;;
            
        "all")
            # Backup all websites
            for site in $(ls "$SITES_DIR" 2>/dev/null); do
                backup_website "$site"
            done
            
            # Backup all databases
            backup_database "all"
            
            # Backup configs
            backup_configs
            ;;
            
        *)
            error_exit "Invalid backup type: $backup_type"
            ;;
    esac
    
    # Clean old backups
    clean_old_backups
    
    # Send notification
    send_notification "SUCCESS" "Backup completed successfully"
    
    log "✅ All backups completed successfully!" "$GREEN"
    log "Backup location: $BACKUP_ROOT"
}

# Run main function with arguments
main "$@"