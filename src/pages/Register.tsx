
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 py-8">
          <div className="gamer-card p-6 space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gradient mb-2">Create Account</h1>
              <p className="text-white/70">Join the FireTourneys community</p>
            </div>
            
            <RegisterForm />
            
            <div className="text-center text-sm text-white/70">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-gaming-purple hover:text-gaming-purple-bright">
                  Sign in
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

export default Register;
