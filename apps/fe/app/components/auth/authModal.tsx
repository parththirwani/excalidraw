'use client';
import { useState } from 'react';
import SignUpModal from './signup';
import SignInModal from './signin';


interface Props {
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
}

export default function AuthManager({ initialMode = 'signin', onClose }: Props) {
  const [currentMode, setCurrentMode] = useState(initialMode);

  const handleSwitchToSignUp = () => setCurrentMode('signup');
  const handleSwitchToSignIn = () => setCurrentMode('signin');

  if (currentMode === 'signup') {
    return (
      <SignUpModal
        onClose={onClose}
        onSwitchToSignIn={handleSwitchToSignIn}
      />
    );
  }

  return (
    <SignInModal
      onClose={onClose}
      onSwitchToSignUp={handleSwitchToSignUp}
    />
  );
}