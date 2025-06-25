import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('Click the button below to verify your email.');
  const navigate = useNavigate();

  const handleVerify = async () => {
    setStatus('pending');
    setMessage('Verifying your email...');
    try {
      const res = await axios.get(`http://localhost:4000/api/auth/verify/${token}`);
      if (res.data.success) {
        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully! Redirecting...');
        setTimeout(() => {
          window.location.href = 'http://localhost:4000';
        }, 2500);
      } else {
        setStatus('error');
        setMessage(res.data.message || 'Verification failed.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Verification failed.');
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#E5EDF9' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md flex flex-col items-center">
        {status === 'pending' && (
          <svg className="w-16 h-16 text-blue-400 animate-spin mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
        )}
        {status === 'success' && (
          <svg className="w-16 h-16 text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#D1FAE5" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" />
          </svg>
        )}
        {status === 'error' && (
          <svg className="w-16 h-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#FEE2E2" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6m0-6l6 6" />
          </svg>
        )}
        <h2 className={`text-2xl font-bold mb-2 ${status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-blue-600'}`}>{status === 'success' ? 'Verified!' : status === 'error' ? 'Verification Failed' : 'Verify Your Email'}</h2>
        <p className="text-center text-gray-600 text-base mb-4">{message}</p>
        {status === 'idle' && (
          <button
            onClick={handleVerify}
            className="py-3 px-8 bg-[#FFA726] hover:bg-[#FB8C00] text-white font-bold rounded-lg text-lg shadow-md tracking-wide mt-2"
          >
            Verify Now
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail; 