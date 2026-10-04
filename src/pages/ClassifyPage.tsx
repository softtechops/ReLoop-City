import React, { useState, useRef } from 'react';
import { SAMPLE_WASTE_ITEMS, classifyImage, SampleWasteItem } from '../lib/classifier';
import { ImageClassificationResult } from '../types';
import { 
  ScanSearch, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Leaf, 
  Coins, 
  ShieldCheck, 
  Factory, 
  RefreshCw,
  FileImage,
  Layers
} from 'lucide-react';

export const ClassifyPage: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<SampleWasteItem>(SAMPLE_WASTE_ITEMS[0]);
  const [classificationResult, setClassificationResult] = useState<ImageClassificationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger classification
  const handleClassify = async (item: SampleWasteItem) => {
    setSelectedSample(item);
    setCustomImagePreview(null);
    setIsProcessing(true);
    try {
      const result = await classifyImage(item.filename, item.imageThumbnail);
      setClassificationResult(result);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle user file upload / drag-and-drop
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      setCustomImagePreview(dataUrl);
      setIsProcessing(true);
      try {
        const result = await classifyImage(file, dataUrl);
        setClassificationResult(result);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Initial trigger if none exists
  React.useEffect(() => {
    handleClassify(SAMPLE_WASTE_ITEMS[0]);
  }, []);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-navy-100 shadow-blueprint">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-navy-800 font-['Outfit']">
              Computer Vision Waste Classification (Step 4: Classify)
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sage-100 text-sage-800 flex items-center gap-1">
              <ScanSearch className="w-3 h-3 text-sage-600" />
              MRF Optical AI Sorting
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Automated image inference sorting unsegregated streams into pure commodities (plastics, organics, metals, e-waste, and residual).
          </p>
        </div>

        <span className="text-xs font-mono text-navy-700 bg-navy-50 px-3 py-1.5 rounded-xl border border-navy-100 self-start sm:self-auto font-semibold">
          Model: ResNet-50 / Edge-CV v2.4
        </span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sample Clicker & Upload Zone */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-navy-100 shadow-blueprint p-6 space-y-5">
          <div>
            <h2 className="font-bold text-base text-navy-800 font-['Outfit']">
              Select Sample Waste Item or Upload Custom Photo
            </h2>
            <p className="text-xs text-charcoal-400">
              Click any of the 8 common municipal waste items below to simulate conveyor belt optical scanning
            </p>
          </div>

          {/* 8 Sample Waste Clickable Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SAMPLE_WASTE_ITEMS.map((item) => {
              const isSelected = selectedSample.id === item.id && !customImagePreview;
              return (
                <button
                  key={item.id}
                  onClick={() => handleClassify(item)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-navy-700 bg-navy-50 shadow-xs ring-2 ring-navy-700/20'
                      : 'border-navy-100 bg-[#F7F6F2]/40 hover:bg-white hover:border-navy-300'
                  }`}
                >
                  <div className="text-2xl mb-1.5">{item.imageThumbnail}</div>
                  <div>
                    <span className="font-bold text-xs text-navy-900 line-clamp-1">{item.name}</span>
                    <span className="text-[10px] text-charcoal-400 block">{item.category}</span>
                  </div>
                  <span className="text-[10px] font-mono text-sage-700 font-bold mt-2">
                    ₹{item.valuePerKg}/kg
                  </span>
                </button>
              );
            })}
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-6 rounded-2xl border-2 border-dashed border-navy-200 hover:border-navy-500 bg-[#F7F6F2]/60 hover:bg-white text-center cursor-pointer transition-all space-y-2 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="w-10 h-10 rounded-xl bg-navy-100 group-hover:bg-navy-700 group-hover:text-white text-navy-700 flex items-center justify-center mx-auto transition-colors">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-navy-800 block">
                Upload Custom Waste Image for Classification
              </span>
              <span className="text-[11px] text-charcoal-400">
                Drag and drop or browse JPEG/PNG from your device
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Inference & Sorting Instructions */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-navy-100 shadow-blueprint p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-navy-100">
              <h2 className="font-bold text-base text-navy-800 font-['Outfit']">
                Inference & Sorting Outcome
              </h2>
              {isProcessing ? (
                <span className="text-xs font-semibold text-amberGold-600 animate-pulse flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Scanning...
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sage-100 text-sage-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-sage-600" /> Model Confidence High
                </span>
              )}
            </div>

            {classificationResult && (
              <div className="space-y-4 pt-3">
                {/* Item Avatar & Detected Label */}
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-2xl bg-navy-50 border border-navy-100 flex items-center justify-center text-3xl shadow-xs overflow-hidden flex-shrink-0">
                    {customImagePreview ? (
                      <img src={customImagePreview} alt="Uploaded item" className="w-full h-full object-cover" />
                    ) : (
                      <span>{classificationResult.imageUrl}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold text-charcoal-400 uppercase">
                      ID: {classificationResult.id}
                    </span>
                    <h3 className="font-bold text-sm text-navy-900 leading-snug">
                      {classificationResult.detectedLabel}
                    </h3>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase mt-1 text-white" style={{ backgroundColor: classificationResult.streamBadgeColor }}>
                      Stream: {classificationResult.materialStream}
                    </span>
                  </div>
                </div>

                {/* AI Confidence Bar */}
                <div className="space-y-1.5 p-3 rounded-xl bg-navy-50/60 border border-navy-100">
                  <div className="flex justify-between text-xs font-semibold text-charcoal-700">
                    <span>Neural Network Confidence</span>
                    <span className="font-mono font-bold text-navy-800">
                      {(classificationResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-navy-200 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-sage-500 transition-all duration-500"
                      style={{ width: `${classificationResult.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Target Processing Unit Callout */}
                <div className="p-3.5 rounded-xl bg-sage-50 border border-sage-200 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-sage-900">
                    <Factory className="w-3.5 h-3.5 text-sage-700" />
                    <span>Target Processing Unit:</span>
                  </div>
                  <p className="font-semibold text-navy-800">
                    {classificationResult.targetProcessingUnit}
                  </p>
                  <p className="text-[11px] text-charcoal-600 mt-1 leading-relaxed">
                    {classificationResult.sortingInstructions}
                  </p>
                </div>

                {/* Economic & Carbon Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-navy-50/50 border border-navy-100 text-xs">
                    <span className="text-[10px] text-charcoal-400 block font-semibold uppercase">Market Value</span>
                    <span className="font-bold text-sm text-navy-800">
                      ₹{classificationResult.estimatedValuePerKgInr}/kg
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-navy-50/50 border border-navy-100 text-xs">
                    <span className="text-[10px] text-charcoal-400 block font-semibold uppercase">Emissions Avoided</span>
                    <span className="font-bold text-sm text-sage-700">
                      {classificationResult.carbonAvoidanceKgPerKg} kg CO₂/kg
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-[#F7F6F2] border border-navy-100 text-[11px] text-charcoal-500">
            <strong>Architecture note:</strong> Behind the scenes, <code className="text-navy-700 bg-white px-1 py-0.5 rounded">classifyImage()</code> can be seamlessly replaced with a client-side TensorFlow.js MobileNet or municipal conveyor camera API.
          </div>
        </div>

      </div>

    </div>
  );
};
