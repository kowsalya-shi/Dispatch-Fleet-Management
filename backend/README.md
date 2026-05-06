# Fleet Management Backend

Real-time backend system for Fleet Management application with WebSocket communication, GPS tracking, and order management.

## Features

- **Real-time Communication**: WebSocket server with Socket.io
- **GPS Tracking**: Live vehicle location tracking and route monitoring
- **Order Management**: Real-time order status updates and broadcasting
- **Dashboard KPIs**: Live metrics and performance indicators
- **Authentication**: JWT-based authentication with role-based access control
- **Caching**: Redis caching for performance optimization
- **Database**: MongoDB with Mongoose ODM
- **Security**: Helmet.js, CORS, rate limiting, and input validation

## Technology Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **WebSocket**: Socket.io
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Authentication**: JWT with bcryptjs
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Custom logger with file and console output
- **Testing**: Jest with Supertest

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB and Redis**
   ```bash
   # MongoDB (default port 27017)
   mongod
   
   # Redis (default port 6379)
   redis-server
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Access Health Check**
   ```
   http://localhost:3000/health
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/fleet_management |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `JWT_SECRET` | JWT signing secret | (required) |
| `JWT_EXPIRES_IN` | JWT expiration time | 8h |
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | info |

## API Endpoints

### Health Check
- `GET /health` - System health status

### Authentication (Coming Soon)
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Vehicles (Coming Soon)
- `GET /api/vehicles` - List all vehicles
- `GET /api/vehicles/:id` - Get vehicle details
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/:id` - Update vehicle
- `DELETE /api/vehicles/:id` - Delete vehicle

### Orders (Coming Soon)
- `GET /api/orders` - List all orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status

## WebSocket Events

### Connection Events
- `connection` - Client connected
- `disconnect` - Client disconnected
- `ping/pong` - Heartbeat monitoring

### GPS Events (Coming Soon)
- `gps:update` - Vehicle location update
- `gps:idle` - Vehicle idle detection
- `gps:deviation` - Route deviation alert

### Order Events (Coming Soon)
- `order:created` - New order created
- `order:updated` - Order status updated
- `order:assigned` - Order assigned to vehicle

### Dashboard Events (Coming Soon)
- `dashboard:kpi` - KPI updates every 30 seconds
- `dashboard:alert` - Emergency alerts

## Development

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

### Project Structure
```
backend/
├── config/          # Configuration files
├── controllers/     # Route controllers (coming soon)
├── middleware/      # Custom middleware (coming soon)
├── models/          # Database models (coming soon)
├── routes/          # API routes (coming soon)
├── services/        # Business logic services (coming soon)
├── tests/           # Test files (coming soon)
├── scripts/         # Utility scripts (coming soon)
├── logs/            # Log files
├── server.js        # Main server file
└── package.json     # Dependencies and scripts
```

## Logging

The application uses a custom logger that outputs to both console and file:
- Console: Colored output for development
- File: JSON format in `logs/app.log`
- Levels: error, warn, info, debug

## Error Handling

- Graceful shutdown on SIGTERM/SIGINT
- Unhandled promise rejection logging
- Express error middleware
- Database connection retry logic
- Redis fallback when unavailable

## Performance

- Connection pooling for MongoDB
- Redis caching for frequently accessed data
- Compression middleware
- Request rate limiting
- Memory usage monitoring

## Security

- Helmet.js for security headers
- CORS configuration
- JWT authentication
- Input validation
- Rate limiting
- Environment-based configuration

## Next Steps

1. Implement database models (Task 2)
2. Add JWT authentication service (Task 3)
3. Create REST API endpoints (Task 4)
4. Implement WebSocket event handlers (Task 6)
5. Add GPS tracking system (Task 7)

## Support

For issues and questions, please check the implementation tasks document in `.kiro/specs/real-time-backend-implementation/tasks.md`.