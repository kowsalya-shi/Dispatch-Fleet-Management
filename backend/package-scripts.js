// Additional npm scripts for development and testing
module.exports = {
  scripts: {
    // Development
    "dev": "nodemon server.js",
    "start": "node server.js",
    
    // Testing
    "test": "jest --detectOpenHandles --forceExit",
    "test:watch": "jest --watch --detectOpenHandles",
    "test:coverage": "jest --coverage --detectOpenHandles --forceExit",
    "test:integration": "jest tests/integration.test.js --detectOpenHandles --forceExit",
    
    // Database
    "db:seed": "node scripts/seed.js",
    "db:migrate": "node scripts/migrate.js",
    
    // System verification
    "verify": "node scripts/verify-system.js",
    "health": "curl -s http://localhost:3000/health | jq .",
    
    // Linting and formatting
    "lint": "eslint . --ext .js --ignore-path .gitignore",
    "lint:fix": "eslint . --ext .js --ignore-path .gitignore --fix",
    "format": "prettier --write \"**/*.{js,json,md}\"",
    
    // Production
    "build": "echo 'No build step required for Node.js'",
    "start:prod": "NODE_ENV=production node server.js",
    
    // Docker
    "docker:build": "docker build -t fleet-management-backend .",
    "docker:run": "docker run -p 3000:3000 --env-file .env fleet-management-backend",
    
    // Utilities
    "logs": "tail -f logs/app.log",
    "clean": "rm -rf node_modules coverage logs/*.log",
    "reset": "npm run clean && npm install && npm run db:seed"
  }
};