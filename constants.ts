
import { Word } from './types';

export const INITIAL_WORDS: Word[] = [
  {
    id: '1',
    english: 'Water',
    assamese: 'পানী',
    taiKhamyang: 'Nam',
    additionalLang: 'Pani (Hindi)',
    pronunciation: 'Nam',
    exampleSentence: 'Water is essential for life.',
    category: 'Nature',
    addedBy: 'owner',
    createdAt: Date.now()
  },
  {
    id: '2',
    english: 'Home',
    assamese: 'ঘৰ',
    taiKhamyang: 'Hun',
    additionalLang: 'Ghar (Hindi)',
    pronunciation: 'Hun',
    exampleSentence: 'I am going home.',
    category: 'Place',
    addedBy: 'owner',
    createdAt: Date.now()
  }
];

export const APP_THEME = {
  primary: '#1e40af', // Blue 800
  secondary: '#f59e0b', // Amber 500
  accent: '#10b981', // Emerald 500
};
