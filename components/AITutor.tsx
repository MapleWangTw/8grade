import React, { useState } from 'react';
import { generateQuestion } from '../services/geminiService';
import { Question, QuestionType, SubjectTopic } from '../types';
import { BrainCircuit, CheckCircle2, XCircle, RefreshCw, Loader2, ChevronRight } from 'lucide-react';

const AITutor: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<SubjectTopic>(SubjectTopic.WAVES);
  const [selectedType, setSelectedType] = useState<QuestionType>(QuestionType.CHOICE);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setShowAnswer(false);
    setUserAnswer('');
    setIsCorrect(null);
    try {
      const q = await generateQuestion(selectedTopic, selectedType);
      setCurrentQuestion(q);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = (val: string) => {
    if (showAnswer) return;
    setUserAnswer(val);
    
    if (currentQuestion?.type === QuestionType.CHOICE) {
       // For simple string match on choice text
       // Ideally, we'd have logic to parse "A", "B" etc., but Gemini returns full string usually.
       // We will just set showAnswer to true and let user verify.
       const correct = val === currentQuestion.answer;
       setIsCorrect(correct); 
    }
    setShowAnswer(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="bg-indigo-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6" />
          <h2 className="font-bold text-lg">AI 雲端題庫</h2>
        </div>
        <div className="text-xs bg-indigo-500 px-2 py-1 rounded">Gemini 2.5 Flash</div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">單元主題</label>
            <select 
              value={selectedTopic} 
              onChange={(e) => setSelectedTopic(e.target.value as SubjectTopic)}
              className="w-full p-2 rounded border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            >
              {Object.values(SubjectTopic).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">題型</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value as QuestionType)}
              className="w-full p-2 rounded border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            >
              {Object.values(QuestionType).map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          {loading ? '題目生成中...' : '立即出題'}
        </button>

        {/* Question Display */}
        <div className="flex-grow bg-slate-50 rounded-lg border border-slate-200 p-6 relative min-h-[300px]">
          {!currentQuestion && !loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
              <BrainCircuit className="w-12 h-12 mb-2 opacity-20" />
              <p>請選擇主題並點擊「立即出題」</p>
            </div>
          )}

          {loading && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-indigo-500">
               <Loader2 className="w-10 h-10 animate-spin mb-2" />
               <p className="animate-pulse text-sm font-medium">AI 老師正在思考中...</p>
             </div>
          )}

          {currentQuestion && !loading && (
            <div className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-1 rounded">
                  {currentQuestion.topic}
                </span>
                <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded">
                  {currentQuestion.type}
                </span>
              </div>
              
              <h3 className="text-lg font-medium text-slate-800 mb-6 leading-relaxed whitespace-pre-wrap">
                {currentQuestion.content}
              </h3>

              {/* Choice Options */}
              {currentQuestion.type === QuestionType.CHOICE && currentQuestion.options && (
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => checkAnswer(opt)}
                      disabled={showAnswer}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        showAnswer 
                          ? opt === currentQuestion.answer 
                            ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500'
                            : userAnswer === opt 
                              ? 'bg-red-50 border-red-500 text-red-700' 
                              : 'bg-white border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border ${
                           showAnswer && opt === currentQuestion.answer ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-slate-500'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        {opt}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Non-Choice Interface */}
              {currentQuestion.type !== QuestionType.CHOICE && !showAnswer && (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="text-indigo-600 font-medium hover:underline flex items-center gap-1 mb-6"
                >
                  查看解析與答案 <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Answer Section */}
              {showAnswer && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 animate-in slide-in-from-bottom-2 fade-in duration-300">
                  <div className="flex items-center gap-2 mb-2 text-green-800 font-bold">
                    {currentQuestion.type === QuestionType.CHOICE ? (
                      isCorrect || userAnswer === currentQuestion.answer ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5 text-red-500" />
                    ) : <CheckCircle2 className="w-5 h-5" />}
                    <span>正確答案：{currentQuestion.answer}</span>
                  </div>
                  <hr className="border-green-200 my-2" />
                  <p className="text-sm text-green-900 leading-relaxed">
                    <span className="font-bold block mb-1">解析：</span>
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITutor;
