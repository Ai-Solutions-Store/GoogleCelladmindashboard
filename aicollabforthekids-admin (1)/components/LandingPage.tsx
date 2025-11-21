import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Zap, ShieldCheck, Rocket, CheckCircle, Users, Globe, Sparkles, ArrowRight } from './IconComponents';
import PaymentModal from './PaymentModal';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string; id: string } | null>(null);

    const pricingTiers = [
        {
            id: 'free-tier',
            name: 'Free',
            price: '$0',
            period: 'Forever',
            features: [
                'Basic Profile',
                '5 Matches/Day',
                'Standard Support',
                'Ad-Supported'
            ],
            color: 'from-slate-700 to-slate-800',
            borderColor: 'border-slate-600'
        },
        {
            id: 'premium-tier',
            name: 'Premium',
            price: '$19',
            period: '/month',
            features: [
                'Unlimited Matches',
                'Priority Support',
                'Advanced Filters',
                'No Ads',
                'Read Receipts'
            ],
            color: 'from-purple-600 to-indigo-700',
            borderColor: 'border-purple-500',
            popular: true
        },
        {
            id: 'vip-tier',
            name: 'VIP',
            price: '$49',
            period: '/month',
            features: [
                'All Premium Features',
                'AI Date Concierge',
                'Profile Boost',
                'Exclusive Events',
                'White-Glove Support'
            ],
            color: 'from-green-600 to-emerald-700',
            borderColor: 'border-green-500'
        }
    ];

    const handlePlanSelection = (plan: typeof pricingTiers[0]) => {
        if (plan.name === 'Free') {
            navigate('/dashboard');
        } else {
            setSelectedPlan({ name: plan.name, price: plan.price, id: plan.id });
            setPaymentModalOpen(true);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-slate-900 text-white overflow-x-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 backdrop-blur-md bg-black/30 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Heart className="w-8 h-8 text-[#39FF14] fill-[#39FF14] animate-pulse" />
                        <span className="text-2xl font-black tracking-tight">YOU & I NOT AI</span>
                    </div>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-all border border-white/20"
                    >
                        Dashboard
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#39FF14]/20 border border-[#39FF14] rounded-full mb-8 animate-pulse">
                    <ShieldCheck className="w-5 h-5 text-[#39FF14]" />
                    <span className="text-[#39FF14] font-bold text-sm uppercase tracking-wider">50% Profits → Shriners Children's Hospitals</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-6 leading-none">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#39FF14] via-purple-400 to-blue-400 animate-gradient">
                        HYPER-WARP
                    </span>
                    <span className="block mt-2">DATING</span>
                    <span className="block text-[#39FF14] text-5xl md:text-7xl mt-2">FOR THE KIDS</span>
                </h1>

                <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Where <span className="text-[#39FF14] font-bold">AI-powered matching</span> meets <span className="text-[#39FF14] font-bold">human verification</span>. 
                    Every connection you make helps heal a child.
                </p>

                <button 
                    onClick={() => navigate('/dashboard')}
                    className="group relative px-12 py-6 bg-gradient-to-r from-[#39FF14] to-green-500 hover:from-green-500 hover:to-[#39FF14] rounded-full font-black text-2xl text-black shadow-[0_0_50px_rgba(57,255,20,0.5)] transition-all hover:scale-110 hover:shadow-[0_0_80px_rgba(57,255,20,0.8)] flex items-center gap-4 mx-auto"
                >
                    <Heart className="w-8 h-8 fill-black" />
                    START YOUR JOURNEY
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                </button>

                <p className="text-slate-400 mt-6 text-sm">
                    Join <span className="text-white font-bold">50,000+</span> verified humans finding real love
                </p>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                    Why We're Different
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Users className="w-12 h-12 text-purple-400" />,
                            title: '100% Human Verified',
                            description: 'Every profile passes multi-step verification. No bots, no catfish, no AI impersonators.'
                        },
                        {
                            icon: <Zap className="w-12 h-12 text-[#39FF14]" />,
                            title: 'AI-Powered Matching',
                            description: 'Gemini AI analyzes 50+ compatibility factors to find your perfect match in seconds.'
                        },
                        {
                            icon: <Heart className="w-12 h-12 text-pink-500 fill-pink-500" />,
                            title: 'Dating for Good',
                            description: 'Every subscription directly funds life-saving care at Shriners Children\'s Hospitals.'
                        }
                    ].map((feature, i) => (
                        <div 
                            key={i}
                            className="group p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl hover:bg-white/10 hover:border-purple-500/50 transition-all hover:scale-105"
                        >
                            <div className="mb-6">{feature.icon}</div>
                            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-4xl md:text-5xl font-black text-center mb-4">
                    Choose Your Plan
                </h2>
                <p className="text-center text-slate-400 mb-16 text-lg">
                    All plans support our mission. Premium unlocks the full experience.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingTiers.map((tier, i) => (
                        <div 
                            key={i}
                            className={`relative p-8 bg-gradient-to-br ${tier.color} rounded-3xl border-2 ${tier.borderColor} ${tier.popular ? 'scale-105 shadow-[0_0_50px_rgba(168,85,247,0.5)]' : ''}`}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-[#39FF14] text-black font-black text-sm rounded-full">
                                    MOST POPULAR
                                </div>
                            )}
                            
                            <h3 className="text-2xl font-black mb-2">{tier.name}</h3>
                            <div className="mb-6">
                                <span className="text-5xl font-black">{tier.price}</span>
                                <span className="text-slate-300 text-lg">{tier.period}</span>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {tier.features.map((feature, j) => (
                                    <li key={j} className="flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-[#39FF14]" />
                                        <span className="text-slate-200">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button 
                                onClick={() => handlePlanSelection(tier)}
                                className={`w-full py-3 rounded-xl font-bold transition-all ${
                                    tier.popular 
                                        ? 'bg-[#39FF14] text-black hover:bg-green-400' 
                                        : 'bg-white/20 hover:bg-white/30 border border-white/30'
                                }`}
                            >
                                {tier.name === 'Free' ? 'Start Free' : 'Subscribe Now'}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { icon: <Users className="w-8 h-8" />, value: '50,000+', label: 'Active Members' },
                        { icon: <Heart className="w-8 h-8 fill-pink-500" />, value: '12,450', label: 'Success Stories' },
                        { icon: <ShieldCheck className="w-8 h-8" />, value: '98%', label: 'Human Verified' },
                        { icon: <Globe className="w-8 h-8" />, value: '$2.4M', label: 'Donated to Charity' }
                    ].map((stat, i) => (
                        <div key={i} className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
                            <div className="flex justify-center mb-3 text-[#39FF14]">{stat.icon}</div>
                            <div className="text-4xl font-black mb-2">{stat.value}</div>
                            <div className="text-slate-400 text-sm uppercase tracking-wider">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
                <div className="p-12 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-md border border-purple-500/30 rounded-3xl">
                    <Rocket className="w-16 h-16 text-[#39FF14] mx-auto mb-6" />
                    <h2 className="text-4xl md:text-5xl font-black mb-4">
                        Ready to Find Your Perfect Match?
                    </h2>
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                        Join thousands of verified humans finding real love while supporting children's healthcare.
                    </p>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-12 py-6 bg-gradient-to-r from-[#39FF14] to-green-500 hover:from-green-500 hover:to-[#39FF14] rounded-full font-black text-2xl text-black shadow-[0_0_50px_rgba(57,255,20,0.5)] transition-all hover:scale-110"
                    >
                        START FOR FREE
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md py-8">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Heart className="w-6 h-6 text-[#39FF14] fill-[#39FF14]" />
                        <span className="text-lg font-bold">YOU & I NOT AI</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">
                        Deployed by <span className="text-purple-400 font-bold">Captain GitHub</span> • <span className="text-[#39FF14] font-bold">FOR THE KIDS</span>
                    </p>
                    <p className="text-slate-500 text-xs">
                        50% of all profits donated to Shriners Children's Hospitals • © 2025 Ai-Solutions-Store
                    </p>
                </div>
            </footer>

            <style>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }
            `}</style>

            {/* Payment Modal */}
            {selectedPlan && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setPaymentModalOpen(false)}
                    planName={selectedPlan.name}
                    planPrice={selectedPlan.price}
                    planId={selectedPlan.id}
                />
            )}
        </div>
    );
};

export default LandingPage;
