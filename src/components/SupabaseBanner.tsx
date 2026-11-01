import React, { useState } from 'react';
import { Database, ShieldCheck, ChevronRight, X, Info } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export const SupabaseBanner: React.FC<{ onOpenConfig?: () => void }> = ({ onOpenConfig }) => {
  const configured = isSupabaseConfigured();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  if (configured) {
    return (
      <div className="bg-emerald-50/80 border-b border-emerald-100 px-4 py-2 text-xs text-emerald-800 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Terhubung ke Supabase:</strong> Sinkronisasi database cloud PostgreSQL &amp; RLS aktif.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/80 px-4 py-3 text-xs text-amber-900 transition-all">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-start gap-2.5">
          <Database className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-semibold text-amber-950">Mode Penyimpanan Lokal Aktif:</span>{' '}
            Aplikasi berfungsi penuh menggunakan penyimpanan perangkat Anda. Untuk sinkronisasi cloud multi-perangkat, hubungkan proyek Supabase Anda pada file{' '}
            <code className="bg-amber-100/90 text-amber-800 px-1.5 py-0.5 rounded font-mono text-[11px]">.env</code>.
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
          {onOpenConfig && (
            <button
              onClick={onOpenConfig}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-200/60 hover:bg-amber-200 rounded-lg transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              Panduan Setup
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-600 hover:text-amber-800 rounded transition-colors"
            aria-label="Tutup pemberitahuan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
