import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Scale,
  Shield,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  ArrowLeft,
  FileText,
  AlertOctagon,
  CheckCircle2,
  Tag,
  Layers,
  Sparkles
} from 'lucide-react';
import { LMPC_RULES } from '../data/lmpcRules2011';
import { STANDARD_PACK_RULES } from '../data/standardPackSizes';

interface RulebookPageProps {
  onBack?: () => void;
}

export const RulebookPage: React.FC<RulebookPageProps> = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [expandedSection, setExpandedSection] = useState<string | null>('chapter-2');

  const chapters = [
    { id: 'all', title: 'Entire Rulebook (43 Pages)' },
    { id: 'ch1', title: 'Chapter I: Preliminary (Rules 1-2)' },
    { id: 'ch2', title: 'Chapter II: Retail Packages (Rules 3-23)' },
    { id: 'ch3', title: 'Chapter III: Wholesale Packages (Rules 24-26)' },
    { id: 'ch4', title: 'Chapter IV: Export & Import (Rules 27-28)' },
    { id: 'sched2', title: 'Second Schedule: Standard Pack Sizes' },
    { id: 'sched5', title: 'Fifth Schedule: Maximum Allowable Error' },
    { id: 'sched8', title: 'Eighth Schedule & Sec 36: Penalties' }
  ];

  const filteredRules = LMPC_RULES.filter(r =>
    r.ruleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.legalSection.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
              title="Back to Platform"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#0A3663] text-white text-[10px] font-bold uppercase tracking-wider">
                Official Gazette GSR 202(E)
              </span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">Ministry of Consumer Affairs</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight flex items-center gap-2 mt-0.5">
              <BookOpen className="w-6 h-6 text-[#00A651]" />
              <span>Legal Metrology (Packaged Commodities) Rules, 2011</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
            <span>Print Rulebook</span>
          </button>
          <a
            href="https://consumeraffairs.nic.in/acts-and-rules/legal-metrology/legal-metrology-packaged-commodities-rules-2011"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-[#00A651] hover:bg-[#008f45] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Official Gazette PDF</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>

      {/* Gazette Stat / Metadata Overview Card */}
      <div className="bg-[#18181b] text-white rounded-3xl p-6 shadow-xl border border-zinc-800 relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">Statutory Enactment</span>
            <span className="text-lg font-black text-white block mt-0.5">7th March, 2011</span>
            <p className="text-xs text-zinc-400 mt-1">Notification GSR 202(E), w.e.f 1st April, 2011 with subsequent amendments.</p>
          </div>
          <div>
            <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">Enforcement Jurisdiction</span>
            <span className="text-lg font-black text-white block mt-0.5">All-India Coverage</span>
            <p className="text-xs text-zinc-400 mt-1">Enforced by Central Legal Metrology Directorate & State Controllers.</p>
          </div>
          <div>
            <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">Key Mandate</span>
            <span className="text-lg font-black text-white block mt-0.5">Consumer Transparency</span>
            <p className="text-xs text-zinc-400 mt-1">Mandatory retail declarations, standard pack sizing, and anti-dual pricing.</p>
          </div>
          <div>
            <span className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider block">Penal Sanctions</span>
            <span className="text-lg font-black text-white block mt-0.5">Sec 36(1) & Sec 48</span>
            <p className="text-xs text-zinc-400 mt-1">Fines up to ₹25,000 for first offence; up to ₹50,000 / 1 year imprisonment for second.</p>
          </div>
        </div>
      </div>

      {/* Search and Chapter Filter Navigation */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
          <input
            type="text"
            placeholder="Search rules by number, title, keyword (e.g. MRP, Table I)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs text-slate-900 dark:text-zinc-100 focus:outline-none focus:border-[#00A651]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Chapter Selection Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChapter(ch.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedChapter === ch.id
                  ? 'bg-[#00A651] text-white shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800'
              }`}
            >
              {ch.title}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CHAPTER I: PRELIMINARY (Pages 1 - 4)                                   */}
      {/* ========================================================================= */}
      {(selectedChapter === 'all' || selectedChapter === 'ch1') && (
        <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#00A651] uppercase">Gazette Pages 1–4</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-zinc-100">
                Chapter I: Preliminary (Rule 1 & Rule 2)
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Commenced: 1st April 2011</span>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-zinc-300">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
              <h3 className="font-black text-slate-900 dark:text-zinc-100 text-sm mb-1">
                Rule 1: Short Title and Commencement
              </h3>
              <p>
                (1) These rules may be called <strong>The Legal Metrology (Packaged Commodities) Rules, 2011</strong>.<br />
                (2) They shall come into force on the 1st day of April, 2011, replacing the Standards of Weights and Measures (Packaged Commodities) Rules, 1977 across all States and Union Territories of India.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
              <h3 className="font-black text-slate-900 dark:text-zinc-100 text-sm mb-1">
                Rule 2: Statutory Definitions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <strong className="text-emerald-700 dark:text-emerald-400 block font-black">Rule 2(h) - Principal Display Panel (PDP)</strong>
                  <span>In relation to a package, means that part of the package which is intended or likely to be displayed, presented, shown or examined by the customer under customary retail conditions.</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <strong className="text-emerald-700 dark:text-emerald-400 block font-black">Rule 2(m) - Retail Sale Price (MRP)</strong>
                  <span>The maximum price at which the commodity in packaged form may be sold to the ultimate consumer and shall include all taxes, local or otherwise, freight, transport, commission and all other charges.</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <strong className="text-emerald-700 dark:text-emerald-400 block font-black">Rule 2(k) - Retail Package</strong>
                  <span>Means the packages which are intended for retail sale to an individual consumer or household, or any other person who does not purchase for resale.</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <strong className="text-emerald-700 dark:text-emerald-400 block font-black">Rule 2(r) - Wholesale Package</strong>
                  <span>Means a package containing either a number of retail packages intended for sale, or a commodity sold in bulk quantities to an intermediary or industrial consumer.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. CHAPTER II: PROVISIONS FOR RETAIL PACKAGES (Pages 5 - 19)             */}
      {/* ========================================================================= */}
      {(selectedChapter === 'all' || selectedChapter === 'ch2') && (
        <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#00A651] uppercase">Gazette Pages 5–19</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-zinc-100">
                Chapter II: Provisions Applicable to Packages for Retail Sale (Rules 3 to 23)
              </h2>
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Core Inspection Provisions</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 flex flex-col justify-between hover:border-emerald-500 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono font-bold text-xs text-[#0A3663] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-900">
                      {rule.ruleNumber}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">
                      Gazette Page #{rule.gazettePage}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100 mb-2 leading-snug">
                    {rule.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed mb-3">
                    {rule.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-red-600 dark:text-red-400">
                    Statutory Fine: ₹{rule.statutoryFine.toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-500 dark:text-zinc-500 truncate max-w-[200px]" title={rule.legalSection}>
                    {rule.legalSection}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Table I: Minimum Height of Numerals & Letters (Rule 7) */}
          <div className="mt-6 p-5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100">
                  Rule 7 Table I: Minimum Height of Numerals for Net Quantity Declarations
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Mandatory letter & numeral dimensions based on net quantity and area of Principal Display Panel (PDP)
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                Gazette Page 8
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-200 dark:bg-zinc-800 font-black text-slate-900 dark:text-zinc-100">
                  <tr>
                    <th className="p-2.5 rounded-l-xl">Net Quantity in Weight or Volume</th>
                    <th className="p-2.5">PDP Surface Area (A in cm²)</th>
                    <th className="p-2.5">Normal Minimum Height</th>
                    <th className="p-2.5 rounded-r-xl">Blown / Embossed / Molded Height</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-slate-700 dark:text-zinc-300 font-medium">
                  <tr>
                    <td className="p-2.5">Up to 50 g / ml</td>
                    <td className="p-2.5 font-mono">A ≤ 50 cm²</td>
                    <td className="p-2.5 font-bold text-emerald-600">1.0 mm</td>
                    <td className="p-2.5 font-bold">2.0 mm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">50 g/ml to 200 g/ml</td>
                    <td className="p-2.5 font-mono">50 &lt; A ≤ 100 cm²</td>
                    <td className="p-2.5 font-bold text-emerald-600">2.0 mm</td>
                    <td className="p-2.5 font-bold">4.0 mm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">200 g/ml to 1 kg/litre</td>
                    <td className="p-2.5 font-mono">100 &lt; A ≤ 500 cm²</td>
                    <td className="p-2.5 font-bold text-emerald-600">4.0 mm</td>
                    <td className="p-2.5 font-bold">6.0 mm</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">More than 1 kg / litre</td>
                    <td className="p-2.5 font-mono">A &gt; 500 cm²</td>
                    <td className="p-2.5 font-bold text-emerald-600">6.0 mm</td>
                    <td className="p-2.5 font-bold">6.0 mm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 3. THE SECOND SCHEDULE: STANDARD PACK SIZES (Pages 20 - 24)               */}
      {/* ========================================================================= */}
      {(selectedChapter === 'all' || selectedChapter === 'sched2') && (
        <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#00A651] uppercase">Gazette Pages 20–24</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-zinc-100">
                The Second Schedule (Rule 5): Permissible Standard Pack Sizes
              </h2>
            </div>
            <span className="text-xs font-bold text-[#0A3663] dark:text-blue-400">14 Designated Commodities</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Under <strong>Rule 5</strong> of the Legal Metrology (Packaged Commodities) Rules, 2011, commodities specified in the Second Schedule shall be packed and offered for sale only in the standard quantities prescribed below. Any violation is penalizable under Section 36(1).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {STANDARD_PACK_RULES.map((rule) => (
              <div
                key={rule.scheduleItemNo}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 dark:text-zinc-100">
                    Item #{rule.scheduleItemNo}: {rule.name}
                  </span>
                  <span className="text-[10px] font-mono bg-slate-200 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-slate-700 dark:text-zinc-300 font-bold">
                    Unit: {rule.allowedSizes.unit}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {rule.allowedSizes.exactValues?.map((val) => (
                    <span
                      key={val}
                      className="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold"
                    >
                      {val} {rule.allowedSizes.unit}
                    </span>
                  ))}
                  {rule.allowedSizes.multiplesAbove && (
                    <span className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold">
                      Multiples of {rule.allowedSizes.step} above {rule.allowedSizes.multiplesAbove}{rule.allowedSizes.unit}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. THE FIFTH SCHEDULE: MAXIMUM ALLOWABLE ERROR & SAMPLING (Pages 28 - 34) */}
      {/* ========================================================================= */}
      {(selectedChapter === 'all' || selectedChapter === 'sched5') && (
        <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#00A651] uppercase">Gazette Pages 28–34</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-zinc-100">
                The Fifth Schedule (Rule 24): Maximum Allowable Deficiency (MAD)
              </h2>
            </div>
            <span className="text-xs font-bold text-red-600 dark:text-red-400">Statistical Seizure Criteria</span>
          </div>

          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            The error in deficiency on net quantity in any individual retail package shall not exceed the Maximum Allowable Error specified in Table 1 below. In batch inspections, a lot fails if either:
            (a) The average net quantity is less than the declared quantity adjusted by the Student's t-factor: <code className="font-mono font-bold text-slate-900 dark:text-zinc-100">Avg &lt; Declared - t·(s/√n)</code>; or
            (b) The number of defective packages exceeds the permissible threshold in the sampling plan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Table 1 Sampling Plans */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
              <h3 className="font-black text-slate-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2">
                Fifth Schedule Table 1: Statistical Batch Sampling Plan
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span>Lot Size ≤ 500 units</span>
                  <span className="font-bold">Sample: 32 | Max Defective: 1 | t = 0.379</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span>Lot Size 501 - 3,200</span>
                  <span className="font-bold">Sample: 50 | Max Defective: 2 | t = 0.328</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span>Lot Size 3,201 - 35,000</span>
                  <span className="font-bold">Sample: 80 | Max Defective: 3 | t = 0.283</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span>Lot Size &gt; 35,000 units</span>
                  <span className="font-bold">Sample: 125 | Max Defective: 5 | t = 0.252</span>
                </div>
              </div>
            </div>

            {/* MPE Error Margins */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
              <h3 className="font-black text-slate-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2">
                Permissible Error Margins (Form A & Form B)
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span>Up to 50 g / ml</span>
                  <span className="font-bold text-red-600">9% of declared quantity</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span>50 to 100 g / ml</span>
                  <span className="font-bold text-red-600">4.5 g / ml</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span>100 to 200 g / ml</span>
                  <span className="font-bold text-red-600">4.5% of declared quantity</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span>200 to 300 g / ml</span>
                  <span className="font-bold text-red-600">9 g / ml</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span>300 to 500 g / ml</span>
                  <span className="font-bold text-red-600">3% of declared quantity</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
                  <span>500 to 1000 g / ml</span>
                  <span className="font-bold text-red-600">15 g / ml</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 5. PENALTIES, SECTIONS & COMPOUNDING FEES (Pages 38 - 43)                 */}
      {/* ========================================================================= */}
      {(selectedChapter === 'all' || selectedChapter === 'sched8') && (
        <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <div>
              <span className="text-[10px] font-mono font-bold text-[#00A651] uppercase">Gazette Pages 38–43</span>
              <h2 className="text-lg font-black text-slate-900 dark:text-zinc-100">
                Penal Provisions & Compounding Fee Schedule (Legal Metrology Act, 2009)
              </h2>
            </div>
            <span className="text-xs font-bold text-red-600">Statutory Penalties</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-2">
              <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-mono text-[10px] font-bold">Section 36(1)</span>
              <h3 className="font-black text-sm text-slate-900 dark:text-zinc-100">First Offence Penalty</h3>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                Whoever manufactures, packs, imports, sells, distributes, or delivers any pre-packaged commodity which does not conform to the declarations on the package shall be punished with fine which may extend to <strong>₹25,000</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 space-y-2">
              <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-mono text-[10px] font-bold">Section 36(2)</span>
              <h3 className="font-black text-sm text-slate-900 dark:text-zinc-100">Repeat & Habitual Offence</h3>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                For the second offence, with fine which may extend to <strong>₹50,000</strong>, and for the subsequent offence, with fine which shall not be less than ₹50,000 but may extend to <strong>₹1,00,000 or with imprisonment for a term up to 1 year</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 space-y-2">
              <span className="px-2 py-0.5 rounded-md bg-[#0A3663] text-white font-mono text-[10px] font-bold">Section 48 & Rule 32</span>
              <h3 className="font-black text-sm text-slate-900 dark:text-zinc-100">Compounding of Offences</h3>
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                Any offence punishable under the Act may, before or after the institution of the prosecution, be compounded by a Director or Legal Metrology Controller on payment of compounding fees specified in the Eighth Schedule.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
