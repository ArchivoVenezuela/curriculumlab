import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message: string;
}

export const Loading: React.FC<LoadingProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
      <p className="text-lg text-slate-600 font-medium">{message}</p>
      <p className="text-sm text-slate-400 mt-2">CursoAPP está pensando...</p>
    </div>
  );
};