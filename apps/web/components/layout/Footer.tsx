import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_6px_rgba(0,0,0,0.03)]">
      <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-xl pb-space-xl">
          <div className="md:col-span-5 flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs">
              <img
                alt="Elite Vertex Brand Logo"
                className="h-10 w-auto object-contain bg-white rounded p-1"
                src="/logo.png"
              />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mt-space-2xs">
              Speak With Confidence. Rise With Communication. Premier institute for Spoken English, Public Speaking, and Career Communication.
            </p>
            <div className="flex items-center gap-space-xs mt-space-2xs text-on-surface-variant font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px] text-secondary">
                verified
              </span>
              <span>ISO 9001:2015 Accredited Pedagogical Standards</span>
            </div>
          </div>
          <div className="md:col-span-3 flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md uppercase tracking-widest text-primary">
              Quick Navigation
            </span>
            <div className="flex flex-col gap-space-xs font-body-sm text-body-sm">
              <Link href="/" className="text-on-surface-variant hover:text-on-surface transition-colors">
                Home
              </Link>
              <Link href="/courses" className="text-on-surface-variant hover:text-on-surface transition-colors">
                Courses &amp; Curriculum
              </Link>
              <Link href="/about" className="text-on-surface-variant hover:text-on-surface transition-colors">
                About the Institute
              </Link>
              <Link href="/gallery" className="text-on-surface-variant hover:text-on-surface transition-colors">
                Campus Gallery
              </Link>
              <Link href="/verify-certificate" className="text-on-surface-variant hover:text-on-surface transition-colors">
                Verify Credential
              </Link>
              <Link href="/faq" className="text-on-surface-variant hover:text-on-surface transition-colors">
                Frequently Asked Questions
              </Link>
              <Link href="/contact" className="text-on-surface-variant hover:text-on-surface transition-colors">
                Contact &amp; Visit
              </Link>
            </div>
          </div>
          <div className="md:col-span-4 flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md uppercase tracking-widest text-primary">
              Campuses &amp; Admissions
            </span>
            <div className="flex flex-col gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
              <div className="flex flex-col">
                <span className="font-semibold text-on-surface">Bengaluru Flagship</span>
                <span className="text-on-surface-variant">42, Prestige Towers, M.G. Road, Bengaluru 560001</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-on-surface">New Delhi Centre</span>
                <span className="text-on-surface-variant">Regal Building, Connaught Place, New Delhi 110001</span>
              </div>
              <div className="flex flex-col pt-space-3xs">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Admissions Hotline
                </span>
                <a href="tel:+918049208800" className="font-headline-sm text-headline-sm text-primary hover:text-secondary transition-colors">
                  +91 (80) 4920-8800
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-space-md flex flex-col md:flex-row items-center justify-between gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
          <p>© 2025 Elite Vertex Institute of Communication. All intellectual property reserved.</p>
          <p className="text-on-surface-variant">Governed under Council for Executive Speech and Oratory.</p>
        </div>
      </div>
    </footer>
  );
}
