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

// BlogPostWrapper component to handle navigation
const BlogPostWrapper = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-primary-900 min-h-screen">
      <Navbar onOpenAuthModal={() => {}} />
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
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
      <Routes>
        <Route path="/thoughts/:slug" element={<BlogPostWrapper />} />
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
