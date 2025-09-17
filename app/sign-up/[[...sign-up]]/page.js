"use client";
import { useState, useEffect } from 'react';
import { SignUp } from '@clerk/nextjs';
import Header from '../../components/Header';

export default function Page() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <style jsx global>{`
        .cl-card {
          background-color: ${isDarkMode ? '#1f2937' : '#ffffff'} !important;
          border-color: ${isDarkMode ? '#374151' : '#e5e7eb'} !important;
        }
        .cl-socialButtonsBlockButton {
          background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
          border-color: ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
          color: ${isDarkMode ? '#d1d5db' : '#374151'} !important;
        }
        .cl-formFieldInput {
          background-color: ${isDarkMode ? '#374151' : '#ffffff'} !important;
          border-color: ${isDarkMode ? '#4b5563' : '#d1d5db'} !important;
          color: ${isDarkMode ? '#ffffff' : '#111827'} !important;
        }
        .cl-headerTitle {
          color: ${isDarkMode ? '#ffffff' : '#111827'} !important;
        }
        .cl-headerSubtitle {
          color: ${isDarkMode ? '#9ca3af' : '#6b7280'} !important;
        }
        .cl-footerActionLink {
          color: ${isDarkMode ? '#9ca3af' : '#6b7280'} !important;
        }
      `}</style>
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 py-12 pt-32">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create your account
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Join Launchapp and start converting websites to apps
            </p>
          </div>
          <SignUp 
            appearance={{
              baseTheme: isDarkMode ? "dark" : "light",
              variables: {
                colorPrimary: isDarkMode ? "#ffffff" : "#111827",
                colorBackground: isDarkMode ? "#1f2937" : "#ffffff",
                colorInputBackground: isDarkMode ? "#374151" : "#ffffff",
                colorInputText: isDarkMode ? "#ffffff" : "#111827",
                colorText: isDarkMode ? "#ffffff" : "#111827",
                colorTextSecondary: isDarkMode ? "#9ca3af" : "#6b7280",
                colorNeutral: isDarkMode ? "#374151" : "#f3f4f6",
                borderRadius: "0.5rem"
              },
              elements: {
                rootBox: "mx-auto",
                card: isDarkMode 
                  ? "!bg-gray-800 !border-gray-700 shadow-xl border" 
                  : "!bg-white !border-gray-200 shadow-xl border",
                headerTitle: isDarkMode ? "!text-white" : "!text-gray-900",
                headerSubtitle: isDarkMode ? "!text-gray-400" : "!text-gray-600",
                socialButtonsBlockButton: isDarkMode 
                  ? "!bg-gray-700 !border-gray-600 !text-gray-300 hover:!bg-gray-600 border" 
                  : "!bg-white !border-gray-300 !text-gray-700 hover:!bg-gray-50 border",
                formFieldInput: isDarkMode 
                  ? "!bg-gray-700 !border-gray-600 !text-white" 
                  : "!bg-white !border-gray-300 !text-gray-900",
                formButtonPrimary: isDarkMode 
                  ? "!bg-white hover:!bg-gray-100 !text-gray-900" 
                  : "!bg-gray-900 hover:!bg-gray-800 !text-white",
                footerActionLink: isDarkMode 
                  ? "!text-gray-400 hover:!text-white" 
                  : "!text-gray-600 hover:!text-gray-900"
              }
            }}
          />
        </div>
      </main>
    </div>
  );
}