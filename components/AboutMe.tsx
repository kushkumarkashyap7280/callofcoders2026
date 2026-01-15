'use client'

import { motion } from 'framer-motion'
import { Code2, Briefcase, GraduationCap, Award, Github, Linkedin, Mail, MapPin, Sparkles } from 'lucide-react'

export default function AboutMe() {
  const skills = [
    { name: 'JavaScript', color: 'from-yellow-400 to-yellow-600' },
    { name: 'TypeScript', color: 'from-blue-400 to-blue-600' },
    { name: 'React', color: 'from-cyan-400 to-cyan-600' },
    { name: 'Next.js', color: 'from-gray-800 to-black' },
    { name: 'Node.js', color: 'from-green-400 to-green-600' },
    { name: 'Python', color: 'from-blue-500 to-yellow-500' },
    { name: 'Java', color: 'from-red-500 to-orange-500' },
    { name: 'C++', color: 'from-blue-600 to-purple-600' },
    { name: 'HTML & CSS', color: 'from-orange-400 to-pink-500' },
    { name: 'Docker', color: 'from-blue-400 to-blue-700' },
    { name: 'Git', color: 'from-orange-500 to-red-600' },
    { name: 'VS Code', color: 'from-blue-500 to-blue-700' },
    { name: 'DSA', color: 'from-purple-400 to-purple-600' },
    { name: 'Postman', color: 'from-orange-400 to-orange-600' },
  ]

  const experiences = [
    {
      title: 'Full Stack Developer',
      company: 'CallOfCoders',
      period: '2024 - Present',
      description: 'Building a comprehensive developer platform with online compiler, learning resources, and community features.',
      icon: Code2,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-2xl opacity-50 animate-pulse" />
                <div className="relative w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                  <span className="text-5xl font-bold text-white">KK</span>
                </div>
              </div>
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Kush Kumar
              </h1>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <p className="text-2xl md:text-3xl text-zinc-700 dark:text-zinc-300 font-semibold">
                  Full Stack Developer
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-zinc-600 dark:text-zinc-400">
                <MapPin className="w-4 h-4" />
                <span>Building the future, one line of code at a time</span>
              </div>
            </div>

            {/* Social Links */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-center gap-4"
            >
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href="https://github.com/kushkumar"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all shadow-lg"
              >
                <Github className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href="https://linkedin.com/in/kushkumar"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all shadow-lg"
              >
                <Linkedin className="w-5 h-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:kushkumar.officialsoftwaredev@gmail.com"
                className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:text-white transition-all shadow-lg"
              >
                <Mail className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </motion.div>

          {/* About Section */}
          <motion.div variants={itemVariants} className="bg-white/70 dark:bg-zinc-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-zinc-700/50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">About Me</h2>
            </div>
            <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Hi! I'm <span className="font-semibold text-purple-600 dark:text-purple-400">Kush Kumar</span>, a passionate Full Stack Developer with expertise in modern web technologies. 
              I created <span className="font-semibold text-blue-600 dark:text-blue-400">CallOfCoders</span> as both my personal portfolio and a platform to help developers learn, practice, and collaborate. 
              I love building scalable applications, solving complex problems, and sharing knowledge with the developer community.
            </p>
          </motion.div>

          {/* Skills Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">Skills & Technologies</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <div className="relative overflow-hidden bg-white dark:bg-zinc-800 rounded-2xl p-4 shadow-lg border border-zinc-200 dark:border-zinc-700 hover:shadow-2xl transition-all">
                    <div className={`absolute inset-0 bg-gradient-to-r ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                    <p className="relative text-center font-semibold text-zinc-800 dark:text-zinc-100">
                      {skill.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Experience Section */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">Experience</h2>
            </div>
            <div className="space-y-6">
              {experiences.map((exp, index) => {
                const Icon = exp.icon
                return (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="bg-white/70 dark:bg-zinc-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 dark:border-zinc-700/50"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{exp.title}</h3>
                        <p className="text-purple-600 dark:text-purple-400 font-semibold">{exp.company}</p>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">{exp.period}</p>
                        <p className="text-zinc-700 dark:text-zinc-300">{exp.description}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-4">Let's Build Something Amazing Together!</h2>
            <p className="text-lg mb-6 text-white/90">
              Interested in collaborating or have a project in mind? Let's connect!
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:kushkumar.officialsoftwaredev@gmail.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Mail className="w-5 h-5" />
              Get In Touch
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
