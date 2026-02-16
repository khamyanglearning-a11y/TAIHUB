
import React, { useState, useRef, useEffect } from 'react';
import { Word } from '../types';
import { generateAIVoice } from '../services/geminiService';
import { decodeBase64, decodeAudioData, blobToBase64 } from '../utils/audioUtils';

interface PronunciationPracticeModalProps {
  word: Word;
  onClose: () => void;
}

const PronunciationPracticeModal: React.FC<PronunciationPracticeModalProps> = ({ word, onClose }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [userAudio, setUserAudio] = useState<string | null>(null);
  const [aiAudioBuffer, setAiAudioBuffer] = useState<AudioBuffer | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const handleListenToAI = async () => {
    if (aiAudioBuffer && audioContextRef.current) {
      const source = audioContextRef.current.createBufferSource();
      source.buffer = aiAudioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
      return;
    }

    setIsAiLoading(true);
    const base64Pcm = await generateAIVoice(word.english);
    if (base64Pcm && audioContextRef.current) {
      const bytes = decodeBase64(base64Pcm);
      const buffer = await decodeAudioData(bytes, audioContextRef.current);
      setAiAudioBuffer(buffer);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    } else {
      alert("Failed to generate AI voice. Please check your connection.");
    }
    setIsAiLoading(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const base64 = await blobToBase64(blob);
        setUserAudio(base64);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playUserAudio = () => {
    if (userAudio) {
      const audio = new Audio(userAudio);
      audio.play();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden transform transition-all animate-in zoom-in duration-300">
        <div className="relative h-32 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex items-end justify-between">
          <div>
            <span className="text-blue-100 text-[10px] font-black uppercase tracking-widest block mb-1">Pronunciation Studio</span>
            <h2 className="text-3xl font-black text-white tracking-tighter">{word.english}</h2>
          </div>
          <button onClick={onClose} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors mb-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            {/* AI Teacher Section */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner group relative overflow-hidden">
                {isAiLoading ? (
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <button 
                    onClick={handleListenToAI}
                    className="w-full h-full flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
                  >
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                  </button>
                )}
              </div>
              <div>
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">AI Teacher</span>
                <p className="text-xs font-bold text-gray-400">Perfect Pronunciation</p>
              </div>
            </div>

            {/* User Section */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`w-20 h-20 ${isRecording ? 'bg-red-50 text-red-600 animate-pulse border-red-200' : userAudio ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-300 border-gray-100'} rounded-3xl border-2 flex items-center justify-center shadow-inner relative transition-colors`}>
                <button 
                  onClick={isRecording ? stopRecording : userAudio && !isRecording ? playUserAudio : startRecording}
                  className="w-full h-full flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
                >
                  {isRecording ? (
                    <div className="w-6 h-6 bg-red-600 rounded-sm"></div>
                  ) : userAudio ? (
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  ) : (
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                  )}
                </button>
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isRecording ? 'text-red-500' : userAudio ? 'text-emerald-500' : 'text-gray-400'}`}>
                  {isRecording ? 'Recording...' : userAudio ? 'Your Attempt' : 'Record Now'}
                </span>
                <p className="text-xs font-bold text-gray-400">
                  {userAudio && !isRecording ? 'Tap to Re-play' : isRecording ? 'Recording your voice' : 'Tap to practice'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 text-center">
            <p className="text-sm font-medium text-gray-500 leading-relaxed italic">
              "Hear the difference. Practice makes perfect. Compare your tone with the AI guide to master the word."
            </p>
          </div>

          {userAudio && (
            <button 
              onClick={() => { setUserAudio(null); startRecording(); }}
              className="w-full py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              Try Recording Again
            </button>
          )}

          <button 
            onClick={onClose}
            className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all"
          >
            Finished Practice
          </button>
        </div>
      </div>
    </div>
  );
};

export default PronunciationPracticeModal;
