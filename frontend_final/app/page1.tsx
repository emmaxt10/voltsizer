"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bolt,
  FileBarChart,
  Gauge,
  Home,
  LineChart,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  UserPlus,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
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

const BACKEND_URL = "http://127.0.0.1:8000";

const heroMetrics = [
  { label: "Project classes", value: "City · Town · Village" },
  { label: "Core outputs", value: "ADMD · DF · CF" },
  { label: "Validation", value: "External check ready" },
];

const stepCards = [
  {
    title: "Create Project",
    description: "Create and organize a new residential transformer sizing project.",
    icon: Upload,
  },
  {
    title: "Set Location",
    description: "Choose the project location and configure the planning scenario.",
    icon: SlidersHorizontal,
  },
  {
    title: "Define Load",
    description: "Enter residential demand assumptions and design inputs.",
    icon: Gauge,
  },
  {
    title: "Run Analysis",
    description: "Generate sizing results, comparisons, and validation outputs.",
    icon: ShieldCheck,
  },
];

const loadProfileData = [
  { hour: "00", profile: 0.22 },
  { hour: "03", profile: 0.18 },
  { hour: "06", profile: 0.28 },
  { hour: "09", profile: 0.36 },
  { hour: "12", profile: 0.48 },
  { hour: "15", profile: 0.62 },
  { hour: "18", profile: 0.71 },
  { hour: "21", profile: 0.39 },
];

const lookupData = [
  { n: 5, admd: 2.16, df: 1.28, cf: 0.78 },
  { n: 10, admd: 1.87, df: 1.46, cf: 0.68 },
  { n: 20, admd: 1.61, df: 1.7, cf: 0.59 },
  { n: 50, admd: 1.33, df: 2.04, cf: 0.49 },
  { n: 100, admd: 1.21, df: 2.22, cf: 0.45 },
];

const projectRows = [
  { name: "North Gaborone Residential Cluster", place: "Gaborone", class: "City", status: "Ready" },
  { name: "Jwaneng Residential Expansion", place: "Jwaneng", class: "Town", status: "In Review" },
  { name: "Molepolole Residential Development", place: "Molepolole", class: "Village", status: "Draft" },
];

type SizingResult = {
  place: string;
  region_type: string;
  residential_units: number;
  ADMD_kW_per_unit: number;
  DF: number;
  CF: number;
  group_peak_kW: number;
  required_kVA: number;
  design_kVA: number;
  selected_transformer_kVA: number;
};

type ProjectFormState = {
  projectName: string;
  place: string;
  residentialUnits: string;
  powerFactor: string;
  margin: string;
};

function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white/10 p-2 backdrop-blur">
              <Bolt className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">VoltSizer</p>
              <p className="text-sm text-slate-300">Residential planning workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/20 bg-transparent text-white hover:bg-white/10" onClick={onEnter}>
              Sign in
            </Button>
            <Button className="rounded-2xl">Request demo</Button>
          </div>
        </nav>

        <div className="grid gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-cyan-200">
                Residential distribution planning workspace
              </Badge>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }} className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight lg:text-6xl">
                Residential Load & Transformer Sizing
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                Design, analyze, and validate residential distribution systems.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-wrap gap-3">
              <Button size="lg" className="rounded-2xl px-6" onClick={onEnter}>
                Open workspace
              </Button>
              <Button size="lg" variant="outline" className="rounded-2xl border-white/20 bg-white/5 px-6 text-white hover:bg-white/10">
                View platform
              </Button>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.15 }} className="grid max-w-2xl gap-4 sm:grid-cols-3">
              {heroMetrics.map((metric) => (
                <Card key={metric.label} className="rounded-3xl border-white/10 bg-white/5 text-white shadow-2xl backdrop-blur">
                  <CardContent className="p-5">
                    <p className="text-sm text-slate-300">{metric.label}</p>
                    <p className="mt-2 text-xl font-semibold">{metric.value}</p>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
            <Card className="rounded-[32px] border-white/10 bg-white/5 p-3 text-white shadow-2xl backdrop-blur">
              <CardContent className="grid gap-4 p-3">
                <div className="rounded-[28px] border border-white/10 bg-slate-950/70 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Load Profile</p>
                      <h3 className="text-2xl font-semibold">Gaborone · 50 residential units</h3>
                    </div>
                    <Badge className="rounded-full bg-emerald-500/15 text-emerald-300">Ready</Badge>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <MetricCard icon={Zap} label="ADMD" value="1.33 kW/unit" />
                    <MetricCard icon={BarChart3} label="DF" value="2.04" />
                    <MetricCard icon={Gauge} label="Transformer" value="100 kVA" />
                  </div>
                  <div className="mt-6 h-64 w-full rounded-3xl border border-white/10 bg-slate-900/70 p-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={loadProfileData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="hour" stroke="#cbd5e1" />
                        <YAxis stroke="#cbd5e1" />
                        <Tooltip />
                        <Area type="monotone" dataKey="profile" stroke="#93c5fd" fill="#93c5fd" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-4 py-6 md:grid-cols-2 xl:grid-cols-4">
          {stepCards.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + index * 0.07 }}
            >
              <Card className="h-full rounded-3xl border-white/10 bg-white/5 text-white backdrop-blur">
                <CardHeader>
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-slate-300">{step.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white/10 p-2">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm text-slate-300">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}

function AuthPanel({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[36px] border bg-white shadow-2xl lg:grid-cols-[1fr_0.95fr]">
        <div className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.18),transparent_35%)]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white/10 p-2"><Bolt className="h-6 w-6" /></div>
                <div>
                  <p className="text-lg font-semibold">VoltSizer</p>
                  <p className="text-sm text-slate-300">Residential planning workspace</p>
                </div>
              </div>
              <div className="mt-12 max-w-xl space-y-5">
                <h2 className="text-4xl font-semibold tracking-tight">Plan, size, and review residential transformer projects in one place.</h2>
                <p className="text-slate-300">
                  A focused interface for residential project setup, analysis, and results review.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              <Card className="rounded-3xl border-white/10 bg-white/5 text-white backdrop-blur">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-300">Workspace preview</p>
                      <p className="text-xl font-semibold">Planning preview</p>
                    </div>
                    <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div className="mt-4 h-44 rounded-3xl border border-white/10 bg-slate-950/70 p-3">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReLineChart data={lookupData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis dataKey="n" stroke="#cbd5e1" />
                        <YAxis stroke="#cbd5e1" />
                        <Tooltip />
                        <Line type="monotone" dataKey="admd" stroke="#38bdf8" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="df" stroke="#34d399" strokeWidth={2} dot={false} />
                      </ReLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-12">
          <Card className="w-full max-w-xl rounded-[32px] border-0 shadow-none">
            <CardHeader className="space-y-2">
              <CardTitle className="text-3xl">Welcome back</CardTitle>
              <CardDescription>Sign in to continue with residential planning projects.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-2xl">
                  <TabsTrigger value="signin" className="rounded-2xl gap-2"><Lock className="h-4 w-4" /> Sign in</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-2xl gap-2"><UserPlus className="h-4 w-4" /> Create account</TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="mt-6 space-y-5">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="engineer@company.com" className="rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" placeholder="••••••••" className="rounded-2xl" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>Secure workspace access</span>
                    <button className="font-medium text-slate-700">Forgot password?</button>
                  </div>
                  <Button className="w-full rounded-2xl" size="lg" onClick={onLogin}>
                    Enter dashboard
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>First name</Label>
                      <Input placeholder="Tshaks" className="rounded-2xl" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last name</Label>
                      <Input placeholder="Engineer" className="rounded-2xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="engineer@company.com" className="rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" placeholder="Create a strong password" className="rounded-2xl" />
                  </div>
                  <Button className="w-full rounded-2xl" size="lg" onClick={onLogin}>
                    Create workspace
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ current, setCurrent }: { current: string; setCurrent: (v: string) => void }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "projects", label: "Projects", icon: FileBarChart },
    { id: "workflow", label: "Workflow", icon: SlidersHorizontal },
    { id: "results", label: "Results", icon: LineChart },
  ];

  return (
    <div className="flex h-full flex-col gap-4 border-r bg-white p-4">
      <div className="flex items-center gap-3 rounded-3xl bg-slate-950 p-4 text-white">
        <div className="rounded-2xl bg-white/10 p-2"><Bolt className="h-5 w-5" /></div>
        <div>
          <p className="font-semibold">VoltSizer</p>
          <p className="text-xs text-slate-300">Residential planning workspace</p>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrent(item.id)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
              current === item.id ? "bg-slate-950 text-white" : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="mt-auto rounded-3xl border bg-slate-50 p-4">
        <p className="text-sm font-medium">Platform status</p>
        <p className="mt-1 text-sm text-slate-500">Sizing engine ready for backend connection.</p>
        <Progress className="mt-4" value={84} />
      </div>
    </div>
  );
}

function DashboardPage({ latestResult }: { latestResult: SizingResult | null }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-slate-500">Review current projects, demand trends, and analysis outputs.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-2xl">Export report</Button>
          <Button className="rounded-2xl">New project</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active projects" value="12" sub="3 awaiting validation" icon={FileBarChart} />
        <StatCard label="Project classes" value="City · Town · Village" sub="Regional planning ready" icon={MapPin} />
        <StatCard label="Suggested transformer" value={latestResult ? `${latestResult.selected_transformer_kVA.toFixed(0)} kVA` : "100 kVA"} sub={latestResult ? `${latestResult.place} latest result` : "Current highlighted scenario"} icon={Gauge} />
        <StatCard label="Analysis mode" value="Residential" sub="Distribution-focused" icon={ShieldCheck} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Load Profile</CardTitle>
            <CardDescription>Preview a sample residential demand curve and project output behavior.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={loadProfileData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="profile" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.18} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Project queue</CardTitle>
            <CardDescription>Current residential planning cases in the workspace.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {projectRows.map((row) => (
              <div key={row.name} className="flex items-center justify-between rounded-2xl border p-4">
                <div>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-sm text-slate-500">{row.place} · {row.class}</p>
                </div>
                <Badge variant="secondary" className="rounded-full">{row.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon }: { label: string; value: string; sub: string; icon: any }) {
  return (
    <Card className="rounded-3xl">
      <CardContent className="flex items-start justify-between p-5">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-xl font-semibold leading-tight">{value}</p>
          <p className="mt-1 text-sm text-slate-500">{sub}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectsPage({
  form,
  setForm,
  onRunAnalysis,
  loading,
  error,
}: {
  form: ProjectFormState;
  setForm: React.Dispatch<React.SetStateAction<ProjectFormState>>;
  onRunAnalysis: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <p className="text-slate-500">Set up place, residential units, and analysis inputs before computation.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>New project setup</CardTitle>
            <CardDescription>Prepare the engineering inputs before running the sizing engine.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Project name</Label>
              <Input
                className="rounded-2xl"
                placeholder="North Gaborone residential cluster"
                value={form.projectName}
                onChange={(e) => setForm((prev) => ({ ...prev, projectName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Place</Label>
              <Select value={form.place} onValueChange={(value) => setForm((prev) => ({ ...prev, place: value }))}>
                <SelectTrigger className="rounded-2xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gaborone">Gaborone</SelectItem>
                  <SelectItem value="Jwaneng">Jwaneng</SelectItem>
                  <SelectItem value="Molepolole">Molepolole</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Residential units</Label>
                <Input
                  className="rounded-2xl"
                  placeholder="50"
                  value={form.residentialUnits}
                  onChange={(e) => setForm((prev) => ({ ...prev, residentialUnits: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Power factor</Label>
                <Input
                  className="rounded-2xl"
                  placeholder="0.9"
                  value={form.powerFactor}
                  onChange={(e) => setForm((prev) => ({ ...prev, powerFactor: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Margin</Label>
                <Input
                  className="rounded-2xl"
                  placeholder="0.2"
                  value={form.margin}
                  onChange={(e) => setForm((prev) => ({ ...prev, margin: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Load profile input</Label>
              <div className="flex items-center gap-3 rounded-2xl border border-dashed p-4 text-slate-500">
                <Upload className="h-4 w-4" />
                <span>load_profile_input.csv</span>
              </div>
            </div>
            {error && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
            <Button className="w-full rounded-2xl" onClick={onRunAnalysis} disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Running analysis...</> : "Run Analysis"}
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Workflow preview</CardTitle>
            <CardDescription>What the user moves through inside the platform.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["1", "Create Project", "Start a new residential transformer sizing case."],
              ["2", "Set Location", "Choose the planning location and scenario."],
              ["3", "Define Load", "Enter residential demand assumptions and project scope."],
              ["4", "Run Analysis", "Generate outputs and recommended transformer size."],
            ].map(([n, title, desc]) => (
              <div key={n} className="flex gap-4 rounded-2xl border p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">{n}</div>
                <div>
                  <p className="font-medium">{title}</p>
                  <p className="text-sm text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function WorkflowPage() {
  const regionCards = useMemo(
    () => [
      { title: "City", place: "Gaborone", a: "Urban planning class", b: "Residential demand profile" },
      { title: "Town", place: "Jwaneng", a: "Town planning class", b: "Residential demand profile" },
      { title: "Village", place: "Molepolole", a: "Village planning class", b: "Residential demand profile" },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Workflow</h1>
        <p className="text-slate-500">A clean view of the residential sizing workflow.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {regionCards.map((card) => (
          <Card key={card.title} className="rounded-3xl">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.place} planning setup.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Planning view</p>
                <p className="text-xl font-semibold">{card.a}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">Demand view</p>
                <p className="text-xl font-semibold">{card.b}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle>Workflow stages</CardTitle>
          <CardDescription>How users move from setup to results.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: Upload, t: "Project input", d: "Load project data and define the residential case." },
            { icon: MapPin, t: "Location setup", d: "Choose place, class, and design settings." },
            { icon: SlidersHorizontal, t: "Load definition", d: "Enter residential demand assumptions and project scope." },
            { icon: FileBarChart, t: "Analysis results", d: "Generate outputs, comparisons, and recommended transformer size." },
          ].map((item) => (
            <div key={item.t} className="rounded-2xl border p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="font-medium">{item.t}</p>
              <p className="mt-1 text-sm text-slate-500">{item.d}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function ResultsPage({ result }: { result: SizingResult | null }) {
  const summaryCards = result
    ? [
        { label: "Place", value: result.place },
        { label: "Location class", value: capitalize(result.region_type) },
        { label: "Residential units", value: String(result.residential_units) },
        { label: "ADMD", value: `${result.ADMD_kW_per_unit.toFixed(3)} kW/unit` },
        { label: "DF", value: result.DF.toFixed(3) },
        { label: "CF", value: result.CF.toFixed(3) },
        { label: "Group peak", value: `${result.group_peak_kW.toFixed(2)} kW` },
        { label: "Required size", value: `${result.required_kVA.toFixed(2)} kVA` },
        { label: "Design size", value: `${result.design_kVA.toFixed(2)} kVA` },
        { label: "Suggested transformer", value: `${result.selected_transformer_kVA.toFixed(0)} kVA` },
      ]
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Results</h1>
        <p className="text-slate-500">Review residential sizing outputs and decision summaries.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Analysis trend</CardTitle>
            <CardDescription>Sample output trend for residential sizing.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ReLineChart data={lookupData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="n" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="admd" stroke="#38bdf8" strokeWidth={2} />
                <Line type="monotone" dataKey="df" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="cf" stroke="#f43f5e" strokeWidth={2} />
              </ReLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Project summary</CardTitle>
            <CardDescription>Key outputs for the selected residential project.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {summaryCards ? (
              <>
                {summaryCards.slice(0, 3).map((item) => <ResultTile key={item.label} label={item.label} value={item.value} />)}
                <Separator />
                {summaryCards.slice(3, 9).map((item) => <ResultTile key={item.label} label={item.label} value={item.value} />)}
                <ResultTile label={summaryCards[9].label} value={summaryCards[9].value} strong />
              </>
            ) : (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-slate-500">
                Run an analysis from the Projects page to see real results here.
              </div>
            )}
            <Button className="mt-2 w-full rounded-2xl" disabled={!result}>Export project summary</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResultTile({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`font-medium ${strong ? "text-lg" : ""}`}>{value}</span>
    </div>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function Workspace() {
  const [current, setCurrent] = useState("dashboard");
  const [form, setForm] = useState<ProjectFormState>({
    projectName: "",
    place: "Gaborone",
    residentialUnits: "50",
    powerFactor: "0.9",
    margin: "0.2",
  });
  const [result, setResult] = useState<SizingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRunAnalysis() {
    setLoading(true);
    setError(null);

    try {
      const residentialUnits = Number(form.residentialUnits);
      const powerFactor = Number(form.powerFactor);
      const margin = Number(form.margin);

      if (!form.place) {
        throw new Error("Please choose a place.");
      }
      if (!Number.isFinite(residentialUnits) || residentialUnits <= 0) {
        throw new Error("Residential units must be a positive number.");
      }
      if (!Number.isFinite(powerFactor) || powerFactor <= 0 || powerFactor > 1) {
        throw new Error("Power factor must be between 0 and 1.");
      }
      if (!Number.isFinite(margin) || margin < 0 || margin > 1) {
        throw new Error("Margin must be between 0 and 1.");
      }

      const response = await fetch(`${BACKEND_URL}/api/run-sizing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          place: form.place,
          residential_units: residentialUnits,
          power_factor: powerFactor,
          margin,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Backend request failed.");
      }

      setResult(data);
      setCurrent("results");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-6">
      <div className="grid min-h-[calc(100vh-2rem)] overflow-hidden rounded-[36px] border bg-white shadow-2xl lg:grid-cols-[280px_1fr]">
        <Sidebar current={current} setCurrent={setCurrent} />
        <main className="bg-slate-50 p-6 lg:p-8">
          {current === "dashboard" && <DashboardPage latestResult={result} />}
          {current === "projects" && (
            <ProjectsPage
              form={form}
              setForm={setForm}
              onRunAnalysis={handleRunAnalysis}
              loading={loading}
              error={error}
            />
          )}
          {current === "workflow" && <WorkflowPage />}
          {current === "results" && <ResultsPage result={result} />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<"landing" | "auth" | "workspace">("landing");

  if (screen === "landing") {
    return <LandingPage onEnter={() => setScreen("auth")} />;
  }

  if (screen === "auth") {
    return <AuthPanel onLogin={() => setScreen("workspace")} />;
  }

  return <Workspace />;
}
