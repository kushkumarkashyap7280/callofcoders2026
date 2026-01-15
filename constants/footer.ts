import { Github, Linkedin, Twitter, Mail, LucideIcon } from 'lucide-react'

export interface FooterLink {
  name: string
  href: string
}

export interface SocialLink {
  name: string
  icon: LucideIcon
  href: string
  color: string
}

export const footerLinks = {
  product: [
    { name: 'Compiler', href: '/compiler' },
    { name: 'About', href: '/about' },
    { name: 'Profile', href: '/profile' },
  ],
  resources: [
    { name: 'Documentation', href: '#' },
    { name: 'Tutorials', href: '#' },
    { name: 'Blog', href: '#' },
  ],
  company: [
    { name: 'About Me', href: '/about' },
    { name: 'Contact', href: '#contact' },
    { name: 'Privacy Policy', href: '#' },
  ],
  legal: [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
}

export const socialLinks: SocialLink[] = [
  { 
    name: 'GitHub', 
    icon: Github, 
    href: 'https://github.com/kushkumarkashyap', 
    color: 'hover:text-gray-900 dark:hover:text-white' 
  },
  { 
    name: 'LinkedIn', 
    icon: Linkedin, 
    href: 'https://linkedin.com/in/kushkumar', 
    color: 'hover:text-blue-600' 
  },
  { 
    name: 'Twitter', 
    icon: Twitter, 
    href: 'https://twitter.com/kushkumar', 
    color: 'hover:text-blue-400' 
  },
  { 
    name: 'Email', 
    icon: Mail, 
    href: 'mailto:kushkumarkashyap7280@gmail.com', 
    color: 'hover:text-red-500' 
  },
]
