import { Rocket, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Rocket className="w-4 h-4 text-primary" />
            <span>Powered by NASA Earth Observation Data</span>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="https://www.nasa.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-3 py-1 rounded-md"
              data-testid="link-nasa"
            >
              <Globe className="w-4 h-4" />
              NASA
            </a>
            <a 
              href="https://www.spaceappschallenge.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-3 py-1 rounded-md"
              data-testid="link-space-apps"
            >
              <Sparkles className="w-4 h-4" />
              Space Apps Challenge
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Will It Rain On My Parade? Built for NASA Space Apps Challenge.
          </p>
        </div>
      </div>
    </footer>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
    </svg>
  );
}
