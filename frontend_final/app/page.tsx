"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  Bolt,
  Building2,
  CheckCircle2,
  ChevronRight,
  Download,
  FileBarChart,
  Gauge,
  Home,
  KeyRound,
  LineChart,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Network,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  UserPlus,
  Waves,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart as ReLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BACKEND_URL = "https://voltsizer.onrender.com";
const AUTH_STORAGE_KEY = "voltsizer-auth-user";
const FORM_STORAGE_KEY = "voltsizer-form";
const RESULT_STORAGE_KEY = "voltsizer-latest-result";
const PROJECTS_STORAGE_KEY = "voltsizer-projects";

const DEMO_USERS = [
  { name: "Emmanuel", email: "emmanuel@voltsizer.local", password: "volt123" },
  { name: "Charles", email: "charles@voltsizer.local", password: "volt123" },
];

const BOTSWANA_LOCATIONS = [
  "Gaborone",
  "Francistown",
  "Jwaneng",
  "Selebi-Phikwe",
  "Orapa",
  "Lobatse",
  "Kasane",
  "Mahalapye",
  "Palapye",
  "Molepolole",
  "Serowe",
  "Maun",
  "Kanye",
  "Mochudi",
  "Ramotswa",
  "Tlokweng",
  "Letlhakane",
  "Thamaga",
  "Mogoditshane",
  "Tonota",
  "Bobonong",
  "Shoshong",
  "Tutume",
  "Gantsi",
  "Masunga",
  "Moshupa",
  "Gabane",
  "Otse",
  "Mmopane",
  "Rakops",
  "Tsabong",
  "Nata",
  "Letlhakeng",
  "Goodhope",
  "Hukuntsi",
  "Gumare",
  "Nkange",
  "Mmathubudukwane",
  "Maitengwe",
  "Mopipi",
];

const heroMetrics = [
  { label: "Planning context", value: "Botswana residential loads" },
  { label: "Diversity outputs", value: "ADMD, DF, CF" },
  { label: "Final decision", value: "Transformer kVA selection" },
];

const loadProfileData = [
  { hour: "00", profile: 0.22, diversified: 0.18 },
  { hour: "03", profile: 0.18, diversified: 0.16 },
  { hour: "06", profile: 0.28, diversified: 0.24 },
  { hour: "09", profile: 0.36, diversified: 0.29 },
  { hour: "12", profile: 0.48, diversified: 0.37 },
  { hour: "15", profile: 0.62, diversified: 0.47 },
  { hour: "18", profile: 0.71, diversified: 0.53 },
  { hour: "21", profile: 0.39, diversified: 0.31 },
];

const lookupData = [
  { n: 5, admd: 2.16, df: 1.28, cf: 0.78 },
  { n: 10, admd: 1.87, df: 1.46, cf: 0.68 },
  { n: 20, admd: 1.61, df: 1.7, cf: 0.59 },
  { n: 50, admd: 1.33, df: 2.04, cf: 0.49 },
  { n: 100, admd: 1.21, df: 2.22, cf: 0.45 },
  { n: 240, admd: 1.08, df: 2.55, cf: 0.39 },
];

type TrendPoint = {
  N: number;
  ADMD_kW_per_unit: number;
  DF: number;
  CF: number;
};

type SizingResult = {
  place: string;
  region_type: string;
  residential_units: number;
  residential_units_per_phase: number;
  diversity_lookup_units_per_phase: number;
  peak_lookup_units_total: number;
  ADMD_kW_per_unit: number;
  DF: number;
  CF: number;
  max_total_peak_kW: number;
  group_peak_kW: number;
  required_kVA: number;
  design_kVA: number;
  selected_transformer_kVA: number;
  phase_balance_note: string;
  trend_points?: TrendPoint[];
};

type ProjectFormState = {
  projectName: string;
  place: string;
  residentialUnits: string;
  powerFactor: string;
  margin: string;
};

type SavedProject = {
  id: string;
  projectName: string;
  place: string;
  residentialUnits: number;
  powerFactor: number;
  margin: number;
  result: SizingResult | null;
  status: string;
  recommendation: string;
  lastUpdated: string;
};

type AuthUser = {
  name: string;
  email: string;
};

const defaultForm: ProjectFormState = {
  projectName: "",
  place: "Gaborone",
  residentialUnits: "50",
  powerFactor: "0.9",
  margin: "0.2",
};

function VoltSizerLogo({ compact = false, dark = false }: { compact?: boolean; dark?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex h-11 w-11 items-center justify-center rounded-xl ${dark ? "bg-white text-slate-950" : "bg-slate-950 text-white"} shadow-lg`}>
        <Bolt className="h-5 w-5" />
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-cyan-400 ring-2 ring-white" />
      </div>
      {!compact && (
        <div>
          <p className={`text-lg font-bold tracking-tight ${dark ? "text-white" : "text-slate-950"}`}>VoltSizer</p>
          <p className={`text-xs font-medium ${dark ? "text-slate-300" : "text-slate-500"}`}>Residential transformer sizing</p>
        </div>
      )}
    </div>
  );
}

function TransformerIllustration() {
  return (
    <div className="relative min-h-[410px] overflow-hidden rounded-[28px] border border-white/15 bg-slate-950 p-6 text-white shadow-2xl">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(14,165,233,0.22),transparent_38%),linear-gradient(315deg,rgba(16,185,129,0.18),transparent_42%)]" />
      <div className="relative z-10 grid h-full gap-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-200">Distribution model</p>
            <h3 className="mt-1 text-2xl font-bold">11 kV / 400 V residential supply</h3>
          </div>
          <Badge className="rounded-full bg-emerald-400/15 text-emerald-200">Sizing ready</Badge>
        </div>
        <div className="grid flex-1 items-center gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/10 p-5">
              <div className="mx-auto flex h-28 w-24 flex-col items-center justify-center rounded-xl border border-cyan-300/60 bg-cyan-300/10">
                <Bolt className="h-8 w-8 text-cyan-200" />
                <div className="mt-3 h-2 w-14 rounded-full bg-cyan-200/70" />
                <div className="mt-2 h-2 w-10 rounded-full bg-emerald-200/70" />
              </div>
              <p className="mt-4 text-center text-sm text-slate-300">Selected transformer capacity</p>
              <p className="text-center text-2xl font-bold">100 kVA</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {["A", "B", "C"].map((phase) => (
                <div key={phase} className="rounded-xl border border-white/10 bg-white/10 p-2">
                  <p className="font-semibold text-cyan-100">Phase {phase}</p>
                  <p className="text-slate-300">balanced</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="h-48 rounded-2xl border border-white/10 bg-white/5 p-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={loadProfileData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
                  <XAxis dataKey="hour" stroke="#cbd5e1" />
                  <YAxis stroke="#cbd5e1" />
                  <Tooltip />
                  <Area type="monotone" dataKey="profile" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="diversified" stroke="#34d399" fill="#34d399" fillOpacity={0.16} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <HouseCluster count={9} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HouseCluster({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-lg border border-white/10 bg-white/10 p-2">
          <div className="mx-auto h-5 w-7 rounded-t-md bg-cyan-200/80" />
          <div className="mx-auto h-4 w-9 rounded-b-sm bg-white/80" />
        </div>
      ))}
    </div>
  );
}

function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(14,165,233,0.20),transparent_32%),linear-gradient(270deg,rgba(16,185,129,0.16),transparent_42%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-7">
          <nav className="flex items-center justify-between">
            <VoltSizerLogo dark />
            <Button variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10" onClick={onEnter}>
              Sign in
            </Button>
          </nav>
          <div className="grid gap-10 pb-14 pt-16 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:pt-20">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="space-y-7">
              <Badge className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1 text-cyan-100">
                Botswana residential load diversity analysis
              </Badge>
              <div className="space-y-5">
                <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight lg:text-7xl">VoltSizer</h1>
                <p className="max-w-2xl text-xl font-medium text-slate-200">
                  Engineering software for residential load modelling, diversity analysis, and distribution transformer sizing.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="rounded-xl bg-cyan-400 px-6 text-slate-950 hover:bg-cyan-300" onClick={onEnter}>
                  Open workspace <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Badge variant="outline" className="rounded-xl border-white/20 px-4 py-2 text-slate-200">
                  Browser-installed web application ready
                </Badge>
              </div>
              <div className="grid max-w-3xl gap-3 sm:grid-cols-3">
                {heroMetrics.map((metric) => (
                  <Card key={metric.label} className="rounded-2xl border-white/10 bg-white/10 text-white shadow-xl">
                    <CardContent className="p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-300">{metric.label}</p>
                      <p className="mt-2 text-lg font-bold">{metric.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
              <TransformerIllustration />
            </motion.div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-6 py-8 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Residential modelling", description: "Structure household demand for estate and neighbourhood planning.", icon: Home },
          { title: "Diversity lookup", description: "Present ADMD, DF and CF trends with clear engineering context.", icon: Waves },
          { title: "Three-phase planning", description: "Show phase distribution and per-phase demand assumptions.", icon: Network },
          { title: "Transformer decision", description: "Convert diversified demand to a clear kVA recommendation.", icon: Gauge },
        ].map((step) => (
          <Card key={step.title} className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-cyan-200">
                <step.icon className="h-5 w-5" />
              </div>
              <CardTitle>{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </div>
  );
}

function AuthPanel({ onLogin, onBack }: { onLogin: (user: AuthUser) => void; onBack: () => void }) {
  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [email, setEmail] = useState("emmanuel@voltsizer.local");
  const [password, setPassword] = useState("volt123");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");

  function handleForgotPassword() {
    setResetMessage("A reset link has been sent if this account exists.");
  }

  function handleSignIn() {
    const account = DEMO_USERS.find((user) => user.email.toLowerCase() === email.trim().toLowerCase());
    if (!account || account.password !== password) {
      setAuthMessage({ type: "error", text: "Incorrect email or password. Try Emmanuel or Charles with password volt123." });
      return;
    }
    setAuthMessage({ type: "success", text: `Correct password. Opening ${account.name}'s workspace.` });
    onLogin({ name: account.name, email: account.email });
  }

  function handleCreateAccount() {
    const name = signupName.trim() || "Demo User";
    const targetEmail = signupEmail.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@voltsizer.local`;
    onLogin({ name, email: targetEmail });
  }

  return (
    <div className="min-h-screen bg-slate-100 p-5">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-7xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl lg:grid-cols-[1fr_0.9fr]">
        <div className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(14,165,233,0.22),transparent_38%),linear-gradient(300deg,rgba(16,185,129,0.18),transparent_40%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="space-y-12">
              <VoltSizerLogo dark />
              <div className="max-w-xl space-y-4">
                <h2 className="text-4xl font-bold tracking-tight">Secure access for engineering project workspaces.</h2>
                <p className="text-slate-300">Demo authentication separates Emmanuel's and Charles's project lists while keeping backend calculations untouched.</p>
              </div>
            </div>
            <Card className="rounded-2xl border-white/10 bg-white/10 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-300" /> Demo accounts</CardTitle>
                <CardDescription className="text-slate-300">Use password volt123 for either account.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                {DEMO_USERS.map((user) => (
                  <button key={user.email} onClick={() => setEmail(user.email)} className="rounded-xl border border-white/10 bg-white/5 p-3 text-left hover:bg-white/10">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-slate-300">{user.email}</p>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 lg:p-12">
          <Card className="w-full max-w-xl border-0 shadow-none">
            <div className="px-6 pt-6 lg:px-8">
              <Button variant="outline" className="rounded-xl" onClick={onBack}>Back</Button>
            </div>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>
              <CardDescription>Sign in to continue transformer sizing and project review.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-xl">
                  <TabsTrigger value="signin" className="gap-2 rounded-xl"><Lock className="h-4 w-4" /> Sign in</TabsTrigger>
                  <TabsTrigger value="signup" className="gap-2 rounded-xl"><UserPlus className="h-4 w-4" /> Create account</TabsTrigger>
                </TabsList>
                <TabsContent value="signin" className="mt-6 space-y-5">
                  <div className="space-y-2">
                    <Label>Email or username</Label>
                    <Input type="email" className="rounded-xl" value={email} onChange={(event) => setEmail(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" className="rounded-xl" value={password} onChange={(event) => setPassword(event.target.value)} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span className="flex items-center gap-2"><KeyRound className="h-4 w-4" /> Protected demo workspace</span>
                    <button className="font-semibold text-slate-800" onClick={handleForgotPassword}>Forgot password?</button>
                  </div>
                  {resetMessage && <div className="rounded-xl bg-sky-50 px-4 py-3 text-sm font-medium text-sky-800">{resetMessage}</div>}
                  {authMessage && (
                    <div className={`rounded-xl px-4 py-3 text-sm font-medium ${authMessage.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                      {authMessage.text}
                    </div>
                  )}
                  <Button className="w-full rounded-xl bg-slate-950" size="lg" onClick={handleSignIn}>Enter dashboard</Button>
                </TabsContent>
                <TabsContent value="signup" className="mt-6 space-y-5">
                  <div className="space-y-2"><Label>Full name</Label><Input placeholder="Project engineer" className="rounded-xl" value={signupName} onChange={(event) => setSignupName(event.target.value)} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="engineer@company.com" className="rounded-xl" value={signupEmail} onChange={(event) => setSignupEmail(event.target.value)} /></div>
                  <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="Create a demo password" className="rounded-xl" /></div>
                  <Button className="w-full rounded-xl bg-slate-950" size="lg" onClick={handleCreateAccount}>Create workspace</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ current, setCurrent, onLogout, user }: { current: string; setCurrent: (value: string) => void; onLogout: () => void; user: AuthUser }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "projects", label: "Projects", icon: FileBarChart },
    { id: "workflow", label: "Workflow", icon: SlidersHorizontal },
    { id: "results", label: "Results", icon: LineChart },
  ];

  return (
    <aside className="flex h-full flex-col gap-5 border-r border-slate-200 bg-white p-4">
      <div className="rounded-2xl bg-slate-950 p-4 text-white">
        <VoltSizerLogo dark />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Signed in</p>
        <p className="mt-1 font-bold text-slate-950">{user.name}</p>
        <p className="truncate text-xs text-slate-500">{user.email}</p>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrent(item.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${current === item.id ? "bg-slate-950 text-white shadow-sm" : "text-slate-700 hover:bg-slate-100"}`}
          >
            <item.icon className="h-4 w-4" />
            <span className="font-semibold">{item.label}</span>
          </button>
        ))}
      </div>
      <Button variant="outline" className="mt-auto rounded-xl" onClick={onLogout}>
        <LogOut className="mr-2 h-4 w-4" /> Logout
      </Button>
    </aside>
  );
}

function DashboardPage({ latestResult, recentProjects, onOpenProject, onNewProject, user }: {
  latestResult: SizingResult | null;
  recentProjects: SavedProject[];
  onOpenProject: (project: SavedProject) => void;
  onNewProject: () => void;
  user: AuthUser;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Badge className="mb-3 rounded-full bg-cyan-50 text-cyan-800">Engineering workspace</Badge>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-slate-600">{user.name}'s recent residential transformer sizing projects.</p>
        </div>
        <Button className="rounded-xl bg-slate-950" onClick={onNewProject}>New project</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Saved projects" value={String(recentProjects.length)} sub="User-specific list" icon={FileBarChart} />
        <StatCard label="Project classes" value="City, Town, Village" sub="Botswana planning context" icon={MapPin} />
        <StatCard label="Suggested transformer" value={latestResult ? `${latestResult.selected_transformer_kVA.toFixed(0)} kVA` : "Awaiting run"} sub={latestResult ? `${latestResult.place} latest result` : "Run analysis to update"} icon={Gauge} />
        <StatCard label="Validation" value={latestResult ? getLoadingStatusText(getLoadingPercent(latestResult)) : "Draft"} sub="Transformer loading status" icon={ShieldCheck} />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Residential Load Profile Preview</CardTitle>
            <CardDescription>Sample maximum demand curve compared with diversified demand.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={loadProfileData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="profile" stroke="#0284c7" fill="#0284c7" fillOpacity={0.18} name="Raw peak" />
                <Area type="monotone" dataKey="diversified" stroke="#059669" fill="#059669" fillOpacity={0.16} name="Diversified" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Visible project queue with status and selected transformer size.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentProjects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-medium text-slate-600">No saved projects yet.</div>
            ) : (
              recentProjects.slice(0, 4).map((project) => (
                <button key={project.id} onClick={() => onOpenProject(project)} className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-cyan-300 hover:bg-cyan-50/40">
                  <div>
                    <p className="font-bold text-slate-950">{project.projectName || `${project.place} Project`}</p>
                    <p className="text-sm font-medium text-slate-600">{project.place} | N={project.residentialUnits} | {project.result ? `${project.result.selected_transformer_kVA.toFixed(0)} kVA transformer` : "Draft"}</p>
                    <p className="text-xs text-slate-500">Updated {formatDate(project.lastUpdated)}</p>
                  </div>
                  <Badge className="rounded-full bg-slate-950 text-white">{project.status}</Badge>
                </button>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon }: { label: string; value: string; sub: string; icon: any }) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold leading-tight text-slate-950">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{sub}</p>
        </div>
        <div className="rounded-xl bg-cyan-50 p-3 text-cyan-700">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectsPage({ form, setForm, onRunAnalysis, onSaveProject, loading, error }: {
  form: ProjectFormState;
  setForm: React.Dispatch<React.SetStateAction<ProjectFormState>>;
  onRunAnalysis: () => void;
  onSaveProject: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-slate-600">Set the location, residential units, power factor, and margin before running the sizing engine.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Project Setup</CardTitle>
            <CardDescription>Inputs are sent to the existing backend sizing endpoint without changing the payload.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Project name</Label>
              <Input className="rounded-xl" placeholder="North Gaborone residential cluster" value={form.projectName} onChange={(event) => setForm((prev) => ({ ...prev, projectName: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Place</Label>
              <Select value={form.place} onValueChange={(value) => setForm((prev) => ({ ...prev, place: value }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {BOTSWANA_LOCATIONS.map((location) => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2"><Label>Residential units</Label><Input className="rounded-xl" placeholder="50" value={form.residentialUnits} onChange={(event) => setForm((prev) => ({ ...prev, residentialUnits: event.target.value }))} /></div>
              <div className="space-y-2"><Label>Power factor</Label><Input className="rounded-xl" placeholder="0.9" value={form.powerFactor} onChange={(event) => setForm((prev) => ({ ...prev, powerFactor: event.target.value }))} /></div>
              <div className="space-y-2"><Label>Margin</Label><Input className="rounded-xl" placeholder="0.2" value={form.margin} onChange={(event) => setForm((prev) => ({ ...prev, margin: event.target.value }))} /></div>
            </div>
            {error && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              <Button className="w-full rounded-xl bg-slate-950" onClick={onRunAnalysis} disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running...</> : "Run Analysis"}
              </Button>
              <Button variant="outline" className="w-full rounded-xl" onClick={onSaveProject}>
                <Save className="mr-2 h-4 w-4" /> Save project
              </Button>
            </div>
          </CardContent>
        </Card>
        <WorkflowPreview />
      </div>
    </div>
  );
}

function WorkflowPreview() {
  const steps = ["Input details", "Select location", "Retrieve diversity", "Estimate demand", "Convert to kVA", "Select transformer"];
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Workflow Preview</CardTitle>
        <CardDescription>Engineering sequence from project input to transformer recommendation.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">{index + 1}</div>
            <p className="font-semibold text-slate-800">{step}</p>
            {index < steps.length - 1 && <ChevronRight className="ml-auto h-4 w-4 text-slate-400" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function WorkflowPage() {
  const workflow = [
    { icon: FileBarChart, title: "Input project details", detail: "Project name, place, residential unit count, power factor, and design margin." },
    { icon: MapPin, title: "Select location category", detail: "Use Botswana place selection to drive the existing backend lookup." },
    { icon: BarChart3, title: "Retrieve diversity values", detail: "ADMD, DF, and CF are returned by the sizing engine." },
    { icon: TrendingDown, title: "Estimate diversified demand", detail: "Peak demand is reduced through diversity and coincidence behaviour." },
    { icon: Gauge, title: "Convert to kVA", detail: "Required and design transformer sizes are presented in kVA." },
    { icon: ShieldCheck, title: "Show recommendation", detail: "Loading status and transformer recommendation are made presentation-ready." },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Workflow</h1>
        <p className="text-slate-600">A polished view of the residential transformer sizing process.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {workflow.map((item, index) => (
          <Card key={item.title} className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-cyan-200"><item.icon className="h-5 w-5" /></div>
                <Badge variant="outline" className="rounded-full">Step {index + 1}</Badge>
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.detail}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ResultsPage({ result }: { result: SizingResult | null }) {
  const loadingPercent = result ? getLoadingPercent(result) : null;
  const loadingStatus = loadingPercent !== null ? getLoadingStatus(loadingPercent) : null;
  const recommendation = result ? getRecommendation(result) : null;
  const trendData = result?.trend_points?.length
    ? result.trend_points.map((point) => ({
        n: point.N,
        admd: point.ADMD_kW_per_unit,
        df: point.DF,
        cf: point.CF,
      }))
    : lookupData;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Results</h1>
          <p className="text-slate-600">Presentation-ready transformer sizing outputs and visual summary.</p>
        </div>
        <Button className="rounded-xl bg-slate-950" disabled={!result} onClick={() => result && exportProjectSummary(result)}>
          <Download className="mr-2 h-4 w-4" /> Export PDF
        </Button>
      </div>
      {!result ? (
        <Card className="rounded-2xl border-dashed border-slate-300 bg-white shadow-sm">
          <CardContent className="p-8 text-sm font-medium text-slate-600">Run an analysis from the Projects page to see real results here.</CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>ADMD, DF and CF Trend</CardTitle>
                <CardDescription>Lookup trend retained for engineering review.</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ReLineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.22} />
                    <XAxis dataKey="n" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="admd" stroke="#0284c7" strokeWidth={2} name="ADMD" />
                    <Line type="monotone" dataKey="df" stroke="#059669" strokeWidth={2} name="DF" />
                    <Line type="monotone" dataKey="cf" stroke="#e11d48" strokeWidth={2} name="CF" />
                  </ReLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            {loadingPercent !== null && loadingStatus && <TransformerLoadingCard loadingPercent={loadingPercent} status={loadingStatus} result={result} />}
          </div>
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
              <CardDescription>Visual cards for place, residential units, demand factors, peak demand, and transformer selection.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <SummaryVisual icon={MapPin} title="Place / Location" value={result.place} sub={capitalize(result.region_type)} visual={<MapVisual />} />
              <SummaryVisual icon={Home} title="Residential units total" value={String(result.residential_units)} sub="Household connections" visual={<ResidentialVisual />} />
              <SummaryVisual icon={Network} title="Units per phase" value={result.residential_units_per_phase.toFixed(2)} sub="A, B and C phase planning" visual={<PhaseVisual label={`${result.residential_units_per_phase.toFixed(1)} units`} />} />
              <SummaryVisual icon={Zap} title="ADMD lookup per phase" value={`${result.ADMD_kW_per_unit.toFixed(3)} kW/unit`} sub="Demand lookup value" visual={<PhaseVisual label="kW" accent="cyan" />} />
              <SummaryVisual icon={Waves} title="Diversity Factor, DF" value={result.DF.toFixed(3)} sub="Staggered household demand" visual={<BarsVisual mode="diverse" />} />
              <SummaryVisual icon={TrendingUp} title="Coincidence Factor, CF" value={result.CF.toFixed(3)} sub="Simultaneous demand indicator" visual={<BarsVisual mode="coincident" />} />
              <SummaryVisual icon={BarChart3} title="Maximum total peak" value={`${result.max_total_peak_kW.toFixed(2)} kW`} sub={`Lookup units: ${result.peak_lookup_units_total}`} visual={<PeakVisual high />} />
              <SummaryVisual icon={TrendingDown} title="Estimated diversified peak" value={`${result.group_peak_kW.toFixed(2)} kW`} sub="Reduced combined peak" visual={<PeakVisual />} />
              <SummaryVisual icon={Gauge} title="Suggested transformer" value={`${result.selected_transformer_kVA.toFixed(0)} kVA`} sub={`Design size: ${result.design_kVA.toFixed(2)} kVA`} visual={<TransformerMini />} strong />
            </CardContent>
          </Card>
          {recommendation && <RecommendationCard recommendation={recommendation} />}
        </>
      )}
    </div>
  );
}

function SummaryVisual({ icon: Icon, title, value, sub, visual, strong }: { icon: any; title: string; value: string; sub: string; visual: React.ReactNode; strong?: boolean }) {
  return (
    <div className={`rounded-2xl border p-4 ${strong ? "border-cyan-300 bg-cyan-50" : "border-slate-200 bg-white"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-600"><Icon className="h-4 w-4" /> {title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{value}</p>
          <p className="text-sm text-slate-500">{sub}</p>
        </div>
      </div>
      <div className="mt-4">{visual}</div>
    </div>
  );
}

function MapVisual() {
  return <div className="flex h-24 items-center justify-center rounded-xl bg-slate-100"><MapPin className="h-10 w-10 text-cyan-700" /><div className="ml-3 h-12 w-24 rounded-lg border-2 border-dashed border-cyan-300" /></div>;
}

function ResidentialVisual() {
  return <div className="grid h-24 grid-cols-4 gap-2 rounded-xl bg-slate-100 p-3">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="rounded-md bg-white p-1 shadow-sm"><div className="mx-auto h-3 w-5 rounded-t bg-cyan-600" /><div className="mx-auto h-4 w-7 rounded-b bg-slate-300" /></div>)}</div>;
}

function PhaseVisual({ label, accent = "emerald" }: { label: string; accent?: "emerald" | "cyan" }) {
  const color = accent === "cyan" ? "bg-cyan-600" : "bg-emerald-600";
  return <div className="grid h-24 grid-cols-3 gap-2">{["A", "B", "C"].map((phase) => <div key={phase} className="rounded-xl bg-slate-100 p-3 text-center"><div className={`mx-auto mb-2 h-2 w-full rounded-full ${color}`} /><p className="text-xs font-bold">Phase {phase}</p><p className="text-xs text-slate-500">{label}</p></div>)}</div>;
}

function BarsVisual({ mode }: { mode: "diverse" | "coincident" }) {
  const heights = mode === "diverse" ? ["35%", "68%", "45%", "80%", "52%"] : ["76%", "82%", "78%", "84%", "80%"];
  return <div className="flex h-24 items-end gap-2 rounded-xl bg-slate-100 p-3">{heights.map((height, index) => <div key={index} className="flex-1 rounded-t-md bg-cyan-600" style={{ height }} />)}</div>;
}

function PeakVisual({ high = false }: { high?: boolean }) {
  return <div className="flex h-24 items-end gap-2 rounded-xl bg-slate-100 p-3">{[30, 44, 58, high ? 92 : 66, 50, 38].map((height, index) => <div key={index} className={`flex-1 rounded-t-md ${index === 3 ? "bg-rose-500" : "bg-slate-300"}`} style={{ height: `${height}%` }} />)}</div>;
}

function TransformerMini() {
  return <div className="flex h-24 items-center justify-center rounded-xl bg-slate-950 text-white"><div className="rounded-xl border border-cyan-300/70 bg-cyan-300/10 p-5"><Bolt className="mx-auto h-8 w-8 text-cyan-200" /><p className="mt-1 text-xs font-semibold">kVA</p></div></div>;
}

function TransformerLoadingCard({ loadingPercent, status, result }: { loadingPercent: number; status: { label: string; icon: any; progressClass: string; textClass: string }; result: SizingResult }) {
  const Icon = status.icon;
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle>Transformer Loading</CardTitle>
        <CardDescription>Required kVA compared with selected transformer capacity.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-4xl font-bold text-slate-950">{loadingPercent.toFixed(1)}%</p>
            <p className="text-sm text-slate-500">{result.required_kVA.toFixed(2)} kVA required / {result.selected_transformer_kVA.toFixed(0)} kVA selected</p>
          </div>
          <div className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${status.textClass}`}>
            <Icon className="h-4 w-4" />
            <span>{status.label}</span>
          </div>
        </div>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200">
          <div className={`h-full rounded-full transition-all ${status.progressClass}`} style={{ width: `${Math.min(loadingPercent, 100)}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-xs font-medium text-slate-500"><span>Low</span><span>Safe</span><span>Medium</span><span>High</span><span>Overloaded</span></div>
      </CardContent>
    </Card>
  );
}

function RecommendationCard({ recommendation }: { recommendation: string }) {
  return (
    <Card className="rounded-2xl border-cyan-200 bg-cyan-50 shadow-sm">
      <CardContent className="flex items-start gap-3 p-5">
        <Mail className="mt-1 h-5 w-5 text-cyan-700" />
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-800">Recommendation</p>
          <p className="mt-1 font-semibold text-slate-900">{recommendation}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function getLoadingPercent(result: SizingResult) {
  if (!result.selected_transformer_kVA) return 0;
  return (result.required_kVA / result.selected_transformer_kVA) * 100;
}

function getLoadingStatus(loadingPercent: number) {
  if (loadingPercent < 40) return { label: "Low", icon: CheckCircle2, progressClass: "bg-sky-500", textClass: "bg-sky-50 text-sky-700" };
  if (loadingPercent < 60) return { label: "Safe", icon: CheckCircle2, progressClass: "bg-emerald-500", textClass: "bg-emerald-50 text-emerald-700" };
  if (loadingPercent < 80) return { label: "Medium", icon: Gauge, progressClass: "bg-lime-500", textClass: "bg-lime-50 text-lime-700" };
  if (loadingPercent <= 100) return { label: "High", icon: AlertTriangle, progressClass: "bg-amber-500", textClass: "bg-amber-50 text-amber-700" };
  return { label: "Overloaded", icon: AlertTriangle, progressClass: "bg-rose-600", textClass: "bg-rose-50 text-rose-700" };
}

function getLoadingStatusText(loadingPercent: number) {
  return getLoadingStatus(loadingPercent).label;
}

function getRecommendation(result: SizingResult) {
  const loading = getLoadingPercent(result);
  if (loading > 100) return "Selected transformer is overloaded. Move to the next standard rating before approval.";
  if (loading >= 80) return "Loading is high. Consider the next transformer rating if growth or uncertainty is expected.";
  if (loading >= 60) return "Current selection is acceptable. Review future growth before final approval.";
  if (loading >= 40) return "Current selection is in a comfortable operating range for the present design demand.";
  return "Transformer is lightly loaded. Check whether this level of spare capacity is intentional.";
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

function storageKeyForUser(baseKey: string, user: AuthUser) {
  return `${baseKey}:${user.email.toLowerCase()}`;
}

function exportProjectSummary(result: SizingResult) {
  const loadingPercent = getLoadingPercent(result);
  const loadingStatus = getLoadingStatus(loadingPercent).label;
  const recommendation = getRecommendation(result);
  const generatedAt = new Date().toLocaleString();
  const reportWindow = window.open("", "_blank", "width=980,height=1200");
  if (!reportWindow) return;

  reportWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>VoltSizer Transformer Sizing Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; color: #0f172a; background: #f8fafc; }
          .page { position: relative; max-width: 820px; margin: 0 auto; min-height: 1050px; background: white; padding: 42px; }
          .watermark { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 96px; font-weight: 800; color: rgba(15,23,42,0.045); transform: rotate(-28deg); pointer-events: none; }
          .header { position: relative; display: flex; justify-content: space-between; gap: 24px; border-bottom: 3px solid #0f172a; padding-bottom: 18px; }
          .logo { display: flex; align-items: center; gap: 12px; }
          .mark { width: 46px; height: 46px; display: grid; place-items: center; border-radius: 12px; background: #0f172a; color: white; font-weight: 900; }
          h1 { margin: 0; font-size: 28px; }
          h2 { margin-top: 28px; font-size: 17px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
          .meta { text-align: right; font-size: 12px; color: #475569; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
          th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
          th { background: #f1f5f9; }
          .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 14px; }
          .card { border: 1px solid #dbeafe; background: #f8fafc; border-radius: 12px; padding: 14px; }
          .label { font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: .04em; }
          .value { margin-top: 5px; font-size: 20px; font-weight: 800; }
          .recommendation { margin-top: 20px; border-left: 5px solid #0284c7; background: #e0f2fe; padding: 16px; font-weight: 700; }
          .footer { margin-top: 32px; font-size: 11px; color: #64748b; }
          @media print { body { background: white; } .page { box-shadow: none; } }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="watermark">VoltSizer</div>
          <div class="header">
            <div class="logo">
              <div class="mark">V</div>
              <div>
                <h1>VoltSizer</h1>
                <div>Transformer Sizing Recommendation Report</div>
              </div>
            </div>
            <div class="meta">
              <strong>Generated</strong><br />${generatedAt}<br /><br />
              <strong>Project place</strong><br />${result.place}
            </div>
          </div>
          <h2>Project Summary</h2>
          <div class="grid">
            <div class="card"><div class="label">Location</div><div class="value">${result.place}</div></div>
            <div class="card"><div class="label">Residential units</div><div class="value">${result.residential_units}</div></div>
            <div class="card"><div class="label">Units per phase</div><div class="value">${result.residential_units_per_phase.toFixed(2)}</div></div>
            <div class="card"><div class="label">ADMD</div><div class="value">${result.ADMD_kW_per_unit.toFixed(3)} kW/unit</div></div>
            <div class="card"><div class="label">DF</div><div class="value">${result.DF.toFixed(3)}</div></div>
            <div class="card"><div class="label">CF</div><div class="value">${result.CF.toFixed(3)}</div></div>
          </div>
          <h2>Sizing Outputs</h2>
          <table>
            <tr><th>Item</th><th>Value</th></tr>
            <tr><td>Maximum total peak</td><td>${result.max_total_peak_kW.toFixed(2)} kW</td></tr>
            <tr><td>Estimated diversified peak demand</td><td>${result.group_peak_kW.toFixed(2)} kW</td></tr>
            <tr><td>Required transformer size</td><td>${result.required_kVA.toFixed(2)} kVA</td></tr>
            <tr><td>Design transformer size</td><td>${result.design_kVA.toFixed(2)} kVA</td></tr>
            <tr><td>Suggested transformer size</td><td>${result.selected_transformer_kVA.toFixed(0)} kVA</td></tr>
            <tr><td>Transformer loading</td><td>${loadingPercent.toFixed(1)}%</td></tr>
            <tr><td>Loading status</td><td>${loadingStatus}</td></tr>
          </table>
          <div class="recommendation">${recommendation}</div>
          <div class="footer">VoltSizer browser-installed web application report. Values generated from the connected sizing backend.</div>
        </div>
        <script>window.onload = () => { window.print(); };</script>
      </body>
    </html>
  `);
  reportWindow.document.close();
}

function Workspace({ onLogout, user }: { onLogout: () => void; user: AuthUser }) {
  const [history, setHistory] = useState<string[]>([]);
  const [current, setCurrent] = useState("dashboard");
  const [form, setForm] = useState<ProjectFormState>(defaultForm);
  const [result, setResult] = useState<SizingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  useEffect(() => {
    const storedForm = localStorage.getItem(storageKeyForUser(FORM_STORAGE_KEY, user));
    const storedResult = localStorage.getItem(storageKeyForUser(RESULT_STORAGE_KEY, user));
    const storedProjects = localStorage.getItem(storageKeyForUser(PROJECTS_STORAGE_KEY, user));
    if (storedForm) setForm(JSON.parse(storedForm));
    if (storedResult) setResult(JSON.parse(storedResult));
    if (storedProjects) setSavedProjects(JSON.parse(storedProjects));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(storageKeyForUser(FORM_STORAGE_KEY, user), JSON.stringify(form));
  }, [form, user]);

  useEffect(() => {
    if (result) localStorage.setItem(storageKeyForUser(RESULT_STORAGE_KEY, user), JSON.stringify(result));
  }, [result, user]);

  useEffect(() => {
    localStorage.setItem(storageKeyForUser(PROJECTS_STORAGE_KEY, user), JSON.stringify(savedProjects));
  }, [savedProjects, user]);

  function handleNavigate(next: string) {
    if (next === current) return;
    setHistory((prev) => [...prev, current]);
    setCurrent(next);
  }

  function handleBack() {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const nextHistory = [...prev];
      const previous = nextHistory.pop() as string;
      setCurrent(previous);
      return nextHistory;
    });
  }

  function saveCurrentProject(projectResult: SizingResult | null = result) {
    const residentialUnits = Number(form.residentialUnits || 0);
    const powerFactor = Number(form.powerFactor || 0.9);
    const margin = Number(form.margin || 0.2);
    const recommendation = projectResult ? getRecommendation(projectResult) : "Project saved before analysis.";
    const status = projectResult ? getLoadingStatusText(getLoadingPercent(projectResult)) : "Draft";
    const newProject: SavedProject = {
      id: `${Date.now()}`,
      projectName: form.projectName || `${form.place} Residential Project`,
      place: form.place,
      residentialUnits,
      powerFactor,
      margin,
      result: projectResult,
      status,
      recommendation,
      lastUpdated: new Date().toISOString(),
    };
    setSavedProjects((prev) => [newProject, ...prev].sort((a, b) => +new Date(b.lastUpdated) - +new Date(a.lastUpdated)));
  }

  function openProject(project: SavedProject) {
    setForm({
      projectName: project.projectName,
      place: project.place,
      residentialUnits: String(project.residentialUnits),
      powerFactor: String(project.powerFactor),
      margin: String(project.margin),
    });
    setResult(project.result);
    handleNavigate(project.result ? "results" : "projects");
  }

  async function handleRunAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const residentialUnits = Number(form.residentialUnits);
      const powerFactor = Number(form.powerFactor);
      const margin = Number(form.margin);

      if (!form.place) throw new Error("Please choose a place.");
      if (!Number.isFinite(residentialUnits) || residentialUnits <= 0) throw new Error("Residential units must be a positive number.");
      if (residentialUnits > 240) throw new Error("Residential units cannot exceed 240 with the current lookup table limit.");
      if (!Number.isFinite(powerFactor) || powerFactor <= 0 || powerFactor > 1) throw new Error("Power factor must be between 0 and 1.");
      if (!Number.isFinite(margin) || margin < 0 || margin > 1) throw new Error("Margin must be between 0 and 1.");

      const response = await fetch(`${BACKEND_URL}/api/run-sizing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          place: form.place,
          residential_units: residentialUnits,
          power_factor: powerFactor,
          margin,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Backend request failed.");

      setResult(data);
      saveCurrentProject(data);
      handleNavigate("results");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-6">
      <div className="grid min-h-[calc(100vh-2rem)] overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl lg:grid-cols-[280px_1fr]">
        <Sidebar current={current} setCurrent={handleNavigate} onLogout={onLogout} user={user} />
        <main className="bg-slate-50 p-6 lg:p-8">
          <div className="mb-4 flex items-center justify-between">
            <Button variant="outline" className="rounded-xl" onClick={handleBack} disabled={history.length === 0}>Back</Button>
          </div>
          {current === "dashboard" && <DashboardPage latestResult={result} recentProjects={savedProjects.slice(0, 4)} onOpenProject={openProject} onNewProject={() => handleNavigate("projects")} user={user} />}
          {current === "projects" && <ProjectsPage form={form} setForm={setForm} onRunAnalysis={handleRunAnalysis} onSaveProject={() => saveCurrentProject()} loading={loading} error={error} />}
          {current === "workflow" && <WorkflowPage />}
          {current === "results" && <ResultsPage result={result} />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<"landing" | "auth" | "workspace">("landing");
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      const storedUser = JSON.parse(storedAuth) as AuthUser;
      setUser(storedUser);
      setScreen("workspace");
    }
  }, []);

  function handleLogin(nextUser: AuthUser) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setScreen("workspace");
  }

  function handleLogout() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setScreen("landing");
  }

  if (screen === "landing") return <LandingPage onEnter={() => setScreen("auth")} />;
  if (screen === "auth") return <AuthPanel onLogin={handleLogin} onBack={() => setScreen("landing")} />;
  return user ? <Workspace onLogout={handleLogout} user={user} /> : <LandingPage onEnter={() => setScreen("auth")} />;
}
