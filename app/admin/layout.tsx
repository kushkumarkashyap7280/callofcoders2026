import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Admin Header */}
      <header className="bg-zinc-900 text-white dark:bg-zinc-950">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-4">
              <a href="/" className="text-sm hover:underline">User Portal</a>
              <a href="/admin" className="text-sm hover:underline">Dashboard</a>
              <a href="/admin/users" className="text-sm hover:underline">Users</a>
              <a href="/admin/settings" className="text-sm hover:underline">Settings</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Admin Sidebar and Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 min-h-[calc(100vh-64px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <a href="/admin" className="block px-4 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/admin/users" className="block px-4 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700">
                  Users
                </a>
              </li>
              <li>
                <a href="/admin/analytics" className="block px-4 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700">
                  Analytics
                </a>
              </li>
              <li>
                <a href="/admin/settings" className="block px-4 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700">
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
