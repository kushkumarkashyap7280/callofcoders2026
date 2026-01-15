export interface NavLink {
  href: string
  label: string
  show: boolean | ((isAuthenticated: boolean, isAdmin: boolean) => boolean)
}

export const createNavLinks = (isAuthenticated: boolean, isAdmin: boolean): NavLink[] => [
  { href: '/', label: 'Home', show: true },
  { href: '/about', label: 'About', show: true },
  { href: '/compiler', label: 'Compiler', show: true },
  { href: '/profile', label: 'Profile', show: isAuthenticated && !isAdmin },
  { href: '/admin', label: 'Admin', show: isAdmin },
]
