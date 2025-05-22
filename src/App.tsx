import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Work from './components/Work';
import About from './components/About';
import Resources from './components/Resources';
import Now from './components/Now';
import Thoughts from './components/Thoughts';
import BlogPostView from './components/BlogPost';
import Contact from './components/Contact';
import AuthModal from './components/AuthModal';
import { Toaster } from 'react-hot-toast';

// ScrollToTop component to handle scroll behavior
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Handle scroll after navigation
    if (location.state?.scrollTo) {
      const targetId = location.state.scrollTo;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Scroll to top on route change
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
};

// BlogPostWrapper component to handle navigation and provide context
const BlogPostWrapper = ({ setIsAuthModalOpen }: { setIsAuthModalOpen: (isOpen: boolean) => void }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-primary-900 min-h-screen">
      <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />
      <BlogPostView onBack={() => navigate('/thoughts')} />
    </div>
  );
};

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2000,
          style: {
            background: 'rgba(26, 26, 26, 0.95)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(8px)',
            maxWidth: '320px',
            width: '100%',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            margin: '0 160px 16px 0',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
            style: {
              background: 'linear-gradient(to right, rgba(74, 222, 128, 0.1), rgba(26, 26, 26, 0.95))',
              borderLeft: '3px solid #4ade80',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              background: 'linear-gradient(to right, rgba(239, 68, 68, 0.1), rgba(26, 26, 26, 0.95))',
              borderLeft: '3px solid #ef4444',
            },
          },
        }}
      />
      <Routes>
        <Route path="/thoughts/:slug" element={<BlogPostWrapper setIsAuthModalOpen={setIsAuthModalOpen} />} />
        <Route path="/thoughts" element={
          <div className="bg-primary-900 min-h-screen">
            <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />
            <Thoughts />
          </div>
        } />
        <Route path="/" element={
          <div className="relative">
            <Navbar onOpenAuthModal={() => setIsAuthModalOpen(true)} />
            <main>
              <Hero />
              <Work />
              <About />
              <Resources />
              <Now />
              <Contact />
            </main>
          </div>
        } />
      </Routes>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </Router>
  );
}

export default App;
