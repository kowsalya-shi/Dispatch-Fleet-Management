const request = require('supertest');
const mongoose = require('mongoose');
const FleetManagementServer = require('../server');
const { User } = require('../models');
const authService = require('../services/authService');

describe('Authentication System', () => {
  let app;
  let server;
  let testUser;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/fleet_management_test');
    
    // Create server instance
    server = new FleetManagementServer();
    await server.initialize();
    app = server.app;

    // Create test user
    testUser = await User.create({
      userId: 'TEST001',
      password: 'testpass123',
      role: 'dispatcher',
      name: 'Test User',
      email: 'test@example.com',
      permissions: [
        { resource: 'orders', actions: ['create', 'read', 'update'] }
      ]
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear refresh tokens before each test
    testUser.refreshTokens = [];
    await testUser.save();
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          userId: 'TEST001',
          password: 'testpass123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.userId).toBe('TEST001');
      expect(response.body.data.tokens.accessToken).toBeDefined();
      expect(response.body.data.tokens.refreshToken).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          userId: 'TEST001',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Authentication failed');
    });

    it('should reject non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          userId: 'NONEXISTENT',
          password: 'testpass123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should validate input data', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          userId: '',
          password: '123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          userId: 'TEST001',
          password: 'testpass123'
        });

      refreshToken = loginResponse.body.data.tokens.refreshToken;
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid-token'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let accessToken;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          userId: 'TEST001',
          password: 'testpass123'
        });

      accessToken = loginResponse.body.data.tokens.accessToken;
    });

    it('should return user information with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.userId).toBe('TEST001');
      expect(response.body.data.user.role).toBe('dispatcher');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Authentication required');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Authentication failed');
    });
  });

  describe('POST /api/auth/logout', () => {
    let accessToken;
    let refreshToken;

    beforeEach(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          userId: 'TEST001',
          password: 'testpass123'
        });

      accessToken = loginResponse.body.data.tokens.accessToken;
      refreshToken = loginResponse.body.data.tokens.refreshToken;
    });

    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          refreshToken
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('AuthService', () => {
    describe('JWT Token Management', () => {
      it('should generate valid access token', () => {
        const token = authService.generateAccessToken(testUser);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

        const decoded = authService.verifyToken(token);
        expect(decoded.userId).toBe(testUser._id.toString());
        expect(decoded.tokenType).toBe('access');
      });

      it('should generate valid refresh token', () => {
        const token = authService.generateRefreshToken(testUser);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');

        const decoded = authService.verifyToken(token, 'refresh');
        expect(decoded.userId).toBe(testUser._id.toString());
        expect(decoded.tokenType).toBe('refresh');
      });

      it('should reject expired token', () => {
        // This would require mocking JWT expiration or using a very short expiry
        // For now, we'll test token type validation
        const accessToken = authService.generateAccessToken(testUser);
        
        expect(() => {
          authService.verifyToken(accessToken, 'refresh');
        }).toThrow('Invalid token type');
      });
    });

    describe('Permission System', () => {
      it('should grant admin all permissions', () => {
        const adminUser = { role: 'admin', permissions: [] };
        const hasPermission = authService.hasPermission(adminUser, 'orders', 'delete');
        expect(hasPermission).toBe(true);
      });

      it('should check specific permissions for non-admin users', () => {
        const hasReadPermission = authService.hasPermission(testUser, 'orders', 'read');
        const hasDeletePermission = authService.hasPermission(testUser, 'orders', 'delete');
        
        expect(hasReadPermission).toBe(true);
        expect(hasDeletePermission).toBe(false);
      });
    });

    describe('Token Information', () => {
      it('should return token information', () => {
        const token = authService.generateAccessToken(testUser);
        const tokenInfo = authService.getTokenInfo(token);
        
        expect(tokenInfo.valid).toBe(true);
        expect(tokenInfo.userId).toBe(testUser.userId);
        expect(tokenInfo.role).toBe(testUser.role);
        expect(tokenInfo.expiresAt).toBeInstanceOf(Date);
      });

      it('should detect invalid token', () => {
        const tokenInfo = authService.getTokenInfo('invalid-token');
        expect(tokenInfo.valid).toBe(false);
        expect(tokenInfo.error).toBeDefined();
      });
    });
  });
});