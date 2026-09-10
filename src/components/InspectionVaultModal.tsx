import React, { useState, useEffect } from 'react';
import { ComplianceReport } from '../types';
import { getScanReports, deleteScanReport, DB_CHANGE_EVENT } from '../services/dbService';
import { generateCompliancePDF } from '../services/pdfReportGenerator';
import {
  X,
  Archive,
  Search,
  FileText,
  Download,
  Trash2,
  ExternalLink,
  ShieldCheck,
  AlertOctagon,
  CheckCircle2,
  Calendar,
  Clock,
  Building2,
  Scale
} from 'lucide-react';

interface InspectionVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectReport: (report: ComplianceReport) => void;
}

export const InspectionVaultModal: React.FC<InspectionVaultModalProps> = ({
  isOpen,
  onClose,
  onSelectReport,
}) => {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const loadReports = () => {
    setReports(getScanReports());
  };

  useEffect(() => {
    if (isOpen) {
      loadReports();
    }
  }, [isOpen]);
  useEffect(() => {
    const handleDbChange = () => {
      loadReports();
    };
    window.addEventListener(DB_CHANGE_EVENT, handleDbChange);
    return () => window.removeEventListener(DB_CHANGE_EVENT, handleDbChange);
  }, []);

  if (!isOpen) return null;

  const filteredReports = reports.filter((r) => {
    const q = searchQuery.toLowerCase();
    const p = r.productInfo;
    return (
      r.id.toLowerCase().includes(q) ||
      (p.productName && p.productName.toLowerCase().includes(q)) ||
      (p.brandName && p.brandName.toLowerCase().includes(q)) ||
      (p.manufacturerName && p.manufacturerName.toLowerCase().includes(q))
    );
  });

  const handleDownloadPDF = async (e: React.MouseEvent, report: ComplianceReport) => {
    e.stopPropagation();
    try {
      setDownloadingId(report.id);
      await generateCompliancePDF(report);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = (e: React.MouseEvent, reportId: string) => {
    e.stopPropagation();
    deleteScanReport(reportId);
    loadReports();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0A3663] text-white">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                Stored Regulatory Inspection Vault
              </h3>
              <p className="text-xs text-slate-500">
                Central repository of inspected packaged commodities with forensic evidence & statutory records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Counter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by product name, brand, or reference number (e.g. Pintola, INSP-)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#00A651]"
            />
          </div>
          <span className="text-xs font-bold text-slate-500">
            {filteredReports.length} Dossier{filteredReports.length === 1 ? '' : 's'} on Record
          </span>
        </div>

        {/* Report List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Archive className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="font-bold">No inspection records found.</p>
              <p className="text-[11px] mt-1">
                Scan or inspect any product, then click "Store in Regulatory Database" to persist the record.
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const p = report.productInfo;
              const isCompliant = report.overallStatus === 'COMPLIANT';
              const imgThumbnail =
                report.capturedImages?.front ||
                report.capturedImages?.back ||
                report.capturedImages?.side;

              return (
                <div
                  key={report.id}
                  onClick={() => {
                    onSelectReport(report);
                    onClose();
                  }}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-[#00A651] bg-slate-50/60 hover:bg-white transition-all cursor-pointer shadow-2xs hover:shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    {imgThumbnail ? (
                      <img
                        src={imgThumbnail}
                        alt={p.productName}
                        className="w-16 h-16 rounded-xl object-contain bg-black/5 border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <Scale className="w-7 h-7" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-[#0A3663]">
                          {report.id}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isCompliant
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {isCompliant ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> CONFORMING
                            </>
                          ) : (
                            <>
                              <AlertOctagon className="w-3 h-3" /> VIOLATIONS DETECTED
                            </>
                          )}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          Score: {report.score}/100
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 leading-snug">
                        {p.productName || 'Packaged Commodity'}
                      </h4>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                        <span>Net Qty: <strong className="text-slate-900">{p.netQuantity} {p.quantityUnit}</strong></span>
                        <span>•</span>
                        <span>MRP: <strong className="text-slate-900">{p.mrpString || `Rs. ${p.mrp}`}</strong></span>
                        {p.manufacturerName && (
                          <>
                            <span>•</span>
                            <span className="truncate max-w-[200px] text-slate-500">
                              Mfg: {p.manufacturerName}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(report.scanTimestamp).toLocaleDateString('en-IN')}</span>
                        <span>{new Date(report.scanTimestamp).toLocaleTimeString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={(e) => handleDownloadPDF(e, report)}
                      disabled={downloadingId === report.id}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#00A651] border border-emerald-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      title="Download Form A/B Official PDF"
                    >
                      <Download className={`w-3.5 h-3.5 ${downloadingId === report.id ? 'animate-bounce' : ''}`} />
                      <span>{downloadingId === report.id ? 'Generating...' : 'PDF'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectReport(report);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-[#0A3663] hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>View Audit</span>
                    </button>

                    <button
                      onClick={(e) => handleDelete(e, report.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00A651]" />
            <span>Digital Evidence Secured under Section 65B Bharatiya Sakshya Adhiniyam</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
