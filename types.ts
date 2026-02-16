
export interface AdminPermissions {
  dictionary: boolean;
  library: boolean;
  gallery: boolean;
  songs: boolean;
  videos: boolean;
  exams: boolean;
}

export interface Admin {
  name: string;
  phone: string;
  password?: string;
  permissions: AdminPermissions;
}

export interface PublicUser {
  id: string;
  name: string;
  address: string;
  phone: string;
  password?: string;
  registeredAt: number;
  avatarUrl?: string;
}

export interface StudentRequest {
  id: string;
  name: string;
  phone: string;
  password?: string;
  email: string;
  address: string;
  photoUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: number;
  canAccessExam?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
  status: 'sent' | 'seen';
  isRead: boolean;
}

export interface ExamQuestion {
  id: string;
  type: 'translation' | 'mcq';
  word: string;
  correctAnswer: string;
  options?: string[]; // Only for MCQ
  audioUrl?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: ExamQuestion[];
  createdBy: string;
  createdAt: number;
  timeLimitMinutes: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Scholar';
  isPublished: boolean;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answers: { questionId: string, answer: string }[];
  submittedAt: number;
  score?: number;
  totalQuestions: number;
  grade?: string;
}

export interface Word {
  id: string;
  english: string;
  assamese: string;
  taiKhamyang: string;
  additionalLang?: string;
  pronunciation?: string;
  exampleSentence?: string;
  sentenceMeaning?: string;
  category: string;
  addedBy: string;
  createdAt: number;
  imageUrl?: string;
  audioUrl?: string;
  isOfflineReady?: boolean; 
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'owner' | 'admin' | 'viewer' | 'student';
  permissions?: AdminPermissions;
  studentStatus?: 'pending' | 'approved' | 'rejected';
  canAccessExam?: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  pdfUrl: string;
  addedBy: string;
  createdAt: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  addedBy: string;
  createdAt: number;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  addedBy: string;
  createdAt: number;
}

export interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  addedBy: string;
  createdAt: number;
}

// Added missing OfflinePack interface to fix import error in components/OfflineCenter.tsx
export interface OfflinePack {
  id: string;
  name: string;
  desc: string;
  size: string;
  isDownloaded?: boolean;
}
