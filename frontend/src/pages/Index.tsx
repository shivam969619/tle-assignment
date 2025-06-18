
import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudentTable from '../components/StudentTable';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Student Management System</h1>
          <p className="text-xl mb-8 opacity-90">Track competitive programming progress and manage student data efficiently</p>
          <div className="flex justify-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-2xl font-bold">50+</h3>
              <p className="text-sm opacity-75">Active Students</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-2xl font-bold">1200+</h3>
              <p className="text-sm opacity-75">Average Rating</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="text-2xl font-bold">95%</h3>
              <p className="text-sm opacity-75">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-12">
        <StudentTable />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
