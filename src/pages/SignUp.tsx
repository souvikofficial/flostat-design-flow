import { useMemo, useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Mail, User, CheckCircle2, XCircle, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    google: any;
  }
}

// Google G icon as SVG
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const rules = useMemo(() => {
    const length = password.length >= 8;
    const upper = /[A-Z]/.test(password);
    const lower = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const special = /[^A-Za-z0-9]/.test(password);
    return { length, upper, lower, number, special };
  }, [password]);

  useEffect(() => {
    // Function to load Google Identity Services
    const loadGoogleScript = () => {
      // Check if script is already loaded
      if (window.google && window.google.accounts) {
        setGoogleScriptLoaded(true);
        initializeGoogleSignIn();
        return;
      }
      
      // Dynamically load Google Identity Services script
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setGoogleScriptLoaded(true);
        initializeGoogleSignIn();
      };
      
      script.onerror = () => {
        console.error("Failed to load Google Identity Services");
        setGoogleScriptLoaded(false);
      };
      
      document.head.appendChild(script);

      // Cleanup function
      return () => {
        // We don't remove the script as it might be used by other components
      };
    };

    loadGoogleScript();
  }, []);

  const initializeGoogleSignIn = () => {
    try {
      if (window.google && window.google.accounts && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "350316183770-2v6n03apts1gaf0q2pkt29n5mkkm3oiq.apps.googleusercontent.com",
          callback: handleGoogleSignUp,
          use_fedcm_for_prompt: true,
        });

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          { 
            theme: "outline", 
            size: "large",
            width: 250,
            text: "continue_with",
            logo_alignment: "left"
          }
        );
        
        // Also enable the One Tap prompt
        window.google.accounts.id.prompt();
      } else {
        console.warn("Google Identity Services not fully loaded");
      }
    } catch (error) {
      console.error("Error initializing Google Sign-In:", error);
      setGoogleScriptLoaded(false);
    }
  };

  const handleGoogleSignUp = async (response: any) => {
    setGoogleLoading(true);
    try {
      console.log('Google Sign-Up response received:', response);
      
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
          description: res.state === "signUp" 
            ? "Account created with Google successfully" 
            : "Signed in with Google successfully",
        });
        
        // Navigate to organizations page after successful sign up
        navigate('/organizations');
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to sign up with Google",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Google Sign-Up error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred during Google sign up",
        variant: "destructive",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSignUp = async () => {
    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    const allRulesPassed = Object.values(rules).every(rule => rule);
    if (!allRulesPassed) {
      toast({
        title: "Error",
        description: "Please ensure your password meets all requirements",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.signUp({
        email,
        password,
        firstName,
        lastName,
        ...(middleName && { middleName })
      });
      
      if (response.success) {
        // Store token in localStorage for future requests
        if (response.token) {
          localStorage.setItem('authToken', typeof response.token === 'string' ? response.token : JSON.stringify(response.token));
        }
        
        toast({
          title: "Success",
          description: "Account created successfully",
        });
        
        // Navigate to organizations page after successful sign up
        navigate('/organizations');
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to create account",
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

  // Fallback function to manually trigger Google Sign-In
  const triggerGoogleSignIn = async () => {
    // If Google script is loaded but not initialized properly, try to initialize it
    if (googleScriptLoaded && window.google && window.google.accounts) {
      try {
        initializeGoogleSignIn();
        // Give it a moment to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        window.google.accounts.id.prompt();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to initialize Google Sign-In. Please try again.",
          variant: "destructive",
        });
      }
    } else if (!googleScriptLoaded) {
      // Try to reload the script by re-running the effect
      // Force reload by temporarily setting googleScriptLoaded to false
      setGoogleScriptLoaded(false);
      setTimeout(() => {
        setGoogleScriptLoaded(true);
      }, 100);
      
      toast({
        title: "Info",
        description: "Retrying to load Google Sign-In services...",
      });
    } else {
      toast({
        title: "Error",
        description: "Google Sign-In is not available. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-soft-lg border-border/50">
        <CardHeader>
          <CardTitle className="text-center">Sign Up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <label className="text-sm font-medium">First Name <span className="text-destructive">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="First Name" className="pl-9" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Middle Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Middle Name" className="pl-9" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Last Name <span className="text-destructive">*</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Last Name" className="pl-9" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Email <span className="text-destructive">*</span></label>
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

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Password <span className="text-destructive">*</span></label>
              <div className="relative">
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  className="pr-9"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <ul className="mt-2 space-y-1 text-xs">
                  <li className="flex items-center gap-1">
                    {rules.length ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}<span>At least 8 characters</span>
                  </li>
                  <li className="flex items-center gap-1">
                    {rules.upper ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}<span>One uppercase letter</span>
                  </li>
                  <li className="flex items-center gap-1">
                    {rules.lower ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}<span>One lowercase letter</span>
                  </li>
                  <li className="flex items-center gap-1">
                    {rules.number ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}<span>One number</span>
                  </li>
                  <li className="flex items-center gap-1">
                    {rules.special ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}<span>One special character</span>
                  </li>
                </ul>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Confirm Password <span className="text-destructive">*</span></label>
              <div className="relative">
                <Input
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="pr-9"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPw((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                  aria-label={showConfirmPw ? "Hide password" : "Show password"}
                >
                  {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <Button 
            className="w-full h-10 bg-[hsl(var(--aqua))] hover:bg-[hsl(var(--aqua))]/90 text-white font-medium" 
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </Button>
          
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">OR</span>
            </div>
          </div>
          
          {/* Google button container */}
          <div ref={googleButtonRef} className="flex justify-center">
            {googleLoading && (
              <div className="flex items-center justify-center w-full h-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[hsl(var(--aqua))]"></div>
              </div>
            )}
          </div>
          
          {/* Fallback Google button if the script fails to load */}
          {!googleScriptLoaded && !googleLoading && (
            <Button
              variant="outline"
              className="w-full h-10 flex items-center justify-center gap-2"
              onClick={triggerGoogleSignIn}
              disabled={googleLoading}
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </Button>
          )}
          
          <p className="text-center text-xs text-muted-foreground">
            Already have an account? <a className="text-[hsl(var(--aqua))] hover:underline" href="/signin">Sign in</a>
          </p>
          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3" />
            <span>We do not share your information with third parties.</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}