import { v4 as uuidv4 } from "uuid";
import { OtpRepository, UserRepository } from "../models/Models.js";
import bcrypt from "bcryptjs";
import pkg from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
const { sign } = pkg;

// Validate required environment variables at startup
const requiredEnvVars = ['JWT_SECRET_KEY'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  console.error('Please check your .env file');
}

// Initialize Google OAuth client with the client ID from environment variables (if available)
let client;
if (process.env.GOOGLE_CLIENT_ID) {
  client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
}

// util: generate random 6-digit OTP
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// sendOtp
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // 1️⃣ Check if user already exists in Users table
    const existingUser = await UserRepository.getById({ email });
    console.log("EX USER: ", existingUser);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // 2️⃣ Generate OTP
    const otp = generateOtp();
    const now = Math.floor(Date.now() / 1000);
    const ttl = now + 5 * 60; // expires in 5 minutes
    console.log("otp: ", otp);
    // 3️⃣ Store OTP in OtpTable (reuse repo)
    const otpresult = await OtpRepository.create({
      email,
      otpId: uuidv4(), // SK if needed
      otp,
      expiresAt: ttl,
    });
    console.log("response time", otpresult);
    // 4️⃣ Response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp, // ⚠️ for testing only
    });
  } catch (error) {
    console.error("Error in sendOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again later.",
      error: error.message,
    });
  }
};

// verifyOtp
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // 1️⃣ Check if user already exists
    const existingUser = await UserRepository.getById({ email }); // email is PK
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // 2️⃣ Get OTP from OtpTable
    const otpItem = await OtpRepository.getById({ email }); // email is PK
    console.log("Otp item: ", otpItem);
    if (!otpItem) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // 3️⃣ Check OTP value
    const now = Math.floor(Date.now() / 1000);
    if (otpItem.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (otpItem.expiresAt < now) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // 4️⃣ Optional: Delete OTP after verification
    await OtpRepository.remove({ email });
    console.log("Otp done: ");
    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again later.",
      error: error.message,
    });
  }
};

// signUp
export const signUp = async (req, res) => {
  try {
    console.log("=== SIGNUP REQUEST ===");
    console.log("Full request body received:", JSON.stringify(req.body, null, 2));
    console.log("Request body type:", typeof req.body);
    console.log("Request body keys:", Object.keys(req.body));
    
    const {
      firstName,
      lastName,
      password,
      conformPassword,
      email,
      contactNumber,
    } = req.body;

    console.log("=== EXTRACTED PARAMETERS ===");
    console.log("firstName:", firstName, "Type:", typeof firstName);
    console.log("lastName:", lastName, "Type:", typeof lastName);
    console.log("password:", password ? "[HIDDEN]" : "undefined", "Type:", typeof password);
    console.log("conformPassword:", conformPassword ? "[HIDDEN]" : "undefined", "Type:", typeof conformPassword);
    console.log("email:", email, "Type:", typeof email);
    console.log("contactNumber:", contactNumber, "Type:", typeof contactNumber);

    // Check if parameters exist and are strings
    const isFirstNameValid = firstName && typeof firstName === 'string' && firstName.trim().length > 0;
    const isLastNameValid = lastName && typeof lastName === 'string' && lastName.trim().length > 0;
    const isPasswordValid = password && typeof password === 'string' && password.trim().length > 0;
    const isConformPasswordValid = conformPassword && typeof conformPassword === 'string' && conformPassword.trim().length > 0;
    const isEmailValid = email && typeof email === 'string' && email.trim().length > 0;

    console.log("=== VALIDATION RESULTS ===");
    console.log("isFirstNameValid:", isFirstNameValid);
    console.log("isLastNameValid:", isLastNameValid);
    console.log("isPasswordValid:", isPasswordValid);
    console.log("isConformPasswordValid:", isConformPasswordValid);
    console.log("isEmailValid:", isEmailValid);

    if (!isFirstNameValid || !isLastNameValid || !isPasswordValid || !isConformPasswordValid || !isEmailValid) {
      console.log("=== MISSING REQUIRED FIELDS ===");
      console.log("Missing fields details:", { 
        firstName: isFirstNameValid, 
        lastName: isLastNameValid, 
        password: isPasswordValid, 
        conformPassword: isConformPasswordValid, 
        email: isEmailValid 
      });
      return res.status(400).json({
        success: false,
        message: "Some params missing!",
      });
    }

    if (password !== conformPassword) {
      console.log("Password mismatch");
      return res.status(400).json({
        success: false,
        message: "Password is Incorrect!",
      });
    }
    
    console.log("Checking if user already exists with email:", email);
    const existingUser = await UserRepository.getById({ email });
    console.log("Existing user check result:", existingUser);
    if (existingUser) {
      console.log("User already exists with this email");
      return res.status(400).json({
        success: false,
        message: "User Already Exists!",
      });
    }

    console.log("Generating password hash");
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    console.log("Creating new user in database");
    const newUser = await UserRepository.create({
      email,
      password: hash,
      firstName,
      lastName,
      contactNumber,
      createdAt: new Date().toISOString(),
    });
    console.log("New user created:", newUser);

    // Generate JWT token
    const token = sign(
      {
        email: newUser.email
      },
      process.env.JWT_SECRET_KEY
    );

    // Update user with token
    const updatedUser = await UserRepository.update({email},{ token})
    console.log("Updated user with token:", updatedUser);

    const options = {
        httpOnly:true
    }

    return res.status(200).cookie("access_token",token,options).json({
        success:true,
        message:"SignUp SuccessFull",
        user: updatedUser,
        token
    })
  } catch (error) {
    console.error("Error in signUp:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create account. Please try again later.",
      error: error.message,
    });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 1️⃣ Check if user exists
    const existingUser = await UserRepository.getById({ email });
    console.log("Existing user:", existingUser);
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Check password
    const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3️⃣ Generate token
    const token = sign(
      {
        email: existingUser.email
      },
      process.env.JWT_SECRET_KEY
      // ,{
      //     expiresIn: "24h" // set if you want to expire the token
      // }
    );
    // save the token to db
    const updatedUser = await UserRepository.update({email},{ token})
    console.log("Updated user: ",updatedUser)

    const options = {
        httpOnly:true
    }

    return res.cookie("access_token",token,options).status(200).json({
        success:true,
        message:"Login SuccessFull",
        user: updatedUser,
        token
    })


  } catch (error) {
    console.error("Error in login: ", error);
    return res.status(500).json({
      success: false,
      message: "Failed to login. Please try again later.",
      error: error.message,
    });
  }
};

// googleOuth
export const googleOAuth = async (req, res) => {
  try {
    console.log('GOOGLE_CLIENT_ID from env:', process.env.GOOGLE_CLIENT_ID);
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('CRITICAL ERROR: GOOGLE_CLIENT_ID is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: "Google authentication is not configured on the server",
      });
    }
    
    const { tokenId } = req.body;
    
    if (!tokenId) {
      return res.status(400).json({
        success: false,
        message: "tokenId is required",
      });
    }
    
    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    
    console.log(`Verified Google user: ${email}`);
    
    let user = await UserRepository.getById({ email });
    
    if (!user) {
      // Create new user if doesn't exist
      const names = name.split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';
      
      user = await UserRepository.create({
        email,
        firstName,
        lastName,
        profilePic: picture,
        googleId,
        createdAt: new Date().toISOString(),
      });
      
      console.log(`Created new user: ${email}`);
    } else if (!user.googleId) {
      // Update user with googleId if exists but not linked
      user = await UserRepository.update(email, { googleId });
      console.log(`Updated user with googleId: ${email}`);
    }
    
    // Generate JWT token
    const token = sign(
      { email: user.email, id: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );
    
    res.status(200).json({
      success: true,
      message: user.googleId ? "Login successful" : "Account created and linked successfully",
      token,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error("Error in googleOAuth:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during Google authentication",
      error: error.message,
    });
  }
};
