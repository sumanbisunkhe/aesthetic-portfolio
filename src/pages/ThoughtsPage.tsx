import { useState } from 'react';
import Navbar from '../components/Navbar';
import Thoughts from '../components/Thoughts';
import AuthModal from '../components/AuthModal';

const ThoughtsPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="relative">
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />
      <main>
        <Thoughts />
      </main>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default ThoughtsPage; 