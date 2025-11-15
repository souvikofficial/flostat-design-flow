# Flostat Design Flow

Industrial IoT platform for SCADA control, device management, and real-time monitoring.

## Local Development Setup

### Prerequisites
1. Node.js (version 16 or higher)
2. Java Runtime Environment (for DynamoDB Local)
3. AWS CLI (for creating local DynamoDB tables)

### Setup Instructions

1. **Install dependencies**:
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

2. **Start DynamoDB Local**:
   - Download DynamoDB Local from AWS
   - Extract and run:
   ```bash
   java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
   ```

3. **Set up local database tables**:
   ```bash
   # Run the setup script
   setup-local-db.bat
   ```
   Or manually run the commands from `server/demo-tables.txt`

4. **Configure environment variables**:
   - Make sure `IS_OFFLINE=true` is set in `server/.env`
   - Ensure `DYNAMODB_LOCAL_ENDPOINT=http://localhost:8000` is in `server/.env`

5. **Start the development servers**:
   ```bash
   # Start both frontend and backend
   start-local.bat
   ```
   
   Or start them separately:
   ```bash
   # Start backend (from server directory)
   cd server
   npm start
   
   # Start frontend (from root directory)
   npm run dev
   ```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:4000
- DynamoDB Local: http://localhost:8000

## Production Deployment

1. Build the production version:
   ```bash
   npm run build:prod
   ```

2. Preview the production build:
   ```bash
   npm run preview
   ```

## Environment Configuration

- Development environment uses local API endpoints and DynamoDB Local
- Production environment uses deployed API endpoints and AWS DynamoDB

To deploy to production:
1. Update the production API URL in `vite.config.ts` and `src/lib/api.ts`
2. Set up environment variables in `.env.production`
3. Run `npm run build` to create the production build

## Project Structure

```
.
├── src/                 # Frontend source code
├── server/              # Backend source code
├── public/              # Static assets
├── components.json      # shadcn/ui configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── vite.config.ts       # Vite configuration
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd server
npm install
```

### Environment Setup

1. Create a `.env` file in the `server/` directory based on `.env.example`:
```bash
cd server
cp .env.example .env
```

2. Update the `.env` file with your configuration values. This includes:
   - API endpoints
   - Authentication configuration
   - Feature flags
   - Other environment-specific settings

3. For Google OAuth, configure the client ID as an environment variable:
   - Create a Google OAuth 2.0 Client ID in the [Google Cloud Console](https://console.cloud.google.com/)
   - Add your frontend URL (e.g., http://localhost:5173) to the authorized JavaScript origins
   - Set the client ID in your frontend `.env` file as `VITE_GOOGLE_CLIENT_ID=your_client_id_here`

### Running the Application

You need to run both the frontend and backend servers:

1. Start the backend server:
```bash
cd server
npm start
```
The backend will run on port 4000 by default.

2. In a separate terminal, start the frontend development server:
```bash
npm run dev
```
The frontend will run on port 5173 and proxy API requests to the backend.

3. Open your browser and navigate to `http://localhost:5173`

## Development

### Frontend

The frontend is built with:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components

### Backend

The backend is built with:
- Node.js
- Express.js
- DynamoDB (via AWS SDK)
- JSON Web Tokens for authentication

### API Integration

The frontend uses a proxy to communicate with the backend:
- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:4000`
- API requests to `/api/*` are automatically proxied to the backend

## Authentication

The application supports multiple authentication methods:

1. **Email/Password Authentication**
   - Users can sign up with email and password
   - Password requirements:
     - At least 8 characters
     - One uppercase letter
     - One lowercase letter
     - One number
     - One special character

2. **Google OAuth**
   - Users can sign in/up with their Google account
   - Requires proper Google OAuth 2.0 Client ID configuration
   - The Google button is available on both Sign In and Sign Up pages

## Available Scripts

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

### Backend
- `npm start` - Start the backend server with nodemon
- `npm run create-tables` - Create DynamoDB tables
- `npm run test-db` - Test DynamoDB connection

## Project Features

- Dashboard with real-time data visualization
- Device management system
- User authentication and authorization
- Organization management
- Reporting system
- Scheduling capabilities
- SCADA integration
- OCR functionality
- Comprehensive logging

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is proprietary and confidential.