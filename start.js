#!/usr/bin/env node

/**
 * Script de inicio rápido para el proyecto CDR
 * Verifica dependencias y configuración antes de ejecutar
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando CDR - CFO Fractional Services\n');

// 1. Verificar Node.js version
const nodeVersion = process.version;
console.log(`✓ Node.js version: ${nodeVersion}`);

// 2. Verificar si node_modules existe
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('⚠️  node_modules no encontrado. Instalando dependencias...\n');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('\n✓ Dependencias instaladas correctamente\n');
  } catch (error) {
    console.error('❌ Error instalando dependencias');
    process.exit(1);
  }
} else {
  console.log('✓ Dependencias instaladas\n');
}

// 3. Verificar archivo .env.local
const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  Archivo .env.local no encontrado');
  console.log('   Creando desde .env.example...\n');
  try {
    const envExample = path.join(__dirname, '.env.example');
    if (fs.existsSync(envExample)) {
      fs.copyFileSync(envExample, envPath);
      console.log('✓ Archivo .env.local creado\n');
    }
  } catch (error) {
    console.log('   (Opcional - puedes crearlo manualmente después)\n');
  }
} else {
  console.log('✓ Archivo .env.local existe\n');
}

// 4. Información del proyecto
console.log('═══════════════════════════════════════════════════');
console.log('📦 Proyecto: CDR - CFO Fractional Services');
console.log('🌐 URL Local: http://localhost:3000');
console.log('═══════════════════════════════════════════════════\n');

// 5. Iniciar servidor
console.log('🔥 Iniciando servidor de desarrollo...\n');
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('\n❌ Error iniciando el servidor');
  process.exit(1);
}
