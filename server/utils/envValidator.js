/**
 * Environment variables validator
 * Checks that all required environment variables are set
 */

const requiredEnvVars = [
  'JWT_SECRET_KEY',
  'USER_TABLE',
  'DYNAMODB_LOCAL_ENDPOINT'
];

const optionalEnvVars = [
  'GOOGLE_CLIENT_ID',
  'AWS_IOT_ENDPOINT',
  'MAIL_HOST',
  'MAIL_USER',
  'MAIL_PASS',
  'AWS_BUCKET_NAME',
  'AWS_REGION'
];

export const validateEnvVars = () => {
  console.log('=== Environment Variables Validation ===');
  
  // Check required variables
  const missingRequired = [];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingRequired.push(envVar);
      console.error(`❌ Missing required environment variable: ${envVar}`);
    } else {
      console.log(`✅ ${envVar}: ${process.env[envVar]}`);
    }
  }
  
  // Show optional variables
  console.log('\n--- Optional Environment Variables ---');
  for (const envVar of optionalEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ ${envVar}: ${process.env[envVar]}`);
    } else {
      console.log(`⚠️  ${envVar}: Not set (optional)`);
    }
  }
  
  if (missingRequired.length > 0) {
    console.error('\n❌ Critical Error: Missing required environment variables');
    console.error('Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
  
  console.log('\n✅ All required environment variables are set!');
  return true;
};

export default validateEnvVars;