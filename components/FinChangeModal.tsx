import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FinChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function FinChangeModal({
  isOpen,
  onClose,
  onConfirm,
}: FinChangeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure you want to change the FIN?</DialogTitle>
          <DialogDescription>
            If yes, the examination details input earlier will be cleared.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={onConfirm}>
            Yes
          </Button>
          <Button variant="default" onClick={onClose}>
            No
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
