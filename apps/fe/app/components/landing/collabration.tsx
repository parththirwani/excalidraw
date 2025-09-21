'use client';

import { ArrowRight, Check } from 'lucide-react';
import { AnimatedSection } from './utils';

export const Collaboration = () => (
  <section className="py-24 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <AnimatedSection>
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              Built for teams
            </h2>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              See your team's ideas come to life in real-time. Live cursors, instant updates, 
              and seamless collaboration make remote brainstorming natural.
            </p>
            <div className="space-y-4 mb-8">
              {[
                'Live cursor tracking',
                'Instant synchronization', 
                'Comment system',
                'Session recording'
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>
            <button className="group text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-2">
              <span>Learn more</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </AnimatedSection>
        <AnimatedSection delay={300}>
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium">A</div>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">B</div>
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">C</div>
                </div>
                <span className="text-xs text-gray-500">3 collaborators</span>
              </div>
              <div className="h-32 bg-gray-50 rounded border-2 border-dashed border-gray-200 flex items-center justify-center relative">
                <div className="absolute top-2 left-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                <div className="absolute top-8 right-4 w-2 h-2 bg-green-500 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-4 left-1/2 w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-700"></div>
                <span className="text-gray-400 text-sm">Live collaboration</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export default Collaboration;