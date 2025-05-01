'use client'

import { useRouter } from 'next/navigation';

function SubscriptionFailure() {
  const router = useRouter();

  const handleRetry = () => {
  
    router.push('/');  
  }
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Payment Failed</h1>
        <p className="text-muted-foreground mb-4">Some error occurred while processing your payment. Please try again.</p>
        <button 
          onClick={handleRetry} 
          className="mt-4 bg-primary text-white py-2 px-6 rounded hover:bg-primary-dark"
        >
          Retry Payment
        </button>
      </div>
    </div>
  );
}

export default SubscriptionFailure;
