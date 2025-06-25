import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loginima from '../image/loginim.png';
import Logo from '../image/log.png';
import star from '../image/star.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');
  const { login, requestPasswordReset } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login(email, password);
    } catch (error: any) {
      let msg = 'Login failed. Please try again.';
      if (error.response && error.response.data && error.response.data.message) {
        msg = error.response.data.message;
      } else if (error.message) {
        msg = error.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');
    try {
      await requestPasswordReset(forgotEmail);
      setForgotSuccess('If that email is registered, a reset link has been sent.');
      setForgotEmail('');
    } catch (error: any) {
      setForgotError(error.message || 'Failed to send reset link.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: '#E5EDF9' }}>
      <img src={star} alt=""  className='absolute top-0 left-0 w-full h-3/4 z-0'/>
      <div
        className="bg-[E6EEF8] rounded-3xl overflow-hidden w-full max-w-5xl z-10"
        style={{ boxShadow: '0 0 60px 20px rgba(255,255,255,0.95), 0 8px 40px 0 rgba(0,0,0,0.08)' }}
      >
        <div className="flex">
          {/* Left side - Illustration */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12" style={{ backgroundColor: '#E6EEF8' }}>
            <div className="text-center">
              <div className="relative mb-8">
                <div className="relative">
                  <img src={Loginima} alt="" />
                </div>
              </div>
            </div>
          </div>
          {/* Right side - Form */}
          <span className='bg-[#ffffff] w-1 h-full'></span>
          <div className="relative z-10 bg-[#E6EEF8] rounded-3xl overflow-hidden w-full lg:w-1/2 p-8 lg:p-12">
            <div className="mb-6">
              <div className="flex items-center justify-center mb-6">
                <img src={Logo} alt="" />
                <h1 className="text-lg font-bold text-gray-800">HR Management</h1>
              </div>
              <div className="text-center mb-6">
                <div className="flex justify-center space-x-6 mb-4">
                  <span className="text-blue-500 font-bold border-b-2 border-[#FFA726] pb-1 text-lg" style={{ letterSpacing: '0.01em' }}>
                    Login
                  </span>
                  <Link
                    to="/signup"
                    className="text-gray-400 hover:text-blue-500 transition-colors text-lg font-semibold"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
            {error && (
              <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:bg-white transition-colors text-sm placeholder-[#64748B] font-medium"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:bg-white transition-colors text-sm placeholder-[#64748B] font-medium"
                  placeholder="Password"
                  required
                />
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A0AEC0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB] border-[#CBD5E1] rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-[#64748B] font-medium">
                    Remember
                  </label>
                </div>
                <div>
                  <button type="button" onClick={() => setShowForgot(true)} className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold bg-transparent border-none p-0 m-0 cursor-pointer text-xs">
                    Forgot Password?
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-3 bg-[#FFA726] hover:bg-[#FB8C00] text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base shadow-md tracking-wide"
                style={{ letterSpacing: '0.01em' }}
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>
              <button
                type="button"
                className="w-full py-2 px-3 bg-[#4B93E7] hover:bg-[#2563EB] text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 text-base shadow-md tracking-wide mt-2"
                style={{ letterSpacing: '0.01em' }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Login with Google G</span>
              </button>
            </form>
            {showForgot && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
                  <button onClick={() => setShowForgot(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                  <h2 className="text-xl font-bold mb-4 text-[#2563EB]">Reset Password</h2>
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] focus:bg-white transition-colors text-base placeholder-[#64748B] font-medium"
                      placeholder="Enter your email"
                      required
                    />
                    {forgotError && <div className="text-red-600 text-sm">{forgotError}</div>}
                    {forgotSuccess && <div className="text-green-600 text-sm">{forgotSuccess}</div>}
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3 px-4 bg-[#FFA726] hover:bg-[#FB8C00] text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-md tracking-wide"
                    >
                      {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-10 text-center text-sm">
              <p className="font-bold text-[#2563EB] text-base">Release Notes</p>
              <p className="text-[#A0AEC0] text-base">version 20.22.11</p>
              <p className="mt-2 text-[#A0AEC0] text-base">Copyright © 2023-24 HRM and services</p>
            </div>
    </div>
  );
};

export default Login;
