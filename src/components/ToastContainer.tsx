import React from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, Zap, Flame, Heart, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bgStyle = 'bg-slate-900 text-white border-slate-700';
        let IconComp = Info;

        if (toast.type === 'success') {
          bgStyle = 'bg-emerald-600 text-white border-emerald-500';
          IconComp = CheckCircle;
        } else if (toast.type === 'xp') {
          bgStyle = 'bg-amber-500 text-slate-950 font-semibold border-amber-400';
          IconComp = Zap;
        } else if (toast.type === 'streak') {
          bgStyle = 'bg-orange-500 text-white border-orange-400';
          IconComp = Flame;
        } else if (toast.type === 'heart') {
          bgStyle = 'bg-rose-500 text-white border-rose-400';
          IconComp = Heart;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-sm transition-all transform animate-bounce-short ${bgStyle}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {toast.icon ? (
                <span className="text-xl flex-shrink-0">{toast.icon}</span>
              ) : (
                <IconComp className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm font-medium tracking-tight truncate">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-lg hover:bg-black/10 active:scale-90 transition-transform opacity-80 hover:opacity-100 flex-shrink-0"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
