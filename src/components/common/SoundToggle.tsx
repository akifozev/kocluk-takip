import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(audioManager.getMuted());

  const handleToggle = () => {
    const next = audioManager.toggleMute();
    setMuted(next);
    if (!next) {
      audioManager.playClick();
    }
  };

  return (
    <button
      onClick={handleToggle}
      title={muted ? 'Sesi Aç' : 'Sesi Kapat'}
      className="p-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 text-amber-400 backdrop-blur-md transition-all active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
    >
      {muted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
    </button>
  );
};
