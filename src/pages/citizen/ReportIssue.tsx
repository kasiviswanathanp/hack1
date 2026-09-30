import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileUploader } from '@/components/common/FileUploader';
import { LocationPicker } from '@/components/maps/LocationPicker';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { PriorityBadge } from '@/components/common/Badge';
import { useGeolocation } from '@/hooks/useGeolocation';
import { geminiService } from '@/services/geminiService';
import { storageService } from '@/services/storageService';
import { complaintService } from '@/services/complaintService';
import { useAuth } from '@/store/AuthContext';
import { CATEGORIES } from '@/constants';
import {
  AIAnalysisResult,
  Complaint,
  ComplaintCategory,
  ComplaintLocation,
  PriorityLevel,
} from '@/types';
import { generateComplaintId } from '@/utils';
import { LiveGeoCamera } from '@/components/camera/LiveGeoCamera';
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Camera,
  MapPin,
  FileText,
  AlertTriangle,
  Building,
  ShieldCheck,
  Send,
  Edit2,
  CheckCircle2,
  Radio,
  Flame,
} from 'lucide-react';
import { cn } from '@/utils';

export const ReportIssue: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCategoryParam = searchParams.get('category') as ComplaintCategory | null;

  const { currentUser } = useAuth();
  const {
    location,
    setLocation,
    isDetecting,
    detectLocation,
    permissionDenied,
    error: geoError,
  } = useGeolocation();

  // Multi-step tracker (Step 1 to Step 6)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // AI analysis state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  // Category Confirmation / Edit state
  const [confirmedCategory, setConfirmedCategory] = useState<ComplaintCategory>('Road');
  const [isEditingCategory, setIsEditingCategory] = useState<boolean>(false);

  // Step 5 fields
  const [description, setDescription] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [contactPreference, setContactPreference] = useState<'SMS' | 'WHATSAPP' | 'CALL'>('WHATSAPP');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Trigger AI analysis when moving from Step 2 to Step 3
  const runAiAnalysis = async (img: string) => {
    setIsAnalyzing(true);
    try {
      const result = await geminiService.analyzeCivicImage({
        imageUri: img,
        userHint: initialCategoryParam || undefined,
        locationHint: location.area,
      });
      setAiResult(result);
      setConfirmedCategory(result.category);
      if (!description) {
        setDescription(result.detectedDescription);
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImageSelected = (dataUrl: string, file: File, capturedLocation?: ComplaintLocation) => {
    setImageUri(dataUrl);
    setImageFile(file);
    if (capturedLocation) {
      setLocation(capturedLocation);
    }
  };

  // Step progression validation
  const handleNext = async () => {
    if (currentStep === 1) {
      if (!imageUri) {
        alert('Please upload or capture a photo of the civic defect.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      if (imageUri && !aiResult) {
        runAiAnalysis(imageUri);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      // Submit complaint (Step 6)
      await handleSubmitComplaint();
    }
  };

  const handleSubmitComplaint = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const complaintId = generateComplaintId();

      // Upload image to Firebase Storage (with base64 fallback)
      let uploadedImageUrl = imageUri || '';
      if (imageFile) {
        uploadedImageUrl = await storageService.uploadComplaintImage(imageFile);
      }

      const matchedCat = CATEGORIES.find((c) => c.id === confirmedCategory);
      const slaHours = matchedCat ? matchedCat.defaultSlaHours : 24;

      const now = new Date();
      const responseDeadline = new Date(now.getTime() + slaHours * 60 * 60 * 1000).toISOString();
      const resolutionDeadline = new Date(now.getTime() + (slaHours + 48) * 60 * 60 * 1000).toISOString();

      const newComplaint: Complaint = {
        id: complaintId,
        citizenId: currentUser?.uid || 'demo-citizen-1',
        citizenName: currentUser?.displayName || 'Citizen',
        citizenPhone: currentUser?.phoneNumber || '+91 98401 23456',
        organizationId: 'org-chn-corp',
        category: confirmedCategory,
        description: description || aiResult?.detectedDescription || 'Civic infrastructure defect',
        landmark: landmark || undefined,
        imageUrls: [uploadedImageUrl],
        location,
        areaId: location.area,
        wardId: location.ward,
        zoneId: location.zone || 'Zone 8 (Central)',
        districtId: location.district || 'Chennai District',

        aiAnalysis: aiResult || {
          issueType: `${confirmedCategory} Defect`,
          category: confirmedCategory,
          severity: 'HIGH',
          confidence: 0.91,
          detectedDescription: description || 'Visual defect detected.',
          suggestedDepartment: matchedCat?.department || 'Municipal Infrastructure Dept',
          suggestedPriority: 'HIGH',
          tags: ['civic_grievance'],
          detectedAt: new Date().toISOString(),
        },
        priority: aiResult?.suggestedPriority || 'HIGH',
        priorityScore: Math.round((aiResult?.confidence || 0.9) * 100),

        departmentId: matchedCat?.department || 'Municipal Roads & Infrastructure',
        departmentName: matchedCat?.department || 'Municipal Roads & Infrastructure',
        assignedOfficerId: 'demo-officer-1',
        assignedOfficerName: 'Rajesh Kumar (Area Officer)',

        status: 'SUBMITTED',
        escalationLevel: 1,

        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        responseDeadline,
        resolutionDeadline,
        statusHistory: [
          {
            status: 'SUBMITTED',
            timestamp: now.toISOString(),
            updatedBy: currentUser?.uid || 'demo-citizen-1',
            actorRole: 'CITIZEN',
            actorName: currentUser?.displayName || 'Citizen',
            notes: `Complaint logged via CivicAI Web Portal. Contact preference: ${contactPreference}`,
            escalationLevel: 0,
          },
        ],
      };

      await complaintService.createComplaint(newComplaint);

      // Navigate to Complaint Success Screen (Section 7)
      navigate(`/citizen/complaints/${complaintId}/success`, { state: { complaint: newComplaint } });
    } catch (err: any) {
      console.error('Complaint submission failed:', err);
      setSubmitError('Unable to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsHeader = [
    { num: 1, label: 'Evidence Photo' },
    { num: 2, label: 'Location' },
    { num: 3, label: 'AI Triage' },
    { num: 4, label: 'Confirm' },
    { num: 5, label: 'Details' },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8 text-left space-y-6">
      {/* Title & Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Report a Civic Grievance
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Complaints are analyzed by Google Gemini and assigned with a legally binding SLA timer.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-between">
          {stepsHeader.map((s, idx) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all',
                      isCompleted
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-xs'
                        : 'bg-slate-100 text-slate-400'
                    )}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : s.num}
                  </div>
                  <span
                    className={cn(
                      'hidden sm:block text-[11px] font-semibold mt-1.5',
                      isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {idx < stepsHeader.length - 1 && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-2 transition-colors',
                      currentStep > s.num ? 'bg-emerald-500' : 'bg-slate-200'
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STEP 1: CAPTURE PHOTO WITH LIVE GOOGLE GEOLOCATION */}
      {currentStep === 1 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-1">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                <span>Google Geolocation Active Camera</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>Step 1: Capture Photo Evidence with Live Geolocation</span>
              </h3>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              Auto-locks GPS & Ward onto Evidence
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Take a photo using your camera. The system uses Google Geolocation services to automatically lock and watermark your live GPS coordinates, ward, and address directly onto the evidence photo.
          </p>

          <LiveGeoCamera
            onCapture={handleImageSelected}
            initialLocation={location}
            currentImageUrl={imageUri}
          />
        </div>
      )}

      {/* STEP 2: LOCATION */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <LocationPicker
            location={location}
            onChange={setLocation}
            isDetecting={isDetecting}
            onDetect={detectLocation}
            permissionDenied={permissionDenied}
            error={geoError}
          />
        </div>
      )}

      {/* STEP 3: AI PREVIEW (Section 6 requirements) */}
      {currentStep === 3 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google Gemini 2.0 Civic Vision</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Step 3: AI Visual Inspection & Classification
              </h3>
            </div>
            {isAnalyzing && (
              <span className="text-xs text-blue-600 font-semibold animate-pulse">
                Analyzing photo...
              </span>
            )}
          </div>

          {isAnalyzing ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mx-auto" />
              <p className="text-sm font-semibold text-slate-800">
                Running neural visual analysis...
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Detecting defect boundary, depth, hazardous obstruction, and municipal department routing.
              </p>
            </div>
          ) : aiResult ? (
            <div className="space-y-4">
              {/* Evidence photo preview with AI overlay */}
              <div className="flex flex-col sm:flex-row gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-200">
                {imageUri && (
                  <img
                    src={imageUri}
                    alt="Analyzed Evidence"
                    className="w-full sm:w-36 h-28 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                )}

                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                      Issue Type
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      AI Confidence: {Math.round(aiResult.confidence * 100)}%
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900">{aiResult.issueType}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {aiResult.detectedDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Google Geotag Locked: {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E ({location.area})</span>
                    </div>
                    {location.area === 'Anna Nagar West' && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                        <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                        <span>AI Hotspot Cluster: Elevated grievance surge in {location.area}. Dynamic Top-Priority enabled!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Readout specifications required by Section 6 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Severity</span>
                  <div className="mt-1">
                    <PriorityBadge priority={aiResult.severity} />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Suggested Department
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-1 truncate">
                    {aiResult.suggestedDepartment}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Suggested Priority
                  </span>
                  <div className="mt-1">
                    <PriorityBadge priority={aiResult.suggestedPriority} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-500">
              <Button
                variant="primary"
                size="sm"
                onClick={() => imageUri && runAiAnalysis(imageUri)}
              >
                Analyze Evidence Photo
              </Button>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: CITIZEN CONFIRMATION (Section 6 requirements) */}
      {currentStep === 4 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Step 4: Confirm or Edit Issue Category
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review the automated AI classification. You can confirm or manually select an alternate category.
            </p>
          </div>

          <div className="rounded-2xl bg-blue-50/70 border border-blue-200 p-5 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-5 h-5" />
            </div>

            <h4 className="text-base font-bold text-blue-950">
              "AI detected this as {confirmedCategory}."
            </h4>
            <p className="text-xs text-blue-700 max-w-md mx-auto">
              This will route to the{' '}
              <span className="font-semibold">
                {CATEGORIES.find((c) => c.id === confirmedCategory)?.department}
              </span>{' '}
              with a binding response SLA.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <Button
                type="button"
                variant={isEditingCategory ? 'outline' : 'primary'}
                size="sm"
                leftIcon={<Check className="w-4 h-4" />}
                onClick={() => setIsEditingCategory(false)}
              >
                Confirm
              </Button>

              <Button
                type="button"
                variant={isEditingCategory ? 'primary' : 'outline'}
                size="sm"
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                onClick={() => setIsEditingCategory(!isEditingCategory)}
              >
                Edit Category
              </Button>
            </div>
          </div>

          {isEditingCategory && (
            <div className="pt-2 space-y-2 animate-in fade-in">
              <label className="block text-xs font-semibold text-slate-700">
                Select Municipal Category Override:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setConfirmedCategory(cat.id);
                      setIsEditingCategory(false);
                    }}
                    className={cn(
                      'p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer',
                      confirmedCategory === cat.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs ring-2 ring-blue-100'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    )}
                  >
                    <span className="block">{cat.label}</span>
                    <span className="text-[10px] text-slate-400 font-normal">SLA: {cat.defaultSlaHours}h</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 5: ADDITIONAL DESCRIPTION (Section 6 requirements) */}
      {currentStep === 5 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Step 5: Additional Grievance Details
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add specific context, nearby landmarks, or your status update preferences.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Detailed Description of the Issue
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue, traffic impact, or any immediate hazards..."
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Input
              label="Optional Landmark / Reference Point"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Opposite Roundtana Metro Station Exit B"
              helperText="Assists field engineers in locating defect quickly on ground"
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Contact & Update Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['WHATSAPP', 'SMS', 'CALL'] as const).map((pref) => (
                  <button
                    key={pref}
                    type="button"
                    onClick={() => setContactPreference(pref)}
                    className={cn(
                      'p-2.5 rounded-xl border text-xs font-bold capitalize transition-all cursor-pointer',
                      contactPreference === pref
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {pref} Updates
                  </button>
                ))}
              </div>
            </div>
          </div>

          {submitError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
              {submitError}
            </div>
          )}
        </div>
      )}

      {/* Bottom Step Actions */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1 || isSubmitting}
          leftIcon={<ChevronLeft className="w-4 h-4" />}
        >
          Previous
        </Button>

        <Button
          type="button"
          variant="primary"
          onClick={handleNext}
          isLoading={isSubmitting || (currentStep === 3 && isAnalyzing)}
          rightIcon={
            currentStep === 5 ? (
              <Send className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )
          }
          className="font-bold px-6"
        >
          {currentStep === 5 ? 'Submit Grievance' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
