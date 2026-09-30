import React, { useState, useEffect } from 'react';
import { fieldTeamService } from '@/services/fieldTeamService';
import { storageService } from '@/services/storageService';
import { WorkOrder } from '@/types';
import { PriorityBadge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';
import { FileUploader } from '@/components/common/FileUploader';
import { ImagePreview } from '@/components/common/ImagePreview';
import { formatDate } from '@/utils';
import {
  HardHat,
  CheckCircle2,
  Clock,
  MapPin,
  Play,
  UploadCloud,
  FileCheck,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/utils';

export const FieldTeamDashboard: React.FC = () => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Completion Form fields
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [afterPhotoFile, setAfterPhotoFile] = useState<File | null>(null);
  const [completionNotes, setCompletionNotes] = useState<string>(
    'Pothole cleared of loose gravel, filled with hot-mix asphalt and roller compacted.'
  );

  const reload = async () => {
    const list = await fieldTeamService.getWorkOrders();
    setWorkOrders(list);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleAccept = async (orderId: string) => {
    await fieldTeamService.acceptWorkOrder(orderId);
    reload();
  };

  const handleStart = async (orderId: string) => {
    await fieldTeamService.startWork(orderId);
    reload();
  };

  const openCompletionModal = (order: WorkOrder) => {
    setSelectedOrder(order);
    setShowCompletionModal(true);
  };

  const handleCompleteWork = async () => {
    if (!selectedOrder) return;
    if (!afterPhoto) {
      alert('Please upload an after-repair completion photo.');
      return;
    }

    setIsSubmitting(true);
    try {
      let uploadedUrl = afterPhoto;
      if (afterPhotoFile) {
        uploadedUrl = await storageService.uploadResolutionProof(
          afterPhotoFile,
          selectedOrder.id,
          'after'
        );
      }

      await fieldTeamService.completeWork(selectedOrder.id, uploadedUrl, completionNotes);
      setShowCompletionModal(false);
      setSelectedOrder(null);
      setAfterPhoto(null);
      reload();
    } catch (err) {
      console.error('Work order completion failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">
              Field Operations & Work Orders
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rapid Response Crew Bravo • Upload on-ground verification photos to trigger automated civic closure.
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
          {workOrders.length} Assigned Work Orders
        </div>
      </div>

      {/* Work Orders List (Section 16 requirements) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workOrders.map((wo) => {
          const isCompleted = wo.status === 'COMPLETED';
          const isInProgress = wo.status === 'IN_PROGRESS';
          const isAssigned = wo.status === 'ASSIGNED';

          return (
            <div
              key={wo.id}
              className={cn(
                'rounded-2xl border p-5 bg-white shadow-xs space-y-4 text-left transition-all',
                isCompleted
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : isInProgress
                  ? 'border-purple-300 ring-2 ring-purple-100'
                  : 'border-slate-200'
              )}
            >
              {/* Top Meta Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {wo.id}
                  </span>
                  <span className="font-mono text-[11px] text-blue-600">
                    ref #{wo.complaintId}
                  </span>
                  <PriorityBadge priority={wo.priority} />
                </div>

                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-xs font-bold uppercase',
                    isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : isInProgress
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  )}
                >
                  {wo.status}
                </span>
              </div>

              {/* Title & Location */}
              <div>
                <h3 className="text-base font-bold text-slate-900">{wo.complaintTitle}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">
                    {wo.location.readableAddress || `${wo.location.area}, ${wo.location.ward}`}
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150 text-xs">
                <span className="font-semibold text-slate-700 block mb-0.5">
                  Engineer Instructions:
                </span>
                <p className="text-slate-600 leading-relaxed">{wo.instructions}</p>
              </div>

              {/* Photo Evidence section */}
              <div className="grid grid-cols-2 gap-2">
                {wo.beforePhoto && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Before Repair:
                    </span>
                    <ImagePreview
                      src={wo.beforePhoto}
                      alt="Before Work"
                      heightClass="h-28"
                    />
                  </div>
                )}

                {wo.afterPhoto && (
                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">
                      After Repair:
                    </span>
                    <ImagePreview
                      src={wo.afterPhoto}
                      alt="After Work"
                      heightClass="h-28"
                    />
                  </div>
                )}
              </div>

              {/* Deadline & dates */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  Deadline: {formatDate(wo.deadline)}
                </span>
                <span className="font-semibold text-slate-700">{wo.fieldTeamName}</span>
              </div>

              {/* Action Buttons (Section 16) */}
              <div className="flex items-center gap-2 pt-2">
                {isAssigned && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleAccept(wo.id)}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                    className="w-full"
                  >
                    Accept Work Order
                  </Button>
                )}

                {wo.status === 'ACCEPTED' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleStart(wo.id)}
                    leftIcon={<Play className="w-3.5 h-3.5" />}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Start Work On Site
                  </Button>
                )}

                {isInProgress && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => openCompletionModal(wo)}
                    leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
                    className="w-full font-bold"
                  >
                    Upload After Photo & Complete
                  </Button>
                )}

                {isCompleted && (
                  <div className="w-full text-center py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Work Completed & Evidence Uploaded</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Modal with After-Photo Uploader */}
      <Modal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        title="Complete Work Order & Upload Proof"
        description="Municipal regulations require on-ground completion photographic evidence."
      >
        <div className="space-y-4 text-xs text-left">
          <FileUploader
            label="Upload 'After' Photo Evidence"
            helperText="Capture repaired road surface, replaced pipe collar, or cleared bins"
            onImageSelected={(uri, file) => {
              setAfterPhoto(uri);
              setAfterPhotoFile(file);
            }}
            currentImageUrl={afterPhoto || undefined}
          />

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Field Completion Report / Material Notes
            </label>
            <textarea
              rows={3}
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCompletionModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleCompleteWork}
              isLoading={isSubmitting}
            >
              Submit Proof & Resolve Grievance
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
