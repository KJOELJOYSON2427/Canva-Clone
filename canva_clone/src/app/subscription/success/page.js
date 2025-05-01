'use client'

import { capturePayPalOrder } from '@/services/subscription-service';
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function SubscriptionSuccess() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [status, setStatus] = useState('processing'); // changed to 'processing' instead of 'processing...'

    useEffect(() => {
        const orderId = searchParams.get('token');

        const processPayment = async () => {
            try {
                console.log('Order ID:', orderId);
const response = await capturePayPalOrder(orderId);
console.log('Response:', response);
;

                if (response.success) {
                    setStatus('success');
                    setTimeout(() => {
                        router.push('/');
                    }, 2000); // Delay to show success message before redirect
                } else {
                    setStatus('failed');
                }
            } catch (e) {
                setStatus('error');
            }
        }
        processPayment();

    }, [searchParams, router]);

    return (
        <div className='flex min-h-screen flex-col items-center justify-center p-4'>
            <div className='w-full max-w-md rounded-lg border bg-card p-8 shadow-lg'>
                {
                    status === 'processing' && (
                        <div className='flex flex-col items-center justify-center'>
                            <Loader2 className='h-16 w-16 animate-spin text-primary mb-4' />
                            <h1 className='text-2xl font-bold mb-2'>Processing Payment</h1>
                            <p className='text-muted-foreground'>Please wait while we confirm your payment.</p>
                        </div>
                    )
                }
                {
                    status === 'success' && (
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold mb-2 text-green-500'>Payment Successful!</h1>
                            <p className='text-muted-foreground mb-4'>Your subscription has been activated.</p>
                        </div>
                    )
                }
                {
                    status === 'failed' && (
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold mb-2 text-red-500'>Payment Failed</h1>
                            <p className='text-muted-foreground mb-4'>There was an issue with your payment. Please try again.</p>
                        </div>
                    )
                }
                {
                    status === 'error' && (
                        <div className='text-center'>
                            <h1 className='text-2xl font-bold mb-2 text-red-500'>Error</h1>
                            <p className='text-muted-foreground mb-4'>There was an error processing your payment. Please try again later.</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default SubscriptionSuccess;
