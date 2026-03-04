"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link2, BarChart3, Shield, LayoutDashboard, ArrowRight, Zap } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant URL Shortening",
    description:
      "Convert any long URL into a clean, compact short link in seconds. No sign-up friction.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description:
      "Track every click on your short links to understand how your audience engages with your content.",
  },
  {
    icon: Shield,
    title: "Secure & Authenticated",
    description:
      "Your links are tied to your account, keeping your data private and protected at all times.",
  },
  {
    icon: LayoutDashboard,
    title: "Centralized Dashboard",
    description:
      "Manage, edit, and monitor all your short links from one organized, easy-to-use dashboard.",
  },
];

const steps = [
  {
    number: "1",
    title: "Create an account",
    description: "Sign up for free in seconds and get instant access to all features.",
  },
  {
    number: "2",
    title: "Paste your URL",
    description: "Enter any long URL you want to shorten into the link creator.",
  },
  {
    number: "3",
    title: "Share your link",
    description: "Copy your new short link and share it anywhere — social, email, or messages.",
  },
];

export default function Home() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.replace("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="landing-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-badge">
          <Link2 className="h-4 w-4" />
          <span>Free URL Shortener</span>
        </div>
        <h1 className="hero-headline">
          Shorten Links.<br />Share Smarter.
        </h1>
        <p className="hero-subtext">
          Turn lengthy URLs into clean, shareable short links. Track clicks, manage your links,
          and take control of how you share content online.
        </p>
        <div className="cta-row hero-cta-row">
          <SignUpButton mode="modal">
            <Button size="lg" className="btn-primary">
              Get started for free
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline" className="btn-secondary">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="section-title">Everything you need</h2>
        <p className="section-subtext">
          Powerful features to simplify the way you share links.
        </p>
        <div className="features-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title} className="feature-card">
                <CardHeader>
                  <div className="feature-icon-wrap">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="feature-card-title">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="feature-card-description">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="steps-section">
        <h2 className="section-title">How it works</h2>
        <p className="section-subtext">Three simple steps to get started.</p>
        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.number} className="step-item">
              <div className="step-number">{step.number}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <h2 className="cta-banner-title">Ready to shorten your first link?</h2>
        <p className="cta-banner-subtext">Join today and start sharing smarter.</p>
        <SignUpButton mode="modal">
          <Button size="lg" className="btn-primary">
            Create free account
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </SignUpButton>
      </section>
    </div>
  );
}
