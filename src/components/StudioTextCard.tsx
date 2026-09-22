import { AdvertFrame } from '../types';
import { MessageSquare, ShieldCheck, Search, CheckCircle2, Globe, FileText, Check } from 'lucide-react';

interface StudioTextCardProps {
  frame: AdvertFrame;
}

export function StudioTextCard({ frame }: StudioTextCardProps) {
  // Scene 8 & 9: WhatsApp chat bubbles
  if (frame.frameNumber === 8) {
    return (
      <div className="w-full h-full bg-[#0b141a] p-4 flex flex-col justify-between select-none font-sans text-stone-100 border border-stone-800">
        <div className="flex items-center gap-2 border-b border-stone-800/80 pb-2">
          <div className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center text-xs font-bold text-amber-300">
            TA
          </div>
          <div>
            <div className="text-[11px] font-semibold text-stone-200">Travel Agent (TikTok)</div>
            <div className="text-[9px] text-emerald-400">online</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 my-auto">
          <div className="self-end max-w-[85%] bg-[#005c4b] text-white p-2.5 rounded-xl rounded-tr-xs shadow-md">
            <p className="text-xs font-medium leading-relaxed">
              "Oga, any update?"
            </p>
            <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-emerald-200/80 font-mono">
              <span>10:42 AM</span>
              <span className="text-sky-300 font-bold">✓✓</span>
            </div>
          </div>
        </div>

        <div className="text-center py-1 text-[9px] font-mono text-stone-500 uppercase tracking-widest border-t border-stone-800/60">
          Weekly Follow-up • Studio Text Scene
        </div>
      </div>
    );
  }

  if (frame.frameNumber === 9) {
    return (
      <div className="w-full h-full bg-[#0b141a] p-4 flex flex-col justify-between select-none font-sans text-stone-100 border border-stone-800">
        <div className="flex items-center gap-2 border-b border-stone-800/80 pb-2">
          <div className="w-7 h-7 rounded-full bg-stone-700 flex items-center justify-center text-xs font-bold text-amber-300">
            TA
          </div>
          <div>
            <div className="text-[11px] font-semibold text-stone-200">Travel Agent (TikTok)</div>
            <div className="text-[9px] text-emerald-400">typing...</div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 my-auto">
          <div className="self-end max-w-[80%] bg-[#005c4b]/60 text-white/80 p-2 rounded-lg rounded-tr-xs text-[11px]">
            "Oga, any update?"
          </div>
          <div className="self-start max-w-[85%] bg-[#202c33] text-stone-100 p-2.5 rounded-xl rounded-tl-xs shadow-md">
            <p className="text-xs font-medium leading-relaxed text-amber-300">
              "Embassy still dey process am. Just dey calm."
            </p>
            <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-stone-400 font-mono">
              <span>11:15 AM</span>
            </div>
          </div>
        </div>

        <div className="text-center py-1 text-[9px] font-mono text-stone-500 uppercase tracking-widest border-t border-stone-800/60">
          The Stall Response • Studio Text Scene
        </div>
      </div>
    );
  }

  // Scene 17: Legit Africa Submission Screen
  if (frame.frameNumber === 17) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-stone-900 to-stone-950 p-4 flex flex-col justify-between select-none text-stone-100 border border-stone-800">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold tracking-tight text-stone-100">
              Legit<span className="text-emerald-400">Africa</span>.com
            </span>
          </div>
          <span className="text-[9px] font-mono bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded">
            Verified Case
          </span>
        </div>

        <div className="my-auto bg-stone-900/90 border border-stone-800 rounded-xl p-3.5 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold tracking-wider">
              Scam Alert Submitted
            </span>
          </div>
          <h4 className="text-xs font-bold text-stone-100 mb-1 leading-snug">
            3M Naira Fake Canadian Visa Scheme
          </h4>
          <p className="text-[10px] text-stone-400 leading-relaxed mb-2.5">
            By Chidi O. • Lagos, Nigeria
          </p>
          <div className="p-2 bg-stone-950 rounded border border-stone-800 text-[10px] text-stone-300 italic">
            "Dem collect 3 million naira, send fake letter, and pack commot for office..."
          </div>
        </div>

        <div className="text-center py-1 text-[9px] font-mono text-emerald-400/90 uppercase tracking-wider">
          LegitAfrica Report Screen • Studio Mockup
        </div>
      </div>
    );
  }

  // Scene 18: Evidence Attachments
  if (frame.frameNumber === 18) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-stone-900 to-stone-950 p-4 flex flex-col justify-between select-none text-stone-100 border border-stone-800">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-stone-100">Evidence Attached</span>
          </div>
          <span className="text-[9px] font-mono text-stone-400">3 Documents</span>
        </div>

        <div className="my-auto flex flex-col gap-2">
          <div className="flex items-center gap-2 p-2 bg-stone-950 rounded-lg border border-stone-800">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="text-left">
              <div className="text-[10px] font-semibold text-stone-200">Bank Transfer Receipt (₦3,000,000)</div>
              <div className="text-[8px] font-mono text-stone-500">PDF • Verified Account Stamp</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-stone-950 rounded-lg border border-stone-800">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="text-left">
              <div className="text-[10px] font-semibold text-stone-200">Fabricated Offer Letter</div>
              <div className="text-[8px] font-mono text-stone-500">A4 Scan • Confirmed Forged</div>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-stone-950 rounded-lg border border-stone-800">
            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <div className="text-left">
              <div className="text-[10px] font-semibold text-stone-200">Vacated Office Address & Landlord Statement</div>
              <div className="text-[8px] font-mono text-stone-500">Location Record • Ikeja</div>
            </div>
          </div>
        </div>

        <div className="text-center py-1 text-[9px] font-mono text-amber-400/90 uppercase tracking-wider">
          Receipts Attached • Studio Evidence Card
        </div>
      </div>
    );
  }

  // Scene 21: Legit Africa Search Bar
  if (frame.frameNumber === 21) {
    return (
      <div className="w-full h-full bg-stone-950 p-4 flex flex-col justify-between select-none text-stone-100 border border-stone-800">
        <div className="flex items-center justify-center gap-1.5 py-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-bold text-stone-100">
            Legit<span className="text-emerald-400">Africa</span>
          </span>
        </div>

        <div className="my-auto w-full flex flex-col items-center gap-3">
          <p className="text-[11px] text-stone-400 text-center font-medium">
            Search before you pay any agent or vendor in Nigeria
          </p>

          <div className="w-full p-2.5 bg-stone-900 border border-amber-500/50 rounded-xl flex items-center gap-2 shadow-lg">
            <Search className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs text-stone-200 font-mono">
              Travel Agent Name...
            </span>
            <span className="ml-auto w-1.5 h-3.5 bg-amber-400 animate-pulse" />
          </div>

          <div className="flex items-center gap-2 text-[9px] text-stone-500 font-mono">
            <span>Visa Agents</span> • <span>Schools</span> • <span>Vendors</span>
          </div>
        </div>

        <div className="text-center py-1 text-[9px] font-mono text-emerald-400/90 uppercase tracking-wider">
          LegitAfrica Search Bar • Studio UI
        </div>
      </div>
    );
  }

  // Scene 23: Zero Paid Removal Guarantee
  if (frame.frameNumber === 23) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-emerald-950/40 via-stone-950 to-stone-950 p-4 flex flex-col justify-between select-none text-stone-100 border border-emerald-900/40">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-stone-100">Uncompromised Review Guarantee</span>
          </div>
        </div>

        <div className="my-auto text-center p-4 bg-stone-900/80 rounded-2xl border border-stone-800 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-3 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-100 mb-1.5">
            "Nobody fit pay us to wipe honest review commot."
          </h3>
          <p className="text-[10px] text-stone-400 leading-relaxed max-w-[200px] mx-auto">
            Zero bribery. Zero commercial review deletion. 100% verified Nigerian consumer truth.
          </p>
        </div>

        <div className="text-center py-1 text-[9px] font-mono text-emerald-400 uppercase tracking-wider">
          LegitAfrica Policy Screen • Studio Card
        </div>
      </div>
    );
  }

  // Scene 24: End Card
  return (
    <div className="w-full h-full bg-gradient-to-b from-stone-900 to-black p-4 flex flex-col justify-between select-none text-stone-100 border border-amber-500/30">
      <div className="flex items-center justify-center gap-1.5 py-1">
        <ShieldCheck className="w-6 h-6 text-emerald-400" />
        <span className="text-base font-extrabold tracking-tight text-white">
          Legit<span className="text-emerald-400">Africa</span>.com
        </span>
      </div>

      <div className="my-auto text-center flex flex-col items-center gap-3">
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono font-semibold">
          100% COMPLETELY FREE
        </div>

        <h2 className="text-sm font-bold text-white max-w-[210px] leading-snug">
          Before you pay any agent, search their name first.
        </h2>

        <div className="text-xs font-mono font-bold text-amber-400 bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-800">
          legitafrica.com
        </div>
      </div>

      <div className="text-center py-1 text-[9px] font-mono text-stone-400 uppercase tracking-wider border-t border-stone-800/80">
        Official Campaign End Card • Studio Asset
      </div>
    </div>
  );
}
