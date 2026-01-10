// Course types
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  lessons?: Lesson[];
}

// Lesson types
export interface Lesson {
  id: string;
  title: string;
  slug: string;
  content: string;
  order: number;
  courseId: string;
  createdAt: Date;
  updatedAt: Date;
  course?: Course;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

// Code execution types
export interface CodeExecutionRequest {
  language: string;
  code: string;
}

export interface CodeExecutionResponse {
  output: string;
  success: boolean;
  error?: string;
}

// User types (for future auth implementation)
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

// Form types
export interface CourseFormData {
  title: string;
  slug: string;
  description?: string;
  order: number;
}

export interface LessonFormData {
  title: string;
  slug: string;
  content: string;
  order: number;
  courseId: string;
}
