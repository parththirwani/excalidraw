import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Globe, Lock, Palette, X } from "lucide-react";

interface CreateCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCanvasModal({ isOpen, onClose }: CreateCanvasModalProps) {
  const [canvasName, setCanvasName] = useState("");
  const [canvasMode, setCanvasMode] = useState("public");

  const handleCreate = () => {
    // Here you would typically create the canvas and navigate to it
    console.log("Creating canvas:", { name: canvasName, mode: canvasMode });
    
    // Reset form and close modal
    setCanvasName("");
    setCanvasMode("public");
    onClose();
  };

  const handleClose = () => {
    setCanvasName("");
    setCanvasMode("public");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="sm:max-w-md border-0 shadow-2xl p-0 gap-0 rounded-xl overflow-hidden"
        style={{ backgroundColor: '#232329' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Palette className="h-4 w-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold text-white">Create Canvas</DialogTitle>
              <DialogDescription className="text-sm" style={{ color: '#a8a5ff' }}>
                Set up your collaborative workspace
              </DialogDescription>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Canvas Name */}
          <div className="space-y-3">
            <Label htmlFor="canvas-name" className="text-sm font-medium text-white">
              Canvas Name
            </Label>
            <Input
              id="canvas-name"
              placeholder="Enter canvas name"
              value={canvasName}
              onChange={(e) => setCanvasName(e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 focus:border-white/20 focus:bg-white/10 rounded-lg h-11"
            />
          </div>

          {/* Privacy Settings */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-white">Privacy</Label>
            <RadioGroup
              value={canvasMode}
              onValueChange={setCanvasMode}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <RadioGroupItem 
                  value="public" 
                  id="public" 
                  className="border-white/20 text-white data-[state=checked]:bg-white data-[state=checked]:border-white mt-0.5" 
                />
                <Globe className="h-4 w-4 text-emerald-400 mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="public" className="text-sm font-medium text-white cursor-pointer">
                    Public
                  </Label>
                  <p className="text-xs mt-0.5" style={{ color: '#a8a5ff' }}>
                    Anyone can discover and join this canvas
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <RadioGroupItem 
                  value="private" 
                  id="private" 
                  className="border-white/20 text-white data-[state=checked]:bg-white data-[state=checked]:border-white mt-0.5" 
                />
                <Lock className="h-4 w-4 text-amber-400 mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="private" className="text-sm font-medium text-white cursor-pointer">
                    Private
                  </Label>
                  <p className="text-xs mt-0.5" style={{ color: '#a8a5ff' }}>
                    Only people with the link can access
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3">
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!canvasName.trim()}
            className="bg-white text-black hover:bg-gray-100 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Canvas
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}