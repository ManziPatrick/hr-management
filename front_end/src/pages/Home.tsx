import React from 'react';
import loginImg from '../image/side1.png'; // Replace with your actual image filenames
import signupImg from '../image/side2.png';
import dashboardImg from '../image/side3.png';
import mainCover from '../image/main-cover.png'; // Add your faint front image here

const Home = () => (
  <div className="relative min-h-screen bg-[#E5EDF9] flex flex-col items-center justify-center overflow-hidden">
    {/* Faint front image as background */}
    <img
      src={mainCover}
      alt="main cover"
      className="absolute right-0 top-1/2 w-[40vw] max-w-[700px] opacity-20 z-0"
      style={{ transform: 'translateY(-50%)' }}
    />
    {/* Cover Text */}
    <div className="z-20 text-left mt-24 ml-12">
      <h1 className="text-5xl font-bold text-[#4B93E7] mb-2">HR Management</h1>
      <div className="h-1 w-32 bg-[#F9C46B] mb-4"></div>
      <h2 className="text-4xl font-bold text-[#F9C46B] mb-2">Alight HR</h2>
    </div>
    {/* 3D/Overlapping Images on the right */}
    <img
      src={dashboardImg}
      alt="dashboard"
      className="absolute right-[8vw] top-10 w-[32vw] max-w-[500px] shadow-2xl rounded-2xl z-10"
      style={{
        transform: 'rotateY(-18deg) rotateX(6deg) scale(0.95)',
        boxShadow: '0 12px 40px 0 rgba(0,0,0,0.18)'
      }}
    />
    <img
      src={signupImg}
      alt="signup"
      className="absolute right-[4vw] top-32 w-[28vw] max-w-[420px] shadow-2xl rounded-2xl z-20"
      style={{
        transform: 'rotateY(-8deg) rotateX(2deg) scale(1.05)',
        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.13)'
      }}
    />
    <img
      src={loginImg}
      alt="login"
      className="absolute right-[12vw] top-[55vh] w-[22vw] max-w-[320px] shadow-xl rounded-2xl z-30"
      style={{
        transform: 'rotateY(-4deg) rotateX(1deg) scale(1.02)',
        boxShadow: '0 6px 24px 0 rgba(0,0,0,0.10)'
      }}
    />
  </div>
);

export default Home; 