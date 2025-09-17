"use client";
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfService() {
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
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8 lg:p-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-8">
              Terms of Service
            </h1>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Last updated: January 15, 2025
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  By accessing and using Web2App, you accept and agree to be bound by the terms 
                  and provision of this agreement.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  2. Service Description
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Web2App is a service that converts websites into mobile applications. We provide:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Website to Android app conversion</li>
                  <li>APK file generation and download</li>
                  <li>Basic app customization features</li>
                  <li>Free app generation service</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  3. User Responsibilities
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Provide accurate information when using our services</li>
                  <li>Only submit websites you own or have permission to convert</li>
                  <li>Not use our service for illegal or harmful purposes</li>
                  <li>Respect intellectual property rights</li>
                  <li>Not attempt to reverse engineer or hack our platform</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  4. Prohibited Uses
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You may not use our service to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Create apps from websites you don&apos;t own</li>
                  <li>Generate apps containing illegal content</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on others&apos; intellectual property rights</li>
                  <li>Distribute malware or harmful software</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  5. Intellectual Property
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  You retain ownership of your content and generated apps. Web2App retains 
                  ownership of the platform and underlying technology.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  6. Disclaimer of Warranties
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Our service is provided &quot;as is&quot; without any warranties. We do not guarantee 
                  that the service will be uninterrupted, secure, or error-free.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  7. Limitation of Liability
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Web2App shall not be liable for any indirect, incidental, special, or 
                  consequential damages arising from your use of our service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  8. Termination
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We may terminate or suspend your access to our service at any time, 
                  with or without cause or notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  9. Changes to Terms
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We reserve the right to modify these terms at any time. Changes will be 
                  effective immediately upon posting.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  10. Contact Information
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  For questions about these Terms of Service, contact us at:
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Email: legal@launchapp.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
