// AdSense Debug Script - Add this to your browser console to check AdSense status
console.log('🔍 AdSense Debug Check:');
console.log('1. Script loaded:', typeof window !== 'undefined' && document.querySelector('script[src*="pagead2.googlesyndication.com"]') !== null);
console.log('2. adsbygoogle available:', typeof window !== 'undefined' && typeof window.adsbygoogle !== 'undefined');
console.log('3. adsbygoogle length:', typeof window !== 'undefined' && window.adsbygoogle ? window.adsbygoogle.length : 'N/A');

// Check for common AdSense issues
if (typeof window !== 'undefined') {
  console.log('4. AdSense client:', window.adsbygoogle ? 'Available' : 'Not loaded');
  console.log('5. Current domain:', window.location.hostname);
  console.log('6. Is localhost?', window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
}

// AdSense will only show real ads on:
// ✅ Live domains (not localhost)
// ✅ Approved AdSense accounts
// ✅ Approved ad units
// ✅ No ad blockers active
// ✅ Sufficient site content

console.log('📝 Expected behavior:');
console.log('- Test container should show immediately');
console.log('- Real AdSense ads will only show on live domains');
console.log('- Check browser console for AdSense initialization logs');
