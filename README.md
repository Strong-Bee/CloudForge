<p align="center">
  <img src="public/globe.svg" alt="CloudForge Logo" width="120" height="120">
</p>

<h1 align="center">CloudForge Control Panel</h1>

<p align="center">
  <strong>Next-Generation, Dual-OS Server Management Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

## 📌 Overview
**CloudForge** is a modern, lightweight, and incredibly powerful Server Control Panel (similar to cPanel or aaPanel) built with Next.js 15. What sets CloudForge apart is its **Native Dual-OS Support**. Whether you are hosting on **Windows Server** (IIS) or **Linux Server** (Nginx), CloudForge adapts automatically to provide a seamless management experience.

Designed with a stunning **Glassmorphism Dark Mode** UI, it brings infrastructure management to the modern era.

## 🔥 Core Features

*   **📊 Smart Dashboard:** Real-time monitoring of CPU, RAM, Disk I/O, Network Traffic, and Load Averages.
*   **🌐 Website & Domain Manager:** 1-click deployment for Static, PHP, Node.js, and WordPress sites. Automatic Virtual Host (Nginx) and Binding (IIS) configuration.
*   **📂 System File Explorer:** A web-based File Manager that can navigate the entire OS root (C:\ or /), complete with upload, delete, and size calculation.
*   **🗄️ Database Manager:** Manage MySQL/PostgreSQL schemas and users with built-in phpMyAdmin integration links.
*   **🐳 Docker Integration:** Monitor and control Docker containers directly from the panel.
*   **⚙️ Service Manager:** Start, stop, and restart core services (Nginx, MySQL, PHP-FPM) without touching the CLI.
*   **🛡️ Security & Firewall:** IP Blocker, ModSecurity toggle, and Brute Force Protection.
*   **⏰ Cron Jobs (Task Scheduler):** Visual interface for creating and managing automated scripts.
*   **💾 One-Click Backups:** Instantly compress and archive web directories into ZIP (Windows) or TAR.GZ (Linux).
*   **📟 Web Terminal:** A fully functional, interactive in-browser terminal (PowerShell for Windows, Bash for Linux).
*   **🔐 Native OS Auth:** Zero fake databases. Login using your actual Windows Administrator or Linux Root credentials securely.

## 🛠️ Technology Stack

*   **Frontend:** Next.js 15 (App Router), React 19, Tailwind CSS 4, Framer Motion (Animations), Lucide React (Icons).
*   **Backend:** Next.js Serverless API Routes (Node.js).
*   **System Integration:** child_process for native shell execution, dockerode for container management.

## 🚀 Installation Guide

### Prerequisites
*   **Node.js:** v20.x or higher
*   **Operating System:** Windows 10/11 / Windows Server 2016+ OR Ubuntu 20.04+ / Debian 11+ / CentOS 7+

### Windows Installation

1. Open **PowerShell as Administrator**.
2. Clone the repository and install dependencies:
   `powershell
   git clone https://github.com/Strong-Bee/CloudForge.git
   cd CloudForge
   npm install
   `
3. Start the panel:
   `powershell
   npm run dev
   `
4. Access http://localhost:3000 and log in with your Windows Username and Password.

### Linux Installation

1. Open your terminal.
2. Clone the repository:
   `ash
   git clone https://github.com/Strong-Bee/CloudForge.git
   cd CloudForge
   `
3. Run the automated setup script (Installs Node.js, Nginx, MySQL, and configures Sudo permissions):
   `ash
   bash scripts/setup_linux.sh
   `
4. Install dependencies and start:
   `ash
   npm install
   npm run dev
   `
5. Access http://localhost:3000 and log in with your Linux Username and Password.

## 📸 Screenshots
*(Coming Soon - Add your panel screenshots here)*

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Strong-Bee/CloudForge/issues).

## 📄 License
This project is [MIT](LICENSE) licensed.

---
Built with ❤️ by [Strong-Bee](https://github.com/Strong-Bee)
