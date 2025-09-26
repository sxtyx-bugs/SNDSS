import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Copy, Clock, Share, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareResult {
  id: string;
  url: string;
  expiresAt: string;
}

export default function ShareApp() {
  const [content, setContent] = useState("");
  const [expirationTime, setExpirationTime] = useState("30");
  const [shareResult, setShareResult] = useState<ShareResult | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter some text to share.",
        variant: "destructive",
      });
      return;
    }

    setIsSharing(true);
    console.log('Sharing content with AI manipulation...', { content, expirationTime });
    console.log('Environment check:', {
      VITE_USE_SUPABASE: import.meta.env.VITE_USE_SUPABASE,
      VITE_PUBLIC_API_URL: import.meta.env.VITE_PUBLIC_API_URL,
      VITE_SUPABASE_PROJECT_URL: import.meta.env.VITE_SUPABASE_PROJECT_URL
    });
    
    try {
      // Convert expiration time to milliseconds based on unit (seconds or minutes)
      const expirationValue = parseInt(expirationTime);
      const expiresAt = new Date(
        Date.now() + 
        (expirationTime.endsWith('s') ? expirationValue * 1000 : expirationValue * 60 * 1000)
      );
      
      // Import the API utility and use it for the request
      console.log('About to import API utilities...');
      const { createShare, USE_SUPABASE } = await import('@/lib/api');
      console.log('API utilities imported:', { USE_SUPABASE });
      
      let result;
      console.log('About to call createShare...');
      if (USE_SUPABASE) {
        console.log('Using Supabase backend');
        // For Supabase, we use a fixed 30-second expiration
        result = await createShare({
          snippet: content,
          language: 'plaintext'
        });
      } else {
        console.log('Using Vercel backend');
        // For Vercel, we use the custom expiration time
        result = await createShare({
          originalContent: content,
          expiresAt: expiresAt.toISOString(),
        });
      }
      console.log('createShare completed with result:', result);

      setShareResult({
        id: result.id || 'supabase-share', // Supabase doesn't return an ID, but we need something for the UI
        url: result.url,
        expiresAt: USE_SUPABASE ? new Date(Date.now() + 30000).toISOString() : result.expiresAt,
      });
      
      toast({
        title: "Share Created",
        description: USE_SUPABASE 
          ? "Your content will be automatically deleted after 30 seconds." 
          : "Your content has been processed and is ready to share.",
      });
    } catch (error) {
      console.error('Error creating share:', error);
      toast({
        title: "Failed to Create Share",
        description: "There was an error processing your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopy = async (text: string) => {
    console.log('Copy function called with text:', text);
    
    try {
      // Check if we're in a secure context
      console.log('Secure context:', window.isSecureContext);
      console.log('Clipboard API available:', !!navigator.clipboard);
      
      // Primary method: Modern Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Copied!",
          description: "URL copied to clipboard.",
        });
        console.log('URL copied to clipboard via Clipboard API');
        return;
      }
      
      // Fallback method: Create a temporary textarea
      console.log('Using fallback copy method');
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast({
          title: "Copied!",
          description: "URL copied to clipboard.",
        });
        console.log('URL copied to clipboard via fallback method');
      } else {
        throw new Error('Copy command failed');
      }
    } catch (err) {
      console.error('Copy failed:', err);
      // Final fallback: Select the text for manual copy
      try {
        const urlInput = document.querySelector('[data-testid="input-share-url"]') as HTMLInputElement;
        if (urlInput) {
          urlInput.select();
          urlInput.setSelectionRange(0, 99999); // For mobile devices
          toast({
            title: "Please Copy Manually",
            description: "The URL has been selected. Press Ctrl+C (or Cmd+C) to copy.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Copy Failed",
            description: "Please manually select and copy the URL.",
            variant: "destructive",
          });
        }
      } catch (selectErr) {
        toast({
          title: "Copy Failed",
          description: "Please manually select and copy the URL.",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setContent("");
    setShareResult(null);
    console.log('Form reset');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-foreground mb-2" data-testid="title-main">
            Secure Text Sharing
          </h1>
          <p className="text-muted-foreground">
            Share text and code snippets with automatic expiration
          </p>
        </div>

        {!shareResult ? (
          <Card className="mb-6" data-testid="card-share-form">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share className="h-5 w-5" />
                Create New Share
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="content" data-testid="label-content">
                  Content to Share
                </Label>
                <Textarea
                  id="content"
                  data-testid="textarea-content"
                  placeholder="Paste your text or code here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] font-mono text-sm resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiration" data-testid="label-expiration">
                  Expiration Time
                </Label>
                <Select value={expirationTime} onValueChange={setExpirationTime}>
                  <SelectTrigger data-testid="select-expiration">
                    <SelectValue placeholder="Select expiration time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30s" data-testid="option-30sec">30 seconds</SelectItem>
                    <SelectItem value="60s" data-testid="option-60sec">1 minute</SelectItem>
                    <SelectItem value="5" data-testid="option-5min">5 minutes</SelectItem>
                    <SelectItem value="10" data-testid="option-10min">10 minutes</SelectItem>
                    <SelectItem value="30" data-testid="option-30min">30 minutes</SelectItem>
                    <SelectItem value="60" data-testid="option-1hour">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Privacy Notice</p>
                    <p>
                      Your content will be automatically processed for security and will 
                      self-destruct after the selected time period. No data is permanently stored.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleShare} 
                disabled={isSharing || !content.trim()}
                className="w-full"
                data-testid="button-share"
              >
                {isSharing ? "Processing..." : "Create Secure Share"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6" data-testid="card-share-result">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <Share className="h-5 w-5" />
                Share Created Successfully
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label data-testid="label-share-url">Share URL</Label>
                <div className="flex gap-2">
                  <Input
                    value={shareResult.url}
                    readOnly
                    className="font-mono text-sm"
                    data-testid="input-share-url"
                  />
                  <Button
                    onClick={() => handleCopy(shareResult.url)}
                    size="icon"
                    variant="outline"
                    data-testid="button-copy-url"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span data-testid="text-expiry-time">
                  Expires at {new Date(shareResult.expiresAt).toLocaleString()}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleCopy(shareResult.url)}
                  variant="default"
                  data-testid="button-copy-main"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  data-testid="button-create-another"
                >
                  Create Another
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center text-sm text-muted-foreground">
          <p>All shares are automatically deleted after expiration. No permanent storage.</p>
        </div>
      </div>
    </div>
  );
}