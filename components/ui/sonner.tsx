"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand={true}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white/70 dark:group-[.toaster]:bg-zinc-900/70 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-white/10 dark:group-[.toaster]:border-zinc-800/50 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl group-[.toaster]:p-4",
          description: "group-[.toast]:text-zinc-600 dark:group-[.toast]:text-zinc-400 group-[.toast]:text-sm group-[.toast]:mt-1",
          actionButton:
            "group-[.toast]:bg-gradient-to-r group-[.toast]:from-blue-600 group-[.toast]:via-purple-600 group-[.toast]:to-pink-600 group-[.toast]:hover:from-blue-700 group-[.toast]:hover:via-purple-700 group-[.toast]:hover:to-pink-700 group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:font-medium group-[.toast]:shadow-lg group-[.toast]:shadow-purple-500/30 group-[.toast]:transition-all group-[.toast]:duration-200",
          cancelButton:
            "group-[.toast]:bg-transparent group-[.toast]:border group-[.toast]:border-zinc-300 dark:group-[.toast]:border-zinc-600 group-[.toast]:text-zinc-700 dark:group-[.toast]:text-zinc-300 group-[.toast]:hover:bg-zinc-100 dark:group-[.toast]:hover:bg-zinc-800 group-[.toast]:rounded-lg group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:font-medium",
          closeButton: "group-[.toast]:bg-zinc-100 dark:group-[.toast]:bg-zinc-800 group-[.toast]:border group-[.toast]:border-zinc-200 dark:group-[.toast]:border-zinc-700 group-[.toast]:text-zinc-700 dark:group-[.toast]:text-zinc-300 group-[.toast]:hover:bg-zinc-200 dark:group-[.toast]:hover:bg-zinc-700",
          success: "group-[.toaster]:border-green-500/20",
          error: "group-[.toaster]:border-red-500/20",
          info: "group-[.toaster]:border-blue-500/20",
          warning: "group-[.toaster]:border-yellow-500/20",
          loading: "group-[.toaster]:border-zinc-500/20",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
