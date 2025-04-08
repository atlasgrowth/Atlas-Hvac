export interface Company {
  id: number;
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
  
  // Status fields
  status?: 'prospect' | 'active' | 'inactive' | 'archived';
  leadStatus?: 'new' | 'in_pipeline' | 'converted' | 'lost';
  pipelineStage?: 'new_lead' | 'contacted' | 'website_sent' | 'website_viewed' | 'meeting_scheduled' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';
  pipelineValue?: number;
  pipelineProbability?: number;
  
  // Contact fields
  assignedUserId?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  notes?: string;
  lastContactedAt?: string;
  nextFollowUpDate?: string;
  
  // Website fields
  customDomain?: string;
  domainSetupComplete?: boolean;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
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
