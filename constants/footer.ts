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

// All social media links for the platform
export const allSocialLinks = [
  {
    name: "Facebook",
    platform: "facebook",
    color: "#1877F2",
    link: "https://www.facebook.com/people/Call-of-Coders/61566491841146/?sk=about",
  },
  {
    name: "Instagram",
    platform: "instagram",
    color: "#E4405F",
    link: "https://www.instagram.com/callofcoders/",
  },
  {
    name: "YouTube",
    platform: "youtube",
    color: "#FF0000",
    link: "https://www.youtube.com/@callofcodersbykush",
  },
  {
    name: "LinkedIn",
    platform: "linkedin",
    color: "#0A66C2",
    link: "https://www.linkedin.com/in/kush-kumar-b10020302/",
  },
  {
    name: "X",
    platform: "twitter",
    color: "#000000",
    link: "https://x.com/CallOfCoders",
  },
  {
    name: "GitHub",
    platform: "github",
    color: "#333333",
    link: "https://github.com/kushkumarkashyap7280",
  },
  {
    name: "LeetCode",
    platform: "leetcode",
    color: "#FFA116",
    link: "https://leetcode.com/kushkumarkashyap7280",
  },
]

export const footerLinks = {
  product: [
    { name: 'Compiler', href: '/compiler' },
    { name: 'About', href: '/about' },
    { name: 'Login', href: '/login' },
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
    href: 'https://github.com/kushkumarkashyap7280', 
    color: 'hover:text-gray-900 dark:hover:text-white' 
  },
  { 
    name: 'LinkedIn', 
    icon: Linkedin, 
    href: 'https://www.linkedin.com/in/kush-kumar-b10020302/', 
    color: 'hover:text-blue-600' 
  },
  { 
    name: 'Twitter', 
    icon: Twitter, 
    href: 'https://x.com/CallOfCoders', 
    color: 'hover:text-blue-400' 
  },
  { 
    name: 'Email', 
    icon: Mail, 
    href: 'mailto:kushkumar.officialsoftwaredev@gmail.com', 
    color: 'hover:text-red-500' 
  },
]
