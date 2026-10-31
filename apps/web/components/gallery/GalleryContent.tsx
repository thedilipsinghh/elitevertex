"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useGetGalleryQuery } from "@/lib/features/api/apiSlice";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function GalleryContent() {
  const [filter, setFilter] = useState<string>("all");
  const [lightboxItem, setLightboxItem] = useState<any | null>(null);

  const { data: galleryResponse, isLoading } = useGetGalleryQuery({});
  const galleryItems = galleryResponse?.data || [];

  // Extract unique categories dynamically from API records
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    galleryItems.forEach((item: any) => {
      if (item.category && item.category.trim()) {
        cats.add(item.category.trim());
      }
    });
    return Array.from(cats);
  }, [galleryItems]);

  const filteredItems = useMemo(() => {
    if (filter === "all") return galleryItems;
    return galleryItems.filter(
      (item: any) => (item.category || "").toLowerCase() === filter.toLowerCase()
    );
  }, [galleryItems, filter]);

  // Loading skeleton placeholder for gallery when data is being fetched
  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-surface-container-low rounded-2xl animate-pulse shadow-sm overflow-hidden border border-outline-variant/30">
          <div className="aspect-[16/10] bg-gray-200 dark:bg-gray-800" />
          <div className="p-5 flex flex-col gap-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col w-full font-sans">
      {/* Top Editorial Header Block */}
      <section className="w-full bg-surface-container-lowest border-b border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-xl md:py-space-2xl">
          {/* Breadcrumbs & Document Reference */}
          <div className="flex flex-wrap items-center justify-between gap-space-xs mb-space-md">
            <nav className="flex items-center gap-space-2xs font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <span className="text-outline-variant">/</span>
              <span className="text-primary font-semibold">Gallery</span>
            </nav>
            <div className="inline-flex items-center gap-space-2xs px-space-xs py-space-3xs bg-surface-container text-on-surface-variant font-label-sm text-label-sm rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span>CAMPUS DOCUMENTARY ARCHIVE</span>
            </div>
          </div>
          {/* Main Heading Typography */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-end">
            <div className="lg:col-span-8 flex flex-col gap-space-2xs">
              <span className="font-label-md text-label-md uppercase tracking-widest text-secondary font-bold">Documentary Visual Index</span>
              <h1 className="font-display text-headline-lg-mobile md:text-display text-primary tracking-tight">Inside Elite Vertex.</h1>
            </div>
            <div className="lg:col-span-4">
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Unfiltered glimpses into our acoustic speech laboratories, intellectual round-tables, high-stakes debate symposiums, and student milestones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Index Navigation Bar */}
      <section className="sticky top-16 md:top-20 z-40 w-full bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/40 shadow-xs">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="flex items-center justify-between py-3 overflow-x-auto no-scrollbar gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-xl font-label-md text-xs font-bold uppercase tracking-wider transition-all duration-150 ${
                  filter === "all"
                    ? "bg-primary text-on-primary shadow-xs"
                    : "bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container"
                }`}
              >
                All Works <span className="ml-1 opacity-75">({galleryItems.length})</span>
              </button>

              {availableCategories.map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl font-label-md text-xs font-bold uppercase tracking-wider transition-all duration-150 shrink-0 ${
                    filter.toLowerCase() === cat.toLowerCase()
                      ? "bg-primary text-on-primary shadow-xs"
                      : "bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-on-surface-variant font-label-sm text-xs font-semibold tracking-wider shrink-0">
              <span className="material-symbols-outlined text-[18px] text-secondary">photo_camera</span>
              <span>{galleryItems.length} ARCHIVAL PHOTOGRAPHS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Gallery Grid Section */}
      <section className="w-full py-12 md:py-16 bg-surface min-h-[500px]">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          
          {isLoading && galleryItems.length === 0 ? (
            renderLoadingSkeleton()
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-3">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">photo_library</span>
              <h3 className="text-lg font-bold text-on-surface">No photos found in this category</h3>
              <p className="text-xs text-on-surface-variant">Switch to &quot;All Works&quot; to view the complete documentary collection.</p>
              <button
                onClick={() => setFilter("all")}
                className="mt-2 text-xs font-bold uppercase tracking-wider text-secondary underline hover:text-primary"
              >
                View All Works
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredItems.map((item: any, idx: number) => (
                <ScrollReveal key={item.id || idx} direction="up" delay={Math.min(idx * 60, 300)}>
                  <article 
                    onClick={() => setLightboxItem(item)}
                    className="group cursor-pointer bg-surface-container-lowest p-3 sm:p-4 rounded-2xl border border-outline-variant/40 shadow-xs hover:shadow-xl transition-all duration-300 hover-lift flex flex-col justify-between h-full"
                  >
                    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-surface-container">
                      <img
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                        src={item.image}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/60 backdrop-blur-md text-white font-label-sm text-[10px] font-bold uppercase px-2.5 py-1 tracking-widest rounded-md shadow-2xs border border-white/20">
                          {item.category || "Campus"}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                        <div className="bg-surface-container-lowest text-primary p-2 rounded-lg shadow-md flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px]">fullscreen</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 pb-1 flex flex-col justify-between flex-1">
                      <div>
                        <h2 className="font-bold text-base text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                          {item.title}
                        </h2>
                        {item.description && (
                          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {(item.location || item.tag) && (
                        <div className="pt-3 mt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant">
                          <span className="font-semibold text-secondary">{item.location || item.tag}</span>
                          <span className="text-[10px] uppercase tracking-wider font-mono">View Specimen</span>
                        </div>
                      )}
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          )}

          {/* Archival Metadata Metric Strip */}
          <div className="mt-16 p-6 sm:p-8 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
              <div className="flex flex-col">
                <span className="font-headline-lg text-headline-lg text-primary leading-none font-bold">1:12</span>
                <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant mt-2 font-semibold">Cohort Instructor Ratio</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-lg text-headline-lg text-primary leading-none font-bold">40+</span>
                <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant mt-2 font-semibold">Stage Practice Hours</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-lg text-headline-lg text-primary leading-none font-bold">100%</span>
                <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant mt-2 font-semibold">Recorded Waveform Audits</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-lg text-headline-lg text-primary leading-none font-bold">2,400+</span>
                <span className="font-label-sm text-xs uppercase tracking-widest text-on-surface-variant mt-2 font-semibold">Alumni in Executive Roles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="w-full bg-surface-container-lowest py-16 border-t border-outline-variant/30">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="bg-primary text-on-primary rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-md">
            <div className="relative z-10 max-w-2xl flex flex-col gap-3 items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-on-primary/10 text-primary-fixed font-label-sm text-xs uppercase tracking-widest rounded-full font-bold">
                Admissions Open • Immediate Batch Onboarding
              </div>
              <h2 className="font-headline-lg text-2xl sm:text-3xl lg:text-4xl text-on-primary font-extrabold tracking-tight">
                Want to Experience Our Acoustic Labs?
              </h2>
              <p className="font-body-lg text-sm sm:text-base text-on-primary-container leading-relaxed">
                Visit our campus, observe an unscripted debate cohort, and sit with our Cambridge-certified speech mentors for a diagnostic voice evaluation.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link href="/book-counselling" className="inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-sm">
                  Book Free Counselling
                </Link>
                <Link href="/courses" className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-on-primary font-label-md text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all border border-white/20">
                  Explore Curriculum
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Lightbox Modal */}
      {lightboxItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300"
          onClick={() => setLightboxItem(null)}
        >
          <div 
            className="relative max-w-4xl w-full bg-surface-container-lowest rounded-2xl overflow-hidden shadow-2xl flex flex-col border border-outline-variant/30 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-surface-container-lowest border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-[11px] font-bold uppercase tracking-widest bg-secondary/10 text-secondary px-2.5 py-1 rounded-md">
                  {lightboxItem.category || "Gallery Record"}
                </span>
                <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-semibold">Documentary Archive</span>
              </div>
              <button 
                onClick={() => setLightboxItem(null)}
                className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-primary transition-colors"
                type="button"
                aria-label="Close dialog"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            {/* Lightbox Media Area */}
            <div className="relative w-full max-h-[70vh] bg-black/90 flex items-center justify-center overflow-hidden">
              <img alt={lightboxItem.title} className="w-full h-full object-contain max-h-[70vh]" src={lightboxItem.image}/>
            </div>
            {/* Lightbox Footer */}
            <div className="p-5 bg-surface-container-lowest flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-outline-variant/30">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-primary">{lightboxItem.title}</h3>
                {lightboxItem.description && (
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{lightboxItem.description}</p>
                )}
              </div>
              <Link href="/book-counselling" className="shrink-0 inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-sm text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all shadow-xs">
                Observe Live Class
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
