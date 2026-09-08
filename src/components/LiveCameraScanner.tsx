import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Upload, Sparkles, AlertCircle, KeyRound, Bot } from 'lucide-react';
import { extractTextFromImage, parseLabelDeclarations, analyzeLabelWithGemini } from '../services/ocrService';
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
  const [geminiApiKey, setGeminiApiKey] = useState(() => localStorage.getItem('inspack_gemini_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);

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

  const processImage = async (dataUrl: string) => {
    setIsProcessing(true);
    setStatusMessage('Scanning Principal Display Panel (PDP)...');

    try {
      let extractedProduct;
      let ocrText = '';

      if (geminiApiKey.trim()) {
        setStatusMessage('Analyzing with Gemini 1.5 Flash Vision AI...');
        const geminiResult = await analyzeLabelWithGemini(dataUrl, geminiApiKey);
        if (geminiResult && geminiResult.productName) {
          extractedProduct = parseLabelDeclarations('');
          Object.assign(extractedProduct, geminiResult);
        }
      }

      if (!extractedProduct) {
        setStatusMessage('Analyzing with Edge Neural OCR Engine...');
        ocrText = await extractTextFromImage(dataUrl, (status, progress) => {
          setStatusMessage(`${status} (${Math.round(progress)}%)`);
        });
        extractedProduct = parseLabelDeclarations(ocrText);
      }

      setStatusMessage('Validating declarations against LMPC Rules 2011...');
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

  const handleSaveKey = (key: string) => {
    setGeminiApiKey(key);
    localStorage.setItem('inspack_gemini_key', key);
    setShowKeyModal(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6">
      <canvas ref={canvasRef} className="hidden" />

      {/* Header bar with AI mode */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-[#00A651]" />
          <span className="text-xs font-bold text-slate-800">
            Vision AI Engine: {geminiApiKey ? 'Gemini 1.5 Flash + Neural OCR' : 'Edge Neural OCR (100% Offline)'}
          </span>
        </div>
        <button
          onClick={() => setShowKeyModal(!showKeyModal)}
          className="text-[11px] text-[#0A3663] font-bold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <KeyRound className="w-3 h-3" />
          <span>{geminiApiKey ? 'API Key Active' : 'Set Gemini AI Key (Optional)'}</span>
        </button>
      </div>

      {showKeyModal && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-2">
          <div className="font-bold text-slate-900">Optional Google Gemini Vision API Key</div>
          <p className="text-slate-600 text-[11px]">
            Inspack already runs 100% offline using built-in Tesseract Neural OCR. If you want next-level multimodal reasoning, enter a free Gemini API key from Google AI Studio.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Paste AI Studio API key..."
              defaultValue={geminiApiKey}
              id="gemini-key-input"
              className="flex-1 bg-white border border-slate-300 px-3 py-1.5 rounded-lg text-xs"
            />
            <button
              onClick={() => {
                const el = document.getElementById('gemini-key-input') as HTMLInputElement;
                handleSaveKey(el.value);
              }}
              className="bg-[#0A3663] text-white px-3 py-1.5 rounded-lg font-bold"
            >
              Save Key
            </button>
          </div>
        </div>
      )}

      {/* Processing Loader */}
      {isProcessing && (
        <div className="py-8 flex flex-col items-center justify-center gap-3">
          <div className="relative">
            <RefreshCw className="w-10 h-10 text-[#00A651] animate-spin" />
            <Sparkles className="w-4 h-4 text-blue-600 absolute top-0 right-0 animate-ping" />
          </div>
          <p className="text-sm font-bold text-slate-900 tracking-wide">{statusMessage}</p>
          <p className="text-xs text-slate-500">
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
                  className="p-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full font-bold shadow-xl ring-4 ring-emerald-500/30 transition-all transform active:scale-95 cursor-pointer"
                  title="Capture Label"
                >
                  <Camera className="w-7 h-7" />
                </button>

                <button
                  onClick={stopCamera}
                  className="px-3 py-2 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs rounded-full backdrop-blur-md cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Idle Trigger Cards */
            <div>
              {errorMsg && (
                <div className="mb-3 p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Live Camera Scanner Button */}
                <button
                  onClick={startCamera}
                  className="p-4 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-500 rounded-xl flex items-center gap-3 transition-all cursor-pointer group text-left shadow-2xs"
                >
                  <div className="p-3 bg-emerald-100 text-[#00A651] rounded-xl group-hover:bg-[#00A651] group-hover:text-white transition-colors">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-[#00A651]">
                      Live Label Scanner
                    </h4>
                    <p className="text-xs text-slate-500">
                      Use smartphone or webcam to scan live packaging
                    </p>
                  </div>
                </button>

                {/* Upload Image Button */}
                <label className="p-4 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-[#0A3663] rounded-xl flex items-center gap-3 transition-all cursor-pointer group text-left shadow-2xs">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="p-3 bg-blue-100 text-[#0A3663] rounded-xl group-hover:bg-[#0A3663] group-hover:text-white transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0A3663]">
                      Upload Package Photo
                    </h4>
                    <p className="text-xs text-slate-500">
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
