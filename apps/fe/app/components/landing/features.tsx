'use client';

import { 
  Zap, 
  Users, 
  InfinityIcon, 
  Square, 
  Type, 
  Move, 
  PenTool, 
  RotateCcw, 
  Download 
} from 'lucide-react';
import { AnimatedSection } from './utils';

export const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning fast",
      description: "Optimized performance ensures smooth drawing and instant response."
    },
    {
      icon: Users,
      title: "Real-time collaboration",
      description: "Multiple users can draw together with live cursors and sync."
    },
    {
      icon: InfinityIcon,
      title: "Infinite canvas",
      description: "Never run out of space with our adaptive infinite canvas."
    },
    {
      icon: Square,
      title: "Smart shapes",
      description: "Create perfect shapes with intelligent recognition."
    },
    {
      icon: Type,
      title: "Rich text",
      description: "Add typography with full formatting control."
    },
    {
      icon: Move,
      title: "Drag & resize",
      description: "Intuitive manipulation with precise positioning."
    },
    {
      icon: PenTool,
      title: "Freehand drawing",
      description: "Natural drawing with pressure sensitivity."
    },
    {
      icon: RotateCcw,
      title: "Unlimited undo",
      description: "Comprehensive history that remembers everything."
    },
    {
      icon: Download,
      title: "Export anywhere",
      description: "Export as PNG, SVG, or PDF with full quality."
    }
  ];

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Everything you need to create
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Powerful features designed for modern visual collaboration
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <AnimatedSection key={index} delay={index * 100}>
              <div className="bg-white p-6 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 shadow-sm">
                <feature.icon className="w-6 h-6 text-indigo-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;