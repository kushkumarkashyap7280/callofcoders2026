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
    <div className="min-h-screen bg-white dark:bg-black w-full overflow-x-hidden">
    
      {children}
    </div>
  );
}
