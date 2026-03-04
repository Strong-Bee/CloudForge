# 🚀 CloudForge - Modern Server Control Panel

CloudForge adalah panel kontrol manajemen server generasi berikutnya yang dirancang untuk kecepatan, keamanan, dan kemudahan penggunaan. Berbeda dengan panel tradisional, CloudForge mendukung secara **Native** sistem operasi **Windows Server** dan **Linux Server** dalam satu antarmuka **Glassmorphism** yang mewah.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38bdf8.svg)

## ✨ Fitur Unggulan

- 🖥️ **Smart Dashboard:** Monitoring CPU, RAM, Disk, Network, dan Uptime secara real-time.
- 📂 **System File Explorer:** Jelajahi seluruh isi hardisk server Anda langsung dari browser (C:\ atau /).
- 🌐 **Website Manager:** Deploy situs Static, PHP, Node.js, atau WordPress dalam hitungan detik.
- 🔗 **Domain & Subdomain:** Pengaturan binding otomatis untuk IIS (Windows) dan Nginx (Linux).
- 🗄️ **Database Manager:** Manajemen skema MySQL/PostgreSQL dengan integrasi phpMyAdmin.
- 🐳 **Docker Manager:** Kelola container dan image microservices secara visual.
- 🛡️ **Security & Firewall:** IP Blocker, Brute Force Protection, dan integrasi ModSecurity.
- ⏰ **Cron Jobs:** Penjadwal tugas (Task Scheduler) otomatis untuk skrip rutin.
- 💾 **One-Click Backup:** Amankan data website dan database ke dalam arsip ZIP/TAR.
- 📟 **Web Terminal:** Eksekusi perintah shell (PowerShell/Bash) langsung dari dashboard.
- 🔐 **Native OS Auth:** Login menggunakan kredensial asli sistem operasi server Anda.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (Turbopack), React 19, Tailwind CSS 4.
- **Animations:** Framer Motion.
- **Icons:** Lucide React.
- **Backend:** Next.js API Routes (Node.js).
- **Communication:** SSH2, Dockerode, Child Process (Native Exec).

## 🚀 Persyaratan Sistem

- **Node.js:** v20.x atau lebih baru.
- **OS Support:** 
  - Windows 10/11 / Windows Server 2016+.
  - Ubuntu 20.04+, Debian 11+, CentOS 7+.
- **Web Server:** IIS (Windows) atau Nginx (Linux).

## 📥 Instalasi & Penggunaan

### 1. Clone Repository
`ash
git clone https://github.com/Strong-Bee/CloudForge.git
cd CloudForge
`

### 2. Install Dependency
`ash
npm install
`

### 3. Jalankan di Windows
Pastikan Anda menjalankan terminal (PowerShell) sebagai **Administrator**.
`powershell
npm run dev
`

### 4. Jalankan di Linux
Gunakan skrip installer otomatis yang sudah disediakan:
`ash
bash scripts/setup_linux.sh
npm run dev
`

## 🔒 Keamanan (Login)
CloudForge menggunakan sistem **Native OS Authentication**.
- **Username:** Nama user Windows/Linux Anda.
- **Password:** Password akun sistem Anda.

## 🤝 Kontribusi
Kontribusi selalu terbuka! Silakan lakukan fork dan kirimkan Pull Request.

## 📄 Lisensi
Proyek ini dilisensikan di bawah [MIT License](LICENSE).

---
Built with ❤️ by [Strong-Bee](https://github.com/Strong-Bee)
