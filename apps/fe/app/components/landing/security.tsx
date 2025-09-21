'use client';

import { Shield, Cloud, Check } from 'lucide-react';
import { AnimatedSection } from './utils';

export const Security = () => (
  <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
    <div className="max-w-7xl mx-auto">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Secure by design
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Local-first architecture with optional cloud sync. Your data, your control.
          </p>
        </div>
      </AnimatedSection>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatedSection delay={100}>
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <Shield className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Local-first storage</h3>
            <p className="text-gray-500 mb-6">
              Your drawings are stored locally first, ensuring privacy and instant access.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>End-to-end encryption</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Offline functionality</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-600" />
                <span>Zero data collection</span>
              </li>
            </ul>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={200}>
          <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <Cloud className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Optional cloud sync</h3>
            <p className="text-gray-500 mb-6">
              Seamlessly sync across devices when you need it. Always secure.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-indigo-600" />
                <span>Cross-device sync</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-indigo-600" />
                <span>Automatic backups</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-indigo-600" />
                <span>Team collaboration</span>
              </li>
            </ul>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export default Security;