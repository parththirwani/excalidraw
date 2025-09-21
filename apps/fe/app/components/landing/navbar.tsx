'use client';
import { useState } from 'react';
import { PenTool } from 'lucide-react';
import AuthManager from '../auth/authModal';


export const Navbar = () => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | null>(null);

  const handleCloseAuth = () => {
    setAuthMode(null);
  };

  const showAuthModal = authMode !== null;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <PenTool className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">Collab-draw</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                onClick={() => setAuthMode('signin')}
              >
                Sign in
              </button>
              <button
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                onClick={() => setAuthMode('signup')}
              >
                Get started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthManager
          onClose={handleCloseAuth}
          initialMode={authMode || 'signin'} // Use the actual authMode state
        />
      )}
    </>
  );
};

export default Navbar;