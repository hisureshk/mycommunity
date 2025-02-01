'use client';

import React, { useRef, useState } from "react";
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import { login } from '../lib/api';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import  ReCAPTCHA  from  "react-google-recaptcha";

interface Login {
    email: string;
    password: string;
}

export default function LoginPage() {
    const { login: authLogin } = useAuth();

    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isVerified, setIsVerified] = useState(false);

    async function handleCaptchaSubmission(token: string | null) {
        try {
          if (token) {
            await fetch("/api", {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token }),
            });
            setIsVerified(true);
          }
        } catch (e) {
          setIsVerified(false);
          console.error(e);
        }
      }
    
      const handleChange = (token: string | null) => {
        handleCaptchaSubmission(token);
      };
      function handleExpired() {
        if(!isVerified) {
          recaptchaRef.current?.reset();
        }
        setIsVerified(false);
      }

    const asyncScriptOnLoad = () => {
    console.log('Google recaptcha loaded just fine')
      }

    const handleLogin = async (values: Login) => {
        try {
            const data = await login(values.email, values.password);
            authLogin(data);
            toast.success('Logged in successfully');
        } catch (error) {
            throw error;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 
        dark:from-gray-900 dark:to-gray-800 transition-colors">

            
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold">
                            Sign in to your account
                        </h2>
                    </div>

                    <AuthForm mode="login" onSubmit={handleLogin} />


                    <>
      {/* <Component {...pageProps} /> */}
      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
        onChange={handleChange}
        asyncScriptOnLoad={asyncScriptOnLoad}
        onExpired={handleExpired}
      />
      </>

                    <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Don&apos;t have an account?{' '}
                        <Link 
                            href="/register" 
                            className="font-medium text-indigo-600 hover:text-indigo-500 
                            dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
