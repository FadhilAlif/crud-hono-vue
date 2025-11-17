# 🚀 Panduan Deployment Backend & Database ke VPS

Panduan lengkap untuk melakukan deployment Backend (Hono + Bun) dan Database (MariaDB) ke VPS menggunakan Docker.

---

## 📋 Prerequisites

Sebelum memulai deployment, pastikan VPS Anda sudah memiliki:

1. **Docker** (versi 20.10 atau lebih baru)
2. **Docker Compose** (versi 2.0 atau lebih baru)
3. **Git** (untuk clone repository)
4. **Port yang tersedia**: 3000 (API) dan 3306 (Database)

---

## 🔧 Step-by-Step Deployment

### **Step 1: Persiapan VPS**

#### 1.1 Install Docker (jika belum terinstall)

```bash
# Update package index
sudo apt update

# Install dependencies
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Tambahkan Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Tambahkan Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo apt install -y docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

#### 1.2 Setup Docker untuk user non-root (opsional tapi direkomendasikan)

```bash
# Tambahkan user ke docker group
sudo usermod -aG docker $USER

# Logout dan login kembali atau jalankan:
newgrp docker

# Test tanpa sudo
docker ps
```

---

### **Step 2: Clone Repository**

```bash
# Clone repository ke VPS
cd ~
git clone https://github.com/FadhilAlif/crud-hono-vue.git
cd crud-hono-vue

# Atau jika sudah ada, pull perubahan terbaru
git pull origin main
```

---

### **Step 3: Konfigurasi Environment**

#### 3.1 Buat file environment production

```bash
# Copy template
cp .env.production .env.production.local

# Edit file environment
nano .env.production
```

#### 3.2 Isi konfigurasi (contoh):

```env
# Database Configuration
DB_ROOT_PASSWORD=SuperSecureP@ssw0rd123!
DB_NAME=hono_db
DB_PORT=3306

# API Configuration
API_PORT=3000
JWT_SECRET=07994a7d152b113b62a5f680cdc069cd32c75a1a460e7fb4208e9e273a415f31

# Environment
NODE_ENV=production
```

**⚠️ PENTING:**

- Ganti `DB_ROOT_PASSWORD` dengan password yang kuat
- Ganti `JWT_SECRET` dengan string random minimal 32 karakter
- Untuk generate JWT_SECRET baru, gunakan:
  ```bash
  openssl rand -hex 32
  ```

---

### **Step 4: Setup Firewall (jika menggunakan ufw)**

```bash
# Allow SSH (jangan lupa ini!)
sudo ufw allow 22/tcp

# Allow API port
sudo ufw allow 3000/tcp

# Allow Database port (jika ingin akses dari luar, tidak direkomendasikan)
# sudo ufw allow 3306/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

### **Step 5: Deployment Menggunakan Script**

#### 5.1 Berikan permission untuk script

```bash
chmod +x deploy.sh
```

#### 5.2 Jalankan deployment script

```bash
./deploy.sh
```

Script akan otomatis:

- ✅ Load environment variables
- ✅ Check Docker dan Docker Compose
- ✅ Stop container yang sedang berjalan
- ✅ Build image baru
- ✅ Jalankan database dan backend
- ✅ Migrate database
- ✅ Verify koneksi

---

### **Step 6: Deployment Manual (Alternatif)**

Jika ingin deploy manual tanpa script:

```bash
# Stop container yang berjalan
docker-compose -f docker-compose.prod.yml down

# Build dan jalankan
docker-compose -f docker-compose.prod.yml up -d --build

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🔍 Verifikasi Deployment

### 1. Check status container

```bash
docker-compose -f docker-compose.prod.yml ps
```

Output yang diharapkan:

```
NAME        IMAGE           STATUS         PORTS
crud-api    crud-api        Up (healthy)   0.0.0.0:3000->3000/tcp
crud-db     mariadb:10.6    Up (healthy)   0.0.0.0:3306->3306/tcp
```

### 2. Test API endpoint

```bash
# Test health check
curl http://localhost:3000

# Test dari luar VPS (ganti YOUR_VPS_IP)
curl http://YOUR_VPS_IP:3000
```

### 3. Check logs

```bash
# Logs backend
docker-compose -f docker-compose.prod.yml logs backend

# Logs database
docker-compose -f docker-compose.prod.yml logs db

# Follow logs real-time
docker-compose -f docker-compose.prod.yml logs -f backend
```

---

## 🛠️ Management Commands

### Restart services

```bash
docker-compose -f docker-compose.prod.yml restart
```

### Stop services

```bash
docker-compose -f docker-compose.prod.yml stop
```

### Start services

```bash
docker-compose -f docker-compose.prod.yml start
```

### Remove containers dan volumes

```bash
# Stop dan hapus container
docker-compose -f docker-compose.prod.yml down

# Hapus container + volumes (⚠️ DATA AKAN HILANG!)
docker-compose -f docker-compose.prod.yml down -v
```

### Access database

```bash
# Masuk ke database container
docker exec -it crud-db mysql -u root -p

# Atau langsung dari host (jika port exposed)
mysql -h localhost -P 3306 -u root -p
```

### Run Prisma commands

```bash
# Masuk ke backend container
docker exec -it crud-api bash

# Di dalam container, jalankan prisma commands
bun prisma studio
bun prisma migrate deploy
bun prisma migrate status
```

---

## 📊 Monitoring

### Check resource usage

```bash
# Resource usage semua container
docker stats

# Disk usage
docker system df

# Logs dengan timestamp
docker-compose -f docker-compose.prod.yml logs --timestamps backend
```

---

## 🔄 Update Aplikasi

Ketika ada perubahan code:

```bash
# Pull perubahan terbaru
git pull origin main

# Rebuild dan deploy ulang
./deploy.sh
```

Atau manual:

```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🔐 Security Best Practices

1. **Gunakan password yang kuat** untuk database
2. **Jangan expose database port** ke internet (3306)
3. **Gunakan HTTPS** dengan reverse proxy (Nginx/Caddy)
4. **Backup database** secara berkala
5. **Update Docker images** secara rutin
6. **Monitor logs** untuk aktivitas mencurigakan

### Setup Reverse Proxy dengan Nginx (Opsional)

```bash
# Install Nginx
sudo apt install nginx

# Buat konfigurasi
sudo nano /etc/nginx/sites-available/api
```

Contoh konfigurasi Nginx:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/

# Test konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 💾 Backup Database

### Backup manual

```bash
# Backup database
docker exec crud-db mysqldump -u root -p${DB_ROOT_PASSWORD} hono_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
docker exec -i crud-db mysql -u root -p${DB_ROOT_PASSWORD} hono_db < backup_20231117_120000.sql
```

### Backup otomatis dengan cron

```bash
# Edit crontab
crontab -e

# Tambahkan (backup setiap hari jam 2 pagi)
0 2 * * * cd ~/crud-hono-vue && docker exec crud-db mysqldump -u root -pYOUR_PASSWORD hono_db > backups/backup_$(date +\%Y\%m\%d).sql
```

---

## ❓ Troubleshooting

### Container tidak bisa start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Check docker daemon
sudo systemctl status docker

# Restart docker daemon
sudo systemctl restart docker
```

### Database connection error

```bash
# Check database health
docker exec crud-db mysqladmin ping -h localhost -p

# Check database logs
docker-compose -f docker-compose.prod.yml logs db

# Verify DATABASE_URL di backend
docker exec crud-api env | grep DATABASE_URL
```

### Port sudah digunakan

```bash
# Check port yang digunakan
sudo netstat -tulpn | grep :3000

# Atau dengan lsof
sudo lsof -i :3000

# Kill process jika perlu
sudo kill -9 PID
```

### Out of disk space

```bash
# Clean up unused Docker resources
docker system prune -a

# Remove unused volumes
docker volume prune
```

---

## 📝 Catatan Penting

1. **Environment Variables**: Pastikan `.env.production` sudah di-set dengan benar sebelum deployment
2. **Backup**: Selalu backup database sebelum melakukan update
3. **Monitoring**: Pantau logs secara berkala untuk mendeteksi error
4. **Security**: Jangan commit file `.env.production` ke Git
5. **Updates**: Update image Docker secara berkala untuk security patches

---

## 📞 Support

Jika mengalami masalah, check:

- Logs: `docker-compose -f docker-compose.prod.yml logs`
- Status: `docker-compose -f docker-compose.prod.yml ps`
- Resources: `docker stats`

---

**Happy Deploying! 🎉**
