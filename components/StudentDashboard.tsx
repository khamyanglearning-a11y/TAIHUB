
import React, { useState, useEffect, useCallback } from 'react';
import { User, Word, Book, Video, Exam, ExamSubmission, ExamQuestion } from '../types';
import WordList from './WordList';
import BookSection from './BookSection';
import VideoSection from './VideoSection';
// Import PronunciationPracticeModal to enable speech practice for students
import PronunciationPracticeModal from './PronunciationPracticeModal';

interface StudentDashboardProps {
  user: User;
  words: Word[];
  books: Book[];
  videos: Video[];
  exams: Exam[];
  submissions: ExamSubmission[];
  onExamSubmit: (submission: ExamSubmission) => void;
  onLogout: () => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  user, words, books, videos, exams, submissions, onExamSubmit, onLogout 
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'live' | 'learning' | 'library' | 'exam' | 'videos'>('learning');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [takingExam, setTakingExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ questionId: string, answer: string }[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<ExamSubmission | null>(null);
  // State to manage the word currently being practiced for pronunciation
  const [practiceWord, setPracticeWord] = useState<Word | null>(null);

  const navItems = [
    { id: 'live', label: 'Live Class', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'learning', label: 'Tai Learning', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253' },
    { id: 'library', label: 'Book Store', icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
    { id: 'exam', label: 'Exam Hall', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
    { id: 'videos', label: 'Learning Video', icon: 'M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z' }
  ];

  const getGrade = (score: number, total: number) => {
    const pct = (score / total) * 100;
    if (pct >= 90) return { grade: 'A+', color: 'text-emerald-500', desc: 'Expert Scholar' };
    if (pct >= 75) return { grade: 'A', color: 'text-blue-500', desc: 'Brilliant Mind' };
    if (pct >= 50) return { grade: 'B', color: 'text-amber-500', desc: 'Good Learner' };
    return { grade: 'C', color: 'text-red-500', desc: 'Keep Practicing' };
  };

  const submitExam = useCallback(() => {
    if (!takingExam) return;
    
    let correctCount = 0;
    answers.forEach(ans => {
      const q = takingExam.questions.find(quest => quest.id === ans.questionId);
      if (q && q.correctAnswer.trim().toLowerCase() === ans.answer.trim().toLowerCase()) {
        correctCount++;
      }
    });

    const gradeInfo = getGrade(correctCount, takingExam.questions.length);
    const submission: ExamSubmission = {
      id: Date.now().toString(),
      examId: takingExam.id,
      studentId: user.id,
      studentName: user.name,
      answers,
      submittedAt: Date.now(),
      score: correctCount,
      totalQuestions: takingExam.questions.length,
      grade: gradeInfo.grade
    };
    
    onExamSubmit(submission);
    setResult(submission);
    setTakingExam(null);
  }, [takingExam, answers, user, onExamSubmit]);

  useEffect(() => {
    if (!takingExam || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [takingExam, timeLeft, submitExam]);

  const startExam = (exam: Exam) => {
    setResult(null);
    setTakingExam(exam);
    setCurrentQuestionIndex(0);
    setAnswers(exam.questions.map(q => ({ questionId: q.id, answer: '' })));
    setTimeLeft(exam.timeLimitMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (result) {
    const gradeInfo = getGrade(result.score || 0, result.totalQuestions);
    return (
      <div className="min-h-screen bg-white p-6 md:p-20 flex flex-col items-center justify-center animate-in fade-in duration-500">
         <div className="w-full max-w-lg bg-gray-50 rounded-[3.5rem] p-12 text-center shadow-2xl border border-white">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl text-4xl">🎓</div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Exam Summary</h2>
            <div className="mt-12 space-y-2">
               <span className={`text-7xl font-black ${gradeInfo.color}`}>{gradeInfo.grade}</span>
               <p className="text-sm font-black text-gray-400 uppercase tracking-widest">{gradeInfo.desc}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-12">
               <div className="bg-white p-6 rounded-3xl border border-gray-100"><span className="text-[10px] font-black text-gray-300 uppercase block mb-1">Score</span><p className="text-2xl font-black text-gray-800">{result.score} / {result.totalQuestions}</p></div>
               <div className="bg-white p-6 rounded-3xl border border-gray-100"><span className="text-[10px] font-black text-gray-300 uppercase block mb-1">Percentage</span><p className="text-2xl font-black text-gray-800">{Math.round(((result.score || 0) / result.totalQuestions) * 100)}%</p></div>
            </div>
            <button onClick={() => { setResult(null); setActiveSubTab('exam'); }} className="w-full mt-10 py-5 bg-gray-900 hover:bg-black text-white rounded-2xl font-black shadow-xl transition-all active:scale-95">Return to Exam Hall</button>
         </div>
      </div>
    );
  }

  if (takingExam) {
    const question = takingExam.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / takingExam.questions.length) * 100;
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-orange-100">Q</div>
            <div><h2 className="text-xl font-black text-gray-900 tracking-tighter line-clamp-1">{takingExam.title}</h2><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Scholar: {user.name}</p></div>
          </div>
          <div className="flex items-center gap-6">
            <div className={`flex flex-col items-end ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
               <span className="text-[10px] font-black uppercase tracking-widest">Remaining</span>
               <span className="text-2xl font-black tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            <button onClick={() => { if(window.confirm("Abort?")) setTakingExam(null); }} className="p-2 text-gray-300 hover:text-red-500"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        </header>
        <div className="h-1.5 w-full bg-gray-50"><div className="h-full bg-orange-600 transition-all duration-700 ease-out" style={{ width: `${progress}%` }}></div></div>
        <main className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-20 flex flex-col items-center">
           <div className="w-full max-w-2xl space-y-12 animate-in slide-in-from-bottom-6 duration-500">
             <div className="text-center space-y-6">
               <span className="px-4 py-1.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest">Question {currentQuestionIndex + 1} of {takingExam.questions.length}</span>
               <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{question.word}</h3>
             </div>
             <div className="space-y-6">
                {question.type === 'mcq' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.options?.map((opt, i) => (
                      <button key={i} onClick={() => setAnswers(prev => prev.map(a => a.questionId === question.id ? { ...a, answer: opt } : a))} className={`p-6 rounded-[2rem] border-2 transition-all text-lg font-black text-left flex items-center gap-4 ${answers.find(a => a.questionId === question.id)?.answer === opt ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border-gray-100 text-gray-700 hover:border-blue-200 hover:shadow-lg'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${answers.find(a => a.questionId === question.id)?.answer === opt ? 'bg-white/20' : 'bg-gray-50 text-gray-400'}`}>{String.fromCharCode(65 + i)}</div>
                        {opt}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input className="w-full px-10 py-8 bg-gray-50 border-4 border-transparent focus:border-blue-500 focus:bg-white rounded-[2.5rem] outline-none text-3xl font-black text-center shadow-inner transition-all" placeholder="Type here..." autoFocus value={answers.find(a => a.questionId === question.id)?.answer || ''} onChange={e => setAnswers(prev => prev.map(a => a.questionId === question.id ? { ...a, answer: e.target.value } : a))} />
                )}
             </div>
             <footer className="flex justify-between items-center pt-12">
               <button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(prev => prev - 1)} className="px-8 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase text-xs tracking-widest disabled:opacity-30">Back</button>
               {currentQuestionIndex === takingExam.questions.length - 1 ? (
                 <button onClick={submitExam} className="px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl">Submit Final</button>
               ) : (
                 <button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl">Next Question</button>
               )}
             </footer>
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50/30 flex flex-col md:flex-row relative">
      <header className="md:hidden bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-black shadow-md">S</div>
          <span className="font-black text-gray-900 tracking-tighter">Portal</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-emerald-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg></button>
      </header>

      {isSidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-emerald-100 flex flex-col z-[60] transform transition-transform duration-300 ease-out md:translate-x-0 md:static md:z-20 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-emerald-50 flex flex-col relative">
          <div className="flex items-center gap-3 mb-6"><div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black">S</div><div><h2 className="text-xl font-black text-gray-900 tracking-tight">Student Hub</h2><p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Portal</p></div></div>
          <div className="bg-emerald-50 rounded-2xl p-4 flex items-center gap-3 border border-emerald-100"><div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-black text-emerald-600 border border-emerald-200 overflow-hidden"><span className="text-lg">🎓</span></div><div className="min-w-0"><p className="font-black text-sm text-gray-900 truncate">{user.name}</p><p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">ID: {user.id.slice(-5)}</p></div></div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveSubTab(item.id as any); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all ${activeSubTab === item.id ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' : 'text-gray-400 hover:bg-emerald-50'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={item.icon} /></svg>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 mt-auto border-t border-emerald-50">
          <button onClick={onLogout} className="w-full py-4 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2">Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto h-[calc(100vh-64px)] md:h-screen custom-scrollbar">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-xs font-black text-emerald-600 uppercase tracking-[0.2em] mb-2"><span className="w-4 h-[2px] bg-emerald-600"></span>Academic Area</div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter capitalize">{activeSubTab === 'exam' ? 'Exam Hall' : activeSubTab}</h1>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Fixed: Added missing onPracticeSpeech prop to WordList component and connected to local state */}
          {activeSubTab === 'learning' && <WordList words={words} canEdit={false} canDelete={false} onEdit={() => {}} onDelete={() => {}} onGenerateImage={async () => {}} onPracticeSpeech={(w) => setPracticeWord(w)} isOnline={true} />}
          {activeSubTab === 'library' && <BookSection books={books} user={user} onAddClick={() => {}} onEditClick={() => {}} onDeleteClick={() => {}} />}
          {activeSubTab === 'videos' && <VideoSection videos={videos} user={user} onAddClick={() => {}} onDeleteClick={() => {}} />}

          {activeSubTab === 'exam' && (
            <div className="max-w-5xl mx-auto space-y-12">
              {!user.canAccessExam ? (
                <div className="text-center py-20 bg-white rounded-[3.5rem] border border-red-50"><div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div><h2 className="text-2xl font-black text-gray-900">Access Restricted</h2><p className="text-gray-400 font-medium mt-2">Contact Admin to enable exams for your account.</p></div>
              ) : (
                <div className="space-y-12">
                  {/* Current Active Exams */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Available Exams</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {exams.filter(ex => ex.isPublished).length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 text-gray-300 font-bold italic">No exams published yet.</div>
                      ) : (
                        exams.filter(ex => ex.isPublished).map(ex => {
                          const isAttempted = submissions.some(s => s.examId === ex.id && s.studentId === user.id);
                          return (
                            <div key={ex.id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-2xl transition-all h-[340px]">
                              <div>
                                <div className="flex justify-between items-center mb-6">
                                   <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">{ex.questions.length}</div>
                                   {isAttempted && <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-emerald-100">Attempted</span>}
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 leading-tight mb-2 tracking-tighter">{ex.title}</h4>
                                <div className="flex gap-2 mb-4"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{ex.difficulty}</span><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{ex.timeLimitMinutes} Mins</span></div>
                                <p className="text-sm text-gray-400 font-medium line-clamp-3 leading-relaxed">"{ex.description}"</p>
                              </div>
                              <div className="mt-8">
                                <button onClick={() => startExam(ex)} className="w-full py-4 bg-gray-900 hover:bg-blue-600 text-white rounded-2xl font-black text-sm transition-all shadow-xl active:scale-95">Take Exam Now</button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Score History */}
                  {submissions.filter(s => s.studentId === user.id).length > 0 && (
                    <div className="space-y-6">
                       <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] pl-4">Performance History</h3>
                       <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden">
                          <table className="w-full">
                             <thead><tr className="bg-gray-50 border-b border-gray-100 text-left"><th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Exam</th><th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</th><th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Grade</th><th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th></tr></thead>
                             <tbody className="divide-y divide-gray-50">
                                {submissions.filter(s => s.studentId === user.id).map(sub => {
                                   const exam = exams.find(e => e.id === sub.examId);
                                   return (
                                     <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-8 py-5 font-black text-gray-900">{exam?.title || 'Unknown Exam'}</td>
                                        <td className="px-8 py-5 font-bold text-gray-600">{sub.score} / {sub.totalQuestions}</td>
                                        <td className="px-8 py-5 font-black text-blue-600">{sub.grade || 'A'}</td>
                                        <td className="px-8 py-5 text-xs text-gray-400 font-medium">{new Date(sub.submittedAt).toLocaleDateString()}</td>
                                     </tr>
                                   );
                                })}
                             </tbody>
                          </table>
                       </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Render the Pronunciation Practice Modal for students when a word is selected */}
      {practiceWord && <PronunciationPracticeModal word={practiceWord} onClose={() => setPracticeWord(null)} />}
    </div>
  );
};

export default StudentDashboard;
