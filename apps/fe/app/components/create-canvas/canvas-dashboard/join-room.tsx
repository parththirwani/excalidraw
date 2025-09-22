import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Lock, AlertCircle, Loader2, UserPlus } from "lucide-react";
import { useJoinRoom } from "@/hooks/get-rooms";


interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const [code, setCode] = useState("");
  const { joinRoom, loading, error } = useJoinRoom();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      return; // Error is handled by the hook
    }

    try {
      const room = await joinRoom(code);
      // Redirect to the room using the slug from the API response
      window.location.href = `/canvas/${room.slug}?code=${code.toUpperCase()}`;
    } catch (error) {
      // Error is already set by the hook, so we don't need to handle it here
      console.error("Failed to join room:", error);
    }
  };

  const handleClose = () => {
    setCode("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#111111] border-white/10 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-amber-400" />
            <DialogTitle className="text-xl font-semibold">Join Private Canvas</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            Enter the access code to join a private canvas
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 my-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-white">Access Code</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-400" />
              <Input
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                }}
                placeholder="Enter access code"
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-amber-400/50 focus:bg-white/10 text-center tracking-widest font-mono text-lg"
                disabled={loading}
                autoFocus
                maxLength={20}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-400">
                <p className="font-medium mb-1">Need an access code?</p>
                <p>Ask the canvas owner to share their private canvas access code with you.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="border-white/10 text-gray-400 hover:text-white hover:border-white/20 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !code.trim()}
              className="bg-amber-500 hover:bg-amber-600 text-black font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Join Canvas
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}