
import { createClient } from '@supabase/supabase-js';
import { Word, PublicUser, StudentRequest, Book, GalleryImage, Song, Video, Admin } from '../types';

const SUPABASE_URL = 'https://vuvwmcvlddfbqihtuqce.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_KQ05A8H21ffmgfi7zopURw_cb8Zzuhw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const db = {
  devAuth: {
    async get() {
      const { data, error } = await supabase.from('dev_auth').select('*').eq('id', 'primary_dev').single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    async setup(phone: string, pass: string, name: string) {
      const { error } = await supabase.from('dev_auth').upsert({
        id: 'primary_dev',
        phone,
        password: pass,
        name,
        created_at: Date.now()
      });
      if (error) throw error;
    }
  },
  words: {
    async fetchAll() {
      const { data, error } = await supabase.from('words').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(w => ({
        id: w.id,
        english: w.english,
        assamese: w.assamese,
        taiKhamyang: w.tai_khamyang,
        additionalLang: w.additional_lang,
        pronunciation: w.pronunciation,
        exampleSentence: w.example_sentence,
        sentenceMeaning: w.sentence_meaning,
        category: w.category,
        imageUrl: w.image_url,
        audioUrl: w.audio_url,
        createdAt: w.created_at,
        addedBy: w.added_by
      })) as Word[];
    },
    async upsert(word: Word) {
      const { error } = await supabase.from('words').upsert({
        id: word.id,
        english: word.english,
        assamese: word.assamese,
        tai_khamyang: word.taiKhamyang,
        additional_lang: word.additionalLang,
        pronunciation: word.pronunciation,
        example_sentence: word.exampleSentence,
        sentence_meaning: word.sentenceMeaning,
        category: word.category,
        image_url: word.imageUrl,
        audio_url: word.audioUrl,
        created_at: word.createdAt,
        added_by: word.addedBy
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('words').delete().eq('id', id);
      if (error) throw error;
    }
  },
  staff: {
    async fetchAll() {
      const { data, error } = await supabase.from('staff').select('*');
      if (error) throw error;
      return (data || []).map(s => ({
        name: s.name,
        phone: s.phone,
        password: s.password,
        permissions: s.permissions
      })) as Admin[];
    },
    async upsert(admin: Admin) {
      const { error } = await supabase.from('staff').upsert({
        phone: admin.phone,
        name: admin.name,
        password: admin.password,
        permissions: admin.permissions
      });
      if (error) throw error;
    },
    async delete(phone: string) {
      const { error } = await supabase.from('staff').delete().eq('phone', phone);
      if (error) throw error;
    }
  },
  books: {
    async fetchAll() {
      const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(b => ({
        id: b.id,
        title: b.title,
        author: b.author,
        description: b.description,
        pdfUrl: b.pdf_url,
        addedBy: b.added_by,
        createdAt: b.created_at
      })) as Book[];
    },
    async upsert(book: Book) {
      const { error } = await supabase.from('books').upsert({
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        pdf_url: book.pdfUrl,
        added_by: book.addedBy,
        created_at: book.createdAt
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('books').delete().eq('id', id);
      if (error) throw error;
    }
  },
  gallery: {
    async fetchAll() {
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(g => ({
        id: g.id,
        url: g.url,
        caption: g.caption,
        addedBy: g.added_by,
        createdAt: g.created_at
      })) as GalleryImage[];
    },
    async upsert(img: GalleryImage) {
      const { error } = await supabase.from('gallery').upsert({
        id: img.id,
        url: img.url,
        caption: img.caption,
        added_by: img.addedBy,
        created_at: img.createdAt
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (error) throw error;
    }
  },
  songs: {
    async fetchAll() {
      const { data, error } = await supabase.from('songs').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(s => ({
        id: s.id,
        title: s.title,
        artist: s.artist,
        audioUrl: s.audio_url,
        addedBy: s.added_by,
        createdAt: s.created_at
      })) as Song[];
    },
    async upsert(song: Song) {
      const { error } = await supabase.from('songs').upsert({
        id: song.id,
        title: song.title,
        artist: song.artist,
        audio_url: song.audioUrl,
        added_by: song.addedBy,
        created_at: song.createdAt
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('songs').delete().eq('id', id);
      if (error) throw error;
    }
  },
  videos: {
    async fetchAll() {
      const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(v => ({
        id: v.id,
        title: v.title,
        youtubeUrl: v.youtube_url,
        addedBy: v.added_by,
        createdAt: v.created_at
      })) as Video[];
    },
    async upsert(video: Video) {
      const { error } = await supabase.from('videos').upsert({
        id: video.id,
        title: video.title,
        youtube_url: video.youtubeUrl,
        added_by: video.addedBy,
        created_at: video.createdAt
      });
      if (error) throw error;
    },
    async delete(id: string) {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
    }
  },
  users: {
    async fetchAll() {
      const { data, error } = await supabase.from('community_users').select('*').order('registered_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(u => ({
        id: u.id,
        name: u.name,
        address: u.address,
        phone: u.phone,
        password: u.password,
        registeredAt: u.registered_at,
        avatar_url: u.avatar_url
      })) as PublicUser[];
    },
    async upsert(user: PublicUser) {
      const { error } = await supabase.from('community_users').upsert({
        id: user.id,
        name: user.name,
        address: user.address,
        phone: user.phone,
        password: user.password,
        registered_at: user.registeredAt,
        avatar_url: user.avatarUrl
      });
      if (error) throw error;
    }
  },
  studentRequests: {
    async fetchAll() {
      const { data, error } = await supabase.from('student_requests').select('*').order('requested_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(r => ({
        id: r.id,
        name: r.name,
        phone: r.phone,
        password: r.password,
        email: r.email,
        address: r.address,
        photoUrl: r.photo_url,
        status: r.status,
        requestedAt: r.requested_at,
        canAccessExam: r.can_access_exam
      })) as StudentRequest[];
    },
    async upsert(request: StudentRequest) {
      const { error } = await supabase.from('student_requests').upsert({
        id: request.id,
        name: request.name,
        phone: request.phone,
        password: request.password,
        email: request.email,
        address: request.address,
        photo_url: request.photoUrl,
        status: request.status,
        requested_at: request.requestedAt,
        can_access_exam: request.canAccessExam
      });
      if (error) throw error;
    }
  }
};
