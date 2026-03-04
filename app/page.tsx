"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortCode, setShortCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  const handleCreateShortLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    setLoading(true);
    try {
      // API call placeholder
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: originalUrl }),
      });
      const data = await response.json();
      setShortCode(data.shortCode);
      setOriginalUrl("");
    } catch (error) {
      console.error("Error creating short link:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <main className="main-card">
        <div className="copy-block">
          <h1 className="headline">Create a Short Link</h1>
          {isSignedIn ? (
            <>
              <p className="subtext">Paste your long URL below to create a short link</p>
              <form onSubmit={handleCreateShortLink} className="form-container">
                <div className="form-group">
                  <Input
                    type="url"
                    placeholder="https://example.com/very/long/url"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    required
                    className="form-input"
                  />
                </div>
                <Button type="submit" disabled={loading} className="btn-primary">
                  {loading ? "Creating..." : "Shorten URL"}
                </Button>
              </form>
              {shortCode && (
                <div className="result-container">
                  <p className="result-label">Your short link:</p>
                  <code className="result-code">{window.location.origin}/{shortCode}</code>
                </div>
              )}
            </>
          ) : (
            <p className="subtext">Sign in to create and manage your short links</p>
          )}
        </div>
      </main>
    </div>
  );
}
