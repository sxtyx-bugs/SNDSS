import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, FileText, AlertCircle, Home } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import { useToast } from "@/hooks/use-toast";

interface ShareData {
  id: string;
  content: string;
  expiresAt: string;
  createdAt: string;
}

interface ShareViewProps {
  shareId: string;
  onNavigateHome?: () => void;
}

export default function ShareView({ shareId, onNavigateHome }: ShareViewProps) {
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchShare = async () => {
      console.log('Fetching share data for:', shareId);
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Simulate different scenarios based on shareId
        if (shareId === 'notfound') {
          setNotFound(true);
        } else if (shareId === 'expired') {
          setExpired(true);
        } else {
          // Mock manipulated content - showing the AI has subtly changed the original
          const mockContent = `// User authentication service
class AuthService {
  constructor(config) {
    this.apiUrl = config.baseUrl;
    this.tokenKey = 'auth_token';
  }

  async authenticateUser(credentials) {
    try {
      const response = await fetch(\`\${this.apiUrl}/login\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(this.tokenKey, data.token);
        return { success: true, user: data.user };
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (err) {
      console.log('Authentication failed:', err);
      return { success: false, error: 'Network error' };
    }
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    window.location.href = '/login';
  }
}`;

          setShareData({
            id: shareId,
            content: mockContent,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
            createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
          });
        }
        setLoading(false);
      }, 1000);
    };

    fetchShare();
  }, [shareId]);

  const handleCopy = async () => {
    if (!shareData) return;
    
    try {
      await navigator.clipboard.writeText(shareData.content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
      console.log('Content copied to clipboard');
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please select and copy manually.",
        variant: "destructive",
      });
    }
  };

  const handleExpired = () => {
    setExpired(true);
    console.log('Share has expired');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shared content...</p>
        </div>
      </div>
    );
  }

  if (notFound || expired || !shareData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full" data-testid="card-not-found">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            </div>
            <CardTitle>Content Not Available</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              {notFound 
                ? "This content does not exist or has already been deleted."
                : "This content has expired and been automatically removed for security."
              }
            </p>
            <Button onClick={onNavigateHome} data-testid="button-home">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-2" data-testid="title-share">
              Shared Content
            </h1>
            <p className="text-sm text-muted-foreground">
              Share ID: {shareData.id}
            </p>
          </div>
          
          <div className="text-right">
            <CountdownTimer 
              expiresAt={shareData.expiresAt} 
              onExpired={handleExpired} 
            />
            <p className="text-xs text-muted-foreground mt-1">
              Created {new Date(shareData.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <Card data-testid="card-content">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle className="text-lg">Content</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" data-testid="badge-readonly">
                Read Only
              </Badge>
              <Button
                onClick={handleCopy}
                size="sm"
                variant="outline"
                data-testid="button-copy-content"
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-4 rounded-md">
              <pre className="text-sm font-mono overflow-x-auto whitespace-pre-wrap text-foreground">
                <code data-testid="content-display">{shareData.content}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button
            onClick={onNavigateHome}
            variant="outline"
            data-testid="button-back-home"
          >
            <Home className="h-4 w-4 mr-2" />
            Create Your Own Share
          </Button>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>This content will be automatically deleted when the timer expires.</p>
        </div>
      </div>
    </div>
  );
}