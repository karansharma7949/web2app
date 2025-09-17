"use client";
import { useState } from 'react';
import { Bars3Icon, XMarkIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Header({ isDarkMode, toggleTheme }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl mx-auto px-4">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gray-900 dark:bg-white rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white dark:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.5 2 15 3.5 15 5V12C15 13.5 13.5 15 12 15C10.5 15 9 13.5 9 12V5C9 3.5 10.5 2 12 2Z"/>
                  <path d="M12 15L11 18L9 20L10 22L12 21L14 22L15 20L13 18L12 15Z"/>
                  <path d="M7 9L9 10V14L7 15V9Z"/>
                  <path d="M17 9L15 10V14L17 15V9Z"/>
                  <circle cx="12" cy="8" r="1.5" fill="rgba(255,255,255,0.3)"/>
                </svg>
              </div>
              <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                Launchapp
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link href="#contact" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Contact
            </Link>
          </nav>

          {/* Theme Toggle & Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <SunIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <MoonIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <SignedOut>
              <SignInButton>
                <button className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <Link 
                href="/sign-up" 
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Sign Up
              </Link>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDarkMode ? (
                <SunIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <MoonIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              ) : (
                <Bars3Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-800/50 shadow-lg mt-2">
          <div className="px-4 py-6 space-y-4">
            <Link href="/" className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Home
            </Link>
            <Link href="#contact" className="block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Contact
            </Link>
            <div className="pt-4 space-y-3">
              <SignedOut>
                <SignInButton>
                  <button className="w-full text-left text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                    Sign In
                  </button>
                </SignInButton>
                <Link 
                  href="/sign-up" 
                  className="block w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-md text-sm font-medium text-center hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                >
                  Sign Up
                </Link>
              </SignedOut>
              <SignedIn>
                <div className="flex justify-center">
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
