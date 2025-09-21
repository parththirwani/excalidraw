'use client';

import { ArrowRight, PenTool, Play } from 'lucide-react';
import { AnimatedSection } from './utils';

export const Hero = () => (
  <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <AnimatedSection>
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 tracking-tight">
            Draw Together,
            <br />
            <span className="text-indigo-600">Effortlessly</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-8 leading-relaxed max-w-2xl mx-auto">
            The simplest way for teams to brainstorm, wireframe, and create visually.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="group bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium flex items-center space-x-2">
              <span>Start drawing</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors font-medium">
              <Play className="w-4 h-4" />
              <span>Watch demo</span>
            </button>
          </div>
        </div>
      </AnimatedSection>
      <AnimatedSection delay={300}>
        <div className="relative max-w-5xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 shadow-sm">
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500">collab-draw.com</div>
                <div className="w-16"></div>
              </div>
              <div className="h-96 bg-white flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-transparent"></div>
                <div className="text-center">
                  <PenTool className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">Canvas ready</p>
                </div>
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-medium">A</div>
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium">B</div>
                  <div className="text-xs text-gray-500">2 online</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  </section>
);

export default Hero;