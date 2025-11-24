import React from 'react';

export enum QuestionType {
  CHOICE = '選擇題',
  CALCULATION = '計算題',
  EXPLANATION = '簡答解釋',
  ANALYSIS = '實驗分析',
}

export enum SubjectTopic {
  WAVES = '波的性質',
  SOUND = '聲音與聽覺',
  OPTICS = '光學 (反射/折射/透鏡)',
  CHEMISTRY = '基礎化學/有機簡介',
}

export interface Question {
  id: string;
  type: QuestionType;
  topic: SubjectTopic;
  content: string;
  options?: string[]; // Only for Choice
  answer: string;
  explanation: string;
}

export interface TopicCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  topic: SubjectTopic;
  onClick: (topic: SubjectTopic) => void;
}

// Gemini Types
export interface GeminiGenParams {
  topic: SubjectTopic;
  questionType: QuestionType;
}