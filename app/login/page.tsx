"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGuestLogin = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `guest_${Date.now()}@research-ai.local`,
        password: process.env.NEXT_PUBLIC_GUEST_PASSWORD!,
      });

      if (error) throw error;
      router.refresh();
    } catch (error: any) {
      console.error('Guest login error:', error);
      toast({
        title: "Error",
        description: "Failed to continue as guest. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoAuth = () => {
    router.push('/no-auth');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <GraduationCap className="h-12 w-12 mb-4 text-primary" />
          <h1 className="text-2xl font-bold text-center">Welcome to Research AI</h1>
          <p className="text-muted-foreground text-center mt-2">
            Your AI-powered academic research assistant
          </p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            extend: true,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary))',
                  inputBackground: 'hsl(var(--background))',
                  inputText: 'hsl(var(--foreground))',
                  inputPlaceholder: 'hsl(var(--muted-foreground))',
                  inputBorder: 'hsl(var(--border))',
                  inputBorderFocus: 'hsl(var(--ring))',
                  inputBorderHover: 'hsl(var(--ring))',
                  defaultButtonBackground: 'hsl(var(--primary))',
                  defaultButtonBackgroundHover: 'hsl(var(--primary))',
                  defaultButtonBorder: 'hsl(var(--primary))',
                  defaultButtonText: 'hsl(var(--primary-foreground))',
                  dividerBackground: 'hsl(var(--border))',
                },
                radii: {
                  borderRadiusButton: 'var(--radius)',
                  buttonBorderRadius: 'var(--radius)',
                  inputBorderRadius: 'var(--radius)',
                },
                space: {
                  inputPadding: '0.5rem 0.75rem',
                  buttonPadding: '0.5rem 1rem',
                },
                fonts: {
                  bodyFontFamily: 'inherit',
                  buttonFontFamily: 'inherit',
                  inputFontFamily: 'inherit',
                  labelFontFamily: 'inherit',
                },
              },
            },
            className: {
              container: 'w-full',
              button: 'w-full px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90',
              input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              loader: 'text-primary',
              anchor: 'text-primary hover:text-primary/80',
              divider: 'my-4 border-t border-border',
              message: 'text-sm text-muted-foreground mt-2',
            },
          }}
          providers={['github', 'google']}
          redirectTo={`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`}
          onlyThirdPartyProviders={false}
          view="sign_in"
          showLinks={true}
        />

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGuestLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Continuing as Guest...' : 'Continue as Guest'}
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={handleNoAuth}
          >
            Continue without Account
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground text-center mt-4">
          Guest accounts have 2 free credits and limited features
        </p>
      </Card>
    </div>
  );
}
