
import { Button } from '../ui/Button';
import { ArrowRight, ShieldCheck, Sun, Moon, Download, MousePointer, Network } from 'lucide-react';
import { ConstellationCanvas } from './ConstellationCanvas';
import { Footer } from '../layout/Footer';

export function LandingPage({ onGetStarted, isDark, toggleTheme }: { onGetStarted: () => void; isDark?: boolean; toggleTheme?: () => void }) {
    return (
        <div className="min-h-screen bg-white dark:bg-vsg-neutral-950 flex flex-col">
            <header className="h-20 flex items-center justify-between px-6 md:px-12 border-b border-vsg-neutral-100 dark:border-vsg-neutral-900 relative z-50">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-vsg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-vsg-primary/20">
                        VSG
                    </div>
                    <span className="font-bold text-xl tracking-tight text-vsg-neutral-900 dark:text-white">SocialGraph</span>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                    <Button variant="ghost">Sign In</Button>
                    <Button onClick={onGetStarted}>Get Started</Button>
                </div>
            </header>

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <ConstellationCanvas />
            </div>

            <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 md:py-32 max-w-5xl mx-auto relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-vsg-orange-50 text-vsg-primary text-sm font-medium mb-8 border border-vsg-orange-100 dark:bg-vsg-orange-900/20 dark:border-vsg-orange-900/30">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vsg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-vsg-primary"></span>
                    </span>
                    v1.0 Now Available
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-vsg-neutral-900 dark:text-white mb-6">
                    See Your <span className="text-vsg-primary">Digital Self</span>
                </h1>

                <p className="text-xl text-vsg-neutral-500 dark:text-vsg-neutral-400 max-w-2xl mb-10 leading-relaxed">
                    Transform your social media data into strategic network intelligence. Privately.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
                    <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-vsg-primary/20" onClick={onGetStarted} rightIcon={<ArrowRight className="h-5 w-5" />}>
                        Visualize Your Network (Free)
                    </Button>
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg">
                        View Demo Graph
                    </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-vsg-neutral-500 bg-vsg-neutral-50 dark:bg-vsg-neutral-900/50 px-4 py-2 rounded-full border border-vsg-neutral-200 dark:border-vsg-neutral-800">
                    <ShieldCheck className="h-4 w-4 text-vsg-success" />
                    <span>Your data never leaves your device unless you say so. 100% client-side parsing.</span>
                </div>

                <div className="mt-32 w-full">
                    <h2 className="text-3xl font-bold mb-12 text-vsg-neutral-900 dark:text-white">How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        <div className="p-8 rounded-2xl bg-white dark:bg-vsg-neutral-900 border border-vsg-neutral-100 dark:border-vsg-neutral-800 shadow-sm relative overflow-hidden group hover:border-vsg-primary/50 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-vsg-neutral-900 dark:text-white">1</div>
                            <div className="w-12 h-12 bg-vsg-orange-50 dark:bg-vsg-neutral-800 rounded-xl flex items-center justify-center mb-6 text-vsg-primary">
                                <Download className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Download Data</h3>
                            <p className="text-vsg-neutral-500 leading-relaxed">Export your archive from Twitter or LinkedIn. We provide simple, step-by-step guides for each platform.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white dark:bg-vsg-neutral-900 border border-vsg-neutral-100 dark:border-vsg-neutral-800 shadow-sm relative overflow-hidden group hover:border-vsg-primary/50 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-vsg-neutral-900 dark:text-white">2</div>
                            <div className="w-12 h-12 bg-vsg-orange-50 dark:bg-vsg-neutral-800 rounded-xl flex items-center justify-center mb-6 text-vsg-primary">
                                <MousePointer className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Drag & Drop</h3>
                            <p className="text-vsg-neutral-500 leading-relaxed">Upload your ZIP file locally. Our engine parses connections directly in your browser without uploading raw data.</p>
                        </div>
                        <div className="p-8 rounded-2xl bg-white dark:bg-vsg-neutral-900 border border-vsg-neutral-100 dark:border-vsg-neutral-800 shadow-sm relative overflow-hidden group hover:border-vsg-primary/50 transition-colors">
                            <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-6xl text-vsg-neutral-900 dark:text-white">3</div>
                            <div className="w-12 h-12 bg-vsg-orange-50 dark:bg-vsg-neutral-800 rounded-xl flex items-center justify-center mb-6 text-vsg-primary">
                                <Network className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Explore</h3>
                            <p className="text-vsg-neutral-500 leading-relaxed">See your network instantly. Discover communities, identify key influencers, and visualize your social universe.</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
