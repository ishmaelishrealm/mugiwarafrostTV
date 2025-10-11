#!/usr/bin/env node

/**
 * Build-time sanity check script for MugiwaraFrostTV
 * Runs linting, type checking, and basic tests before deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running build-time sanity checks...\n');

const checks = [
  {
    name: 'TypeScript Compilation',
    command: 'npx tsc --noEmit',
    critical: true,
  },
  {
    name: 'ESLint Check',
    command: 'npx eslint . --ext .ts,.tsx,.js,.jsx --max-warnings 0',
    critical: true,
  },
  {
    name: 'Next.js Build Check',
    command: 'npm run build',
    critical: true,
  },
  {
    name: 'Package Security Audit',
    command: 'npm audit --audit-level moderate',
    critical: false,
  },
];

let hasErrors = false;
let hasWarnings = false;

for (const check of checks) {
  try {
    console.log(`⏳ Running: ${check.name}...`);
    execSync(check.command, { 
      stdio: 'pipe',
      cwd: process.cwd(),
    });
    console.log(`✅ ${check.name} - PASSED\n`);
  } catch (error) {
    const status = check.critical ? 'FAILED' : 'WARNING';
    const icon = check.critical ? '❌' : '⚠️';
    
    console.log(`${icon} ${check.name} - ${status}`);
    console.log(error.stdout?.toString() || error.stderr?.toString() || error.message);
    console.log('');
    
    if (check.critical) {
      hasErrors = true;
    } else {
      hasWarnings = true;
    }
  }
}

// File existence checks
console.log('📁 Checking required files...');

const requiredFiles = [
  'vercel.json',
  'public/robots.txt',
  'app/sitemap.ts',
  'next.config.ts',
  'package.json',
];

for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    hasErrors = true;
  }
}

// Environment variables check
console.log('\n🔧 Checking environment configuration...');

const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
];

for (const envVar of requiredEnvVars) {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} is set`);
  } else {
    console.log(`⚠️ ${envVar} not set (will use default)`);
  }
}

// Final status
console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ BUILD CHECK FAILED');
  console.log('Critical errors found. Deployment should not proceed.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️ BUILD CHECK COMPLETED WITH WARNINGS');
  console.log('Deployment can proceed, but review warnings above.');
  process.exit(0);
} else {
  console.log('✅ ALL CHECKS PASSED');
  console.log('Ready for production deployment! 🚀');
  process.exit(0);
}






