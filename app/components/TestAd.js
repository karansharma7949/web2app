"use client";
import { useEffect, useRef, useState } from 'react';

export default function TestAd({ slot }) {
  const adRef = useRef(null);
  const [adStatus, setAdStatus] = useState('loading');
  const adClient = 'ca-pub-3648081589447801';
  const adSlot = slot || '2255847145';

  useEffect(() => {
    console.log('🧪 TestAd: Component mounted');

    // Simple test - just show that the container works
    setTimeout(() => {
      console.log('🧪 TestAd: Showing test content');
      setAdStatus('test_content');
    }, 1000);

  }, []);

  return (
    <div className="test-ad-container" style={{
      width: '100%',
      maxWidth: '100%',
      height: '320px',
      overflow: 'hidden',
      boxSizing: 'border-box',
      border: '2px solid #007acc',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        padding: '20px'
      }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>
          🎯 Test Ad Container
        </h3>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
          This is a test container to verify the layout works.
        </p>
        <p style={{ margin: '0', fontSize: '12px', opacity: '0.8' }}>
          Real AdSense ads will appear here when deployed to production.
        </p>
        <div style={{
          marginTop: '15px',
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '4px',
          fontSize: '11px'
        }}>
          Client: {adClient}<br/>
          Slot: {adSlot}
        </div>
      </div>
    </div>
  );
}
