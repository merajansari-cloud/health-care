import { Activity, Heart, Shield, Mail, Phone, FileText, HelpCircle } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="hidden md:block border-t bg-background/80 backdrop-blur-sm mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">MediAI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your personal AI health assistant. Track vitals, analyse symptoms, and stay on top of your wellbeing.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-secondary" />
              <span>HIPAA-compliant & end-to-end encrypted</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Links</p>
            <ul className="space-y-2">
              {[
                { label: "Dashboard", href: "/" },
                { label: "AI Chat", href: "/chat" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Support</p>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@mediai.health"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  support@mediai.health
                </a>
              </li>
              <li>
                <a
                  href="tel:+18005550000"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  +1 800 555 0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> by MediAI Team © {year}
          </p>
          <p className="text-xs text-muted-foreground text-center sm:text-right max-w-sm">
            MediAI is an AI assistant and does <span className="font-semibold">not</span> replace professional medical advice. Always consult a licensed physician.
          </p>
        </div>
      </div>
    </footer>
  );
}
