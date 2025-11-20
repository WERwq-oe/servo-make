import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, BarChart3, Share2 } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans selection:bg-indigo-500 selection:text-white">
            {/* Navbar */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
                <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                    Servo Make
                </div>
                <div className="space-x-4">
                    <Link to="/create" className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-colors font-medium">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
                    Create Surveys that <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        People Actually Enjoy
                    </span>
                </h1>
                <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Build beautiful, interactive surveys in minutes. Collect responses, analyze data, and share with a unique URL. No coding required.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/create" className="group px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-all flex items-center gap-2 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                        Create a Survey
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-32 text-left">
                    <FeatureCard
                        icon={<CheckCircle2 className="w-8 h-8 text-emerald-400" />}
                        title="Easy Editor"
                        description="Drag-and-drop interface with rich text formatting and multiple question types."
                    />
                    <FeatureCard
                        icon={<Share2 className="w-8 h-8 text-blue-400" />}
                        title="Instant Sharing"
                        description="Get a unique URL hosted on GitHub Pages instantly. Share it anywhere."
                    />
                    <FeatureCard
                        icon={<BarChart3 className="w-8 h-8 text-purple-400" />}
                        title="Real-time Analytics"
                        description="Watch responses roll in with our beautiful, real-time dashboard."
                    />
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/80 transition-colors">
            <div className="mb-4 p-3 bg-slate-900/50 rounded-xl w-fit">{icon}</div>
            <h3 className="text-xl font-bold mb-2 text-slate-100">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{description}</p>
        </div>
    );
}
