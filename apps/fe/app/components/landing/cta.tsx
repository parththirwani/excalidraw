'use client';

import { AnimatedSection } from './utils';

export const CTA = () => (
  <section className="py-24 px-4 sm:px-6 lg:px-8">
    <div className="max-w-4xl mx-auto text-center">
      <AnimatedSection>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
          Start creating today
        </h2>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          Join thousands of teams using Collab-draw for visual collaboration.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
            Get started free
          </button>
          <button className="border border-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:border-gray-300 hover:text-gray-800 transition-colors font-medium">
            Contact sales
          </button>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default CTA;