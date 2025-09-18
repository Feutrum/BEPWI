#!/usr/bin/env node

/**
 * Strapi API Structure Validator
 * Catches common directory naming mismatches before server startup
 */

const fs = require('fs');
const path = require('path');

function validateApiStructure() {
  console.log('🔍 Validating Strapi API structure...');

  const apiDir = path.join(__dirname, '..', 'src', 'api');
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(apiDir)) {
    console.error('❌ API directory not found:', apiDir);
    return false;
  }

  const apiDirs = fs.readdirSync(apiDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const apiName of apiDirs) {
    const apiPath = path.join(apiDir, apiName);
    console.log(`  📁 Checking ${apiName}...`);

    // Check content-types directory structure
    const contentTypesDir = path.join(apiPath, 'content-types');
    if (fs.existsSync(contentTypesDir)) {
      const contentTypeDirs = fs.readdirSync(contentTypesDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      if (contentTypeDirs.length === 0) {
        errors.push(`❌ ${apiName}: No content-type directory found in content-types/`);
      } else if (contentTypeDirs.length > 1) {
        errors.push(`❌ ${apiName}: Multiple content-type directories: ${contentTypeDirs.join(', ')}`);
      } else {
        const contentTypeName = contentTypeDirs[0];
        if (contentTypeName !== apiName) {
          errors.push(`❌ ${apiName}: Directory name mismatch! API dir is "${apiName}" but content-type dir is "${contentTypeName}"`);
        }

        // Check schema.json exists
        const schemaPath = path.join(contentTypesDir, contentTypeName, 'schema.json');
        if (!fs.existsSync(schemaPath)) {
          errors.push(`❌ ${apiName}: Missing schema.json in content-types/${contentTypeName}/`);
        } else {
          // Validate schema.json structure
          try {
            const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
            if (!schema.kind) {
              errors.push(`❌ ${apiName}: schema.json missing 'kind' property`);
            }
            if (!schema.info || !schema.info.singularName || !schema.info.pluralName) {
              errors.push(`❌ ${apiName}: schema.json missing required info properties`);
            }
            if (schema.info && schema.info.singularName !== apiName) {
              warnings.push(`⚠️  ${apiName}: singularName "${schema.info.singularName}" doesn't match directory name`);
            }
          } catch (e) {
            errors.push(`❌ ${apiName}: Invalid JSON in schema.json - ${e.message}`);
          }
        }
      }
    }

    // Check for required API files
    const requiredDirs = ['controllers', 'routes', 'services'];
    for (const dir of requiredDirs) {
      const dirPath = path.join(apiPath, dir);
      if (!fs.existsSync(dirPath)) {
        warnings.push(`⚠️  ${apiName}: Missing ${dir} directory`);
      } else {
        const expectedFile = path.join(dirPath, `${apiName}.js`);
        if (!fs.existsSync(expectedFile)) {
          warnings.push(`⚠️  ${apiName}: Missing ${dir}/${apiName}.js file`);
        }
      }
    }
  }

  // Report results
  console.log('\n📊 Validation Results:');
  console.log(`   APIs found: ${apiDirs.length}`);
  console.log(`   Errors: ${errors.length}`);
  console.log(`   Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\n❌ ERRORS (will prevent Strapi startup):');
    errors.forEach(error => console.log(`   ${error}`));
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    warnings.forEach(warning => console.log(`   ${warning}`));
  }

  if (errors.length === 0) {
    console.log('\n✅ API structure validation passed!');
    return true;
  } else {
    console.log('\n💥 API structure validation failed!');
    console.log('   Fix the errors above before starting Strapi.');
    return false;
  }
}

// Run validation
const isValid = validateApiStructure();
process.exit(isValid ? 0 : 1);