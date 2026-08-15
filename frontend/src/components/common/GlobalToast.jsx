import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';
import useToastStore from '../../store/toastStore';

export default function GlobalToast() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgColor = 'bg-slate-900 border-slate-800 text-white';
        let Icon = Info;
        let iconColor = 'text-medical-400';

        if (toast.type === 'error') {
          bgColor = 'bg-red-950/95 border-red-800 text-white';
          Icon = AlertCircle;
          iconColor = 'text-red-400';
        } else if (toast.type === 'warning') {
          bgColor = 'bg-amber-950/95 border-amber-800 text-white';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        } else if (toast.type === 'success') {
          bgColor = 'bg-teal-950/95 border-teal-800 text-white';
          Icon = CheckCircle2;
          iconColor = 'text-teal-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl flex items-start justify-between gap-3 animate-slide-down ${bgColor}`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
              <p className="text-xs font-semibold leading-relaxed break-words">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
