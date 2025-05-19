import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Work from './components/Work';
import About from './components/About';
import Thoughts from './components/Thoughts';
import AuthModal from './components/AuthModal';
import { useState } from 'react';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  return (
    <div className="relative">
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />
      <main>
        <Hero />
        <Work />
        <About />
        <Thoughts />
      </main>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default App;
