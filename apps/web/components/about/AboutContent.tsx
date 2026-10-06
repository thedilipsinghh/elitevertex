import Link from "next/link";
import Image from "next/image";

export function AboutContent() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Compact Editorial Header */}
      <section className="w-full bg-surface-container-lowest">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-xl lg:py-space-2xl">
          <div className="max-w-3xl flex flex-col gap-space-2xs">
            <div className="flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label-md text-label-md uppercase tracking-widest text-secondary">About Elite Vertex</span>
            </div>
            <h1 className="font-display text-headline-lg-mobile md:text-headline-lg lg:text-display text-on-surface tracking-tight leading-[1.08] mt-space-3xs">
              More Than English.<br className="hidden sm:inline" />We Build Confidence.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-space-xs">
              Founded on the conviction that spoken language is mastered through psychological safety, active voice mechanics, and deliberate physical practice.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Our Story */}
      <section className="w-full bg-surface py-space-2xl lg:py-space-3xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Left Column Narrative */}
            <div className="lg:col-span-6 flex flex-col gap-space-md pr-0 lg:pr-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">01 / Origin &amp; Paradigm</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight">
                Fluency is a physical and psychological habit.
              </h2>
              <div className="flex flex-col gap-space-sm text-on-surface-variant font-body-md text-body-md">
                <p>
                  Traditional language pedagogy treats communication as a silent written exercise. For decades, classrooms across India drilled parsing syntax, memorizing verb tenses, and filling blanks—leaving adult professionals articulate on paper, yet gripped with crippling hesitation the moment they speak.
                </p>
                <p>
                  Elite Vertex was founded to reverse this obsolete hierarchy. Language fluency is not theoretical knowledge; it is muscular conditioning and nervous system calibration. Under sustained acoustic guidance, vocal cord hesitation dissolves only when students are liberated from fear of judgment.
                </p>
                <p>
                  By replacing quiet note-taking with continuous roundtable deliberation and immediate acoustic critique, we transform self-conscious translators into decisive, authoritative speakers.
                </p>
              </div>
              <div className="pt-space-xs flex items-center gap-space-lg">
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md text-primary font-bold">70%</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Acoustic Airtime Per Learner</span>
                </div>
                <div className="w-px h-10 bg-surface-container-highest"></div>
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md text-secondary font-bold">1:12</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Strict Cohort Ratio</span>
                </div>
              </div>
            </div>
            {/* Right Column Authentic Photo */}
            <div className="lg:col-span-6">
              <div className="relative bg-surface-container-low p-space-xs rounded-xl shadow-sm">
                <img
                  alt="Elite Vertex interactive roundtable workshop where students engage in live communicative practice under faculty supervision"
                  className="w-full aspect-[4/3] object-cover rounded-lg"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1XUmQebC7cWdgP8rjmnfdqiY3TWTBNoYsfMaSYI7n3xfYNILdru7siueSJaT3rMs4i4yPJNbvZvfikMQY3F9R2qu9KcA-IJpgJKfBgkmFG_E5MXmadYRgWJ_6PhUHhZrCm8UV-zLzfi7YQS7zuXK6r0MjulQm5z6SjXV14VWLoizz-xs76JsWDExBfm2OMZySxsZVg3HIpEMQlOhdIgz88ZuQ4xbfsXjeGRuCDxyYgFYtotlQBLMiC4mi6i"
                />
                <div className="p-space-sm bg-surface-container-lowest rounded-b-lg mt-space-2xs flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">Bengaluru Executive Seminar Room 04</span>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold">Active Debate Studio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission */}
      <section className="w-full bg-surface-container-lowest py-space-2xl lg:py-space-3xl shadow-[0_1px_0_rgba(0,0,0,0.02)]">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="max-w-xl mb-space-xl">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">02 / Purpose &amp; Horizon</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mt-space-3xs">
              Institutional Directives
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-xl">
            {/* Vision */}
            <div className="bg-surface-container-low p-space-xl rounded-xl flex flex-col justify-between">
              <div className="flex flex-col gap-space-sm">
                <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">The Institutional Vision</span>
                <h3 className="font-headline-md text-headline-md text-primary tracking-tight">
                  Eradicating speech anxiety and language hesitation across India’s rising talent.
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-2xs">
                  To build a culture where no engineer, founder, educator, or graduate is held back by vocal diffidence. We envision Indian professional voices commanding global auditoriums, boardrooms, and academic symposia with unmatched clarity, gravitas, and poise.
                </p>
              </div>
              <div className="pt-space-lg mt-space-lg flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[18px] text-secondary">trip_origin</span>
                <span>National Oral Fluency Standard 2030</span>
              </div>
            </div>
            {/* Mission */}
            <div className="bg-primary-container text-on-primary-container p-space-xl rounded-xl flex flex-col justify-between">
              <div className="flex flex-col gap-space-sm">
                <span className="font-label-md text-label-md uppercase tracking-wider text-secondary-fixed">The Core Mission</span>
                <h3 className="font-headline-md text-headline-md text-surface-container-lowest tracking-tight">
                  Acoustic immersion, personalized vocal diagnostics, and CEFR-verified advancement.
                </h3>
                <p className="font-body-md text-body-md text-primary-fixed-dim mt-space-2xs">
                  Deploying small-group seminar pedagogy strictly capped at 12 participants per studio. Every student receives phoneme-level acoustic feedback, daily impromptu podium time, and psychologically fortified speaking drills mapped directly to Cambridge CEFR standards.
                </p>
              </div>
              <div className="pt-space-lg mt-space-lg flex items-center gap-space-xs text-primary-fixed-dim font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[18px] text-secondary-fixed">verified</span>
                <span>Accredited Academic Methodology</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Teaching Philosophy */}
      <section className="w-full bg-surface py-space-2xl lg:py-space-3xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">03 / Pedagogical Architecture</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mt-space-3xs">
                Learn → Practice → Speak → Improve
              </h2>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
              A four-stage closed feedback cycle engineered to systematically dismantle vocal inhibition through micro-coaching and live airtime.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            {/* Stage 1 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col gap-space-sm shadow-sm hover:translate-y-[-2px] transition-transform duration-200">
              <div className="flex items-center justify-between">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">01</span>
                <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">Step One</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mt-space-2xs">Learn</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Targeted 15-minute conceptual briefs on vocal inflection, thought-framing frameworks (PREP, STAR), and tone modulation. Zero lecture overload.
              </p>
            </div>
            {/* Stage 2 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col gap-space-sm shadow-sm hover:translate-y-[-2px] transition-transform duration-200">
              <div className="flex items-center justify-between">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">02</span>
                <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">Step Two</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mt-space-2xs">Practice</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Drills in private, sound-isolated acoustic pods. Rapid repetition of rhythm, jaw relaxation mechanics, and uninhibited phrasing drills.
              </p>
            </div>
            {/* Stage 3 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col gap-space-sm shadow-sm hover:translate-y-[-2px] transition-transform duration-200">
              <div className="flex items-center justify-between">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">03</span>
                <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">Step Three</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mt-space-2xs">Speak</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Live podium speaking infront of an intimate group of 12. Impromptu debates, board presentations, and simulated high-stakes cross-examinations.
              </p>
            </div>
            {/* Stage 4 */}
            <div className="bg-surface-container-lowest p-space-lg rounded-xl flex flex-col gap-space-sm shadow-sm hover:translate-y-[-2px] transition-transform duration-200">
              <div className="flex items-center justify-between">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">04</span>
                <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">Step Four</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mt-space-2xs">Improve</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                High-definition video playback analysis with faculty. Constructive diagnostic critique on eye-line, filler cadence, and assertive articulation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Learning Environment & Leadership */}
      <section className="w-full bg-surface-container-low py-space-2xl lg:py-space-3xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="max-w-2xl mb-space-xl">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">04 / Leadership &amp; Space</span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mt-space-3xs">
              Scholarly Rigor in Modern Architectural Spaces
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Faculty Portrait */}
            <div className="lg:col-span-5">
              <div className="bg-surface-container-lowest p-space-xs rounded-xl shadow-sm">
                <img
                  alt="Portrait of Dr. Meenakshi Sundaram, Chief Linguist and Academic Dean at Elite Vertex Institute"
                  className="w-full aspect-[4/5] object-cover rounded-lg"
                  src="https://lh3.googleusercontent.com/aida/AEtjO1VxRPTogt0A57N14457KucT3rxqNKRPPEb1qPm-CIFuw1wiSHSbHElScSJfENkOfdFaJADBnZTmQJ3ZWim1ZL82hh6-iAqn9ATFm4QPXJ2B63y699ZfTPjJvUQ3SMK6sN-F0AtI0zgS4-YFYqaJVyc4Wu7ACiSpt9EmlbyhLppBRFv6aan4TTgQU3aICLKS1C9VGvExCM7cClYc1bNGkvgwYHQWjGDxmJXda8d5ntxI3AORC2RZtuTfV1AQ"
                />
                <div className="p-space-sm flex flex-col gap-space-3xs">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Dr. Meenakshi Sundaram</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Chief Linguist &amp; Academic Dean</span>
                </div>
              </div>
            </div>
            {/* Bio & Infrastructure Highlights */}
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              <div className="flex flex-col gap-space-sm">
                <div className="inline-flex items-center gap-space-xs px-space-xs py-space-3xs bg-secondary-fixed text-on-secondary-fixed rounded text-label-sm font-label-sm uppercase tracking-wider w-fit">
                  British Council Accredited Fellow
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface tracking-tight">
                  &quot;We do not teach you to impersonate a native speaker. We coach you to speak with total clarity, natural gravitas, and unflinching presence.&quot;
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  With over 22 years of forensic linguistic research and corporate communication advisory across Oxford, Singapore, and India, Dr. Sundaram directs the curriculum standards at Elite Vertex. Under her governance, every module prioritizes psychological comfort, pragmatic phonetics, and real-world professional resonance over artificial diction.
                </p>
              </div>
              {/* Physical Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm pt-space-xs">
                <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-3xs">
                  <span className="material-symbols-outlined text-secondary text-[28px]">graphic_eq</span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface mt-space-2xs text-[1rem]">Acoustic Pods</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Individual soundproof chambers for private speech recording and playback calibration.</p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-3xs">
                  <span className="material-symbols-outlined text-secondary text-[28px]">videocam</span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface mt-space-2xs text-[1rem]">HD Playback Labs</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Dual-camera review setups to analyze body posture, micro-pauses, and eye contact vectors.</p>
                </div>
                <div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-3xs">
                  <span className="material-symbols-outlined text-secondary text-[28px]">meeting_room</span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface mt-space-2xs text-[1rem]">Executive Studios</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Roundtable chambers in Bengaluru and New Delhi configured for authentic boardroom simulations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. High-Trust Final CTA */}
      <section className="w-full bg-surface py-space-2xl lg:py-space-3xl">
        <div className="max-w-[1280px] mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
          <div className="bg-primary p-space-xl md:p-space-2xl rounded-xl text-on-primary flex flex-col md:flex-row md:items-center justify-between gap-space-xl shadow-md">
            <div className="flex flex-col gap-space-xs max-w-xl">
              <span className="font-label-md text-label-md uppercase tracking-widest text-secondary-fixed">Direct Admission Portal</span>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-surface-bright tracking-tight">
                Start Your Journey With Elite Vertex.
              </h2>
              <p className="font-body-md text-body-md text-surface-variant max-w-lg">
                Experience an active classroom session and receive a complimentary 20-minute diagnostic speech assessment with our senior academic linguists.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md shrink-0">
              <Link className="inline-flex items-center justify-center bg-secondary hover:bg-on-secondary-container text-on-secondary font-label-md text-label-md uppercase tracking-wider px-space-xl py-space-sm rounded-lg transition-colors duration-150" href="/book-counselling">
                Book Free Counselling
              </Link>
              <Link className="inline-flex items-center gap-space-3xs text-on-primary font-label-md text-label-md uppercase tracking-wider hover:text-secondary-fixed transition-colors py-space-sm" href="/courses">
                <span>Explore Curriculum</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
