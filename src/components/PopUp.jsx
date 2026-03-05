import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import popupImage from "../assets/34483b435ffe26fe5a7fd3ed8704cb043fd97db8.png";

export default function PopUp() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl p-0 overflow-hidden border-white-200">
        <div className="grid md:grid-cols-2">
          <div className="relative h-56 md:h-full">
            <img
              src={popupImage}
              alt="Free Personality Development Masterclass"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r md:from-black/35 md:to-transparent" />
          </div>

          <div className="p-6 sm:p-8">
            <DialogHeader className="text-left">
              <p className="text-xs font-semibold tracking-[0.14em] text-blue-600 uppercase mb-2">
                Limited Launch Offer
              </p>
              <DialogTitle className="text-2xl leading-tight text-slate-900">
                Free Personality Development Masterclass
              </DialogTitle>
              <DialogDescription className="text-slate-600 pt-2">
                Learn practical communication and confidence frameworks from an expert-led live session.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">Course Fee</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-lg text-slate-400 line-through">₹2,999</span>
                <span className="text-2xl font-bold text-emerald-600">FREE</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild className="sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                <a href="#lead-form" onClick={() => setOpen(false)}>
                  Claim Your FREE Spot
                </a>
              </Button>
              <Button asChild variant="outline" className="sm:flex-1 border-slate-300 text-slate-700 hover:bg-slate-100">
                <a href="#lead-form" onClick={() => setOpen(false)}>
                  Maybe Later
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
