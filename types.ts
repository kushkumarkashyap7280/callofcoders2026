
interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  externalLink: string | null;
  tags: string[];
  isPublished: boolean;
  instructor: string | null;
  level: string | null;
  duration: string | null;
  price: number | null;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    lessons: number;
    enrollments: number;
  };
}

export type { Course };