import React, { useState } from 'react';
import { ComplianceReport } from '../types';
import { getScanReports, getInspectionStats, deleteScanReport } from '../services/dbService';
import { generateCompliancePDF } from '../services/pdfReportGenerator';
import {
  BarChart3,
  Search,
  Download,
  Trash2,
  AlertOctagon,
  IndianRupee,
  ShieldCheck,
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
        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-bold uppercase">
            <span>Total Inspected</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">{stats.total} Packages</div>
          <div className="text-[11px] text-slate-500 mt-1">Across retail & dark stores</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-bold uppercase">
            <span>Compliance Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{stats.complianceRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">{stats.compliant} fully conforming</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-bold uppercase">
            <span>Flagged for Seizure</span>
            <AlertOctagon className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-black text-red-600">{stats.nonCompliant} Packages</div>
          <div className="text-[11px] text-slate-500 mt-1">Under Rule 20(1) & 21(3)</div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-bold uppercase">
            <span>Compounding Fines</span>
            <IndianRupee className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            ₹{stats.totalFines.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Under Section 32 & 48</div>
        </div>
      </div>

      {/* Category Risk Breakdown */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
        <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#0A3663]" />
          <span>Category Risk Heatmap (LMPC Enforcement Hotspots)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-800">Edible Oils</span>
              <span className="text-[10px] text-red-600 font-bold">High Risk</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-red-500 h-full w-[72%]"></div>
            </div>
            <span className="text-[10px] text-slate-500">Sticker tampering & Dual unit issues</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-800">Biscuits & Bakery</span>
              <span className="text-[10px] text-amber-600 font-bold">Medium Risk</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-amber-500 h-full w-[45%]"></div>
            </div>
            <span className="text-[10px] text-slate-500">Second Schedule size non-compliance</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-800">Dairy & Milk</span>
              <span className="text-[10px] text-amber-600 font-bold">Medium Risk</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-amber-500 h-full w-[38%]"></div>
            </div>
            <span className="text-[10px] text-slate-500">Font size on PDP below Table-I</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-slate-800">Foodgrains / Atta</span>
              <span className="text-[10px] text-emerald-600 font-bold">Low Risk</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
              <div className="bg-emerald-500 h-full w-[15%]"></div>
            </div>
            <span className="text-[10px] text-slate-500">Standard 1kg/5kg packs conforming</span>
          </div>
        </div>
      </div>

      {/* Inspection History & Case Repository */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Inspection Dossier & Seizure Log
            </h3>
            <p className="text-xs text-slate-500">
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
                className="bg-slate-50 border border-slate-300 text-slate-900 text-xs pl-8 pr-3 py-1.5 rounded-xl w-48 sm:w-64 focus:outline-none focus:border-[#0A3663]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-900 text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-[#0A3663]"
            >
              <option value="ALL">All Status</option>
              <option value="COMPLIANT">Compliant Only</option>
              <option value="NON_COMPLIANT">Violations Only</option>
              <option value="NEEDS_REVIEW">Needs Review</option>
            </select>
          </div>
        </div>

        {/* Table of Scans */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] uppercase font-bold text-slate-600 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Inspection ID</th>
                <th className="py-3 px-4">Commodity / Manufacturer</th>
                <th className="py-3 px-4">Net Qty & MRP</th>
                <th className="py-3 px-4">Compliance Status</th>
                <th className="py-3 px-4">Penalty</th>
                <th className="py-3 px-4 text-right">Statutory Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((report) => {
                const isPass = report.overallStatus === 'COMPLIANT';
                const isWarn = report.overallStatus === 'NEEDS_REVIEW';

                return (
                  <tr
                    key={report.id}
                    onClick={() => onSelectReport(report)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#0A3663]">
                      {report.id}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        {new Date(report.scanTimestamp).toLocaleDateString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-black text-slate-900 dark:text-slate-100">{report.productInfo.productName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {report.productInfo.manufacturerName}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {report.productInfo.netQuantity} {report.productInfo.quantityUnit}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {report.productInfo.mrpString}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          isPass
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isWarn
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {isPass ? 'COMPLIANT' : isWarn ? 'WARNINGS' : 'NON-COMPLIANT'}
                        <span className="ml-1">({report.score}%)</span>
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-red-600">
                      {report.totalCompoundingFine > 0
                        ? `₹${report.totalCompoundingFine.toLocaleString('en-IN')}`
                        : 'Nil'}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => handleDownloadPDF(report, e)}
                          className="p-1.5 bg-slate-100 hover:bg-[#00A651] hover:text-white rounded-lg text-slate-600 transition-colors cursor-pointer"
                          title="Download Form A/B PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(report.id, e)}
                          className="p-1.5 bg-slate-100 hover:bg-red-600 hover:text-white rounded-lg text-slate-500 transition-colors cursor-pointer"
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
                  <td colSpan={6} className="py-8 text-center text-slate-400">
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
