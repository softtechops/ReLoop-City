import React, { useState, useRef } from 'react';
import { SAMPLE_WASTE_ITEMS, classifyImage, SampleWasteItem } from '../lib/classifier';
import { ImageClassificationResult } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { LoopStepNav } from '../components/ui/LoopStepNav';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SectionCard } from '../components/ui/SectionCard';
import { 
  ScanSearch, 
  UploadCloud, 
  CheckCircle2, 
  Factory, 
  RefreshCw, 
  Coins, 
  AlertCircle,
  FileCheck
} from 'lucide-react';

export const ClassifyPage: React.FC = () => {
  const [selectedSample, setSelectedSample] = useState<SampleWasteItem>(SAMPLE_WASTE_ITEMS[0]);
  const [classificationResult, setClassificationResult] = useState<ImageClassificationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger classification
  const handleClassify = async (item: SampleWasteItem) => {
    setSelectedSample(item);
    setCustomImagePreview(null);
    setUploadError(null);
    setIsProcessing(true);
    try {
      const result = await classifyImage(item.filename, item.imageThumbnail);
      setClassificationResult(result);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle user file upload with validation
  const processUploadedFile = (file: File) => {
    setUploadError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Invalid file type. Please upload an image file (PNG, JPG, or WEBP).');
      return;
    }

    // Validate file size (10 MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File is too large. Maximum supported image size is 10 MB.');
      return;
    }

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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Initial classification on mount
  React.useEffect(() => {
    handleClassify(SAMPLE_WASTE_ITEMS[0]);
  }, []);

  return (
    <div className="space-y-6 pb-16">
      
      {/* Page Header */}
      <PageHeader
        title="4 · Waste Sorting (AI Vision): Automated MRF Classification"
        subtitle="Computer vision neural network scanning conveyor belt streams to recover pure polymers, paper, metals, and organics."
        stepNumber={4}
        stepName="Classify"
        actions={
          <Badge variant="amber" size="md">
            <span>Demo classifier (simulated)</span>
          </Badge>
        }
      />

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Sample Clicker & Drag/Drop Upload Zone */}
        <div className="lg:col-span-7 space-y-6">
          <SectionCard
            title="Sample Waste Items & Conveyor Feed"
            subtitle="Click any of the 8 typical municipal items to simulate optical conveyor inspection"
          >
            {/* 8 Sample Waste Cards with proper alt text */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SAMPLE_WASTE_ITEMS.map((item) => {
                const isSelected = selectedSample.id === item.id && !customImagePreview;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleClassify(item)}
                    aria-label={`Select sample item: ${item.name}`}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[110px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
                      isSelected
                        ? 'border-navy-700 bg-navy-50 shadow-xs ring-2 ring-navy-700/20'
                        : 'border-navy-100 bg-[#F8FAFC] hover:bg-white hover:border-emerald-300'
                    }`}
                  >
                    <div className="text-3xl mb-1" role="img" aria-label={`Icon for ${item.name}`}>
                      {item.imageThumbnail}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-navy-900 line-clamp-1">{item.name}</span>
                      <span className="text-xs text-charcoal-500 block">{item.category}</span>
                    </div>
                    <span className="text-xs font-mono text-sage-800 font-bold mt-2">
                      ₹{item.valuePerKg}/kg
                    </span>
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {/* Accessible Drag & Drop Upload Zone (Section 5) */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Upload waste image for classification. Drag and drop image here or press Enter to browse."
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-7 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all space-y-2 select-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-navy-600 ${
              isDragOver
                ? 'border-navy-700 bg-navy-100/60 scale-[1.01]'
                : 'border-navy-200 hover:border-emerald-500 bg-[#F8FAFC] hover:bg-white'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*"
              className="hidden"
              aria-hidden="true"
            />
            <div className="w-12 h-12 rounded-2xl bg-navy-100 text-navy-800 flex items-center justify-center mx-auto transition-colors" aria-hidden="true">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <span className="text-sm font-bold text-navy-900 block">
                Drag and drop custom waste image or click to browse
              </span>
              <span className="text-xs text-charcoal-500">
                Supports JPG, PNG, WEBP (Max 10 MB). Press Enter or Space to open file picker.
              </span>
            </div>

            {uploadError && (
              <div
                role="alert"
                className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-center gap-1.5"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Inference & Sorting Result (Section 5: Announced via aria-live) */}
        <div className="lg:col-span-5">
          <SectionCard
            title="Inference & Sorting Outcome"
            subtitle="Deep learning stream classification & facility assignment"
            headerAction={
              isProcessing ? (
                <span className="text-xs font-semibold text-amberGold-700 animate-pulse flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  Analyzing...
                </span>
              ) : (
                <Badge variant="sage" size="sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sage-700" aria-hidden="true" />
                  <span>High Confidence</span>
                </Badge>
              )
            }
          >
            <div
              aria-live="polite"
              aria-atomic="true"
              className="space-y-4"
            >
              {classificationResult && (
                <>
                  {/* Item Image Preview & Detected Label */}
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-navy-50 border border-navy-100 flex items-center justify-center text-3xl shadow-xs overflow-hidden flex-shrink-0">
                      {customImagePreview ? (
                        <img
                          src={customImagePreview}
                          alt="User uploaded waste item"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span role="img" aria-label={classificationResult.name}>
                          {classificationResult.imageUrl}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-mono font-bold text-charcoal-400 uppercase">
                        ID: {classificationResult.id}
                      </span>
                      <h3 className="font-bold text-base text-navy-900 leading-snug">
                        {classificationResult.detectedLabel}
                      </h3>
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase mt-1 text-white"
                        style={{ backgroundColor: classificationResult.streamBadgeColor }}
                      >
                        Stream: {classificationResult.materialStream}
                      </span>
                    </div>
                  </div>

                  {/* Neural Network Confidence Bar */}
                  <div className="space-y-1.5 p-3.5 rounded-xl bg-navy-50/70 border border-navy-100">
                    <div className="flex justify-between text-xs font-semibold text-charcoal-700">
                      <span>Neural Network Confidence</span>
                      <span className="font-mono font-bold text-navy-900">
                        {(classificationResult.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div
                      role="progressbar"
                      aria-valuenow={Math.round(classificationResult.confidence * 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      className="w-full h-2 rounded-full bg-navy-200 overflow-hidden"
                    >
                      <div 
                        className="h-full rounded-full bg-sage-500 transition-all duration-500"
                        style={{ width: `${classificationResult.confidence * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Target Facility & Handling Instructions */}
                  <div className="p-4 rounded-xl bg-sage-50 border border-sage-200 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-sage-900">
                      <Factory className="w-4 h-4 text-sage-700" aria-hidden="true" />
                      <span>Target Processing Line:</span>
                    </div>
                    <p className="font-bold text-navy-900 text-sm">
                      {classificationResult.targetProcessingUnit}
                    </p>
                    <p className="text-charcoal-700 text-xs mt-1 leading-relaxed">
                      {classificationResult.sortingInstructions}
                    </p>
                  </div>

                  {/* Economic & Carbon Metrics */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-navy-100 text-xs">
                      <span className="text-charcoal-500 block font-semibold uppercase text-xs">Market Value</span>
                      <span className="font-bold text-base text-navy-900">
                        ₹{classificationResult.estimatedValuePerKgInr}/kg
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-navy-100 text-xs">
                      <span className="text-charcoal-500 block font-semibold uppercase text-xs">Avoided Carbon</span>
                      <span className="font-bold text-base text-sage-800">
                        {classificationResult.carbonAvoidanceKgPerKg} kg CO₂/kg
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-[#F8FAFC] border border-navy-100 text-xs text-charcoal-500">
              <strong>Pluggable Architecture:</strong> The clean <code className="text-navy-800 bg-white px-1.5 py-0.5 rounded font-mono">classifyImage()</code> function can be replaced directly with a TensorFlow.js edge model or municipal camera webhook without modifying UI components.
            </div>
          </SectionCard>
        </div>

      </div>

      {/* Loop Step Navigation */}
      <LoopStepNav
        currentStep={4}
        prevPath="/optimize"
        prevLabel="3 · Smart Routes"
        nextPath="/allocate"
        nextLabel="5–6 · Where Waste Goes & Energy"
      />

    </div>
  );
};
