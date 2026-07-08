"use client";

import { Cpu, ShieldCheck, Star, Camera, Check, MapPin, LayoutDashboard, Search, Minus, Sparkles, Globe, Users, Award } from "lucide-react";
import { useEffect } from "react";

export default function HomeFindClientPage() {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = "1";
          (entry.target as HTMLElement).style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    document.querySelectorAll(".reveal").forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.opacity = "0";
      htmlEl.style.transform = "translateY(40px)";
      htmlEl.style.transition = "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
      // Keep delay if class has delay-100, delay-200
      if (htmlEl.classList.contains("delay-100")) htmlEl.style.transitionDelay = "100ms";
      if (htmlEl.classList.contains("delay-200")) htmlEl.style.transitionDelay = "200ms";
      if (htmlEl.classList.contains("delay-300")) htmlEl.style.transitionDelay = "300ms";
      observer.observe(htmlEl);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-brand-purple/30 selection:text-white pb-24">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 opacity-5" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>
      <style dangerouslySetInnerHTML={{__html: `
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
        .glass-card { background: linear-gradient(145deg, rgba(30,30,30,0.5) 0%, rgba(10,10,10,0.5) 100%); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; }
        .text-gradient { background: linear-gradient(to right, #60a5fa, #c084fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .text-gradient-gold { background: linear-gradient(135deg, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .card-hover { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .card-hover:hover { transform: translateY(-8px); border-color: rgba(255,255,255,0.2); box-shadow: 0 20px 40px -10px rgba(139, 92, 246, 0.15); }
        .card-hover-gold:hover { transform: translateY(-8px); border-color: rgba(212,175,55,0.4); box-shadow: 0 20px 40px -10px rgba(212, 175, 55, 0.2); }
        .glow-orb { position: absolute; width: 600px; height: 600px; background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(0,0,0,0) 70%); border-radius: 50%; z-index: 0; filter: blur(60px); pointer-events: none; }
        .glow-blue { top: -100px; left: 50%; transform: translateX(-50%); }
        .glow-purple { background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(0,0,0,0) 70%); top: 40%; left: -200px; }
        .glow-gold { background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, rgba(0,0,0,0) 70%); bottom: -100px; right: -200px; }
      `}} />
      

    <div className="grain-overlay"></div>

    {/* Navigation */}
    

    {/* Hero */}
    <header className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden border-b border-white/5">
        <div className="glow-orb glow-blue"></div>
        <div className="glow-orb glow-purple"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8 text-sm text-gray-300 shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></span>
                    The Next Generation of Real Estate
                </div>
                <h1 className="text-6xl md:text-8xl font-display font-bold leading-[1.05] mb-6 tracking-tight">
                    Find a home you&apos;ll <br />
                    <span className="text-gradient">truly love.</span>
                </h1>
                <p className="text-xl text-gray-400 font-light mb-10 max-w-lg leading-relaxed">
                    Premium properties directly from owners. Zero commissions. No hidden fees. Powered by advanced artificial intelligence.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                    <a href="#about" className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:scale-105 transition-transform text-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">Explore Platform</a>
                    <a href="#pricing" className="px-8 py-4 bg-transparent text-white font-semibold rounded-full hover:bg-white/5 transition-colors border border-white/10 text-center">View Ecosystem</a>
                </div>
            </div>
            
            <div className="reveal delay-200 relative hidden lg:block">
                {/* Abstract Glass UI Mockup */}
                <div className="glass-card p-6 w-full shadow-2xl shadow-blue-900/20 transform rotate-y-6 rotate-x-6 perspective-1000 border-t border-white/20">
                    <div className="flex gap-2 mb-6">
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                        <div className="w-3 h-3 rounded-full bg-white/20"></div>
                    </div>
                    {/* Search Bar Mock */}
                    <div className="bg-black/50 border border-white/10 rounded-2xl p-4 flex items-center gap-4 mb-6 shadow-inner">
                        <MapPin    className="text-gray-400 w-5 h-5" />
                        <div className="text-gray-400 font-medium text-sm flex-1">Where do you want to live?</div>
                        <div className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold shadow-lg">Search</div>
                    </div>
                    {/* Listing Cards Mock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 rounded-2xl h-48 border border-white/5 overflow-hidden relative group">
                            <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="Villa Mockup" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                            <div className="absolute bottom-4 left-4 z-20">
                                <div className="text-xl font-display font-bold text-white">$4,250,000</div>
                                <div className="text-xs text-gray-300 font-medium">Beverly Hills, CA</div>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-2xl h-48 border border-white/5 overflow-hidden relative group">
                            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt="Penthouse Mockup" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10"></div>
                            <div className="absolute bottom-4 left-4 z-20">
                                <div className="text-xl font-display font-bold text-white">$2,890,000</div>
                                <div className="text-xs text-gray-300 font-medium">Miami Beach, FL</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    {/* What & Why: The Ecosystem */}
    <section id="about" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 reveal">
                <h2 className="text-sm font-bold tracking-[0.2em] text-brand-blue uppercase mb-4">What is Home Find</h2>
                <h3 className="text-4xl md:text-5xl font-display font-bold mb-6">A Seamless <span className="text-gradient">Ecosystem</span></h3>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                    A modern real estate platform connecting owners directly with buyers. No middlemen, no friction. Just beautifully crafted technology.
                </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                <div className="glass-card p-10 card-hover reveal">
                    <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center mb-8 border border-brand-blue/20">
                        <ShieldCheck    className="w-7 h-7 text-brand-blue" />
                    </div>
                    <h4 className="text-2xl font-display font-bold mb-4">Zero Commissions</h4>
                    <p className="text-gray-400 leading-relaxed font-light">Transact directly through our secure platform. We eliminate the middlemen so buyers and sellers retain maximum value.</p>
                </div>
                <div className="glass-card p-10 card-hover reveal delay-100">
                    <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 flex items-center justify-center mb-8 border border-brand-purple/20">
                        <Sparkles    className="w-7 h-7 text-brand-purple" />
                    </div>
                    <h4 className="text-2xl font-display font-bold mb-4">AI Matching</h4>
                    <p className="text-gray-400 leading-relaxed font-light">Our proprietary AiX algorithms match high-end properties with the perfect buyers based on precise lifestyle data.</p>
                </div>
                <div className="glass-card p-10 card-hover reveal delay-200">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10">
                        <Globe    className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-2xl font-display font-bold mb-4">Global Reach</h4>
                    <p className="text-gray-400 leading-relaxed font-light">A beautifully designed, borderless platform ensuring your premium property is seen by a verified worldwide audience.</p>
                </div>
            </div>
        </div>
    </section>

    {/* Platform Features */}
    <section id="features" className="py-32 bg-dark relative border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
                <div className="reveal">
                    <h2 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-4">Platform Features</h2>
                    <h3 className="text-4xl md:text-5xl font-display font-bold mb-10 leading-tight">Built for owners.<br />Designed for buyers.</h3>
                    
                    <div className="space-y-10 mt-12">
                        <div className="flex gap-6 items-start group">
                            <div className="mt-1 bg-white/5 p-4 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors shadow-lg">
                                <LayoutDashboard    className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-2">Centralized Dashboard</h4>
                                <p className="text-gray-400 font-light leading-relaxed">Manage all your listings from a highly intuitive interface. Edit details, upload high-res galleries, and track performance.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start group">
                            <div className="mt-1 bg-white/5 p-4 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors shadow-lg">
                                <Search    className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-2">Advanced Filtering</h4>
                                <p className="text-gray-400 font-light leading-relaxed">Lightning-fast search capabilities. Filter by city, property type, price range, and custom architectural tags.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start group">
                            <div className="mt-1 bg-white/5 p-4 rounded-2xl border border-white/10 group-hover:bg-brand-gold/20 transition-colors shadow-lg">
                                <Star    className="w-6 h-6 text-brand-gold" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-2">Exceptional Placements</h4>
                                <p className="text-gray-400 font-light leading-relaxed">Featured listings get priority placement, dedicated luxury styling, and increased visibility across the platform.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="reveal delay-200 relative">
                    <div className="glow-orb glow-purple opacity-50"></div>
                    <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
                        <img src="https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop" alt="Dashboard Interface Visualization" className="w-full h-auto opacity-60 mix-blend-overlay" />
                        <div className="absolute inset-0 flex items-center justify-center z-10 p-8">
                            <div className="glass-card p-8 w-full max-w-md shadow-2xl backdrop-blur-3xl border-t border-white/30">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20"></div>
                                    <div className="h-8 w-24 bg-white/10 rounded-full"></div>
                                </div>
                                <div className="h-4 w-1/3 bg-white/20 rounded mb-4"></div>
                                <div className="h-3 w-full bg-white/10 rounded mb-2"></div>
                                <div className="h-3 w-5/6 bg-white/10 rounded mb-8"></div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-xs text-gray-400 mb-1">Listed Price</div>
                                        <div className="text-3xl font-display font-bold text-white">$5,900,000</div>
                                    </div>
                                    <div className="bg-white text-black px-6 py-3 rounded-full text-sm font-bold shadow-lg">Contact</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* AI Features: Smart Pricing Calculator */}
    <section id="aix" className="py-32 relative">
        <div className="glow-orb glow-blue opacity-30"></div>
        <div className="max-w-7xl mx-auto px-6 text-center reveal">
            <h2 className="text-sm font-bold tracking-[0.2em] text-brand-purple uppercase mb-4">AI Features</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold mb-6">Smart Pricing Calculator</h3>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light mb-16 leading-relaxed">
                Integrated anti-manipulation logic and real-time market analysis. Home Find algorithms ensure optimal property valuations and fair market integrity.
            </p>
            
            <div className="max-w-4xl mx-auto glass-card p-12 text-left border-t border-white/20 relative overflow-hidden card-hover">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-purple/20 rounded-full blur-[80px]"></div>
                
                <div className="flex flex-col md:flex-row gap-12 relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                <Cpu    className="text-white w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold font-display">Valuation Engine</h4>
                                <p className="text-brand-purple text-sm font-medium mt-1">AiX OS™ Market Analysis Active</p>
                            </div>
                        </div>
                        
                        <p className="text-gray-400 font-light leading-relaxed mb-8">
                            Our proprietary systems analyze thousands of data points instantly to prevent market manipulation and guarantee premium pricing accuracy for high-end real estate.
                        </p>
                    </div>
                    
                    <div className="flex-1 space-y-8 bg-black/40 p-6 rounded-2xl border border-white/5">
                        <div>
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-gray-300 font-medium">Market Accuracy Confidence</span>
                                <span className="text-green-400 font-bold">99.2%</span>
                            </div>
                            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-green-400/90 w-[99%] rounded-full shadow-[0_0_15px_rgba(74,222,128,0.6)]"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-gray-300 font-medium">Anti-Manipulation Guard</span>
                                <span className="text-brand-blue font-bold">Secured</span>
                            </div>
                            <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-blue w-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.6)]"></div>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                            <span className="text-xs text-gray-500 uppercase tracking-wider font-bold">System Status</span>
                            <span className="flex items-center gap-2 text-xs font-bold text-white bg-white/10 px-3 py-1 rounded-full"><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    {/* Professional Representation */}
    <section className="py-32 relative border-t border-white/5 bg-dark">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
                <h2 className="text-sm font-bold tracking-[0.2em] text-brand-gold uppercase mb-4">Elite Tier</h2>
                <h3 className="text-4xl md:text-5xl font-display font-bold mb-6">Professional <span className="text-gradient-gold">Representation</span></h3>
                <p className="text-xl text-gray-400 font-light mb-8 leading-relaxed">
                    For our most exclusive listings, Home Find offers elite professional representation. We don&apos;t just list your property; we curate an experience.
                </p>
                <ul className="space-y-6 text-gray-300 mb-10">
                    <li className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                        <Award    className="text-brand-gold w-6 h-6" /> 
                        <span className="font-medium">Dedicated expert assigned to your portfolio</span>
                    </li>
                    <li className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                        <Camera    className="text-brand-gold w-6 h-6" /> 
                        <span className="font-medium">Cinematic property showcases & drone footage</span>
                    </li>
                    <li className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                        <Users    className="text-brand-gold w-6 h-6" /> 
                        <span className="font-medium">Private international buyer network access</span>
                    </li>
                </ul>
            </div>
            <div className="reveal delay-200 relative">
                <div className="glow-orb glow-gold opacity-40"></div>
                <div className="glass-card p-2 border-brand-gold/30 shadow-[0_0_60px_rgba(212,175,55,0.15)] rounded-3xl relative overflow-hidden">
                    <div className="absolute inset-0 border border-brand-gold/50 rounded-3xl z-20 pointer-events-none m-2"></div>
                    <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1200&auto=format&fit=crop" alt="Luxury Representation" className="w-full rounded-2xl opacity-90 mix-blend-luminosity hover:mix-blend-normal transition-all duration-1000 object-cover h-[500px]" />
                </div>
            </div>
        </div>
    </section>

    {/* Pricing Preview */}
    <section id="pricing" className="py-32 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 reveal">
                <h2 className="text-sm font-bold tracking-[0.2em] text-brand-blue uppercase mb-4">Monetization</h2>
                <h3 className="text-4xl md:text-5xl font-display font-bold mb-6">Premium Pricing Ecosystem</h3>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">Flexible tiers designed for individuals, top-tier agencies, and elite representations.</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* Tier 1 */}
                <div className="glass-card p-10 reveal card-hover flex flex-col justify-between">
                    <div>
                        <h4 className="text-xl font-bold text-gray-400 mb-2 font-display">Essential</h4>
                        <div className="text-5xl font-display font-bold mb-8">Free</div>
                        <ul className="space-y-5 text-gray-400 font-light mb-10">
                            <li className="flex items-center gap-4"><Check    className="w-5 h-5 text-white" /> 1 Property Listing</li>
                            <li className="flex items-center gap-4"><Check    className="w-5 h-5 text-white" /> Standard Support</li>
                            <li className="flex items-center gap-4"><Check    className="w-5 h-5 text-white" /> Direct Buyer Contact</li>
                            <li className="flex items-center gap-4 opacity-40"><Minus    className="w-5 h-5 text-gray-500" /> No Featured Status</li>
                        </ul>
                    </div>
                    <button className="w-full py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors font-semibold text-lg">Get Started</button>
                </div>
                
                {/* Tier 2 */}
                <div className="glass-card p-10 reveal delay-100 flex flex-col justify-between relative border-brand-blue/50 transform lg:-translate-y-6 shadow-[0_20px_50px_rgba(59,130,246,0.15)]">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">Most Popular</div>
                    <div>
                        <h4 className="text-xl font-bold text-brand-blue mb-2 font-display">Premium</h4>
                        <div className="text-5xl font-display font-bold mb-8">$99<span className="text-xl text-gray-500 font-normal">/mo</span></div>
                        <ul className="space-y-5 text-gray-200 font-light mb-10">
                            <li className="flex items-center gap-4"><Check    className="w-5 h-5 text-brand-blue" /> Up to 10 Listings</li>
                            <li className="flex items-center gap-4"><Check    className="w-5 h-5 text-brand-blue" /> Featured Priority Status</li>
                            <li className="flex items-center gap-4"><Check    className="w-5 h-5 text-brand-blue" /> Social Media Package</li>
                            <li className="flex items-center gap-4"><Check    className="w-5 h-5 text-brand-blue" /> Advanced Analytics</li>
                        </ul>
                    </div>
                    <button className="w-full py-4 rounded-full bg-white text-black hover:bg-gray-200 transition-colors font-semibold text-lg shadow-[0_0_20px_rgba(255,255,255,0.2)]">Subscribe Now</button>
                </div>
                
                {/* Tier 3 */}
                <div className="glass-card p-10 reveal delay-200 flex flex-col justify-between border-brand-gold/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <h4 className="text-xl font-bold text-brand-gold mb-2 font-display">AiX Elite</h4>
                        <div className="text-5xl font-display font-bold mb-8 text-gradient-gold">Custom</div>
                        <ul className="space-y-5 text-gray-300 font-light mb-10">
                            <li className="flex items-center gap-4"><Check    className="w-5 h-5 text-brand-gold" /> Unlimited Listings</li>
                            <li className="flex items-center gap-4"><Check    className="w-5 h-5 text-brand-gold" /> Professional Representation</li>
                            <li className="flex items-center gap-4"><Check    className="w-5 h-5 text-brand-gold" /> Dedicated Agent</li>
                            <li className="flex items-center gap-4"><Check    className="w-5 h-5 text-brand-gold" /> Custom Commission Model</li>
                        </ul>
                    </div>
                    <button className="relative z-10 w-full py-4 rounded-full border border-brand-gold/50 text-brand-gold hover:bg-brand-gold hover:text-black transition-all font-semibold text-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]">Contact Us</button>
                </div>
            </div>
        </div>
    </section>


    {/* Powered by AiX / CTA */}
    <section className="py-40 relative text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-blue/10 pointer-events-none"></div>
        <div className="glow-orb glow-gold opacity-20 left-1/2 -translate-x-1/2 bottom-0"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 reveal">
            <h2 className="text-6xl md:text-7xl font-display font-bold mb-8 text-gradient-gold drop-shadow-2xl">Powered by AiX OS™</h2>
            <p className="text-2xl text-gray-400 mb-12 font-light leading-relaxed">
                Experience the pinnacle of real estate technology. <br className="hidden md:block" />Architected and designed by AiX Luxury.
            </p>
            <a href="https://aixluxury.com" target="_blank" className="inline-flex items-center justify-center px-10 py-5 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform text-lg shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                Discover AiX Luxury
            </a>
        </div>
    </section>

    {/* Footer / Contact */}
    

    {/* Intersection Observer for Scroll Animations */}
    
    </div>
  );
}
