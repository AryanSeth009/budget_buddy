"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
const Page: React.FC = () => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set the flag to true when the component is mounted on the client side
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      router.push('/login');
    }
  }, [isClient, router]);

  if (!isClient) {
    // Render nothing or a loading state on the server side
    return null;
  }

  return (
    <div className='bg-[#1B1B1B]'>
      Redirecting to login...
    </div>
  );
};

export default Page;