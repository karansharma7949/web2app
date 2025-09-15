"use client";
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Header from './components/Header';
import Hero from './components/Hero';
import ToolInterface from './components/ToolInterface';
import Footer from './components/Footer';

export default function Home() {
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
    <>
      <Head>
        <title>Web2App - Transform Websites into Mobile Apps</title>
        <meta
          name="description"
          content="Convert any website into a professional mobile app in minutes. No coding required. Generate Android apps instantly with Web2App."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://web2app.com/" />
        <meta
          property="og:title"
          content="Web2App - Transform Websites into Mobile Apps"
        />
        <meta
          property="og:description"
          content="Convert any website into a professional mobile app in minutes. No coding required."
        />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://web2app.com/" />
        <meta
          property="twitter:title"
          content="Web2App - Transform Websites into Mobile Apps"
        />
        <meta
          property="twitter:description"
          content="Convert any website into a professional mobile app in minutes. No coding required."
        />
        <meta property="twitter:image" content="/twitter-image.jpg" />
      </Head>

      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <main>
          <Hero />
          <ToolInterface />
        </main>
        <Footer />
      </div>
    </>
  );
}
