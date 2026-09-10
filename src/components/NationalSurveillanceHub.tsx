import React, { useState } from 'react';
import {
  Radio,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Globe,
  TrendingUp,
  Award,
  Filter,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  MapPin,
  CheckCircle2,
  AlertOctagon,
  FileSpreadsheet
} from 'lucide-react';

export const NationalSurveillanceHub: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('all');

  const stateData = [
    { state: 'Delhi NCT', raids: 4210, compliance: 82, seizures: 142, fine: '₹14.2 Lakh' },
    { state: 'Maharashtra', raids: 8940, compliance: 76, seizures: 380, fine: '₹28.4 Lakh' },
    { state: 'Karnataka', raids: 6510, compliance: 78, seizures: 210, fine: '₹19.1 Lakh' },
    { state: 'Uttar Pradesh', raids: 12400, compliance: 64, seizures: 620, fine: '₹42.8 Lakh' },
    { state: 'Gujarat', raids: 7120, compliance: 81, seizures: 190, fine: '₹18.6 Lakh' },
    { state: 'Tamil Nadu', raids: 6850, compliance: 79, seizures: 230, fine: '₹21.0 Lakh' },
  ];

  const darkStores = [
    { name: 'Blinkit', compliance: 82, violations: 'Missing USP & foreign origin details on imported snacks', status: 'Moderate' },
    { name: 'Zepto', compliance: 79, violations: 'Sticker pricing on edible oils; missing PIN codes', status: 'High Alert' },
    { name: 'Swiggy Instamart', compliance: 84, violations: 'Font height on PDP below Table I minimums', status: 'Moderate' },
    { name: 'Amazon Fresh', compliance: 91, violations: 'Minor manufacturer postal PIN omission', status: 'Low Risk' },
    { name: 'Flipkart Minutes', compliance: 80, violations: 'Dual pricing notices issued in 3 dark store hubs', status: 'Moderate' },
  ];

  const repeatOffenders = [
    { brand: 'Shree Krishna Agro Oils Ltd.', violations: 5, rule: 'Rule 18(5) Sticker Overprinting & Rule 12 Non-SI Units', penalty: '₹50,000 (2nd Offense)', status: 'Show Cause Issued' },
    { brand: 'Sunrise Bakery & Confectionery', violations: 4, rule: 'Rule 5 Second Schedule Standard Pack Violation', penalty: '₹25,000', status: 'Compounded' },
    { brand: 'Global Import Goods LLP', violations: 3, rule: 'Rule 10(1) Second Proviso Missing Indian Importer Details', penalty: '₹35,000', status: 'Notice Served' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#0A3663] text-white">
            <Radio className="w-6 h-6 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-[#00A651] uppercase tracking-wider">
                Ministry National Intelligence Hub
              </span>
              <span className="text-[10px] bg-cyan-100 text-cyan-900 px-2 py-0.5 rounded-full font-bold">
                Live Field Feed
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
              National Legal Metrology Surveillance Directorate
            </h1>
            <p className="text-xs text-slate-500">
              Macro market surveillance, nationwide enforcement coordination, and repeat offender tracking under Legal Metrology Act, 2009
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-500 block">Surveillance Lead</span>
            <span className="text-xs font-black text-slate-900">National Surveillance Director</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#0A3663] text-white flex items-center justify-center font-bold text-sm">
            R
          </div>
        </div>
      </div>

      {/* Top Macro KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs transition-colors">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            National Commodities Scanned
          </span>
          <div className="text-2xl font-black text-[#0A3663] mt-1">
            148,290 <span className="text-xs text-slate-400 font-normal">Packs</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">
            ↑ 18.4% this quarter
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs transition-colors">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            All-India Compliance Rate
          </span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            74.2% <span className="text-xs text-slate-400 font-normal">Conforming</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            25.8% flagged for remedial compounding
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs transition-colors">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Seizure Actions Executed
          </span>
          <div className="text-2xl font-black text-red-600 mt-1">
            1,840 <span className="text-xs text-slate-400 font-normal">Lots</span>
          </div>
          <span className="text-[11px] text-red-600 font-bold mt-1 inline-block">
            Est. Value: ₹2.48 Crore
          </span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs transition-colors">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Compounding Fines Realized
          </span>
          <div className="text-2xl font-black text-amber-600 mt-1">
            ₹48.6 <span className="text-xs text-slate-400 font-normal">Lakhs</span>
          </div>
          <span className="text-[11px] text-slate-500 block mt-1">
            Under Section 48 & Rule 32
          </span>
        </div>
      </div>

      {/* Two Column Section: State Surveillance Heatmap & Dark Store Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: State Surveillance Performance */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#00A651]" />
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                State Enforcement Performance Matrix
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-400">Regional Metrology Directorates</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {stateData.map((item) => (
              <div key={item.state} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{item.state}</span>
                  <span className="text-[10px] text-slate-500">{item.raids.toLocaleString()} inspections • {item.seizures} seizures</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-600 block">{item.compliance}%</span>
                    <span className="text-[10px] text-slate-400">Compliance</span>
                  </div>
                  <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.compliance > 80 ? 'bg-emerald-500' : item.compliance > 70 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${item.compliance}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-700 min-w-[70px] text-right">
                    {item.fine}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick-Commerce Dark Store Surveillance (SIH Core Theme) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Quick-Commerce Dark Store Radar
              </h3>
            </div>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
              LMPC Rule 6(10)
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {darkStores.map((ds) => (
              <div key={ds.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-black text-slate-900">{ds.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0A3663]">{ds.compliance}%</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                      ds.status === 'Low Risk'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ds.status === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ds.status}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {ds.violations}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Repeat Offender Watchlist & Special Enforcement Campaigns */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs transition-colors space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-600" />
            <h3 className="text-sm font-black text-slate-900 tracking-tight">
              Repeat Offender Escalation Tracker (Section 36 Mandatory 2nd Offense Penalties)
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-bold">Cross-District Intelligence</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3 font-bold">Manufacturer / Brand Owner</th>
                <th className="p-3 font-bold">Flagged Violations</th>
                <th className="p-3 font-bold">Statutory Infringements</th>
                <th className="p-3 font-bold">Prescribed Compounding Fee</th>
                <th className="p-3 font-bold text-right">Legal Action Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800 text-xs">
              {repeatOffenders.map((ro) => (
                <tr key={ro.brand}>
                  <td className="p-3 font-bold text-slate-900">{ro.brand}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                      {ro.violations} Raids Flagged
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 text-[11px]">{ro.rule}</td>
                  <td className="p-3 font-mono font-bold text-red-600">{ro.penalty}</td>
                  <td className="p-3 text-right font-bold text-[#0A3663]">{ro.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
