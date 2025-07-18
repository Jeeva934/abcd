
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share, Mail, MessageCircle, Upload } from "lucide-react";
import { toast } from "sonner";

interface ShareDialogProps {
  title: string;
  content: string;
}

const ShareDialog = ({ title, content }: ShareDialogProps) => {
  const [email, setEmail] = useState("");

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Check out this question paper: ${title}`);
    const url = `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
    toast.success("Sharing to WhatsApp");
  };

  const shareToEmail = () => {
    if (!email.trim()) {
      toast.error("Please enter an email address");
      return;
    }
    
    const subject = encodeURIComponent(`Question Paper: ${title}`);
    const body = encodeURIComponent(`Hi,\n\nI'm sharing this question paper with you: ${title}\n\n${content}`);
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;
    
    window.location.href = mailtoUrl;
    toast.success("Opening email client");
  };

  const shareToGoogleDrive = () => {
    // In a real implementation, this would use Google Drive API
    toast.info("Google Drive integration coming soon!");
    console.log("Would share to Google Drive:", { title, content });
  };

  const copyToClipboard = () => {
    const shareText = `Question Paper: ${title}\n\n${content}`;
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success("Content copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy to clipboard");
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Question Paper</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={shareToWhatsApp} variant="outline" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </Button>
            <Button onClick={shareToGoogleDrive} variant="outline" className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Google Drive</span>
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex space-x-2">
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={shareToEmail} size="sm">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button onClick={copyToClipboard} variant="outline" className="w-full">
            Copy to Clipboard
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
