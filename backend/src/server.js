import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import candidateRoutes from './routes/candidateRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { protect } from './middleware/auth.js';

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(morgan('dev'));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});
app.use(limiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/jobs', jobRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

// Email verification page - this will automatically verify when clicked
app.get('/verify/:token', async (req, res) => {
  const { token } = req.params;
  
  try {
    // Import the verification function from auth controller
    const User = (await import('./models/User.js')).default;
    
    // Find user with this verification token
    const user = await User.findOne({ verificationToken: token });
    
    if (!user) {
      return res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Email Verification</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <style>
              body { 
                text-align: center; 
                padding: 40px; 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .card { 
                background: #fff; 
                border-radius: 20px; 
                box-shadow: 0 10px 40px rgba(0,0,0,0.1); 
                max-width: 400px; 
                padding: 40px 30px; 
                animation: fadeIn 0.6s ease-out;
              }
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .icon { 
                font-size: 80px; 
                margin-bottom: 20px; 
                animation: bounce 1s ease-out;
              }
              @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
              }
              .error { color: #ef4444; }
              h2 { color: #333; margin-bottom: 15px; }
              p { color: #666; line-height: 1.6; margin-bottom: 30px; }
              .btn { 
                display: inline-block;
                padding: 12px 30px; 
                font-size: 16px; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #fff; 
                text-decoration: none;
                border-radius: 25px; 
                font-weight: 600;
                transition: transform 0.2s ease;
              }
              .btn:hover {
                transform: translateY(-2px);
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="icon error">❌</div>
              <h2>Verification Failed</h2>
              <p>This verification link is invalid or has expired. Please request a new verification email.</p>
              <a href="http://localhost:3000/login" class="btn">Go to Login</a>
            </div>
          </body>
        </html>
      `);
    }

    // Verify the user
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // Show success page with auto-redirect
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Email Verified Successfully</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { 
              text-align: center; 
              padding: 40px; 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .card { 
              background: #fff; 
              border-radius: 20px; 
              box-shadow: 0 10px 40px rgba(0,0,0,0.1); 
              max-width: 400px; 
              padding: 40px 30px; 
              animation: fadeIn 0.6s ease-out;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .icon { 
              font-size: 80px; 
              margin-bottom: 20px; 
              animation: bounce 1s ease-out;
            }
            @keyframes bounce {
              0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
              40% { transform: translateY(-10px); }
              60% { transform: translateY(-5px); }
            }
            .success { color: #22c55e; }
            h2 { color: #333; margin-bottom: 15px; }
            p { color: #666; line-height: 1.6; margin-bottom: 30px; }
            .btn { 
              display: inline-block;
              padding: 12px 30px; 
              font-size: 16px; 
              background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
              color: #fff; 
              text-decoration: none;
              border-radius: 25px; 
              font-weight: 600;
              transition: transform 0.2s ease;
              margin: 0 10px;
            }
            .btn:hover {
              transform: translateY(-2px);
            }
            .countdown {
              font-size: 14px;
              color: #888;
              margin-top: 20px;
            }
            .redirect-text {
              font-size: 12px;
              color: #999;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon success">✅</div>
            <h2>Email Verified Successfully!</h2>
            <p>Congratulations! Your email has been verified. You can now access all features of your account.</p>
            <a href="http://localhost:3000/login" class="btn" id="loginBtn">Login Now</a>
            <div class="countdown">
              <div class="redirect-text">Redirecting to login in <span id="countdown">5</span> seconds...</div>
            </div>
          </div>
          
          <script>
            let countdown = 5;
            const countdownElement = document.getElementById('countdown');
            const loginBtn = document.getElementById('loginBtn');
            
            const timer = setInterval(() => {
              countdown--;
              countdownElement.textContent = countdown;
              
              if (countdown <= 0) {
                clearInterval(timer);
                window.location.href = 'http://localhost:3000/login';
              }
            }, 1000);
            
            // Allow user to click button to go immediately
            loginBtn.addEventListener('click', () => {
              clearInterval(timer);
            });
          </script>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('Email verification error:', error);
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Verification Error</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            body { 
              text-align: center; 
              padding: 40px; 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .card { 
              background: #fff; 
              border-radius: 20px; 
              box-shadow: 0 10px 40px rgba(0,0,0,0.1); 
              max-width: 400px; 
              padding: 40px 30px; 
            }
            .icon { font-size: 80px; margin-bottom: 20px; }
            .error { color: #ef4444; }
            h2 { color: #333; margin-bottom: 15px; }
            p { color: #666; line-height: 1.6; margin-bottom: 30px; }
            .btn { 
              display: inline-block;
              padding: 12px 30px; 
              font-size: 16px; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #fff; 
              text-decoration: none;
              border-radius: 25px; 
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="icon error">⚠️</div>
            <h2>Verification Error</h2>
            <p>An error occurred while verifying your email. Please try again or contact support.</p>
            <a href="http://localhost:3000/login" class="btn">Go to Login</a>
          </div>
        </body>
      </html>
    `);
  }
});

// Password reset redirect page - this will redirect to the frontend reset-password page
app.get('/reset/:token', (req, res) => {
  const { token } = req.params;
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/reset-password/${token}`);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});