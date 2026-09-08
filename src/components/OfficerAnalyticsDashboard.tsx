import React, { useState } from 'react';
import { ComplianceReport } from '../types';
import { getScanReports, getInspectionStats, deleteScanReport } from '../services/dbService';
import { generateCompliancePDF } from '../services/pdfReportGenerator';
import {
  BarChart3,
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  FileText,
  IndianRupee,
  ShieldCheck,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';

interface OfficerAnalyticsDashboardProps {
  onSelectReport: (report: ComplianceReport) => void;
}

export const OfficerAnalyticsDashboard: React.FC<OfficerAnalyticsDashboardProps> = ({
  onSelectReport,
}) => {
  const [reports, setReports] = useState<ComplianceReport[]>(getScanReports());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLIANT' | 'NON_COMPLIANT' | 'NEEDS_REVIEW'>('ALL');

  const stats = getInspectionStats();

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.productInfo.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.productInfo.manufacturerName && r.productInfo.manufacturerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || r.overallStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteScanReport(id);
    setReports(getScanReports());
  };

  const handleDownloadPDF = (report: ComplianceReport, e: React.MouseEvent) => {
    e.stopPropagation();
    generateCompliancePDF(report);
  };

  return (
    <div className="space-y-6">
      {/* Top Stat KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-semibold uppercase">
            <span>Total Inspected</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.total} Packages</div>
          <div className="text-[11px] text-slate-500 mt-1">Across retail & dark stores</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-semibold uppercase">
            <span>Compliance Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.complianceRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{stats.compliant} fully conforming</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-semibold uppercase">
            <span>Flagged for Seizure</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400">{stats.nonCompliant} Packages</div>
          <div className="text-[11px] text-slate-500 mt-1">Under Rule 20(1) & 21(3)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-semibold uppercase">
            <span>Compounding Fines</span>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            ₹{stats.totalFines.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Under Section 32 & 48</div>
        </div>
      </div>

      {/* Category Risk Breakdown */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <span>Category Risk Heatmap (LMPC Enforcement Hotspots)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-300">Edible Oils</span>
              <span className="text-[10px] text-red-400 font-bold">High Risk</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-red-500 h-full w-[72%]"></div>
            </div>
            <span className="text-[10px] text-slate-500">Sticker tampering & Dual unit issues</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-300">Biscuits & Bakery</span>
              <span className="text-[10px] text-amber-400 font-bold">Medium Risk</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-amber-500 h-full w-[45%]"></div>
            </div>
            <span className="text-[10px] text-slate-500">Second Schedule size non-compliance</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-300">Dairy & Milk</span>
              <span className="text-[10px] text-amber-400 font-bold">Medium Risk</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-amber-500 h-full w-[38%]"></div>
            </div>
            <span className="text-[10px] text-slate-500">Font size on PDP below Table-I</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-300">Foodgrains / Atta</span>
              <span className="text-[10px] text-emerald-400 font-bold">Low Risk</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-emerald-500 h-full w-[15%]"></div>
            </div>
            <span className="text-[10px] text-slate-500">Standard 1kg/5kg packs conforming</span>
          </div>
        </div>
      </div>

      {/* Inspection History & Case Repository */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Inspection Dossier & Seizure Log
            </h3>
            <p className="text-xs text-slate-400">
              Complete archive of scanned packaged commodities and issued statutory notices
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search product, manufacturer..."
                className="bg-slate-950 border border-slate-800 text-white text-xs pl-8 pr-3 py-1.5 rounded-xl w-48 sm:w-64 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Status</option>
              <option value="COMPLIANT">Compliant Only</option>
              <option value="NON_COMPLIANT">Violations Only</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
            </select>
          </div>
        </div>

        {/* Table of Scans */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Inspection ID</th>
                <th className="py-3 px-4">Commodity / Manufacturer</th>
                <th className="py-3 px-4">Net Qty & MRP</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4">Penalty</th>
                <th className="py-3 px-4 text-right">Statutory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReports.map((report) => {
                const isPass = report.overallStatus === 'COMPLIANT';
                const isWarn = report.overallStatus === 'NEEDS_REVIEW';

                return (
                  <tr
                    key={report.id}
                    onClick={() => onSelectReport(report)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                      {report.id}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        {new Date(report.scanTimestamp).toLocaleDateString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{report.productInfo.productName}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {report.productInfo.manufacturerName}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-200">
                        {report.productInfo.netQuantity} {report.productInfo.quantityUnit}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {report.productInfo.mrpString}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          isPass
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : isWarn
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {isPass ? 'COMPLIANT' : isWarn ? 'WARNINGS' : 'NON-COMPLIANT'}
                        <span className="ml-1">({report.score}%)</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-red-400">
                      {report.totalCompoundingFine > 0
                        ? `₹${report.totalCompoundingFine.toLocaleString('en-IN')}`
                        : 'Nil'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => handleDownloadPDF(report, e)}
                          className="p-1.5 bg-slate-800 hover:bg-emerald-600 hover:text-white rounded-lg text-slate-300 transition-colors"
                          title="Download Form A/B PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(report.id, e)}
                          className="p-1.5 bg-slate-800 hover:bg-red-600 hover:text-white rounded-lg text-slate-400 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No inspection records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
