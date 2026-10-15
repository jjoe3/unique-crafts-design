/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Banner, defaultBannerData, BannerData, BackgroundMode } from './components/Banner.tsx';
import { StorySection } from './components/StorySection.tsx';
import { CollectionsSection } from './components/CollectionsSection.tsx';
import { CommunitySection } from './components/CommunitySection.tsx';
import { Toolbar } from './components/Toolbar.tsx';
import { ContactModal } from './components/ContactModal.tsx';
import { LearnMoreModal } from './components/LearnMoreModal.tsx';
import { CompareModal } from './components/CompareModal.tsx';
import { CodeModal } from './components/CodeModal.tsx';
import { SectionDrawer } from './components/SectionDrawer.tsx';

export default function App() {
  const [bannerData, setBannerData] = useState<BannerData>(defaultBannerData);
  const [backgroundMode, setBackgroundMode] = useState<BackgroundMode>('with-log');
  const [aspectMode, setAspectMode] = useState<'contained-16-9' | 'full-viewport'>('full-viewport');
  const [isEditing, setIsEditing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Modals & Drawers
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [learnMoreOpen, setLearnMoreOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const bannerRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDataChange = (key: keyof BannerData, value: string) => {
    setBannerData((prev) => ({ ...prev, [key]: value }));
  };

  const handleDownloadPng = useCallback(async () => {
    if (!bannerRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(bannerRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#EDE5DB',
      });
      const link = document.createElement('a');
      link.download = `unique-crafts-banner-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Banner PNG downloaded in high resolution (2x)!');
    } catch (err) {
      console.error('Failed to export PNG', err);
      showToast('Unable to export PNG directly. Try copying code instead.');
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const handleNavClick = (navItem: string) => {
    if (navItem === 'Home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection(null);
    } else if (navItem === 'Our Story') {
      document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(null);
    } else if (navItem === 'Collections') {
      document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(null);
    } else if (navItem === 'Community') {
      document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(null);
    } else {
      setActiveSection(navItem);
    }
  };

  const handleJumpToStory = () => {
    document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJumpToCollections = () => {
    document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleJumpToCommunity = () => {
    document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="min-h-screen text-[#1C1917] flex flex-col font-sans antialiased selection:bg-[#1C1917] selection:text-white"
      style={{ backgroundColor: '#EDE5DB' }}
    >
      {/* Studio Header Toolbar (Collapsible / Fullscreen capable) */}
      <Toolbar
        backgroundMode={backgroundMode}
        onBackgroundModeChange={setBackgroundMode}
        aspectMode={aspectMode}
        onAspectModeChange={setAspectMode}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing(!isEditing)}
        onDownloadPng={handleDownloadPng}
        isDownloading={isDownloading}
        onOpenCompare={() => setCompareOpen(true)}
        onOpenCode={() => setCodeOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        onJumpToStory={handleJumpToStory}
        onJumpToCollections={handleJumpToCollections}
        onJumpToCommunity={handleJumpToCommunity}
      />

      {/* Main Banner Presentation Canvas (Section 1) */}
      <div
        className={`flex-1 flex items-center justify-center transition-all duration-300 ${
          aspectMode === 'contained-16-9' ? 'p-4 sm:p-8 lg:p-12' : 'p-0'
        }`}
        style={{ backgroundColor: '#EDE5DB' }}
      >
        <Banner
          ref={bannerRef}
          data={bannerData}
          isEditing={isEditing}
          onDataChange={handleDataChange}
          backgroundMode={backgroundMode}
          aspectMode={aspectMode}
          onOpenContact={() => setContactModalOpen(true)}
          onOpenLearnMore={() => setLearnMoreOpen(true)}
          onNavClick={handleNavClick}
          activeNav={activeSection || 'Home'}
        />
      </div>

      {/* Section 2: OUR STORY / Hero (Texts strictly on the right side, plane black background, no photo) */}
      <StorySection
        onExploreClick={() => setLearnMoreOpen(true)}
      />

      {/* Section 3: COLLECTIONS / Hero (Wine Holders, Mirrors, Wall Art, Custom Pieces with 50px photos) */}
      <CollectionsSection
        onSelectCollection={(title) => {
          showToast(`Selected ${title}. Connect with our studio for availability.`);
        }}
        onCustomProjectClick={() => setContactModalOpen(true)}
      />

      {/* Section 4: COMMUNITY (Made by Nature. Finished by Hand.) */}
      <CommunitySection
        onGetInTouchClick={() => setContactModalOpen(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-black px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Interactive Modals */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />

      <LearnMoreModal
        isOpen={learnMoreOpen}
        onClose={() => setLearnMoreOpen(false)}
      />

      <CompareModal
        isOpen={compareOpen}
        onClose={() => setCompareOpen(false)}
      />

      <CodeModal
        isOpen={codeOpen}
        onClose={() => setCodeOpen(false)}
      />

      <SectionDrawer
        section={activeSection}
        onClose={() => setActiveSection(null)}
        onOpenContact={() => setContactModalOpen(true)}
      />
    </div>
  );
}
