'use client';

import { Tabs } from '@heroui/react';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';
import { MeshGradient, Dithering } from '@paper-design/shaders-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header with shader gradient */}
      <header className="relative w-full overflow-hidden">
        <MeshGradient
          colors={['#5b00ff', '#00ffa3', '#ff9a00', '#ea00ff']}
          swirl={0.55}
          distortion={0.85}
          speed={0.1}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        <Dithering
          colorBack="#ffffff"
          colorFront="#eaeaea"
          shape="simplex"
          speed={0.1}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/30" />

        <div className="relative max-w-7xl mx-auto px-4 py-12 text-left">
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-semibold text-white leading-snug">
              Question Collection
              <br />& Submission Platform
            </h1>
            <p className="text-white/80 text-sm font-medium">
              Submit and manage educational questions with markdown support
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        <Tabs defaultSelectedKey="submit" className="w-full">
          <Tabs.ListContainer className="mb-8">
            <Tabs.List aria-label="Navigation tabs" className="glass rounded-lg p-1">
              <Tabs.Tab id="submit" className="px-6 py-3 flex items-center gap-2">
                ✍️ <span>Submit Question</span>
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab id="submissions" className="px-6 py-3 flex items-center gap-2">
                📋 <span>My Submissions</span>
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>

          <Tabs.Panel id="submit">
            <QuestionForm />
          </Tabs.Panel>

          <Tabs.Panel id="submissions">
            <QuestionList />
          </Tabs.Panel>
        </Tabs>
      </main>
    </div>
  );
}
