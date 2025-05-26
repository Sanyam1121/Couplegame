import React from 'react';
import { Heart, Share2, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Couple's Playdate",
        text: "Check out this fun couple's interactive game!",
        url: window.location.href
      }).catch(err => {
        console.error('Could not share:', err);
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Could not copy link:', err));
    }
  };
  
  return (
    <footer className="bg-white bg-opacity-90 backdrop-blur-sm py-6 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-1">
              Made with <Heart className="text-pink-500 w-4 h-4" /> in 2025
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleShare}
              className="flex items-center gap-1 text-gray-700 hover:text-pink-500 transition-colors"
            >
              <Share2 size={18} />
              <span>Share</span>
            </button>
            
            <a 
              href="https://github.com"
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-700 hover:text-pink-500 transition-colors"
            >
              <Github size={18} />
              <span>Source</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;