
import React from 'react';
import HeroSection from '@/components/Landing/HeroSection';
import FeaturesShowcase from '@/components/Landing/FeaturesShowcase';
import BenefitsSection from '@/components/Landing/BenefitsSection';
import HowItWorksSection from '@/components/Landing/HowItWorksSection';
import FeatureDeepDive from '@/components/Landing/FeatureDeepDive';
import SocialProofSection from '@/components/Landing/SocialProofSection';
import FinalCTASection from '@/components/Landing/FinalCTASection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <HeroSection />
      <FeaturesShowcase />
      <BenefitsSection />
      <HowItWorksSection />
      <FeatureDeepDive />
      <SocialProofSection />
      <FinalCTASection />
    </div>
  );
};

export default LandingPage;
