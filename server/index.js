import express from "express";
import 'dotenv/config' //  to load the data to `process` variable
import validateEnvVars from './utils/envValidator.js';
import authRoutes from "./routes/authRoutes.js"
import orgRoutes from "./routes/orgRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import ocrRoutes from "./routes/ocrRoutes.js";
import serverless from "serverless-http";
import cors from "cors";
import { OAuth2Client } from 'google-auth-library';

const app = express();

// Validate environment variables at startup
validateEnvVars();

// Initialize Google OAuth client for health check (if available)
let googleClient;
if (process.env.GOOGLE_CLIENT_ID) {
  googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
}

app.use(express.json())// parser to use json
const PORT = process.env.PORT || 4000
// Configure CORS to allow credentials
app.use(cors({ 
  origin: ["http://localhost:3000",
    'https://awstraining.flostat.com',
    "http://localhost:5173", // Add Vite dev server port
    "http://localhost:56216"
  ],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
}));

// Additional headers to handle Cross-Origin-Opener-Policy issues
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.get("/", (req, res) => {
    res.send("Hello world")
})

// Health check endpoint
app.get("/health", (req, res) => {
    const googleClientIdStatus = process.env.GOOGLE_CLIENT_ID 
      ? process.env.GOOGLE_CLIENT_ID.substring(0, 10) + "..." 
      : "NOT SET";
    
    res.json({
        status: "OK",
        timestamp: new Date().toISOString(),
        env: {
            IS_OFFLINE: process.env.IS_OFFLINE,
            GOOGLE_CLIENT_ID: googleClientIdStatus,
            USER_TABLE: process.env.USER_TABLE,
            DYNAMODB_LOCAL_ENDPOINT: process.env.DYNAMODB_LOCAL_ENDPOINT
        }
    })
})

// Google OAuth health check
app.get("/health/google", async (req, res) => {
    try {
        // Just verify that the client can be initialized
        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({
                status: "ERROR",
                message: "GOOGLE_CLIENT_ID not set"
            });
        }
        
        res.json({
            status: "OK",
            message: "Google OAuth client initialized successfully",
            clientId: process.env.GOOGLE_CLIENT_ID.substring(0, 10) + "..." // Partial client ID for security
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Failed to initialize Google OAuth client",
            error: error.message
        });
    }
});

app.use('/api/demo',(req,res)=>{
    res.json({
        s:"d",
        the:"f"
    })
})
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/org',orgRoutes)
app.use('/api/v1/user',userRoutes)
app.use('/api/v1/device',deviceRoutes)
app.use('/api/v1/report',reportRoutes)
app.use('/api/v1/ocr', ocrRoutes)

// default path
// app.use('/',(req,res)=>{
//     res.send("<H1> NAMASTE </H1>")
// })


app.listen(PORT, () => {
    console.log(`Connected to server on port ${PORT}`);
    console.log(`CORS enabled for origins: http://localhost:3000, https://awstraining.flostat.com, http://localhost:5173, http://localhost:56216`);
    console.log(`Health check endpoints:`);
    console.log(`  - http://localhost:${PORT}/health`);
    console.log(`  - http://localhost:${PORT}/health/google`);
})
export const handler = serverless(app);