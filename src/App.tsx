import { Tabs } from '@heroui/react';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-accent text-accent-foreground py-6 px-4 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Question Collection Platform</h1>
          <p className="text-sm mt-1 opacity-90">
            Submit questions with markdown support and image uploads
          </p>
        </div>
      </header>

      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Tabs className="mb-8" defaultSelectedKey="submit">
            <Tabs.ListContainer>
              <Tabs.List aria-label="Question management">
                <Tabs.Tab id="submit">
                  Submit Question
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="submissions">
                  My Submissions
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>
            <Tabs.Panel id="submit">
              <div className="py-6">
                <QuestionForm />
              </div>
            </Tabs.Panel>
            <Tabs.Panel id="submissions">
              <div className="py-6">
                <QuestionList />
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </main>

      <footer className="bg-surface py-4 px-4 mt-16 border-t border-separator">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted">
          <p>Question Collection Platform - Built with React, Vditor, and Supabase</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
