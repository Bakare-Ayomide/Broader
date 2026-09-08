import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface GlassBottomSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHandle?: boolean;
  className?: string;
  snapHeight?: 'auto' | 'half' | 'full';
}

const HEIGHT_CLASSES = {
  auto: 'max-h-[85vh]',
  half: 'h-[50vh]',
  full: 'h-[92vh]',
};

export const GlassBottomSheet: React.FC<GlassBottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  showHandle = true,
  className = '',
  snapHeight = 'auto',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end pointer-events-none">
          {/* Backdrop (clickable if onClose provided) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${
              onClose ? 'pointer-events-auto' : 'pointer-events-none'
            }`}
          />

          {/* Bottom Sheet Card */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className={`pointer-events-auto relative w-full max-w-md mx-auto ${
              HEIGHT_CLASSES[snapHeight]
            } bg-gradient-to-b from-neutral-900/95 via-black/95 to-black rounded-t-3xl border-t border-x border-white/[0.12] p-5 shadow-[0_-15px_40px_rgba(0,0,0,0.85)] backdrop-blur-2xl flex flex-col z-10 ${className}`}
          >
            {/* Grab Handle */}
            {showHandle && (
              <div className="w-12 h-1.5 rounded-full bg-white/25 mx-auto mb-3 shrink-0" />
            )}

            {/* Header if title given */}
            {title && (
              <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/[0.08] shrink-0">
                <div>
                  <h3 className="text-sm font-JakartaBold text-white">{title}</h3>
                  {subtitle && (
                    <p className="text-[11px] text-neutral-400 font-JakartaRegular">{subtitle}</p>
                  )}
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/15 flex items-center justify-center text-neutral-300 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable sheet body */}
            <div className="overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
