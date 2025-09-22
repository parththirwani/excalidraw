import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Globe, Lock, Loader2, CheckCircle, AlertCircle, Palette } from "lucide-react";
import { useCreateRoom } from "@/hooks/get-rooms";

interface CreateCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated?: () => void;
}

// Slug validation helper functions
const isValidSlug = (slug: string): boolean => {
  // Slug should only contain lowercase letters, numbers, and hyphens
  // Should not start or end with hyphen
  // Should not have consecutive hyphens
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 2 && slug.length <= 50;
};

const sanitizeSlug = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

const getSlugErrorMessage = (slug: string): string | null => {
  if (!slug) return "Canvas name is required";
  if (slug.length < 2) return "Canvas name must be at least 2 characters long";
  if (slug.length > 50) return "Canvas name must be 50 characters or less";
  if (slug.startsWith('-') || slug.endsWith('-')) return "Canvas name cannot start or end with a hyphen";
  if (slug.includes('--')) return "Canvas name cannot contain consecutive hyphens";
  if (!/^[a-z0-9-]+$/.test(slug)) return "Canvas name can only contain lowercase letters, numbers, and hyphens";
  return null;
};

export function CreateCanvasModal({ isOpen, onClose, onRoomCreated }: CreateCanvasModalProps) {
  const [canvasName, setCanvasName] = useState("");
  const [canvasMode, setCanvasMode] = useState("public");
  const [success, setSuccess] = useState(false);
  const [slugError, setSlugError] = useState<string | null>(null);
  
  const { createRoom, loading, error } = useCreateRoom();

  const handleCanvasNameChange = (value: string) => {
    setCanvasName(value);
    
    // Real-time validation
    const sanitized = sanitizeSlug(value);
    const errorMessage = getSlugErrorMessage(sanitized);
    setSlugError(errorMessage);
  };

  const handleCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const sanitizedSlug = sanitizeSlug(canvasName);
    
    if (!sanitizedSlug.trim()) {
      setSlugError("Canvas name is required");
      return;
    }

    // Final validation before creating
    const validationError = getSlugErrorMessage(sanitizedSlug);
    if (validationError) {
      setSlugError(validationError);
      return;
    }

    try {
      await createRoom({
        name: sanitizedSlug, // Use sanitized slug
        type: canvasMode === 'public' ? 'PUBLIC' : 'PRIVATE'
      });
      
      setSuccess(true);
      
      // Close modal after a short delay and refresh rooms
      setTimeout(() => {
        setSuccess(false);
        setCanvasName("");
        setCanvasMode('public');
        setSlugError(null);
        onClose();
        if (onRoomCreated) {
          onRoomCreated();
        }
      }, 1500);
      
    } catch (err) {
      // Error is already handled by the hook
      console.error('Failed to create room:', err);
    }
  };

  const handleClose = () => {
    if (loading) return; // Prevent closing during creation
    
    setCanvasName("");
    setCanvasMode('public');
    setSuccess(false);
    setSlugError(null);
    onClose();
  };

  // Show preview of sanitized slug
  const previewSlug = canvasName ? sanitizeSlug(canvasName) : "";
  const isFormValid = canvasName.trim() && !slugError && !getSlugErrorMessage(previewSlug);

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-[#111111] border-white/10 text-white max-w-md">
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Canvas Created!</h3>
            <p className="text-gray-400">Your new canvas is ready to use.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#111111] border-white/10 text-white max-w-md">
        <form onSubmit={handleCreate}>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Create New Canvas</DialogTitle>
            <DialogDescription className="text-gray-400">
              Set up a new collaborative workspace for your team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 my-6">
            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Canvas Name */}
            <div className="space-y-2">
              <Label htmlFor="canvas-name" className="text-sm font-medium text-white">
                Canvas Name
              </Label>
              <Input
                id="canvas-name"
                type="text"
                placeholder="my-awesome-canvas"
                value={canvasName}
                onChange={(e) => handleCanvasNameChange(e.target.value)}
                className={`bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-white/20 focus:bg-white/10 ${
                  slugError ? 'border-red-500/50 focus:border-red-500/50' : ''
                }`}
                disabled={loading}
                required
              />
              
              {/* Slug Preview */}
              {previewSlug && previewSlug !== canvasName && (
                <div className="text-xs text-gray-400">
                  URL Preview: /canvas/<span className="text-white">{previewSlug}</span>
                </div>
              )}
              
              {/* Slug Error */}
              {slugError && (
                <div className="flex items-center gap-1 text-red-400 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  {slugError}
                </div>
              )}
              
              {/* Slug Guidelines */}
              <div className="text-xs text-gray-500">
                Use lowercase letters, numbers, and hyphens. Spaces will be converted to hyphens.
              </div>
            </div>

            {/* Visibility */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-white">Visibility</Label>
              <RadioGroup
                value={canvasMode}
                onValueChange={(value) => setCanvasMode(value)}
                disabled={loading}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 p-3 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                  <RadioGroupItem value="public" id="public" className="border-white/20 text-white" />
                  <Label 
                    htmlFor="public" 
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                  >
                    <Globe className="h-4 w-4 text-emerald-400" />
                    <div>
                      <div className="font-medium text-white">Public</div>
                      <div className="text-sm text-gray-400">Anyone can discover and join this canvas</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-3 p-3 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                  <RadioGroupItem value="private" id="private" className="border-white/20 text-white" />
                  <Label 
                    htmlFor="private" 
                    className="flex items-center gap-2 flex-1 cursor-pointer"
                  >
                    <Lock className="h-4 w-4 text-amber-400" />
                    <div>
                      <div className="font-medium text-white">Private</div>
                      <div className="text-sm text-gray-400">Only invited members can access this canvas</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter className="gap-3">
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
              disabled={loading || !isFormValid}
              className="bg-white text-black hover:bg-gray-100 font-medium min-w-[100px]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Canvas'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}