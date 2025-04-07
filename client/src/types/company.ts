export interface Company {
  id: string;
  slug: string;
  name: string;
  nameForEmails: string;
  site?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  description?: string;
  isPublic?: boolean;
  industry?: string;
  phone?: string;
  employees?: string;
  rating?: number;
  reviewCount?: number;
  reviewsLink?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  photo?: string;
  categories?: string[];
  primaryCategory?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
}

export interface Review {
  id: string;
  companyId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  initials: string;
  avatarColor: string;
}
