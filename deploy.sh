#!/bin/bash

# Script untuk deployment ke VPS
# Author: Deployment Script
# Description: Automated deployment script untuk Backend dan Database

set -e

echo "================================================"
echo "   Deployment Script - Backend & Database      "
echo "================================================"
echo ""

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fungsi untuk print dengan warna
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check apakah file .env.production ada
if [ ! -f .env.production ]; then
    print_error "File .env.production tidak ditemukan!"
    print_info "Silakan buat file .env.production terlebih dahulu"
    exit 1
fi

print_info "Memuat environment variables dari .env.production..."
export $(cat .env.production | grep -v '^#' | xargs)

# Check apakah Docker dan Docker Compose terinstall
if ! command -v docker &> /dev/null; then
    print_error "Docker tidak terinstall!"
    print_info "Silakan install Docker terlebih dahulu: https://docs.docker.com/engine/install/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose tidak terinstall!"
    print_info "Silakan install Docker Compose terlebih dahulu"
    exit 1
fi

print_success "Docker dan Docker Compose terdeteksi"

# Stop container yang sedang berjalan
print_info "Menghentikan container yang sedang berjalan..."
docker-compose -f docker-compose.prod.yml down || true
print_success "Container dihentikan"

# Hapus image lama (optional)
read -p "Hapus image lama untuk rebuild? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Menghapus image lama..."
    docker rmi crud-api:latest || true
    print_success "Image lama dihapus"
fi

# Build dan jalankan container
print_info "Building dan menjalankan container..."
docker-compose -f docker-compose.prod.yml up -d --build

# Tunggu beberapa detik untuk memastikan container running
print_info "Menunggu container siap..."
sleep 10

# Check status container
print_info "Memeriksa status container..."
docker-compose -f docker-compose.prod.yml ps

# Check health database
print_info "Memeriksa koneksi database..."
for i in {1..30}; do
    if docker exec crud-db mysqladmin ping -h localhost -p${DB_ROOT_PASSWORD} --silent; then
        print_success "Database siap!"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Database gagal siap dalam waktu yang ditentukan"
        exit 1
    fi
    echo -n "."
    sleep 2
done

# Check logs backend
print_info "Memeriksa logs backend..."
docker-compose -f docker-compose.prod.yml logs backend --tail=20

echo ""
print_success "Deployment selesai!"
echo ""
print_info "API berjalan di: http://localhost:${API_PORT}"
print_info "Database berjalan di: localhost:${DB_PORT}"
echo ""
print_info "Untuk melihat logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f backend"
echo ""
print_info "Untuk menghentikan:"
echo "  docker-compose -f docker-compose.prod.yml down"
echo ""
