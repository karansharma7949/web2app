"use client";
import { useEffect, useRef, useState } from 'react';

export default function GoogleAdSense({
  slot,
  style = { display: 'block' },
  format = 'auto',
  responsive = 'true',
  className = ''
}) {
  const adRef = useRef(null);
  const [adStatus, setAdStatus] = useState('loading');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const adClient = 'ca-pub-3648081589447801';
  const adSlot = slot || '2255847145';

  // Load AdSense script dynamically to avoid hydration issues
  useEffect(() => {
    const loadAdSenseScript = () => {
      // Check if script is already loaded (should be loaded from layout.js)
      if (document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
        console.log('✅ AdSense script already loaded from head section');
        setScriptLoaded(true);
        return;
      }

      // Fallback: Create and load the script if not found
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3648081589447801';
      script.crossOrigin = 'anonymous';
      script.async = true;

      script.onload = () => {
        console.log('✅ AdSense script loaded successfully (fallback)');
        setScriptLoaded(true);
      };

      script.onerror = () => {
        console.error('❌ AdSense script failed to load (fallback)');
        setAdStatus('script_error');
      };

      document.head.appendChild(script);
    };

    loadAdSenseScript();
  }, []);

  useEffect(() => {
    if (!adRef.current) {
      return;
    }

    // Check if this specific ad has already been processed
    if (adRef.current.dataset.adsenseProcessed) {
      return;
    }

    // Function to initialize the ad
    const initializeAd = () => {
      if (!adRef.current) return;

      // Check if adsbygoogle is available
      if (typeof window.adsbygoogle === 'undefined') {
        console.log('❌ AdSense: adsbygoogle not available');
        setAdStatus('script_not_loaded');
        return false;
      }

      console.log('✅ AdSense: adsbygoogle available, length:', window.adsbygoogle.length);

      try {
        console.log('🎯 AdSense: Attempting to push ad with data:', {
          adClient,
          adSlot,
          format,
          responsive
        });
        // Initialize the ad
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        // Mark this ad as processed
        adRef.current.dataset.adsenseProcessed = 'true';
        setAdStatus('initialized');
        console.log('✅ AdSense: Ad initialized successfully');

        // Check if ad loaded after a delay
        setTimeout(() => {
          if (adRef.current) {
            if (adRef.current.innerHTML.trim() === '') {
              console.log('⚠️ AdSense: No content loaded after 3 seconds');
              setAdStatus('no_content');
            } else {
              console.log('✅ AdSense: Content loaded successfully');
              setAdStatus('has_content');
            }
          }
        }, 3000);

        return true;
      } catch (error) {
        console.error('❌ AdSense: Error initializing ad:', error);
        setAdStatus('error');
        return false;
      }
    };

    // Only initialize if script is loaded
    if (scriptLoaded) {
      // Try to initialize immediately
      if (initializeAd()) {
        return;
      }

      // If not available, retry every second for up to 10 seconds
      let retryCount = 0;
      const maxRetries = 10;

      const retryInterval = setInterval(() => {
        retryCount++;

        if (initializeAd() || retryCount >= maxRetries) {
          clearInterval(retryInterval);
          if (retryCount >= maxRetries) {
            setAdStatus('timeout');
          }
        }
      }, 1000);

      // Cleanup interval on component unmount
      return () => clearInterval(retryInterval);
    } else {
      setAdStatus('waiting_for_script');
    }
  }, [scriptLoaded]);

  // MutationObserver to prevent AdSense from injecting unwanted styles
  useEffect(() => {
    if (!adRef.current) return;
    
    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          // Prevent AdSense from injecting height: auto !important
          const target = mutation.target;
          if (target.style.height === 'auto') {
            target.style.height = '';
          }
          if (target.style.overflow === 'hidden') {
            target.style.overflow = 'visible';
          }
        }
      });
    });
    
    observer.observe(adRef.current, {
      attributes: true,
      attributeFilter: ['style']
    });
    
    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className={`adsense-container ${className}`} style={{
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',
      ...style
    }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: '320px',
          minHeight: '250px',
          overflow: 'hidden',
          boxSizing: 'border-box',
          margin: '0 auto'
        }}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      >
        {/* Only show fallback if ad hasn't loaded content */}
      {adStatus !== 'has_content' && (
        <div className="text-gray-400 text-sm p-4 text-center" style={{
          height: '320px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #ccc',
          borderRadius: '4px'
        }}>
          <div className="text-center">
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">Advertisement</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {adStatus === 'loading' && 'Loading ads...'}
              {adStatus === 'waiting_for_script' && 'Loading ad service...'}
              {adStatus === 'script_error' && 'Ad service temporarily unavailable'}
              {adStatus === 'no_content' && 'No ads available at the moment'}
              {adStatus === 'error' && 'Advertisement unavailable'}
              {adStatus === 'timeout' && 'Ad service timeout'}
              {adStatus === 'script_not_loaded' && 'Loading ad service...'}
            </p>
          </div>
        </div>
      )}  
      </ins>
    </div>
  );
}
