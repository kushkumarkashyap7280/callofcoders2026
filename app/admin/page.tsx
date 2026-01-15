import type { Metadata } from "next";
import Link from 'next/link'
import { 
  BookOpen, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Users, 
  TrendingUp,
  Eye,
  CheckCircle,
  Clock
} from 'lucide-react'

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  // TODO: Fetch real stats from API
  const stats = {
    totalCourses: 12,
    publishedCourses: 8,
    totalLessons: 156,
    totalUsers: 1247,
    totalEnrollments: 3421,
    activeLearners: 892,
    totalBlogs: 24,
    publishedBlogs: 18,
    totalProjects: 15,
    publishedProjects: 12,
  }

  const recentActivity = [
    { type: 'enrollment', user: 'john@example.com', course: 'React Fundamentals', time: '5 min ago' },
    { type: 'completion', user: 'jane@example.com', course: 'JavaScript Basics', time: '1 hour ago' },
    { type: 'signup', user: 'mike@example.com', course: null, time: '2 hours ago' },
    { type: 'enrollment', user: 'sarah@example.com', course: 'Next.js Mastery', time: '3 hours ago' },
  ]

  const popularCourses = [
    { title: 'JavaScript Fundamentals', enrollments: 524, completion: 68 },
    { title: 'React Complete Guide', enrollments: 432, completion: 71 },
    { title: 'Next.js Fullstack', enrollments: 387, completion: 65 },
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Manage your courses, content, and users
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Courses</h3>
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalCourses}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {stats.publishedCourses} published
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Total Users</h3>
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalUsers}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {stats.activeLearners} active learners
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Enrollments</h3>
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalEnrollments}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              {stats.totalLessons} lessons
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Content</h3>
              <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.totalBlogs + stats.totalProjects}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Blogs & Projects
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/courses"
              className="group bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all"
            >
              <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Manage Courses
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Create and edit courses
              </p>
            </Link>

            <Link
              href="/admin/blogs"
              className="group bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition-all"
            >
              <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Manage Blogs
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Write and publish blogs
              </p>
            </Link>

            <Link
              href="/admin/projects"
              className="group bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:border-green-500 dark:hover:border-green-500 hover:shadow-lg transition-all"
            >
              <Briefcase className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                Manage Projects
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Showcase your work
              </p>
            </Link>

            <Link
              href="/admin/users"
              className="group bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:border-amber-500 dark:hover:border-amber-500 hover:shadow-lg transition-all"
            >
              <Users className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-3" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Manage Users
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                View and manage users
              </p>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-700 last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    activity.type === 'enrollment' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    activity.type === 'completion' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-purple-100 dark:bg-purple-900/30'
                  }`}>
                    {activity.type === 'enrollment' ? <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" /> :
                     activity.type === 'completion' ? <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" /> :
                     <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-zinc-900 dark:text-zinc-100">
                      <span className="font-medium">{activity.user}</span>
                      {activity.type === 'enrollment' && <> enrolled in <span className="font-medium">{activity.course}</span></>}
                      {activity.type === 'completion' && <> completed <span className="font-medium">{activity.course}</span></>}
                      {activity.type === 'signup' && <> signed up</>}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Courses */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Popular Courses</h2>
            <div className="space-y-4">
              {popularCourses.map((course, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{course.title}</h3>
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">{course.enrollments} students</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                      <span>Completion Rate</span>
                      <span>{course.completion}%</span>
                    </div>
                    <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all"
                        style={{ width: `${course.completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

