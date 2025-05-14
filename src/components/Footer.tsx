
import React from "react";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gaming-purple/20 bg-gaming-dark-purple/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gaming-purple flex items-center justify-center">
                <Trophy className="w-5 h-5 text-gaming-dark" />
              </div>
              <span className="text-xl font-bold text-gradient-primary">FireTourneys</span>
            </Link>
            <p className="text-white/70 text-sm mb-4">
              The ultimate Free Fire tournament platform. Join competitions, follow live streams, and climb the ranks!
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gaming-purple/30 transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gaming-purple/30 transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gaming-purple/30 transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.170 5.009c-1.98 0-3.58 1.7-3.56 3.56 0 1.98 1.6 3.58 3.56 3.58 1.96 0 3.58-1.61 3.58-3.58s-1.58-3.56-3.58-3.56zm10.6 3.56c0-1.86-1.5-3.39-3.36-3.39-1.86 0-3.36 1.52-3.36 3.39 0 1.86 1.5 3.39 3.36 3.39 1.86 0 3.36-1.52 3.36-3.39zm2.73 0c0 3.37-1.38 5.1-3.82 5.1-.82 0-1.6-.34-2.28-1.03l-.2.83h-2.26l.6-12.28 2.24-.47-.18 5c.72-.64 1.5-.94 2.25-.94 2.42 0 3.66 1.74 3.66 5.1zm-2.21 0c0-2.24-.64-3.27-1.85-3.27-.7 0-1.37.37-2.05 1.07l-.19 4.4c.64.73 1.32 1.07 1.96 1.07 1.31 0 2.13-1.05 2.13-3.27zm-10.63 0c0 3.37-1.38 5.1-3.82 5.1-.82 0-1.6-.34-2.28-1.03l-.2.83h-2.26l.6-12.28 2.24-.47-.18 5c.72-.64 1.5-.94 2.25-.94 2.42 0 3.66 1.74 3.66 5.1zm-2.21 0c0-2.24-.64-3.27-1.85-3.27-.7 0-1.37.37-2.05 1.07l-.19 4.4c.64.73 1.32 1.07 1.96 1.07 1.31 0 2.13-1.05 2.13-3.27z"></path>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-gaming-purple/30 transition-colors">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.543 6.498c-.265-1.177-1.044-2.104-2.034-2.417-1.806-.587-9.036-.587-9.036-.587s-7.23 0-9.036.587c-.99.313-1.77 1.24-2.034 2.417-.313 2.066-.391 4.243-.391 6.3 0 2.056.078 4.233.391 6.3.265 1.177 1.044 2.104 2.034 2.417 1.806.587 9.036.587 9.036.587s7.23 0 9.036-.587c.99-.313 1.77-1.24 2.034-2.417.313-2.066.391-4.243.391-6.3 0-2.056-.078-4.234-.391-6.3zm-13.458 10.167v-7.734l6.267 3.867z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/tournaments" className="text-white/70 hover:text-gaming-purple text-sm transition-colors">Tournaments</Link></li>
              <li><Link to="/teams" className="text-white/70 hover:text-gaming-purple text-sm transition-colors">Teams</Link></li>
              <li><Link to="/schedule" className="text-white/70 hover:text-gaming-purple text-sm transition-colors">Schedule</Link></li>
              <li><Link to="/streams" className="text-white/70 hover:text-gaming-purple text-sm transition-colors">Live Streams</Link></li>
              <li><Link to="/news" className="text-white/70 hover:text-gaming-purple text-sm transition-colors">News</Link></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-gaming-purple text-sm transition-colors">Rules & Regulations</a></li>
              <li><a href="#" className="text-white/70 hover:text-gaming-purple text-sm transition-colors">Anti-Cheat Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-gaming-purple text-sm transition-colors">How to Register</a></li>
              <li><a href="#" className="text-white/70 hover:text-gaming-purple text-sm transition-colors">FAQ</a></li>
              <li><a href="#" className="text-white/70 hover:text-gaming-purple text-sm transition-colors">Contact Support</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-white/70 text-sm">Email: info@firetourneys.com</li>
              <li className="text-white/70 text-sm">Discord: firetourneys</li>
              <li className="text-white/70 text-sm">Phone: +91 98765 43210</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm mb-4 md:mb-0">
            © 2025 FireTourneys. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/50 text-sm hover:text-gaming-purple transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/50 text-sm hover:text-gaming-purple transition-colors">Terms of Service</a>
            <a href="#" className="text-white/50 text-sm hover:text-gaming-purple transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
