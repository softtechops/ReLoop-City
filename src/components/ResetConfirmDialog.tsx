import React from 'react';
import { useStore } from '../store/useStore';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { RotateCcw, AlertCircle } from 'lucide-react';

export const ResetConfirmDialog: React.FC = () => {
  const { isResetConfirmOpen, closeResetConfirm, resetSimulation } = useStore();

  return (
    <Modal
      isOpen={isResetConfirmOpen}
      onClose={closeResetConfirm}
      maxWidth="md"
      title="Reset Simulation Demo?"
      description="Returns all 100 smart bins, fleet telemetry, and daily metrics to initial state."
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={closeResetConfirm}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={() => {
              resetSimulation();
              closeResetConfirm();
            }}
          >
            Confirm Reset
          </Button>
        </>
      }
    >
      <div className="space-y-3 text-sm text-charcoal-600">
        <div className="p-3.5 rounded-xl bg-amberGold-50 border border-amberGold-200 text-amberGold-900 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amberGold-700 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Assumptions are preserved:</span>
            <span>
              Your customized market tariffs, biogas yields, and fleet efficiency settings in the Assumptions panel will remain intact.
            </span>
          </div>
        </div>
        <p className="text-xs text-charcoal-500">
          The simulation clock will return to Day 1, 14:00 (Tuesday) with initial fill telemetry.
        </p>
      </div>
    </Modal>
  );
};
