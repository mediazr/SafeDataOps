#!/bin/bash
# Script de build para Render
# Instala dependencias del frontend y compila
set -e

echo "=== Instalando dependencias del frontend ==="
cd frontend
npm install
npm run build

echo "=== Build completado ==="
ls -la dist/
