import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Helper: Send email using nodemailer
const sendEmail = async (to, subject, text, html = null) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  if (html) {
    mailOptions.html = html;
  }

  await transporter.sendMail(mailOptions);
};

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Create user
    const user = await User.create({ name, email, password, verificationToken });
    
    // Send verification email with HTML template
    const backendUrl = process.env.BACKEND_URL || 'https://hr-management-clso.onrender.com';
    const verifyUrl = `${backendUrl}/verify/${verificationToken}`;
    
    const emailText = `Welcome to our platform! Please verify your email by clicking the link: ${verifyUrl}`;
    
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Our Platform!</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Thank you for signing up! To get started, please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verifyUrl}" style="
              display: inline-block;
              padding: 15px 40px;
              background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
              color: white;
              text-decoration: none;
              border-radius: 25px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
            ">
              Verify My Email
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px; line-height: 1.6;">
            If the button doesn't work, you can copy and paste this link into your browser:<br>
            <a href="${verifyUrl}" style="color: #667eea; word-break: break-all;">${verifyUrl}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `;
    
    await sendEmail(email, 'Verify Your Email Address', emailText, emailHtml);
    
    res.status(201).json({ 
      success: true, 
      message: 'Account created successfully! Please check your email to verify your account.' 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Signup failed', error: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    
    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email before logging in. Check your inbox for the verification link.' 
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }
    
    // Generate token and send response
    const token = generateToken(user);
    res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed', error: error.message });
  }
};

// Resend verification email
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }
    
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email is already verified' });
    }
    
    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = verificationToken;
    await user.save();
    
    // Send new verification email
    const backendUrl = process.env.BACKEND_URL || 'https://hr-management-clso.onrender.com';
    const verifyUrl = `${backendUrl}/verify/${verificationToken}`;
    
    const emailText = `Please verify your email by clicking the link: ${verifyUrl}`;
    
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Email Verification</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${user.name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${verifyUrl}" style="
              display: inline-block;
              padding: 15px 40px;
              background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
              color: white;
              text-decoration: none;
              border-radius: 25px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
            ">
              Verify My Email
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px; line-height: 1.6;">
            If the button doesn't work, you can copy and paste this link into your browser:<br>
            <a href="${verifyUrl}" style="color: #667eea; word-break: break-all;">${verifyUrl}</a>
          </p>
        </div>
      </div>
    `;
    
    await sendEmail(email, 'Verify Your Email Address', emailText, emailHtml);
    
    res.status(200).json({ 
      success: true, 
      message: 'Verification email sent. Please check your inbox.' 
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ success: false, message: 'Failed to resend verification email', error: error.message });
  }
};

// Request password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.status(200).json({ 
        success: true, 
        message: 'If that email is registered, a reset link has been sent.' 
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    // Send reset email
    const backendUrl = process.env.BACKEND_URL || 'https://hr-management-clso.onrender.com';
    const resetUrl = `${backendUrl}/reset/${resetToken}`;
    
    const emailText = `You requested a password reset. Click the link to reset your password: ${resetUrl}`;
    
    const emailHtml = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${user.name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            You requested a password reset. Click the button below to create a new password.
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" style="
              display: inline-block;
              padding: 15px 40px;
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
              color: white;
              text-decoration: none;
              border-radius: 25px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
            ">
              Reset My Password
            </a>
          </div>
          
          <p style="color: #888; font-size: 14px; line-height: 1.6;">
            This link will expire in 1 hour. If you didn't request this reset, you can safely ignore this email.
          </p>
          
          <p style="color: #888; font-size: 14px; line-height: 1.6;">
            If the button doesn't work, you can copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #667eea; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
      </div>
    `;
    
    await sendEmail(email, 'Password Reset Request', emailText, emailHtml);
    
    res.status(200).json({ 
      success: true, 
      message: 'If that email is registered, a reset link has been sent.' 
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ success: false, message: 'Password reset request failed', error: error.message });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Find user with valid reset token
    const user = await User.findOne({ 
      resetPasswordToken: token, 
      resetPasswordExpires: { $gt: Date.now() } 
    });
    
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }
    
    // Update password and clear reset token
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Password reset successful. You can now log in with your new password.' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ success: false, message: 'Password reset failed', error: error.message });
  }
};