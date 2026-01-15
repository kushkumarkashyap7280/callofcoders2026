'use client'

import Link from 'next/link'
import { Code2, Heart } from 'lucide-react'
import { footerLinks, socialLinks } from '@/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800 overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-2 space-y-3 sm:space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Code2 className="h-8 w-8 text-blue-600 dark:text-blue-500 transform group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <span className="text-2xl font-heading font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Kush Kumar
              </span>
            </Link>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              Full Stack Developer & Software Engineer. Building modern web applications and sharing knowledge through free tools and resources.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-600 dark:text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-110`}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="space-y-4">
            <h3 className="text-sm font-heading font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-heading font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-heading font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

       

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 text-center">
              <span>© {currentYear} Kush Kumar. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center">
                Made with <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mx-1 animate-pulse" /> in India
              </span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm flex-wrap justify-center">
              <Link
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors whitespace-nowrap"
              >
                Status
              </Link>
              <Link
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors whitespace-nowrap"
              >
                Changelog
              </Link>
              <Link
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors whitespace-nowrap"
              >
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
    </footer>
  )
}
