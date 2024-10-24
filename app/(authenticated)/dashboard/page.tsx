import { ChatInterface } from '@/components/chat-interface';

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16">
        <ChatInterface />
      </div>
    </main>
  );
}