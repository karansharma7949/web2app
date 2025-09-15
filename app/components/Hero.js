import { ArrowDownIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function Hero() {
  const scrollToTool = () => {
    document.getElementById('tool-interface').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            Transform websites into mobile apps
          </div>

          {/* Main heading */}
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Convert Any Website to
            <span className="block text-gray-600 dark:text-gray-400">Mobile App in Minutes</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            Create professional mobile apps from any website without coding. 
            Generate Android APKs using webview.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={scrollToTool}
              className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-md hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Start Building Free
            </button>
            <button className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
              View Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">10,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Apps Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">5 Min</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Build Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
          </div>

          {/* Features List */}
          <div className="flex flex-wrap justify-center gap-6 mt-16">
            {[
              'No coding required',
              'Android support',
              'Play store ready',
              'Custom branding'
            ].map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2" />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
