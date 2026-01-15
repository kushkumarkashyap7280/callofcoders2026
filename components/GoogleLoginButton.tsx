"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { NEXT_PUBLIC_GOOGLE_CLIENT_ID } from "@/config/env";


export default function GoogleLoginButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
   
  
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("An error occurred during Google login");
    } finally {
      setLoading(false);
    }


  };

  const handleGoogleError = () => {
    console.error("Google login failed");
    alert("Google login failed. Please try again.");
  };

  // Get Google Client ID from environment variable
  const clientId = NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  if (!clientId) {
    return (
      <div className="text-sm text-red-500 text-center">
        Google Client ID not configured. Please add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env file.
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="w-full flex justify-center">
        {loading ? (
          <div className="w-full py-2 text-center text-sm text-gray-600">
            Signing in with Google...
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text="continue_with"
            width="100%"
          />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
