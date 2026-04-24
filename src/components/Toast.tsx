import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// --- Module-level pub/sub ---
// showToast() can be called from any module without prop drilling.
// ToastContainer subscribes on mount, unsubscribes on unmount.

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
let listeners: Listener[] = [];
let nextId = 1;
const DEFAULT_DURATION_MS = 3000;

const emit = () => {
  listeners.forEach(fn => fn(toasts));
};

const subscribe = (fn: Listener) => {
  listeners.push(fn);
  return () => {
    listeners = listeners.filter(l => l !== fn);
  };
};

const dismiss = (id: number) => {
  toasts = toasts.filter(t => t.id !== id);
  emit();
};

export const showToast = (
  message: string,
  type: ToastType = 'info',
  durationMs: number = DEFAULT_DURATION_MS
) => {
  const id = nextId++;
  toasts = [...toasts, { id, message, type }];
  emit();
  if (durationMs > 0) {
    window.setTimeout(() => dismiss(id), durationMs);
  }
  return id;
};

// --- UI ---

const iconFor = (type: ToastType) => {
  if (type === 'success') return CheckCircle2;
  if (type === 'error') return AlertCircle;
  return Info;
};

const styleFor = (type: ToastType) => {
  if (type === 'success') {
    return {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-800',
      iconColor: 'text-emerald-600',
    };
  }
  if (type === 'error') {
    return {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-600',
    };
  }
  return {
    bg: 'bg-white',
    border: 'border-elder-border',
    text: 'text-elder-text',
    iconColor: 'text-elder-accent',
  };
};

export const ToastContainer: React.FC = () => {
  const [items, setItems] = useState<Toast[]>(toasts);

  useEffect(() => {
    return subscribe(setItems);
  }, []);

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none w-[calc(100%-2rem)] max-w-sm"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {items.map(t => {
          const Icon = iconFor(t.type);
          const s = styleFor(t.type);
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className={cn(
                'pointer-events-auto rounded-xl border shadow-lg px-3 py-2.5 flex items-start gap-2',
                s.bg,
                s.border
              )}
              role={t.type === 'error' ? 'alert' : 'status'}
            >
              <Icon size={16} className={cn('flex-shrink-0 mt-0.5', s.iconColor)} aria-hidden />
              <div className={cn('flex-1 text-[11px] leading-snug font-medium', s.text)}>
                {t.message}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className={cn(
                  'flex-shrink-0 min-w-[32px] min-h-[32px] -mr-1 rounded-lg flex items-center justify-center hover:bg-black/5 transition-colors',
                  s.text
                )}
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
