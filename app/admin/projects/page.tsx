'use client'

import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink, Github } from 'lucide-react'

export default function AdminProjectsPage() {
  // TODO: Fetch from API - prisma.project.findMany({ orderBy: { sequenceNo: 'asc' } })
  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      desc: 'Full-stack e-commerce solution with Next.js and Stripe',
      technologies: ['Next.js', 'TypeScript', 'Stripe', 'Prisma'],
      imgUrl: null,
      projectLiveLink: 'https://example.com',
      sourceCodeLink: 'https://github.com/example',
      isPublished: true,
      sequenceNo: 1,
      createdAt: new Date('2025-12-01'),
    },
    {
      id: 2,
      title: 'Task Management App',
      desc: 'Collaborative task management with real-time updates',
      technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      imgUrl: null,
      projectLiveLink: 'https://example.com',
      sourceCodeLink: 'https://github.com/example',
      isPublished: true,
      sequenceNo: 2,
      createdAt: new Date('2025-11-15'),
    },
    {
      id: 3,
      title: 'Portfolio Website',
      desc: 'Modern portfolio with animations and dark mode',
      technologies: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
      imgUrl: null,
      projectLiveLink: null,
      sourceCodeLink: 'https://github.com/example',
      isPublished: false,
      sequenceNo: 3,
      createdAt: new Date('2025-10-20'),
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Manage Projects
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Showcase your portfolio projects
            </p>
          </div>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Project
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Projects</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{projects.length}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Published</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {projects.filter(p => p.isPublished).length}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Drafts</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {projects.filter(p => !p.isPublished).length}
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-all"
            >
              {/* Project Image */}
              <div className="aspect-video bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                {project.imgUrl ? (
                  <img src={project.imgUrl} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-zinc-400 dark:text-zinc-500">Project Image</span>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    {project.title}
                  </h3>
                  {project.isPublished ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded shrink-0">
                      <Eye className="w-3 h-3" />
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded shrink-0">
                      <EyeOff className="w-3 h-3" />
                      Draft
                    </span>
                  )}
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  {project.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mb-4">
                  {project.projectLiveLink && (
                    <a 
                      href={project.projectLiveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Live
                    </a>
                  )}
                  {project.sourceCodeLink && (
                    <>
                      {project.projectLiveLink && <span>•</span>}
                      <a 
                        href={project.sourceCodeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Github className="w-3 h-3" />
                        Source
                      </a>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      // TODO: Toggle isPublished
                      console.log('Toggle publish:', project.id)
                    }}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                      project.isPublished
                        ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                        : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                    }`}
                  >
                    {project.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {project.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => {
                      // TODO: Delete project
                      if (confirm('Are you sure you want to delete this project?')) {
                        console.log('Delete:', project.id)
                      }
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
