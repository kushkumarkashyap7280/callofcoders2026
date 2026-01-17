export interface NavLink {
  href: string
  label: string
  show: boolean | ((isAuthenticated: boolean, isAdmin: boolean) => boolean)
}

export const createNavLinks = (isAuthenticated: boolean, isAdmin: boolean, username?: string): NavLink[] => [
  { href: '/', label: 'Home', show: true },
  { href: '/about', label: 'About', show: true },
  { href: '/courses', label: 'Courses', show: true },
  { href: '/compiler', label: 'Compiler', show: true },
  { href: '/blogs', label: 'Blogs', show: true },
  { href: username ? `/${username}` : '/login', label: 'Profile', show: isAuthenticated && !isAdmin },
  { href: '/admin', label: 'Admin', show: isAdmin },
]
