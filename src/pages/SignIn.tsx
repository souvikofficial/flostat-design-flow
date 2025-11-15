import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    google: any;
  }
}

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Dynamically load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      initializeGoogleSignIn();
    };
    
    script.onerror = () => {
      console.error("Failed to load Google Identity Services");
    };
    
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google && window.google.accounts && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "350316183770-2v6n03apts1gaf0q2pkt29n5mkkm3oiq.apps.googleusercontent.com",
        callback: handleGoogleSignIn,
        use_fedcm_for_prompt: true,
      });

      window.google.accounts.id.renderButton(
        googleButtonRef.current,
        { 
          theme: "outline", 
          size: "large",
          width: 250,
          text: "continue_with"
        }
      );
    }
  };

  const handleGoogleSignIn = async (response: any) => {
    setGoogleLoading(true);
    try {
      console.log('Google Sign-In response received:', response);
      
      // Check if we received a credential
      if (!response.credential) {
        throw new Error("No credential received from Google Sign-In");
      }
      
      const res = await api.auth.googleOuth({ tokenId: response.credential });
      console.log('Backend response:', res);
      
      if (res.success) {
        // Store token in localStorage for future requests
        if (res.token) {
          localStorage.setItem('authToken', typeof res.token === 'string' ? res.token : JSON.stringify(res.token));
        }
        
        toast({
          title: "Success",
          description: "Signed in with Google successfully",
        });
        
        // Navigate to organizations page after successful sign in
        navigate('/organizations');
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to sign in with Google",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred during Google sign in",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.login({ email, password });
      
      if (response.success) {
        // Store token in localStorage for future requests
        if (response.token) {
          localStorage.setItem('authToken', typeof response.token === 'string' ? response.token : JSON.stringify(response.token));
        }
        
        toast({
          title: "Success",
          description: "Signed in successfully",
        });
        
        // Navigate to organizations page after successful sign in
        navigate('/organizations');
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to sign in",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center">
      <Card className="w-full max-w-md shadow-soft-lg border-border/50">
        <CardHeader>
          <CardTitle className="text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pl-9 pr-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="text-right">
              <a className="text-xs text-[hsl(var(--aqua))] hover:underline" href="#">Forgot password?</a>
            </div>
          </div>
          <Button 
            className="w-full h-9 gap-2 bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 text-white font-medium" 
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Sign In
              </>
            )}
          </Button>
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">OR</span>
            </div>
          </div>
          <div ref={googleButtonRef} className="flex justify-center">
            {googleLoading && (
              <div className="flex items-center justify-center w-full h-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[hsl(var(--aqua))]"></div>
              </div>
            )}
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Don't have an account? <a className="text-[hsl(var(--aqua))] hover:underline" href="/signup">Sign up</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}