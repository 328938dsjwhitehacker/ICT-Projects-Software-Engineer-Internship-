export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <header className="border-b bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="font-semibold text-lg tracking-tight">
            VCE Study Planner
          </div>

          <div className="flex items-center gap-3">
            {/* Placeholder for user avatar or email */}
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        {children}
      </main>
    </div>
  );
}