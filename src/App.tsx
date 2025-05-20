import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Work from './components/Work';
import About from './components/About';
import Resources from './components/Resources';
import Now from './components/Now';
import ThoughtsPage from './pages/ThoughtsPage';
import AuthModal from './components/AuthModal';
import { useState } from 'react';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  return (
    <Router>
      <Routes>
        <Route path="/thoughts" element={<ThoughtsPage />} />
        <Route path="/" element={
    <div className="relative">
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />
      <main>
        <Hero />
        <Work />
        <About />
              <Resources />
              <Now />
      </main>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
