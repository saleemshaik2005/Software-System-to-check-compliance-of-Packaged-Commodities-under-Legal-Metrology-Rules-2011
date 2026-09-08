import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Sparkles, AlertCircle, Trash2, CheckCircle2, Bot, Layers, ArrowRight } from 'lucide-react';
import { extractTextFromImage, parseLabelDeclarations, analyzeMultiViewWithVisionAI } from '../services/ocrService';
import { evaluateCompliance } from '../services/complianceEngine';
import { ComplianceReport } from '../types';

interface LiveCameraScannerProps {
  onScanComplete: (report: ComplianceReport) => void;
  activeView: 'front' | 'back' | 'side';
  setActiveView?: (view: 'front' | 'back' | 'side') => void;
}

export const LiveCameraScanner: React.FC<LiveCameraScannerProps> = ({
  onScanComplete,
  activeView,
  setActiveView,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [multiImages, setMultiImages] = useState<{
    front?: string;
    back?: string;
    side?: string;
  }>({});

  const [activeCameraTarget, setActiveCameraTarget] = useState<'front' | 'back' | 'side' | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Start Camera for target slot
  const startCameraForSlot = async (slot: 'front' | 'back' | 'side') => {
    setErrorMsg('');
    setActiveCameraTarget(slot);

    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setErrorMsg('Camera access unavailable. Please use the Upload File button.');
      setActiveCameraTarget(null);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setActiveCameraTarget(null);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    if (activeCameraTarget) {
      setTimeout(() => startCameraForSlot(activeCameraTarget), 200);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !activeCameraTarget) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    setMultiImages((prev) => ({
      ...prev,
      [activeCameraTarget]: dataUrl,
    }));

    if (setActiveView) setActiveView(activeCameraTarget);
    stopCamera();
  };

  const handleFileUpload = (slot: 'front' | 'back' | 'side', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setMultiImages((prev) => ({
          ...prev,
          [slot]: dataUrl,
        }));
        if (setActiveView) setActiveView(slot);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (slot: 'front' | 'back' | 'side', e: React.MouseEvent) => {
    e.stopPropagation();
    setMultiImages((prev) => {
      const copy = { ...prev };
      delete copy[slot];
      return copy;
    });
  };

  // Run AI & Rule Evaluation on all captured views
  const handleAnalyzeAll = async () => {
    const imagesToAnalyze = { ...multiImages };
    if (!imagesToAnalyze.front && !imagesToAnalyze.back && !imagesToAnalyze.side) {
      setErrorMsg('Please capture or upload at least the Front packaging image.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Analyzing packaging declarations with Neural Vision Engine...');

    try {
      // 1. Try Multimodal Vision AI with all captured multi-view images
      const visionProduct = await analyzeMultiViewWithVisionAI(imagesToAnalyze);

      let extractedProduct;
      let ocrRawText = '';

      if (visionProduct && visionProduct.productName) {
        extractedProduct = parseLabelDeclarations('');
        Object.assign(extractedProduct, visionProduct);
      } else {
        // 2. Fallback to Edge Neural OCR on the primary image
        setStatusMessage('Engaging Edge Neural OCR fallback on packaging...');
        const primaryImage = imagesToAnalyze.front || imagesToAnalyze.back || imagesToAnalyze.side || '';
        ocrRawText = await extractTextFromImage(primaryImage, (msg, prog) => {
          setStatusMessage(`${msg} (${Math.round(prog)}%)`);
        });
        extractedProduct = parseLabelDeclarations(ocrRawText);
      }

      setStatusMessage('Validating declarations against LMPC Rules 2011...');
      const report = evaluateCompliance(
        extractedProduct,
        activeView,
        imagesToAnalyze,
        {
          name: 'Insp. R. K. Verma',
          badge: 'LM-ND-4092',
          location: 'Inspection Field Unit • Retail Market'
        }
      );
      report.ocrRawText = ocrRawText;

      setIsProcessing(false);
      onScanComplete(report);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setErrorMsg('Error evaluating packaging. Please try again with clear photos.');
    }
  };

  const capturedCount = [multiImages.front, multiImages.back, multiImages.side].filter(Boolean).length;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-[#00A651]">
              <Layers className="w-4 h-4" />
            </span>
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Multi-View Package Inspection (Front • Back • Sides)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Capture or upload images of all sides for 100% legal verification under Rule 6 & Rule 10
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 text-xs font-bold">
          <Bot className="w-3.5 h-3.5 text-[#00A651]" />
          <span>Neural Multimodal AI Active</span>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Active Live Camera Overlay Modal */}
      {activeCameraTarget && (
        <div className="mb-5 relative rounded-2xl overflow-hidden bg-black aspect-[4/3] max-h-96 flex items-center justify-center shadow-xl">
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            className="w-full h-full object-cover"
          />

          {/* Viewfinder Frame */}
          <div className="absolute inset-8 border-2 border-emerald-400/80 rounded-2xl pointer-events-none flex flex-col justify-between p-3">
            <div className="flex justify-between">
              <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-400"></span>
              <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-400"></span>
            </div>
            <div className="text-center text-[11px] font-bold text-emerald-300 bg-slate-950/80 px-3 py-1 rounded-full self-center backdrop-blur-sm shadow-md uppercase">
              Align {activeCameraTarget} Label
            </div>
            <div className="flex justify-between">
              <span className="w-4 h-4 border-b-2 border-l-2 border-emerald-400"></span>
              <span className="w-4 h-4 border-b-2 border-r-2 border-emerald-400"></span>
            </div>
          </div>

          {/* Camera Action Buttons */}
          <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
            <button
              onClick={flipCamera}
              className="p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full backdrop-blur-md shadow-lg cursor-pointer"
              title="Switch Camera"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            <button
              onClick={capturePhoto}
              className="p-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full font-bold shadow-xl ring-4 ring-emerald-500/30 transition-all transform active:scale-95 cursor-pointer"
              title="Snap Label"
            >
              <Camera className="w-7 h-7" />
            </button>

            <button
              onClick={stopCamera}
              className="px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-full backdrop-blur-md cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Processing Loader */}
      {isProcessing && (
        <div className="py-10 flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-2xl border border-slate-200 mb-4">
          <div className="relative">
            <RefreshCw className="w-12 h-12 text-[#00A651] animate-spin" />
            <Sparkles className="w-5 h-5 text-blue-600 absolute top-0 right-0 animate-ping" />
          </div>
          <p className="text-sm font-black text-slate-900 tracking-wide">{statusMessage}</p>
          <p className="text-xs text-slate-500 text-center max-w-md">
            Scanning Principal Display Panel, MRP clause, Postal PIN Code, and Second Schedule standard sizes across all uploaded views
          </p>
        </div>
      )}

      {/* Three Multi-View Card Slots */}
      {!isProcessing && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* 1. FRONT VIEW */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xs font-black uppercase text-slate-900 tracking-wide">
                    1. Front Panel (PDP)
                  </span>
                  {multiImages.front ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-700 bg-amber-100 font-bold px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Commodity Name, Net Quantity & MRP declaration
                </p>

                {multiImages.front ? (
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-black mb-3">
                    <img
                      src={multiImages.front}
                      alt="Front Label"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={(e) => handleRemoveImage('front', e)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-500 shadow-md cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-center mb-3 bg-white">
                    <Camera className="w-8 h-8 text-slate-300 mb-1" />
                    <span className="text-xs font-semibold text-slate-400">Front label preview</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => startCameraForSlot('front')}
                  className="flex items-center justify-center gap-1.5 bg-[#0A3663] hover:bg-blue-900 text-white text-xs font-bold py-2 px-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Camera</span>
                </button>

                <label className="flex items-center justify-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-2 px-2.5 rounded-xl transition-all cursor-pointer text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('front', e)}
                    className="hidden"
                  />
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </label>
              </div>
            </div>

            {/* 2. BACK VIEW */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xs font-black uppercase text-slate-900 tracking-wide">
                    2. Back Panel (Address)
                  </span>
                  {multiImages.back ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-200 font-bold px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Manufacturer Name, Factory Address, PIN & Consumer Care
                </p>

                {multiImages.back ? (
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-black mb-3">
                    <img
                      src={multiImages.back}
                      alt="Back Label"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={(e) => handleRemoveImage('back', e)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-500 shadow-md cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-center mb-3 bg-white">
                    <Camera className="w-8 h-8 text-slate-300 mb-1" />
                    <span className="text-xs font-semibold text-slate-400">Back label preview</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => startCameraForSlot('back')}
                  className="flex items-center justify-center gap-1.5 bg-[#0A3663] hover:bg-blue-900 text-white text-xs font-bold py-2 px-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Camera</span>
                </button>

                <label className="flex items-center justify-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-2 px-2.5 rounded-xl transition-all cursor-pointer text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('back', e)}
                    className="hidden"
                  />
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </label>
              </div>
            </div>

            {/* 3. SIDE VIEW */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-xs font-black uppercase text-slate-900 tracking-wide">
                    3. Side / Batch Details
                  </span>
                  {multiImages.side ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Ready</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-500 bg-slate-200 font-bold px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  Date of packing, batch code & barcode stickers
                </p>

                {multiImages.side ? (
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-black mb-3">
                    <img
                      src={multiImages.side}
                      alt="Side Label"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={(e) => handleRemoveImage('side', e)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-500 shadow-md cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="aspect-[4/3] rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center p-3 text-center mb-3 bg-white">
                    <Camera className="w-8 h-8 text-slate-300 mb-1" />
                    <span className="text-xs font-semibold text-slate-400">Side label preview</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <button
                  onClick={() => startCameraForSlot('side')}
                  className="flex items-center justify-center gap-1.5 bg-[#0A3663] hover:bg-blue-900 text-white text-xs font-bold py-2 px-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Camera</span>
                </button>

                <label className="flex items-center justify-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold py-2 px-2.5 rounded-xl transition-all cursor-pointer text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('side', e)}
                    className="hidden"
                  />
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                </label>
              </div>
            </div>
          </div>

          {/* Big Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <div className="text-xs text-slate-600 font-semibold">
              {capturedCount > 0 ? (
                <span className="text-[#00A651]">
                  ✓ {capturedCount} packaging view(s) loaded and ready for AI audit
                </span>
              ) : (
                <span className="text-slate-500">
                  Select Camera or Upload above to inspect a real product
                </span>
              )}
            </div>

            <button
              onClick={handleAnalyzeAll}
              disabled={capturedCount === 0}
              className="bg-[#00A651] hover:bg-emerald-600 disabled:opacity-40 text-white font-black text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              <Sparkles className="w-4 h-4" />
              <span>Extract & Verify All Statutory Declarations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
