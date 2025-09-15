"use client";
import { useState, useEffect } from 'react';
import { 
  CloudArrowUpIcon, 
  DevicePhoneMobileIcon, 
  ArrowDownTrayIcon,
  CheckCircleIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

export default function ToolInterface() {
  const [formData, setFormData] = useState({
    websiteUrl: '',
    appName: '',
    appDescription: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoFileObject, setLogoFileObject] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // small helper to time step changes
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const buildingSteps = [
    "Saving app configuration...",
    "Extracting Flutter template...",
    "Configuring WebView settings...",
    "Generating app icons...",
    "Building Android APK...",
    "Optimizing app performance...",
    "Signing APK with certificate...",
    "Finalizing app package...",
    "App ready for download!"
  ];
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(URL.createObjectURL(file));
      setLogoFileObject(file);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setCurrentStep(0);
    setError(null);
    setDownloadUrl(null);
    
    try {
      // Require a logo upload; do not proceed silently without it
      if (!logoFileObject) {
        setIsGenerating(false);
        setCurrentStep(0);
        setError('Please upload a logo image before generating the app.');
        return;
      }

      let logoUrl = null;
      
      // Upload logo to Appwrite if file is selected
      if (logoFileObject) {
        const logoFormData = new FormData();
        logoFormData.append('file', logoFileObject);
        
        const uploadResponse = await fetch('/api/upload-logo', {
          method: 'POST',
          body: logoFormData,
        });
        
        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          logoUrl = uploadResult.fileUrl;
        } else {
          const errorData = await uploadResponse.json();
          throw new Error(`Logo upload failed: ${errorData.error || 'Unknown error'}`);
        }
      }
      
      // Progress deterministically to "Building Android APK..." (index 4) then pause
      // Move through steps 0 -> 3 with short delays
      for (let i = 0; i <= 3; i++) {
        setCurrentStep(i);
        // shorter delay for snappy UX on early steps
        // skip initial wait for i===0 so user sees immediate progress
        if (i !== 0) await wait(400);
      }
      // Pause at step 4 (Building Android APK...)
      setCurrentStep(4);

      // Make API call to generate app while step text paused at "Building Android APK..."
      const response = await fetch('/api/generate-app', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          websiteUrl: formData.websiteUrl,
          appName: formData.appName,
          logoFile: logoUrl
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate app');
      }

      const result = await response.json();
      
      if (result.success && result.downloadUrl) {
        setDownloadUrl(result.downloadUrl);
        // Quickly show the remaining steps (5..8) then close the overlay
        for (let i = 5; i < buildingSteps.length; i++) {
          setCurrentStep(i);
          await wait(350);
        }
        setIsGenerated(true);
      } else {
        throw new Error('No download URL received');
      }
    } catch (error) {
      console.error('Error generating app:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    console.log('Download button clicked');
    console.log('downloadUrl:', downloadUrl);
    
    if (downloadUrl) {
      console.log('Attempting to download from:', downloadUrl);
      setIsDownloading(true);
      
      try {
        // Use local API proxy to avoid CORS issues
        const filename = `${formData.appName || 'MyApp'}.apk`;
        const proxyUrl = `/api/download-apk?url=${encodeURIComponent(downloadUrl)}&filename=${encodeURIComponent(filename)}`;
        
        // Create a temporary link element and trigger download
        const link = document.createElement('a');
        link.href = proxyUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Reset download state after a delay
        setTimeout(() => setIsDownloading(false), 3000);
      } catch (error) {
        console.error('Download error:', error);
        setIsDownloading(false);
      }
    } else {
      console.error('No download URL available');
      alert('Download URL is not available. Please try generating the app again.');
    }
  };

  // Auto-scroll to download section when APK is ready
  useEffect(() => {
    if (downloadUrl && !isGenerating) {
      const downloadSection = document.getElementById('download-section');
      if (downloadSection) {
        downloadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [downloadUrl, isGenerating]);

  return (
    <section id="tool-interface" className="py-24 bg-gray-50 dark:bg-gray-900/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Loading Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="w-full max-w-7xl max-h-[90vh] overflow-hidden">
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 sm:p-6 lg:p-8 shadow-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    
                    {/* Main Loading Content */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      {/* Building Animation */}
                      <div className="mb-4 sm:mb-6">
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto">
                          <div className="absolute inset-0 border-2 sm:border-3 lg:border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                          <div className="absolute inset-0 border-2 sm:border-3 lg:border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
                          <div className="absolute inset-1 sm:inset-2 border border-transparent border-t-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                        </div>
                      </div>

                      {/* Current Step Text */}
                      <div className="min-h-[2rem] sm:min-h-[3rem] flex items-center justify-center mb-4 sm:mb-6 px-2">
                        <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse text-center">
                          {buildingSteps[currentStep]}
                        </p>
                      </div>

                      {/* Building Details - Scrollable */}
                      <div className="w-full max-w-lg lg:max-w-xl">
                        <div className="h-28 sm:h-40 lg:h-52 overflow-y-auto text-left pr-2" style={{ scrollbarWidth: 'thin' }}>
                          <div className="space-y-2">
                            {buildingSteps.slice(0, currentStep + 1).map((step, index) => (
                              <div key={index}>
                                <div className="flex items-start text-xs sm:text-sm">
                                  <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                  <span className={`${index === currentStep ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {step}
                                  </span>
                                </div>
                                {step === "Building Android APK..." && index === currentStep && (
                                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 ml-5 sm:ml-6">
                                    This could take 5-6 minutes. Do not close your browser window.
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Ad Space (Hidden on mobile) */}
                    <div className="hidden lg:flex lg:w-72 xl:w-80 flex-col justify-center">
                      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 h-full flex flex-col justify-center">
                        <div className="text-center">
                          <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">Advertisement</p>
                          <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <p className="text-gray-400 dark:text-gray-500 text-base">
                              Ad content will appear here<br/>
                              <span className="text-sm">(320x400 banner space)</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Build Your App Now
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Configure your app settings and generate your mobile app instantly
          </p>
        </div>

        {/* Authentication Check */}
        <SignedOut>
          <div className="text-center py-16">
            <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
              <CogIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Sign In Required
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please sign in to access the app generation tool and create your mobile app.
              </p>
              <SignInButton>
                <button className="w-full py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                  Sign In to Continue
                </button>
              </SignInButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>

        {/* If build is completed, show a dedicated download UI and hide the full form/preview */}
        {isGenerated && downloadUrl ? (
          <div id="download-section" className="mt-12 text-center py-20">
            <div className="max-w-2xl mx-auto bg-green-50 dark:bg-gray-900 border-2 border-green-200 dark:border-green-800 p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-200">Your App is Ready! 🎉</h2>
              <p className="mb-6 text-green-700 dark:text-green-300">Download your Android APK file below.</p>
              <div className="space-y-4">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isDownloading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Preparing Download...
                    </>
                  ) : (
                    <>
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Download APK
                    </>
                  )}
                </button>
                <div className="mt-8">
                  <button
                    onClick={() => {
                      setDownloadUrl(null);
                      setFormData({ websiteUrl: '', appName: '', appDescription: '' });
                      setLogoFile(null);
                      setLogoFileObject(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Convert Another App
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Form Section */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
            <div className="flex items-center mb-8">
              <CogIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                App Configuration
              </h3>
            </div>

            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Website URL *
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  value={formData.websiteUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  required
                />
              </div>

              {/* App Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  App Name *
                </label>
                <input
                  type="text"
                  name="appName"
                  value={formData.appName}
                  onChange={handleInputChange}
                  placeholder="My Awesome App"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  required
                />
              </div>

              {/* App Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  App Description
                </label>
                <textarea
                  name="appDescription"
                  value={formData.appDescription}
                  onChange={handleInputChange}
                  placeholder="Brief description of your app..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm resize-none"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  App Logo
                </label>
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {logoFile ? (
                      <div className="relative">
                        <img
                          src={logoFile}
                          alt="App logo preview"
                          className="mx-auto h-16 w-16 rounded-md object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setLogoFile(null)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <>
                        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 dark:text-gray-400">
                          <label
                            htmlFor="logo-upload"
                            className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-gray-600 dark:text-gray-400 hover:text-gray-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="logo-upload"
                              name="logo-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleLogoUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, SVG up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Primary color removed */}

              {/* Generate Button */}
              <button
                type="submit"
                disabled={
                  isGenerating ||
                  !formData.websiteUrl ||
                  !formData.appName ||
                  !logoFile
                }
                className="w-full py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-gray-900 mr-2"></div>
                    Generating...
                  </span>
                ) : (
                  'Generate App'
                )}
              </button>
            </form>

            {/* Features List */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What you&apos;ll get:
              </h4>
              <div className="space-y-3">
                {[
                  'Cross-platform mobile app',
                  'Professional app icon',
                  'Optimized WebView performance',
                  'App store ready package'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-8">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                App Preview
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                See how your app will look
              </p>
            </div>

            {/* App Icon Preview */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 text-center">
                App Icon
              </h4>
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                  {logoFile ? (
                    <img
                      src={logoFile}
                      alt="App Icon"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white text-2xl">🌐</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                Light and dark theme previews
              </p>
            </div>

            {/* Phone Mockups - Light and Dark Theme Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center">
              {/* Light theme mockup */}
              <div className="relative w-64 h-[500px] bg-gray-300 rounded-[2.5rem] p-2 shadow-lg">
                {/* Screen */}
                <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-white">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-gray-200 rounded-b-lg z-10"></div>

                  {/* Splash Screen Content */}
                  <div className="w-full h-full flex flex-col items-center justify-center px-8">
                    {/* Logo */}
                    <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6 shadow-lg">
                      {logoFile ? (
                        <img
                          src={logoFile}
                          alt="App Logo"
                          className="w-20 h-20 rounded-2xl object-cover"
                        />
                      ) : (
                        <span className="text-gray-700 text-4xl">🌐</span>
                      )}
                    </div>
                    
                    {/* App Name */}
                    <h2 className="text-gray-900 font-bold text-xl mb-2 text-center">
                      {formData.appName || "Your App Name"}
                    </h2>
                    
                    {/* Loading indicator */}
                    <div className="flex space-x-1 mt-8">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gray-300 rounded-full"></div>
                </div>
              </div>

              {/* Dark theme mockup */}
              <div className="relative w-64 h-[500px] bg-gray-800 rounded-[2.5rem] p-2 shadow-lg">
                {/* Screen */}
                <div className="w-full h-full rounded-[2rem] overflow-hidden relative bg-gray-900">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-5 bg-gray-800 rounded-b-lg z-10"></div>

                  {/* Splash Screen Content */}
                  <div className="w-full h-full flex flex-col items-center justify-center px-8">
                    {/* Logo */}
                    <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg">
                      {logoFile ? (
                        <img
                          src={logoFile}
                          alt="App Logo"
                          className="w-20 h-20 rounded-2xl object-cover"
                        />
                      ) : (
                        <span className="text-white text-4xl">🌐</span>
                      )}
                    </div>
                    
                    {/* App Name */}
                    <h2 className="text-white font-bold text-xl mb-2 text-center">
                      {formData.appName || "Your App Name"}
                    </h2>
                    
                    {/* Loading indicator */}
                    <div className="flex space-x-1 mt-8">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>
            
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
              Splash screen preview
            </p>

            {/* Download Section */}
            {isGenerated && downloadUrl && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-lg text-sm font-medium mb-4">
                  <CheckCircleIcon className="h-4 w-4 mr-2 text-green-600" />
                  App Generated Successfully!
                </div>

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors flex items-center justify-center"
                >
                  {isDownloading ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Preparing Download...
                    </>
                  ) : (
                    <>
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Download APK
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Compatible with Android 5.0+ • Ready for Google Play
                </p>
              </div>
            )}

            {/* Error Section */}
            {error && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 rounded-lg text-sm font-medium mb-4">
                  <span className="mr-2">❌</span>
                  Build Failed
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                  {error}
                </p>
                <button
                  onClick={() => {
                    setError(null);
                    setIsGenerated(false);
                  }}
                  className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
        )}
        </SignedIn>
      </div>
    </section>
  );
}
