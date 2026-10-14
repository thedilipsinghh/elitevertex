import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#0B0F17] text-white border-t border-white/10 transition-all">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-8 border-b border-white/10">
          
          {/* Brand & Overview Column */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img
                alt="Elite Vertex Brand Logo"
                className="h-9 w-auto object-contain bg-white rounded-md p-1.5 shadow-sm"
                src="/logo.png"
              />
              <span className="font-bold text-lg tracking-tight text-white">
                Elite Vertex
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Speak With Confidence. Rise With Communication. Premier institute for Spoken English, Public Speaking, and Executive Career Communication.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium bg-white/5 w-fit px-3 py-1.5 rounded-full border border-amber-400/20">
              <span className="material-symbols-outlined text-[16px]">
                verified
              </span>
              <span>ISO 9001:2015 Accredited Pedagogical Standards</span>
            </div>
          </div>

          {/* Quick Navigation Column */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Navigation
            </span>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <Link href="/" className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                Home
              </Link>
              <Link href="/courses" className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                Courses &amp; Curriculum
              </Link>
              <Link href="/about" className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                About the Institute
              </Link>
              <Link href="/gallery" className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                Campus Gallery
              </Link>
              <Link href="/verify-certificate" className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                Verify Credential
              </Link>
              <Link href="/faq" className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                FAQ &amp; Help
              </Link>
              <Link href="/contact" className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                Contact &amp; Visit
              </Link>
            </div>
          </div>

          {/* Programs Column */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Popular Programs
            </span>
            <div className="flex flex-col gap-2 text-sm text-gray-300">
              <Link href="/courses#spoken-english" className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                Fluent Spoken English
              </Link>
              <Link href="/courses#public-speaking" className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                Public Speaking Mastery
              </Link>
              <Link href="/courses#executive-comm" className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                Executive Business Communication
              </Link>
              <Link href="/courses#personality-dev" className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                Personality &amp; Confidence Building
              </Link>
              <Link href="/courses#interview-prep" className="hover:text-white hover:translate-x-0.5 transition-all w-fit">
                Corporate Interview Preparation
              </Link>
            </div>
          </div>

          {/* Contact & Admissions Column */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Campuses &amp; Hotline
            </span>
            <div className="flex flex-col gap-3 text-xs text-gray-300">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-amber-400 mt-0.5">
                  location_on
                </span>
                <div>
                  <span className="font-semibold text-white block text-sm">Bengaluru Flagship</span>
                  <span>42, Prestige Towers, M.G. Road, Bengaluru 560001</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-amber-400 mt-0.5">
                  location_on
                </span>
                <div>
                  <span className="font-semibold text-white block text-sm">New Delhi Centre</span>
                  <span>Regal Building, Connaught Place, New Delhi 110001</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] uppercase tracking-wider text-gray-400 block mb-1">
                  Admissions Helpline
                </span>
                <a
                  href="tel:+918049208800"
                  className="inline-flex items-center gap-2 text-base font-bold text-amber-400 hover:text-amber-300 transition-colors bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    call
                  </span>
                  +91 (80) 4920-8800
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Elite Vertex Institute of Communication. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
