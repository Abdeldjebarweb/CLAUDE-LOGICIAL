export interface Article {
  id: string
  title: string
  slug: string
  content: string
  image_url: string | null
  category: string
  author: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  title: string
  description: string
  image_url: string | null
  date: string
  time: string
  location: string
  maps_link: string | null
  capacity: number | null
  is_free: boolean
  price: number | null
  organizer: string
  registration_link: string | null
  status: 'upcoming' | 'past'
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  description: string | null
  photo_url: string | null
  email: string | null
  order_index: number
  is_active: boolean
}

export interface Partner {
  id: string
  name: string
  description: string | null
  logo_url: string | null
  website: string | null
  category: string
}

export interface GalleryItem {
  id: string
  image_url: string
  caption: string | null
  album: string | null
  created_at: string
}

export interface Membership {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  city: string
  institution: string
  field: string
  level: string
  arrival_year: string
  message: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface HelpRequest {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  age: number
  institution: string
  field: string
  situation: string
  help_type: string
  urgency: 'low' | 'medium' | 'high' | 'critical'
  description: string
  attachment_url: string | null
  status: 'new' | 'in_progress' | 'resolved' | 'closed'
  created_at: string
}

export interface Contact {
  id: string
  name: string
  email: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export interface Donation {
  id: string
  donor_name: string
  donor_email: string
  amount: number
  message: string | null
  status: 'pending' | 'completed'
  created_at: string
}

export interface PageContent {
  id: string
  page_slug: string
  section_key: string
  content: string
  updated_at: string
  updated_by: string | null
}

export interface SiteSettings {
  id: string
  key: string
  value: string
}
