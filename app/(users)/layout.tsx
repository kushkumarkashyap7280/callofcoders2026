import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Portal",
  description: "Default user layout",
};

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* User Header/Navigation */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <h1 className="text-xl font-bold">User Portal</h1>
            <div className="flex gap-4">
              <a href="/" className="text-sm hover:underline">Home</a>
              <a href="/admin" className="text-sm hover:underline">Admin</a>
            </div>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
