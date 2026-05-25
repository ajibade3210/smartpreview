"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Language } from "./language-selector";
import type { Variable } from "./variables-panel";

interface Template {
  id: string;
  name: string;
  description: string;
  language: Language;
  code: string;
  variables: Variable[];
  preview: string;
}

const TEMPLATES: Template[] = [
  {
    id: "landing-hero",
    name: "Landing Hero",
    description: "A stunning hero section with gradient background",
    language: "html",
    preview: "Hero",
    variables: [
      { key: "title", value: "Build Amazing Products" },
      { key: "subtitle", value: "The modern way to create beautiful web experiences" },
      { key: "cta", value: "Get Started" },
    ],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero {
      text-align: center;
      max-width: 800px;
      padding: 40px;
    }
    h1 {
      font-size: 4rem;
      font-weight: 800;
      background: linear-gradient(135deg, #4ade80, #22d3ee, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 24px;
      line-height: 1.1;
    }
    p {
      font-size: 1.25rem;
      color: rgba(255,255,255,0.7);
      margin-bottom: 40px;
      line-height: 1.6;
    }
    .btn {
      background: linear-gradient(135deg, #4ade80, #22d3ee);
      color: #0f0f23;
      border: none;
      padding: 16px 40px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 40px rgba(74, 222, 128, 0.3);
    }
  </style>
</head>
<body>
  <div class="hero">
    <h1>{{title}}</h1>
    <p>{{subtitle}}</p>
    <button class="btn">{{cta}}</button>
  </div>
</body>
</html>`,
  },
  {
    id: "pricing-card",
    name: "Pricing Card",
    description: "Modern pricing card with features list",
    language: "html",
    preview: "Pricing",
    variables: [
      { key: "plan", value: "Pro" },
      { key: "price", value: "29" },
      { key: "period", value: "month" },
    ],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      background: #0f0f1a;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 24px;
      padding: 40px;
      width: 100%;
      max-width: 360px;
      backdrop-filter: blur(10px);
    }
    .badge {
      display: inline-block;
      background: linear-gradient(135deg, #4ade80, #22d3ee);
      color: #0f0f1a;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .price {
      color: #fff;
      margin-bottom: 24px;
    }
    .price span {
      font-size: 4rem;
      font-weight: 800;
    }
    .price small {
      color: rgba(255,255,255,0.5);
      font-size: 1rem;
    }
    .features {
      list-style: none;
      margin-bottom: 32px;
    }
    .features li {
      color: rgba(255,255,255,0.8);
      padding: 12px 0;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .features li::before {
      content: "✓";
      color: #4ade80;
      font-weight: bold;
    }
    .btn {
      width: 100%;
      background: #fff;
      color: #0f0f1a;
      border: none;
      padding: 16px;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">{{plan}}</span>
    <div class="price">
      <span>\${{price}}</span>
      <small>/{{period}}</small>
    </div>
    <ul class="features">
      <li>Unlimited projects</li>
      <li>Priority support</li>
      <li>Advanced analytics</li>
      <li>Custom integrations</li>
    </ul>
    <button class="btn">Get Started</button>
  </div>
</body>
</html>`,
  },
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Beautiful contact form with validation styling",
    language: "html",
    preview: "Form",
    variables: [
      { key: "title", value: "Get in Touch" },
      { key: "subtitle", value: "We'd love to hear from you" },
    ],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .form-container {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 24px;
      padding: 48px;
      width: 100%;
      max-width: 480px;
    }
    h2 {
      color: #fff;
      font-size: 2rem;
      margin-bottom: 8px;
    }
    .subtitle {
      color: rgba(255,255,255,0.5);
      margin-bottom: 32px;
    }
    .field {
      margin-bottom: 20px;
    }
    label {
      display: block;
      color: rgba(255,255,255,0.7);
      font-size: 0.9rem;
      margin-bottom: 8px;
    }
    input, textarea {
      width: 100%;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 12px;
      padding: 14px 16px;
      color: #fff;
      font-size: 1rem;
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus, textarea:focus {
      border-color: #4ade80;
    }
    textarea {
      resize: vertical;
      min-height: 120px;
    }
    .btn {
      width: 100%;
      background: linear-gradient(135deg, #4ade80, #22d3ee);
      color: #1a1a2e;
      border: none;
      padding: 16px;
      font-size: 1rem;
      font-weight: 600;
      border-radius: 12px;
      cursor: pointer;
      margin-top: 12px;
    }
  </style>
</head>
<body>
  <div class="form-container">
    <h2>{{title}}</h2>
    <p class="subtitle">{{subtitle}}</p>
    <form>
      <div class="field">
        <label>Name</label>
        <input type="text" placeholder="John Doe">
      </div>
      <div class="field">
        <label>Email</label>
        <input type="email" placeholder="john@example.com">
      </div>
      <div class="field">
        <label>Message</label>
        <textarea placeholder="Your message..."></textarea>
      </div>
      <button type="submit" class="btn">Send Message</button>
    </form>
  </div>
</body>
</html>`,
  },
  {
    id: "pug-card",
    name: "Profile Card",
    description: "User profile card with Pug templating",
    language: "pug",
    preview: "Profile",
    variables: [
      { key: "name", value: "Jane Smith" },
      { key: "role", value: "Product Designer" },
      { key: "bio", value: "Creating beautiful digital experiences" },
    ],
    code: `doctype html
html(lang="en")
  head
    meta(charset="UTF-8")
    style.
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: system-ui, sans-serif;
        min-height: 100vh;
        background: linear-gradient(135deg, #1e1e3f 0%, #2d2d5a 100%);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .card {
        background: rgba(255,255,255,0.05);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 24px;
        padding: 40px;
        text-align: center;
        width: 320px;
      }
      .avatar {
        width: 100px;
        height: 100px;
        background: linear-gradient(135deg, #4ade80, #22d3ee);
        border-radius: 50%;
        margin: 0 auto 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.5rem;
        color: #1e1e3f;
        font-weight: bold;
      }
      h3 { color: #fff; font-size: 1.5rem; margin-bottom: 4px; }
      .role { color: #4ade80; font-size: 0.9rem; margin-bottom: 16px; }
      .bio { color: rgba(255,255,255,0.6); line-height: 1.6; }
  body
    .card
      .avatar= name.charAt(0)
      h3= name
      p.role= role
      p.bio= bio`,
  },
  {
    id: "hbs-list",
    name: "Feature List",
    description: "Feature showcase with Handlebars",
    language: "handlebars",
    preview: "Features",
    variables: [
      { key: "title", value: "Why Choose Us" },
      { key: "tagline", value: "Built for modern teams" },
    ],
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, sans-serif;
      min-height: 100vh;
      background: #0a0a1a;
      color: #fff;
      padding: 60px 20px;
    }
    .container { max-width: 800px; margin: 0 auto; }
    h2 {
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 8px;
      background: linear-gradient(90deg, #4ade80, #22d3ee);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .tagline {
      text-align: center;
      color: rgba(255,255,255,0.5);
      margin-bottom: 48px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    .feature {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
      padding: 28px;
    }
    .icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, rgba(74,222,128,0.2), rgba(34,211,238,0.2));
      border-radius: 12px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .feature h4 { margin-bottom: 8px; }
    .feature p { color: rgba(255,255,255,0.6); font-size: 0.9rem; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="container">
    <h2>{{title}}</h2>
    <p class="tagline">{{tagline}}</p>
    <div class="grid">
      <div class="feature">
        <div class="icon">⚡</div>
        <h4>Lightning Fast</h4>
        <p>Optimized for speed with instant compilation and live preview updates.</p>
      </div>
      <div class="feature">
        <div class="icon">🎨</div>
        <h4>Beautiful Design</h4>
        <p>Create stunning interfaces with our modern design system.</p>
      </div>
      <div class="feature">
        <div class="icon">🔒</div>
        <h4>Secure by Default</h4>
        <p>Enterprise-grade security built into every feature.</p>
      </div>
      <div class="feature">
        <div class="icon">🚀</div>
        <h4>Easy Deployment</h4>
        <p>One-click deployment to your favorite hosting platform.</p>
      </div>
    </div>
  </div>
</body>
</html>`,
  },
  {
    id: "jsx-counter",
    name: "Interactive Counter",
    description: "React counter with animations",
    language: "jsx",
    preview: "Counter",
    variables: [
      { key: "title", value: "React Counter" },
      { key: "startValue", value: "0" },
    ],
    code: `function App(props) {
  const { title = "React Counter", startValue = "0" } = props;
  const [count, setCount] = React.useState(parseInt(startValue) || 0);
  
  return (
    <div style={{
      fontFamily: 'system-ui, sans-serif',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        padding: '48px',
        textAlign: 'center',
      }}>
        <h1 style={{
          color: '#fff',
          fontSize: '1.5rem',
          marginBottom: '32px',
        }}>{title}</h1>
        <div style={{
          fontSize: '5rem',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '32px',
        }}>{count}</div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={() => setCount(c => c - 1)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.2)',
              background: 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '1.5rem',
              cursor: 'pointer',
            }}
          >−</button>
          <button
            onClick={() => setCount(0)}
            style={{
              padding: '0 24px',
              height: '56px',
              borderRadius: '16px',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >Reset</button>
          <button
            onClick={() => setCount(c => c + 1)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              border: 'none',
              background: 'linear-gradient(135deg, #4ade80, #22d3ee)',
              color: '#1a1a2e',
              fontSize: '1.5rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >+</button>
        </div>
      </div>
    </div>
  );
}`,
  },
];

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: Template) => void;
}

export function TemplateGallery({
  open,
  onOpenChange,
  onSelectTemplate,
}: TemplateGalleryProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Template Gallery</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid grid-cols-2 gap-4">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template);
                  onOpenChange(false);
                }}
                className="group relative flex flex-col items-start rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:bg-accent"
              >
                <div className="mb-3 flex h-24 w-full items-center justify-center rounded-lg bg-muted">
                  <span className="text-3xl font-bold text-muted-foreground/50">
                    {template.preview}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">
                    {template.name}
                  </h3>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {template.language.toUpperCase()}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {template.description}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export type { Template };
