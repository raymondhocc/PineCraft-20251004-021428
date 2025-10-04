import { PineCraftCore } from '@/components/PineCraftCore';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Toaster } from '@/components/ui/sonner';
import { Github } from 'lucide-react';
export function HomePage() {
  return (
    <>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased relative">
        <ThemeToggle className="absolute top-6 right-6" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="py-16 md:py-24 text-center relative overflow-hidden">
            <div 
              className="absolute inset-0 -z-10 bg-indigo-50 dark:bg-indigo-900/20"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0% 100%)'
              }}
            />
            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[200%] h-[200%] -z-10 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.15)_0%,_transparent_40%)]" />
            <h1 className="text-4xl lg:text-5xl font-display font-bold tracking-tight text-gray-900 dark:text-gray-100 animate-fade-in">
              PineCraft
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in animation-delay-200">
              A minimalist tool to dynamically generate and manage Pine Script™ strategy parameters through an intuitive UI.
            </p>
          </header>
          <div className="pb-16 md:pb-24 animate-slide-up">
            <PineCraftCore />
          </div>
        </main>
        <footer className="border-t">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground space-y-2 sm:space-y-0">
            <p>Built with ❤️ at Cloudflare</p>
            <a 
              href="https://github.com/cloudflare/workers-sdk/tree/main/templates/c-code-react-runner" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" />
              View on GitHub
            </a>
          </div>
        </footer>
      </div>
      <Toaster richColors closeButton theme="system" />
    </>
  );
}