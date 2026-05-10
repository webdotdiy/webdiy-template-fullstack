import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function App() {
  const [health, setHealth] = useState<'checking' | 'ok' | 'error'>('checking');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? setHealth('ok') : setHealth('error')))
      .catch(() => setHealth('error'));
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-8 px-6 py-24">
        <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          webdiy-template-fullstack starter
        </span>
        <h1 className="text-4xl font-semibold tracking-tight">
          Vite + React + Hono + Supabase, on Cloudflare Workers.
        </h1>
        <p className="max-w-prose text-lg text-muted-foreground">
          Frontend (Vite + React) and backend (Hono) deploy as one Worker bundle. The placeholder
          tokens in <code className="rounded bg-muted px-1.5 py-0.5 text-sm">src/index.css</code>{' '}
          are intentionally generic — replace them with your project's design register before
          building components.
        </p>
        <div className="flex items-center gap-3">
          <Button>Start building</Button>
          <Button variant="outline">View the README</Button>
          <span className="text-sm text-muted-foreground">
            API:{' '}
            <span
              className={
                health === 'ok'
                  ? 'text-foreground'
                  : health === 'error'
                    ? 'text-destructive'
                    : 'text-muted-foreground'
              }
            >
              {health === 'checking' ? 'checking…' : health === 'ok' ? '/api/health 200' : 'down'}
            </span>
          </span>
        </div>
      </div>
    </main>
  );
}
