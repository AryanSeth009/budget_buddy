"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter(); // Use Next.js router for navigation

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store both token and userId in sessionStorage
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('userId', data.userId);

      // Navigate to home page after successful login
      router.push('/home');
    } else {
      // Handle login error
      console.error('Login error:', data.error);
      alert('Login failed. Please check your credentials.');
    }
  };
  


  return (
    <div className='login flex items-center justify-center  h-screen'>
      <form
        onSubmit={handleSubmit}
        className="relative bg-white bg-opacity-5 border border-white border-opacity-70 p-10 text-white rounded-xl backdrop-blur-md w-80 md:w-96"
      >
        <h1 className="text-center font-bold text-2xl mb-5">Login</h1>

        <div className="space-y-4 mb-4">
          <div className="flex items-center space-x-3 border border-white border-opacity-70 rounded-full px-5">
            <input
              type="email"
              placeholder="Email ID"
             
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              className="bg-transparent w-full text-white py-3 outline-none placeholder-white"
              required
            />
            <i className="ri-mail-fill text-xl"></i>
          </div>

          <div className="flex items-center space-x-3 border border-white border-opacity-70 rounded-full px-5">
            <input
              type="password"
              placeholder="Password"
             
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent w-full text-white py-3 outline-none placeholder-white"
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
          Login
        </button>

        <div className="text-sm text-center">
          Don't have an account?{" "}
          <a href="/register" className="font-medium hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
}

export default Page;
