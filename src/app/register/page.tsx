// nextjs-app/pages/register.tsx

"use client";
import React, { useState } from 'react';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (data.success) {
      // Handle successful registration (e.g., redirect to login page)
      window.location.href = '/login';
    } else {
      // Handle registration error
      console.error(data.error);
    }
  };

  return (
    <div className='login flex items-center justify-center bg-[url("https://images.unsplash.com/photo-1654198340681-a2e0fc449f1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wyMDUzMDJ8MHwxfHNlYXJjaHw0ODN8fGJsYWNrJTIwZ3JhZGllbnQlMjB8ZW58MXx8fHwxNjk5NTQwODM2fDA&ixlib=rb-4.0.3&q=80&w=1080")] h-screen'>
      <form
        className="relative bg-white bg-opacity-5 border border-white border-opacity-70 p-10 text-white rounded-xl backdrop-blur-md w-80 md:w-96"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center font-bold text-2xl mb-5">Sign Up</h1>

        <div className="space-y-4 mb-4">
          <div className="flex items-center space-x-3 border border-white border-opacity-70 rounded-full px-5">
            <input
              type="text"
              placeholder="Username"
              required
              className="bg-transparent w-full text-white py-3 outline-none placeholder-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <i className="ri-user-fill text-xl"></i>
          </div>
          <div className="flex items-center space-x-3 border border-white border-opacity-70 rounded-full px-5">
            <input
              type="email"
              placeholder="Email ID"
              required
              className="bg-transparent w-full text-white py-3 outline-none placeholder-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <i className="ri-mail-fill text-xl"></i>
          </div>
          <div className="flex items-center space-x-3 border border-white border-opacity-70 rounded-full px-5">
            <input
              type="password"
              placeholder="Password"
              required
              className="bg-transparent w-full text-white py-3 outline-none placeholder-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <i className="ri-lock-2-fill text-xl"></i>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="user-check"
              className="w-4 h-4 text-white"
            />
            <label htmlFor="user-check">Remember me</label>
          </div>
          <a href="#" className="hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-white text-black rounded-full font-medium mb-4"
        >
          Register
        </button>

        <div className="text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="font-medium hover:underline">
            Sign In
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
