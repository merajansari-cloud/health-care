# MediAI — Frontend Blueprint Report
> Deep scan & reverse engineering report | Generated: April 2026

---

## 1. PROJECT OVERVIEW

| Field | Value |
|---|---|
| **App Name** | MediAI |
| **Type** | Healthcare AI Assistant Web App |
| **Architecture** | pnpm Monorepo (Full-Stack) |
| **Frontend Path** | `artifacts/healthcare-ai/` |
| **Backend Path** | `artifacts/api-server/` |
| **Entry File** | `src/main.tsx` |
| **Root Component** | `src/App.tsx` |
| **Port (Dev)** | 22564 |
| **Base URL** | `/` (root path) |

---

## 2. TECH STACK

| Category | Library / Tool | Version |
|---|---|---|
| **Framework** | React | 19 (catalog) |
| **Build Tool** | Vite | 7.x (catalog) |
| **Language** | TypeScript | strict mode |
| **Styling** | Tailwind CSS v4 | catalog |
| **Routing** | Wouter | ^3.3.5 |
| **State / Server** | TanStack React Query | catalog |
| **UI Components** | Radix UI (headless) | full suite |
| **Icons** | Lucide React | catalog |
| **Animation** | Framer Motion | catalog |
| **Charts** | Recharts | ^2.15.2 |
| **Forms** | React Hook Form + Zod | latest |
| **Theme** | Custom ThemeProvider (localStorage) | — |
| **Toasts** | Radix Toast + Sonner | — |
| **CSS Animations** | tw-animate-css | ^1.4.0 |

---

## 3. ROUTING MAP

Router: **Wouter** with `<Switch>` + `<Route>`  
Base: `import.meta.env.BASE_URL` (trailing slash removed)  
All routes wrapped in `<MainLayout>`

```
/           →  Dashboard.tsx     (Disease Prediction Tool)
/chat       →  Chat.tsx          (AI Health Chat)
*           →  not-found.tsx     (404 Fallback)
```

### Route Details

| Route | Component | Purpose | Auth Required |
|---|---|---|---|
| `/` | `Dashboard` | Disease Prediction: symptom selector + match engine | No |
| `/chat` | `Chat` | AI conversation interface for symptom discussion | No |
| `*` (wildcard) | `NotFound` | 404 error page | No |

---

## 4. PAGE-BY-PAGE ANALYSIS

---

### PAGE 1: Dashboard — Disease Prediction
**File:** `src/pages/Dashboard.tsx`  
**Route:** `/`  
**Purpose:** Lets users select symptoms and predicts likely diseases using a frontend scoring algorithm.

#### Sections / UI Blocks
| Section | Description |
|---|---|
| **Page Header** | Title "Disease Prediction" + subtitle + flask icon |
| **Step 1 Card** | Symptom selector card |
| ↳ Search Input | Searchable dropdown from 45+ symptoms |
| ↳ Dropdown List | Filtered suggestions appear while typing |
| ↳ Quick-pick Chips | 12 common symptoms as one-click buttons (Fever, Headache, Cough, etc.) |
| ↳ Selected Tags | Chosen symptoms shown as removable badge pills |
| **Action Row** | "Predict Disease" button + "Clear All" button |
| **Step 2 Results** | Accordion-style result cards (max 5) |
| ↳ Result Card | Disease name, match %, severity badge, expand/collapse toggle |
| ↳ Expanded Detail | Description, matched vs. unmatched symptoms, recommendation box, specialist name |
| **Disclaimer** | Medical advice disclaimer at bottom |

#### State Variables
| Variable | Type | Purpose |
|---|---|---|
| `search` | `string` | Controls search input value |
| `selected` | `string[]` | List of selected symptoms |
| `results` | `PredictionResult[] \| null` | Prediction output (null = not yet run) |
| `expanded` | `string \| null` | Which result card is open |

#### Prediction Algorithm (Frontend-only)
1. For each of 17 diseases, count how many selected symptoms match its symptom list
2. Calculate `matchPercent = (matchCount / disease.symptoms.length) * 100`
3. Filter: only include diseases with `matchCount >= 2`
4. Sort: by `matchPercent` descending, then `matchCount`
5. Return top 5 results

#### Disease Database (built-in, no API)
17 diseases mapped with symptoms, severity, recommendation, specialist:
Common Cold, Flu, COVID-19, Pneumonia, Dengue Fever, Typhoid Fever, Malaria, Gastroenteritis, Strep Throat, Sinusitis, Anemia, Hypertension, Diabetes (Type 2), Bronchitis, Migraine, UTI, Allergic Rhinitis

#### Severity Levels
- 🟢 `mild` — Green styling (emerald)
- 🟡 `moderate` — Yellow/amber styling
- 🔴 `severe` — Red/rose styling

#### Key Interactions
| Action | Trigger | Result |
|---|---|---|
| Type in search | `onChange` on Input | Filters symptom dropdown |
| Click symptom in dropdown | `onClick` | Adds to `selected`, clears search |
| Click quick-chip | `onClick` | Adds to `selected` |
| Click `×` on badge | `onClick` | Removes from `selected`, resets results |
| Click "Predict Disease" | `onClick` | Runs scoring algorithm, sets `results` |
| Click "Clear All" | `onClick` | Resets all state |
| Click result card header | `onClick` | Toggles `expanded` (accordion) |

---

### PAGE 2: Chat — AI Health Conversation
**File:** `src/pages/Chat.tsx`  
**Route:** `/chat`  
**Purpose:** Conversational UI where users describe symptoms and receive AI-style responses.

> ⚠️ Current backend connection: **Not connected** — responses are simulated via `setTimeout`. Real AI integration not yet wired.

#### Sections / UI Blocks
| Section | Description |
|---|---|
| **Chat Header** | MediAI avatar + name + "Online" status dot with pulse animation |
| **Messages Area** | Scrollable list of user/AI message bubbles |
| ↳ User Bubble | Right-aligned, primary color background |
| ↳ AI Bubble | Left-aligned, muted background with border |
| ↳ Typing Indicator | 3-dot bounce animation while AI "responds" |
| **Suggestion Chips** | Horizontal scrollable row: fever, headache, cough, fatigue, chest pain |
| **Input Area** | Attach button + text input + mic button + send button |
| **Footer Disclaimer** | "MediAI may produce inaccurate information…" |

#### Pre-loaded Conversation (initial messages)
8 messages already loaded showing a sample headache/fever consultation:
1. User: "I've been having a headache and mild fever since yesterday"
2. AI: Asks for severity scale + temperature
3. User: "Headache 6/10, Temperature 38.2°C"
4. AI: Asks about other symptoms
5. User: Confirms body aches and fatigue
6. AI: Suggests viral illness / influenza
7. User: "Should I see a doctor?"
8. AI: Gives when-to-see-doctor criteria

#### State Variables
| Variable | Type | Purpose |
|---|---|---|
| `messages` | `Message[]` | All chat messages (user + ai) |
| `input` | `string` | Current text in input box |
| `isTyping` | `boolean` | Shows typing indicator |
| `isRecording` | `boolean` | Mic button toggle state |

#### Key Interactions
| Action | Trigger | Result |
|---|---|---|
| Type message | `onChange` on Input | Updates `input` |
| Press Enter | `onKeyDown` | Calls `handleSend()` |
| Click Send | `onClick` | Calls `handleSend()` |
| Click suggestion chip | `onClick` | Appends symptom text to `input` |
| Click Mic button | `onClick` | Toggles `isRecording` (UI only — no real recording) |
| Click Attach button | `onClick` | No action (placeholder) |
| Auto-scroll | `useEffect` on messages | Scrolls to bottom on new message |

#### AI Response Logic (current — simulated)
```
handleSend() → adds user message → sets isTyping=true →
  setTimeout 1500ms → sets isTyping=false → adds fixed AI reply
```

---

### PAGE 3: 404 Not Found
**File:** `src/pages/not-found.tsx`  
**Route:** `*` (any unmatched path)  
**Purpose:** Catch-all fallback for invalid URLs.

| Element | Detail |
|---|---|
| Layout | Centered card on gray background |
| Icon | Red `AlertCircle` |
| Title | "404 Page Not Found" |
| Message | "Did you forget to add the page to the router?" |
| Navigation | No back button or link (user must use browser back) |

---

## 5. LAYOUT SYSTEM

### MainLayout (`src/layouts/MainLayout.tsx`)
Wraps every page. Provides consistent shell.

```
┌─────────────────────────────────────────────────────┐
│  Navbar (sticky top, full width)                    │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  AppSidebar  │  <main>                              │
│  (desktop    │    {page content}                    │
│   only)      │    <Footer /> (desktop only)         │
│              │                                      │
├──────────────┴──────────────────────────────────────┤
│  Mobile Bottom Nav (fixed, mobile only)             │
└─────────────────────────────────────────────────────┘
```

| Zone | Visibility | Component |
|---|---|---|
| Navbar | Always (all screen sizes) | `Navbar.tsx` |
| Sidebar | Desktop only (`md:block`, hidden on mobile) | `Sidebar.tsx` |
| Mobile Bottom Nav | Mobile only (`md:hidden`, fixed bottom) | Inline in `MainLayout.tsx` |
| Footer | Desktop only (`hidden md:block`) | `Footer.tsx` |

---

## 6. NAVIGATION STRUCTURE

### Navigation Items (both Sidebar + Mobile Bottom Nav)
| Label | Route | Icon |
|---|---|---|
| Dashboard | `/` | `LayoutDashboard` |
| Chat | `/chat` | `MessageCircle` |

### Active State
- Uses `useLocation()` from Wouter
- Active item: `location === item.url` → applies `text-primary` / `isActive` prop
- Sidebar uses Radix `SidebarMenuButton isActive` prop
- Mobile nav uses conditional className

---

## 7. COMPONENTS INVENTORY

### Custom Components (non-UI)

| File | Component | Purpose |
|---|---|---|
| `components/Navbar.tsx` | `Navbar` | Top bar: logo, theme toggle, avatar |
| `components/Sidebar.tsx` | `AppSidebar` | Left desktop navigation |
| `components/Footer.tsx` | `Footer` | Bottom info bar (desktop only) |
| `layouts/MainLayout.tsx` | `MainLayout` | Page shell + mobile nav |
| `context/ThemeProvider.tsx` | `ThemeProvider` | Dark/light theme context |

### Navbar Features
| Element | Detail |
|---|---|
| Logo | Cross icon + "MediAI" text (hidden on xs screens) |
| Sidebar Trigger | Hamburger menu (`Menu` icon), visible on `lg:hidden` |
| Theme Toggle | Moon/Sun icon button, calls `toggleTheme()` |
| User Avatar | "AJ" initials, hardcoded, no auth |

### Footer Sections
| Section | Content |
|---|---|
| Brand | MediAI logo + description + HIPAA badge |
| Quick Links | Dashboard, AI Chat (wouter `<Link>`) |
| Support | Help Center, Privacy Policy, Terms, email, phone (all `href="#"` — not wired) |
| Bottom bar | Copyright + medical disclaimer |

---

## 8. CONTEXT & STATE MANAGEMENT

| Context | File | Provides | Persists |
|---|---|---|---|
| `ThemeContext` | `context/ThemeProvider.tsx` | `theme`, `toggleTheme` | `localStorage["theme"]` |
| `QueryClientProvider` | `App.tsx` (TanStack) | API caching layer | In-memory (per session) |
| `TooltipProvider` | `App.tsx` (Radix) | Tooltip context | — |
| `SidebarProvider` | `MainLayout.tsx` (Radix) | Sidebar open/close state | — |

**No global user auth context** — user is hardcoded as "AJ".

---

## 9. THEMING SYSTEM

| Detail | Value |
|---|---|
| System | Custom React context + Tailwind dark mode class |
| Toggle | Navbar button → `toggleTheme()` |
| Storage | `localStorage` key: `"theme"` |
| Default | Follows OS `prefers-color-scheme` |
| Modes | `"light"` / `"dark"` |
| Apply Method | Adds `light` or `dark` class to `<html>` element |

---

## 10. UI COMPONENT LIBRARY

Located in `src/components/ui/` — **Radix UI + Tailwind** (shadcn/ui style).

Full list of available UI primitives:
`accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `button-group`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `empty`, `field`, `form`, `hover-card`, `input`, `input-group`, `input-otp`, `item`, `kbd`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `spinner`, `switch`, `table`, `tabs`, `textarea`, `toast`, `toaster`, `toggle`, `toggle-group`, `tooltip`

---

## 11. HOOKS

| Hook | File | Purpose |
|---|---|---|
| `useTheme()` | `context/ThemeProvider.tsx` | Access theme + toggle |
| `useMobile()` | `hooks/use-mobile.tsx` | Detect mobile viewport (768px breakpoint) |
| `useLocation()` | Wouter (external) | Current URL path for active nav state |
| `useSidebar()` | `ui/sidebar.tsx` | Control sidebar open/close state |

---

## 12. MISSING / INCOMPLETE FEATURES

| Feature | Status | Notes |
|---|---|---|
| Real AI chat backend | ❌ Not connected | Chat uses `setTimeout` simulation |
| User authentication | ❌ Not implemented | Avatar shows hardcoded "AJ" initials |
| Mic recording | ❌ UI only | Toggle state but no Web Speech API |
| File attach | ❌ UI only | Button exists, no handler |
| Help Center link | ❌ Placeholder | `href="#"` — not wired |
| Privacy / Terms | ❌ Placeholder | `href="#"` — no actual pages |
| Disease data persistence | ❌ None | Prediction resets on page reload |
| User profile | ❌ Not present | Previously existed, was removed |

---

## 13. FILE TREE (Frontend)

```
artifacts/healthcare-ai/
├── src/
│   ├── main.tsx                        ← App entry point
│   ├── App.tsx                         ← Router + Providers
│   ├── index.css                       ← Global styles + Tailwind
│   ├── pages/
│   │   ├── Dashboard.tsx               ← / (Disease Prediction)
│   │   ├── Chat.tsx                    ← /chat (AI Conversation)
│   │   └── not-found.tsx               ← * (404 page)
│   ├── layouts/
│   │   └── MainLayout.tsx              ← Shell: sidebar + navbar + mobile nav
│   ├── components/
│   │   ├── Navbar.tsx                  ← Top navigation bar
│   │   ├── Sidebar.tsx                 ← Desktop sidebar
│   │   ├── Footer.tsx                  ← Desktop footer
│   │   └── ui/                         ← 50+ Radix/shadcn primitives
│   ├── context/
│   │   └── ThemeProvider.tsx           ← Dark/light mode context
│   └── hooks/
│       └── use-mobile.tsx              ← Viewport size hook
├── package.json                        ← Dependencies
├── vite.config.ts                      ← Vite + Tailwind config
└── .replit-artifact/artifact.toml      ← Replit artifact config (port 22564)
```

---

## 14. SUMMARY TABLE

| Item | Count / Detail |
|---|---|
| Total Pages | 3 (Dashboard, Chat, 404) |
| Active Routes | 2 real pages + 1 fallback |
| Navigation Items | 2 (Dashboard, Chat) |
| Custom Components | 5 (Navbar, Sidebar, Footer, MainLayout, ThemeProvider) |
| UI Primitives | 50+ (Radix/shadcn) |
| Disease Database | 17 diseases, 45+ symptoms |
| State Contexts | 4 (Theme, QueryClient, Tooltip, Sidebar) |
| Pages with real logic | 1 (Dashboard — prediction algorithm) |
| Pages with simulated logic | 1 (Chat — fake AI timeout) |
| Backend integration | ❌ None active on frontend |
| Auth | ❌ None (hardcoded user "AJ") |
| Mobile support | ✅ Responsive (bottom nav on mobile) |
| Dark mode | ✅ Full (localStorage persisted) |

---

*Report generated by deep frontend scan of MediAI — `artifacts/healthcare-ai/`*
