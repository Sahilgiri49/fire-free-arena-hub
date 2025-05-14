
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 py-8">
          <div className="gamer-card p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gradient mb-2">Sign In</h1>
              <p className="text-white/70">Sign in to your FireTourneys account</p>
            </div>
            
            <LoginForm />
            
            <div className="text-center text-sm text-white/70">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="text-gaming-purple hover:text-gaming-purple-bright">
                  Create one now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
