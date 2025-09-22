import { useState, useEffect } from "react";
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
import { Copy, Globe, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomSlug?: string;
  roomType?: 'PUBLIC' | 'PRIVATE';
  roomCode?: string;
}

export function ShareModal({ isOpen, onClose, roomId, roomSlug, roomType, roomCode }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeRevealed, setCodeRevealed] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      setCodeRevealed(false);
      setCodeCopied(false);
    }
  }, [isOpen]);

  const getShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/canvas/${roomSlug}`;
  };

  const handleCopy = async (text: string, type: 'link' | 'code') => {
    try {
      setLoading(true);
      await navigator.clipboard.writeText(text);

      if (type === 'link') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);

      if (type === 'link') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        setCodeCopied(true);
        setTimeout(() => setCodeCopied(false), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoomTypeInfo = () => {
    if (roomType === 'PUBLIC') {
      return {
        icon: <Globe className="h-4 w-4 text-emerald-400" />,
        badge: (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
            <Globe className="h-3 w-3 mr-1" />
            Public
          </Badge>
        ),
        description: "Anyone with the link can join this canvas"
      };
    } else {
      return {
        icon: <Lock className="h-4 w-4 text-amber-400" />,
        badge: (
          <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">
            <Lock className="h-3 w-3 mr-1" />
            Private
          </Badge>
        ),
        description: "Only people with the access code can join this canvas"
      };
    }
  };

  const roomInfo = getRoomTypeInfo();
  const showCodeWarning = roomType === 'PRIVATE' && !roomCode;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111111] border-white/10 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Share Canvas</DialogTitle>
            {roomInfo.badge}
          </div>
          <DialogDescription className="text-gray-400 flex items-center gap-2">
            {roomInfo.icon}
            {roomInfo.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-6">
          {/* Room Name */}
          {roomSlug && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white">Canvas Name</Label>
              <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-white font-medium">{roomSlug}</p>
              </div>
            </div>
          )}

          {/* Private Access Code */}
          {roomType === 'PRIVATE' && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white">Access Code</Label>
              {roomCode ? (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    {/* Code display with blur effect */}
                    <div className="flex-1 relative">
                      <code
                        className={`text-lg font-mono text-amber-400 tracking-wider transition-all duration-200 cursor-pointer select-none ${!codeRevealed ? 'blur-sm hover:blur-none' : ''
                          }`}
                        onClick={() => setCodeRevealed(true)}
                        title={!codeRevealed ? "Click to reveal code" : ""}
                      >
                        {roomCode}
                      </code>
                    </div>

                    {/* Copy button */}
                    <Button
                      onClick={() => handleCopy(roomCode, 'code')}
                      disabled={loading}
                      size="sm"
                      className={`px-2 py-1 h-auto transition-colors ${codeCopied
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-amber-500 hover:bg-amber-600 text-black'
                        }`}
                    >
                      {loading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : codeCopied ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-amber-400/80 mt-2">
                    {!codeRevealed
                      ? "Click on the blurred code to reveal it"
                      : "Share this code with people you want to invite"
                    }
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <div>
                      <p className="text-red-400 font-medium text-sm">No access code available</p>
                      <p className="text-red-400/80 text-xs mt-1">
                        This private room is not properly configured. Please ask the room admin for assistance.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Share Link - Show for all valid rooms */}
          {!showCodeWarning && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-white">Share Link</Label>
              <div className="flex gap-2">
                <Input
                  value={getShareUrl()}
                  readOnly
                  className="bg-white/5 border-white/10 text-white text-sm font-mono"
                />
                <Button
                  onClick={() => handleCopy(getShareUrl(), 'link')}
                  disabled={loading}
                  className={`px-3 transition-colors ${copied
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-white text-black hover:bg-gray-100'
                    }`}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : copied ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!showCodeWarning && (
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-400">
                  {roomType === 'PRIVATE' ? (
                    <>
                      <p className="font-medium mb-1">Private Canvas</p>
                      <p>Share the link and access code separately. People will need to enter the code when they visit the canvas.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-medium mb-1">Public Canvas</p>
                      <p>Anyone with this link can join and collaborate on this canvas.</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white/10 text-gray-400 bg-transparent"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}