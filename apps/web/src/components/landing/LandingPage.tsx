import { Link } from 'react-router-dom';
import {
  Upload,
  Shield,
  Zap,
  Network,
  Lock,
  BarChart3,
  Users,
  TrendingUp,
  ArrowRight,
  Check,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import ConstellationBackground from '@/components/ui/ConstellationBackground';
import { cn } from '@/lib/utils';
import LandingHeader from './LandingHeader';

/**
 * Platform icons configuration
 */
const platforms = [
  { name: 'Twitter/X', color: 'bg-black dark:bg-white dark:text-black' },
  { name: 'Instagram', color: 'bg-gradient-to-br from-purple-600 to-pink-500' },
  { name: 'LinkedIn', color: 'bg-[#0077B5]' },
  { name: 'Facebook', color: 'bg-[#1877F2]' },
  { name: 'TikTok', color: 'bg-black dark:bg-white dark:text-black' },
];

/**
 * Feature cards configuration
 */
const features = [
  {
    icon: Network,
    title: 'Network Visualization',
    description:
      'Transform your connections into an interactive force-directed graph. See communities, bridges, and influence patterns at a glance.',
  },
  {
    icon: Shield,
    title: 'Privacy-First Design',
    description:
      'Your data never leaves your device during analysis. We use client-side processing and cryptographic pseudonymization.',
  },
  {
    icon: Zap,
    title: 'Instant Insights',
    description:
      'Powered by deterministic algorithms - no AI black boxes. Get consistent, explainable insights about your digital identity.',
  },
  {
    icon: BarChart3,
    title: 'Engagement Analysis',
    description:
      'Understand who drives your engagement. Identify your most valuable connections and dormant relationships.',
  },
  {
    icon: Users,
    title: 'Community Detection',
    description:
      'Louvain algorithm automatically discovers distinct communities in your network. See how your worlds connect.',
  },
  {
    icon: TrendingUp,
    title: 'Growth Opportunities',
    description:
      'Discover weak ties and bridge accounts that unlock access to new communities and audiences.',
  },
];

/**
 * How it works steps
 */
const steps = [
  {
    number: '01',
    title: 'Export Your Data',
    description:
      'Request your data export from any supported platform. We never ask for your login credentials.',
  },
  {
    number: '02',
    title: 'Upload Securely',
    description:
      'Drag and drop your export ZIP file. Processing happens entirely in your browser.',
  },
  {
    number: '03',
    title: 'Explore Insights',
    description:
      'Interact with your network graph. Discover patterns, communities, and growth opportunities.',
  },
];

/**
 * Pricing tiers
 */
const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out VSG',
    features: [
      '1 platform analysis',
      'Basic network graph',
      'Community detection',
      '100 node limit',
    ],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'For serious network analysts',
    features: [
      'All 5 platforms',
      'Unlimited nodes',
      'All insight views',
      'PDF & PNG exports',
      'Historical tracking',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Creator',
    price: '$29',
    period: '/month',
    description: 'For content creators & brands',
    features: [
      'Everything in Pro',
      'API access',
      'White-label exports',
      'Dedicated support',
      'Early feature access',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

/**
 * LandingPage Component
 *
 * The main entry point for unauthenticated users.
 * Showcases the value proposition, features, and pricing.
 */
function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-vsg-gray-950">
      {/* Landing Header */}
      <LandingHeader />

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden min-h-[90vh]">
        {/* Background gradient with orange texture */}
        <div className="absolute inset-0 bg-gradient-to-br from-vsg-orange-50 via-white to-vsg-gray-50 dark:from-vsg-gray-900 dark:via-vsg-gray-950 dark:to-vsg-gray-900" />
        
        {/* Spread orange gradient overlays across the hero */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_20%,_rgba(249,115,22,0.06)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_30%,_rgba(249,115,22,0.05)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_80%,_rgba(249,115,22,0.04)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_70%_70%,_rgba(249,115,22,0.05)_0%,_transparent_45%)]" />

        {/* Animated constellation background - more visible */}
        <ConstellationBackground
          nodeCount={50}
          opacity={0.5}
          colorTheme="orange"
          connectionDistance={150}
          showGlow={true}
          speedMultiplier={0.5}
          mouseDistance={200}
          enableColorShift={true}
          className="z-[1]"
        />

        {/* Decorative blur elements - spread across */}
        <div className="absolute top-16 left-[5%] w-64 h-64 bg-vsg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-[10%] w-48 h-48 bg-vsg-orange-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-24 left-1/3 w-56 h-56 bg-vsg-orange-500/6 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-[15%] w-72 h-72 bg-vsg-orange-500/8 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 sm:pt-36 sm:pb-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vsg-orange-100 dark:bg-vsg-orange-900/40 text-vsg-orange-800 dark:text-vsg-orange-200 text-body-sm font-medium mb-8">
              <Lock className="w-4 h-4" />
              Privacy-First Network Intelligence
            </div>

            {/* Headline - larger font */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-vsg-gray-900 dark:text-white max-w-5xl mx-auto leading-[1.1]">
              Understand Your{' '}
              <span className="vsg-gradient-text">Digital Identity</span>{' '}
              Through Network Science
            </h1>

            {/* Subheadline */}
            <p className="mt-6 text-body-lg sm:text-h4 text-vsg-gray-600 dark:text-vsg-gray-400 max-w-2xl mx-auto font-normal">
              Transform your social media connections into actionable insights.
              See your influence, discover communities, and unlock growth opportunities.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild className="gap-2">
                <Link to="/upload" className="text-white">
                  <Upload className="w-5 h-5" />
                  Analyze My Network
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="gap-2">
                <a href="#how-it-works">
                  See How It Works
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
            </div>

            {/* Platform badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              <span className="text-body-sm text-vsg-gray-500 dark:text-vsg-gray-400 mr-2">
                Works with:
              </span>
              {platforms.map((platform) => (
                <span
                  key={platform.name}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-caption font-medium',
                    platform.color,
                    // Twitter/X and TikTok have white bg in dark mode, so text should be black
                    platform.name === 'Twitter/X' || platform.name === 'TikTok'
                      ? 'text-white dark:text-black'
                      : 'text-white'
                  )}
                >
                  {platform.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-vsg-gray-50 dark:bg-vsg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-bold text-vsg-gray-900 dark:text-white">
              Network Intelligence, Simplified
            </h2>
            <p className="mt-4 text-body-lg text-vsg-gray-600 dark:text-vsg-gray-400 max-w-2xl mx-auto">
              Powerful algorithms. Beautiful visualizations. Complete privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} padding="lg" className="group">
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-lg bg-vsg-orange-100 dark:bg-vsg-orange-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-normal">
                    <feature.icon className="w-6 h-6 text-vsg-orange-500" />
                  </div>
                  <h3 className="text-h4 font-semibold text-vsg-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-body text-vsg-gray-600 dark:text-vsg-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-white dark:bg-vsg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-bold text-vsg-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="mt-4 text-body-lg text-vsg-gray-600 dark:text-vsg-gray-400 max-w-2xl mx-auto">
              Three simple steps to unlock your network intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-vsg-gray-200 dark:bg-vsg-gray-800" />
                )}

                <div className="relative text-center">
                  {/* Step number */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-vsg-orange-500 text-white text-h3 font-bold mb-6">
                    {step.number}
                  </div>
                  <h3 className="text-h4 font-semibold text-vsg-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-body text-vsg-gray-600 dark:text-vsg-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-24 bg-vsg-gray-900 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-vsg-orange-500/20 text-vsg-orange-400 text-body-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                Privacy by Design
              </div>
              <h2 className="text-h2 font-bold text-white mb-6">
                Your Data Stays Yours
              </h2>
              <p className="text-body-lg text-vsg-gray-400 mb-8">
                Unlike other analytics tools, Visual Social Graph processes your
                data entirely in your browser. We never see your raw social media
                data, and we never ask for your login credentials.
              </p>

              <ul className="space-y-4">
                {[
                  '80% client-side processing',
                  'HMAC-SHA256 pseudonymization',
                  'No account access required',
                  'Export ZIP files only',
                  'Optional cloud storage',
                  'GDPR & CCPA compliant',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-vsg-gray-300">
                    <div className="w-5 h-5 rounded-full bg-vsg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-vsg-orange-500" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              {/* Decorative graph illustration with constellation */}
              <div className="aspect-square rounded-2xl bg-vsg-gray-800 border border-vsg-gray-700 relative overflow-hidden">
                {/* Constellation background in the illustration box */}
                <ConstellationBackground
                  nodeCount={30}
                  opacity={0.6}
                  colorTheme="mixed"
                  connectionDistance={100}
                  showGlow={true}
                  speedMultiplier={0.4}
                  mouseDistance={120}
                />
                {/* Center globe icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Globe className="w-32 h-32 text-vsg-gray-700/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-vsg-gray-50 dark:bg-vsg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-h2 font-bold text-vsg-gray-900 dark:text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-body-lg text-vsg-gray-600 dark:text-vsg-gray-400 max-w-2xl mx-auto">
              Start free. Upgrade when you need more power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                padding="none"
                className={cn(
                  'relative overflow-hidden',
                  tier.highlighted && 'ring-2 ring-vsg-orange-500'
                )}
              >
                {tier.highlighted && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-vsg-orange-500 to-vsg-orange-600" />
                )}
                <CardContent className="p-6">
                  <h3 className="text-h4 font-semibold text-vsg-gray-900 dark:text-white">
                    {tier.name}
                  </h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-display font-bold text-vsg-gray-900 dark:text-white">
                      {tier.price}
                    </span>
                    <span className="ml-1 text-body text-vsg-gray-500 dark:text-vsg-gray-400">
                      {tier.period}
                    </span>
                  </div>
                  <p className="mt-2 text-body-sm text-vsg-gray-600 dark:text-vsg-gray-400">
                    {tier.description}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-body-sm">
                        <Check className="w-4 h-4 text-vsg-success-500 flex-shrink-0" />
                        <span className="text-vsg-gray-700 dark:text-vsg-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full mt-8"
                    variant={tier.highlighted ? 'primary' : 'outline'}
                    asChild
                  >
                    <Link
                      to="/upload"
                      className={cn(
                        tier.highlighted && 'text-white',
                        tier.name === 'Free' && 'text-vsg-orange-600'
                      )}
                    >
                      {tier.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-vsg-orange-500 to-vsg-orange-600 overflow-hidden">
        {/* Subtle constellation overlay */}
        <ConstellationBackground
          nodeCount={30}
          opacity={0.35}
          colorTheme="orange"
          connectionDistance={130}
          showGlow={false}
          speedMultiplier={0.4}
          mouseDistance={180}
          className="z-0"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-h2 font-bold text-white mb-6">
            Ready to See Your Network?
          </h2>
          <p className="text-body-lg text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of users who have discovered insights about their
            digital identity. Start your free analysis today.
          </p>
          <Button
            size="lg"
            className="bg-white text-vsg-orange-700 hover:bg-vsg-gray-100 gap-2"
            asChild
          >
            <Link to="/upload">
              <Upload className="w-5 h-5" />
              Start Free Analysis
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-vsg-gray-900 dark:bg-black py-12 overflow-hidden">
        {/* Subtle constellation in footer */}
        <ConstellationBackground
          nodeCount={25}
          opacity={0.4}
          colorTheme="orange"
          connectionDistance={140}
          showGlow={true}
          speedMultiplier={0.25}
          mouseDistance={160}
          className="z-0"
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vsg-orange-500 to-vsg-orange-600 flex items-center justify-center">
                <Network className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">Visual Social Graph</span>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6 text-body-sm text-vsg-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/help" className="hover:text-white transition-colors">
                Help Center
              </Link>
              <a
                href="https://github.com/visual-social-graph"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                GitHub
              </a>
            </nav>

            {/* Copyright */}
            <p className="text-body-sm text-vsg-gray-500">
              &copy; {new Date().getFullYear()} Visual Social Graph. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
