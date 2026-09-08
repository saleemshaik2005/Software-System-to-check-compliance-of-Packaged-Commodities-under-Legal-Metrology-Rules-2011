import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Sparkles, AlertCircle, Zap, Image as ImageIcon } from 'lucide-react';
import { extractTextFromImage, parseLabelDeclarations } from '../services/ocrService';
import { evaluateCompliance } from '../services/complianceEngine';
import { ComplianceReport } from '../types';

interface LiveCameraScannerProps {
  onScanComplete: (report: ComplianceReport) => void;
  activeView: 'front' | 'back' | 'side';
}

export const LiveCameraScanner: React.FC<LiveCameraScannerProps> = ({
  onScanComplete,
  activeView,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Start Camera
  const startCamera = async () => {
    setErrorMsg('');
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
        setIsCameraActive(true);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setErrorMsg('Camera access unavailable or blocked. You can upload an image directly.');
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const flipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    setTimeout(startCamera, 200);
  };

  // Capture image from video
  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    stopCamera();
    processImage(dataUrl);
  };

  // Handle uploaded file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        processImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Run OCR & Compliance Evaluation
  const processImage = async (dataUrl: string) => {
    setIsProcessing(true);
    setStatusMessage('Scanning Principal Display Panel (PDP)...');

    try {
      const ocrText = await extractTextFromImage(dataUrl, (status, progress) => {
        setStatusMessage(`${status} (${Math.round(progress)}%)`);
      });

      setStatusMessage('Validating declarations against LMPC Rules 2011...');
      const extractedProduct = parseLabelDeclarations(ocrText);
      const report = evaluateCompliance(
        extractedProduct,
        activeView,
        { [activeView]: dataUrl }
      );
      report.ocrRawText = ocrText;

      setIsProcessing(false);
      onScanComplete(report);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setErrorMsg('Error analyzing label. Please try again with clear lighting.');
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl mb-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Processing Loader */}
      {isProcessing && (
        <div className="py-8 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin" />
            <Sparkles className="w-4 h-4 text-cyan-400 absolute top-0 right-0 animate-ping" />
          </div>
          <p className="text-sm font-bold text-white tracking-wide">{statusMessage}</p>
          <p className="text-xs text-slate-400">
            Checking Rule 6 declarations, MRP formatting, SI units, and Second Schedule sizes
          </p>
        </div>
      )}

      {!isProcessing && (
        <>
          {/* Active Camera Viewport */}
          {isCameraActive ? (
            <div className="relative rounded-xl overflow-hidden bg-black aspect-[4/3] max-h-96 flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className="w-full h-full object-cover"
              />

              {/* Viewfinder Target Frame for PDP */}
              <div className="absolute inset-8 border-2 border-emerald-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-3">
                <div className="flex justify-between">
                  <span className="w-4 h-4 border-t-2 border-l-2 border-emerald-400"></span>
                  <span className="w-4 h-4 border-t-2 border-r-2 border-emerald-400"></span>
                </div>
                <div className="text-center text-[11px] font-bold text-emerald-300 bg-slate-950/70 px-2 py-0.5 rounded-full self-center backdrop-blur-sm">
                  Align Principal Display Panel (PDP)
                </div>
                <div className="flex justify-between">
                  <span className="w-4 h-4 border-b-2 border-l-2 border-emerald-400"></span>
                  <span className="w-4 h-4 border-b-2 border-r-2 border-emerald-400"></span>
                </div>
              </div>

              {/* Controls Bar */}
              <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-4">
                <button
                  onClick={flipCamera}
                  className="p-3 bg-slate-900/80 hover:bg-slate-800 text-white rounded-full backdrop-blur-md shadow-lg"
                  title="Switch Camera"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>

                <button
                  onClick={capturePhoto}
                  className="p-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full font-bold shadow-xl ring-4 ring-emerald-500/30 transition-all transform active:scale-95"
                  title="Capture Label"
                >
                  <Camera className="w-7 h-7" />
                </button>

                <button
                  onClick={stopCamera}
                  className="px-3 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs rounded-full backdrop-blur-md"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Idle Trigger Cards */
            <div>
              {errorMsg && (
                <div className="mb-3 p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Live Camera Scanner Button */}
                <button
                  onClick={startCamera}
                  className="p-4 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 rounded-xl flex items-center gap-3 transition-all cursor-pointer group text-left"
                >
                  <div className="p-3 bg-emerald-950/60 text-emerald-400 rounded-xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">
                      Live Label Scanner
                    </h4>
                    <p className="text-xs text-slate-400">
                      Use smartphone or webcam to scan live packaging
                    </p>
                  </div>
                </button>

                {/* Upload Image Button */}
                <label className="p-4 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 rounded-xl flex items-center gap-3 transition-all cursor-pointer group text-left">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="p-3 bg-cyan-950/60 text-cyan-400 rounded-xl group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">
                      Upload Package Photo
                    </h4>
                    <p className="text-xs text-slate-400">
                      Drag & drop front/back package label (PNG, JPG)
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
