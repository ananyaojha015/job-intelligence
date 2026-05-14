import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, RadarChart,
  PolarGrid, PolarAngleAxis, Radar
} from "recharts";

const API = "https://jobiq-backend.onrender.com/api";

const PROFESSIONS = [
  { id: "software-development", label: "Software Development", icon: "💻" },
  { id: "ai-ml", label: "AI / Machine Learning", icon: "🤖" },
  { id: "data-science", label: "Data Science", icon: "📊" },
  { id: "cloud-devops", label: "Cloud / DevOps", icon: "☁️" },
  { id: "uiux-design", label: "UI/UX Design", icon: "🎨" },
  { id: "finance-fintech", label: "Finance / Fintech", icon: "📈" },
  { id: "digital-marketing", label: "Digital Marketing", icon: "📣" },
  { id: "cybersecurity", label: "Cybersecurity", icon: "🔒" },
  { id: "mobile-development", label: "Mobile Development", icon: "📱" },
  { id: "healthcare-tech", label: "Healthcare Tech", icon: "🧬" },
  { id: "teaching-edtech", label: "Teaching / EdTech", icon: "👩‍🏫" },
  { id: "banking-finance", label: "Banking / Finance", icon: "💰" },
  { id: "marketing", label: "Marketing", icon: "📢" },
];

const LEARNING_RESOURCES = {
  "python": "https://docs.python.org/3/tutorial/",
  "react": "https://react.dev/learn",
  "machine learning": "https://www.coursera.org/learn/machine-learning",
  "typescript": "https://www.typescriptlang.org/docs/",
  "docker": "https://docs.docker.com/get-started/",
  "aws": "https://aws.amazon.com/getting-started/",
  "kubernetes": "https://kubernetes.io/docs/tutorials/",
  "node.js": "https://nodejs.org/en/learn",
  "postgresql": "https://www.postgresql.org/docs/",
  "mongodb": "https://learn.mongodb.com",
  "django": "https://docs.djangoproject.com/en/stable/intro/",
  "flask": "https://flask.palletsprojects.com/",
  "tensorflow": "https://www.tensorflow.org/tutorials",
  "pytorch": "https://pytorch.org/tutorials/",
  "git": "https://git-scm.com/doc",
  "github": "https://docs.github.com/en/get-started",
  "go": "https://go.dev/learn/",
  "vue": "https://vuejs.org/guide/introduction.html",
  "nlp": "https://huggingface.co/learn/nlp-course/",
  "figma": "https://help.figma.com/hc/en-us/categories/360002051613",
  "excel": "https://support.microsoft.com/en-us/excel",
  "tableau": "https://www.tableau.com/learn/training",
};

// ── Glassmorphism styles ───────────────────────
const glass = {
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.3)",
  borderRadius: "20px",
};

const glassCard = {
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(124,111,205,0.15)",
  borderRadius: "16px",
  boxShadow: "0 8px 32px rgba(124,111,205,0.08)",
};

const COLORS = {
  primary: "#7C6FCD",
  primaryLight: "#EDE9FF",
  bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  text: "#2D2D2D",
  textLight: "#8A8A9A",
  success: "#6DBF9E",
  warning: "#E8A838",
  danger: "#E07070",
};

// ── Animated background blobs ──────────────────
function AnimatedBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)" }}>
      <div style={{
        position: "absolute", width: "600px", height: "600px",
        background: "radial-gradient(circle, rgba(124,111,205,0.4) 0%, transparent 70%)",
        top: "-100px", left: "-100px",
        animation: "blob1 8s ease-in-out infinite alternate"
      }} />
      <div style={{
        position: "absolute", width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(118,75,162,0.3) 0%, transparent 70%)",
        bottom: "-100px", right: "-100px",
        animation: "blob2 10s ease-in-out infinite alternate"
      }} />
      <div style={{
        position: "absolute", width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(102,126,234,0.3) 0%, transparent 70%)",
        top: "40%", left: "40%",
        animation: "blob3 12s ease-in-out infinite alternate"
      }} />
      <style>{`
        @keyframes blob1 { from { transform: translate(0,0) scale(1); } to { transform: translate(100px,50px) scale(1.2); } }
        @keyframes blob2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-80px,-60px) scale(1.1); } }
        @keyframes blob3 { from { transform: translate(0,0) scale(1); } to { transform: translate(60px,-80px) scale(0.9); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes shimmer { from { background-position: -200% center; } to { background-position: 200% center; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
        .fade-in-up { animation: fadeInUp 0.6s ease forwards; }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        .hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(124,111,205,0.25); }
        .prof-card { transition: all 0.2s ease; cursor: pointer; }
        .prof-card:hover { transform: translateY(-4px) scale(1.02); }
        .nav-item { transition: all 0.2s ease; cursor: pointer; }
        .nav-item:hover { background: rgba(124,111,205,0.15); }
        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #c4b5fd 50%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

// ── Splash / Onboarding Screen ─────────────────
function SplashScreen({ onComplete }) {
  const [step, setStep] = useState("splash");
  const [name, setName] = useState("");
  const [selectedProfession, setSelectedProfession] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    setTimeout(() => setStep("name"), 2500);
  }, []);

  const handleNameSubmit = () => {
    if (!name.trim()) return;
    setStep("profession");
  };

  const handleProfessionSelect = (prof) => {
    setSelectedProfession(prof);
  };

  const handleStart = () => {
    if (!selectedProfession) return;
    localStorage.setItem("jobiq_name", name);
    localStorage.setItem("jobiq_profession", JSON.stringify(selectedProfession));
    onComplete(name, selectedProfession);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <AnimatedBg />

      {step === "splash" && (
        <div className="fade-in" style={{ textAlign: "center", zIndex: 1 }}>
          <div style={{ fontSize: "80px", marginBottom: "24px", animation: "pulse 2s ease infinite" }}>
            🧠
          </div>
          <div className="shimmer-text" style={{ fontSize: "52px", fontWeight: "800", letterSpacing: "-1px" }}>
            JobIQ
          </div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "18px", marginTop: "12px" }}>
            Your Personal Career Intelligence Platform
          </div>
          <div style={{ marginTop: "40px", display: "flex", gap: "8px", justifyContent: "center" }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: "8px", height: "8px", borderRadius: "50%",
                background: i === 0 ? "white" : "rgba(255,255,255,0.4)",
                animation: "pulse 1.5s ease infinite",
                animationDelay: i * 0.3 + "s"
              }} />
            ))}
          </div>
        </div>
      )}

      {step === "name" && (
        <div className="fade-in-up" style={{ ...glass, padding: "48px", width: "480px", zIndex: 1, textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>👋</div>
          <h2 style={{ color: "white", fontSize: "28px", fontWeight: "700", margin: "0 0 8px 0" }}>
            Welcome to JobIQ
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", marginBottom: "32px", fontSize: "15px" }}>
            Your personalized career intelligence platform. What should we call you?
          </p>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleNameSubmit()}
            placeholder="Enter your name..."
            autoFocus
            style={{
              width: "100%", padding: "14px 18px", borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.3)",
              background: "rgba(255,255,255,0.15)", color: "white",
              fontSize: "16px", outline: "none", boxSizing: "border-box",
              backdropFilter: "blur(10px)"
            }}
          />
          <button
            onClick={handleNameSubmit}
            style={{
              marginTop: "16px", width: "100%", padding: "14px",
              background: "linear-gradient(135deg, #7C6FCD, #a78bfa)",
              color: "white", border: "none", borderRadius: "12px",
              fontSize: "16px", fontWeight: "600", cursor: "pointer",
              boxShadow: "0 4px 20px rgba(124,111,205,0.4)"
            }}
          >
            Continue
          </button>
        </div>
      )}

      {step === "profession" && (
        <div className="fade-in-up" style={{ ...glass, padding: "40px", width: "700px", maxHeight: "85vh", overflowY: "auto", zIndex: 1 }}>
          <h2 style={{ color: "white", fontSize: "24px", fontWeight: "700", margin: "0 0 8px 0", textAlign: "center" }}>
            {"Hi " + name + "! What's your field?"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.7)", textAlign: "center", marginBottom: "28px", fontSize: "14px" }}>
            We'll personalize your job market insights based on your profession
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "28px" }}>
            {PROFESSIONS.map(prof => (
              <div
                key={prof.id}
                className="prof-card"
                onClick={() => handleProfessionSelect(prof)}
                style={{
                  padding: "16px 12px", borderRadius: "14px", textAlign: "center",
                  background: selectedProfession && selectedProfession.id === prof.id
                    ? "rgba(124,111,205,0.5)"
                    : "rgba(255,255,255,0.1)",
                  border: selectedProfession && selectedProfession.id === prof.id
                    ? "2px solid rgba(255,255,255,0.8)"
                    : "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>{prof.icon}</div>
                <div style={{ color: "white", fontSize: "12px", fontWeight: "500", lineHeight: "1.3" }}>{prof.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={handleStart}
            disabled={!selectedProfession}
            style={{
              width: "100%", padding: "14px",
              background: selectedProfession
                ? "linear-gradient(135deg, #7C6FCD, #a78bfa)"
                : "rgba(255,255,255,0.2)",
              color: "white", border: "none", borderRadius: "12px",
              fontSize: "16px", fontWeight: "600",
              cursor: selectedProfession ? "pointer" : "not-allowed",
              boxShadow: selectedProfession ? "0 4px 20px rgba(124,111,205,0.4)" : "none",
              transition: "all 0.2s ease"
            }}
          >
            {selectedProfession ? "Launch My Dashboard" : "Select your profession"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Sidebar ────────────────────────────────────
function Sidebar({ page, setPage, userName, profession, isOpen }) {
  const items = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "jobs", icon: "💼", label: "Jobs" },
    { id: "resume", icon: "📄", label: "Resume" },
    { id: "learn", icon: "🎓", label: "Learn" },
    { id: "interview", icon: "🎯", label: "Interview Prep" },
    { id: "roadmap", icon: "🗺️", label: "Skill Roadmap" },
  ];

  return (
    <div style={{
      width: "230px", minHeight: "100vh",
      background: "rgba(15,12,41,0.95)",
      backdropFilter: "blur(20px)",
      borderRight: "1px solid rgba(255,255,255,0.1)",
      padding: "24px 16px",
      display: "flex", flexDirection: "column", gap: "4px", flexShrink: 0,
      transition: "transform 0.3s ease",
      transform: isOpen ? "translateX(0)" : "translateX(-100%)",
      position: "fixed", top: 0, left: 0, height: "100vh",
      zIndex: 100, overflowY: "auto"
    }}>
      {/* Logo */}
      <div style={{ marginBottom: "32px", paddingLeft: "8px" }}>
        <div className="shimmer-text" style={{ fontSize: "22px", fontWeight: "800" }}>JobIQ</div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
          {profession ? profession.icon + " " + profession.label : "Career Intelligence"}
        </div>
      </div>

      {/* User */}
      <div style={{
        ...glass, padding: "12px", marginBottom: "20px",
        display: "flex", alignItems: "center", gap: "10px"
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: "linear-gradient(135deg, #7C6FCD, #a78bfa)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontWeight: "700", fontSize: "16px", flexShrink: 0
        }}>
          {userName ? userName[0].toUpperCase() : "U"}
        </div>
        <div>
          <div style={{ color: "white", fontSize: "13px", fontWeight: "600" }}>{userName || "User"}</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px" }}>Active</div>
        </div>
      </div>

      {/* Nav */}
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="nav-item"
          onClick={() => setPage(item.id)}
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 12px", borderRadius: "10px",
            background: page === item.id ? "rgba(124,111,205,0.4)" : "transparent",
            color: page === item.id ? "white" : "rgba(255,255,255,0.6)",
            fontWeight: page === item.id ? "600" : "400",
            fontSize: "14px",
            borderLeft: page === item.id ? "3px solid #a78bfa" : "3px solid transparent",
            animation: "slideIn 0.4s ease forwards",
            animationDelay: idx * 0.05 + "s",
            opacity: 0,
          }}
        >
          <span style={{ fontSize: "16px" }}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}

      {/* Change profile */}
      <div
        onClick={() => {
          localStorage.removeItem("jobiq_name");
          localStorage.removeItem("jobiq_profession");
          window.location.reload();
        }}
        style={{
          marginTop: "auto", padding: "10px 12px", borderRadius: "10px",
          color: "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: "8px",
          transition: "color 0.2s ease"
        }}
      >
        <span>↩</span>
        <span>Change Profile</span>
      </div>
    </div>
  );
}

// ── Page wrapper ───────────────────────────────
function PageWrap({ children }) {
  return (
    <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {children}
    </div>
  );
}

// ── Glass Card ─────────────────────────────────
function GCard({ children, style }) {
  return (
    <div className="hover-lift" style={{ ...glassCard, padding: "20px", ...style }}>
      {children}
    </div>
  );
}

// ── Stat Card ──────────────────────────────────
function StatCard({ title, value, subtitle, color, icon }) {
  return (
    <div className="hover-lift" style={{ ...glassCard, padding: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "13px", color: COLORS.textLight }}>{title}</div>
        <div style={{ fontSize: "24px" }}>{icon}</div>
      </div>
      <div style={{ fontSize: "32px", fontWeight: "700", color: color || COLORS.primary }}>{value}</div>
      {subtitle && <div style={{ fontSize: "12px", color: COLORS.textLight }}>{subtitle}</div>}
    </div>
  );
}

// ── Dashboard ──────────────────────────────────
function DashboardPage({ skills, jobs, insights, userName, profession }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const chartData = skills.slice(0, 8).map(s => ({
    name: s.skill_name.length > 10 ? s.skill_name.slice(0, 10) + ".." : s.skill_name,
    frequency: s.frequency,
    demand: insights && insights.demand_scores
      ? (insights.demand_scores.find(d => d.skill === s.skill_name) || { demand_score: 0 }).demand_score
      : 0
  }));

  const radarData = skills.slice(0, 6).map(s => ({
    skill: s.skill_name.length > 8 ? s.skill_name.slice(0, 8) + ".." : s.skill_name,
    value: s.frequency
  }));

  return (
    <PageWrap>
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: "700", margin: "0 0 4px 0", color: "white" }}>
          {greeting + ", " + (userName || "there") + "! 👋"}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", margin: 0, fontSize: "14px" }}>
          {profession ? "Here is your " + profession.label + " market intelligence" : "Here is the latest job market intelligence"}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <StatCard title="Total Jobs" value={jobs.length} icon="💼" subtitle="Tracked listings" color={COLORS.primary} />
        <StatCard title="Top Skill" value={skills.length > 0 ? skills[0].skill_name : "-"} icon="🔥"
          subtitle={"Demand: " + (insights && insights.demand_scores && insights.demand_scores.length > 0 ? insights.demand_scores[0].demand_score : 0)}
          color={COLORS.warning} />
        <StatCard title="Skills Tracked" value={skills.length} icon="📊" subtitle="Unique market skills" color={COLORS.success} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "16px" }}>
        <GCard>
  <h2 style={{ fontSize: "15px", fontWeight: "600", margin: "0 0 20px 0", color: "black" }}>
    Top Skills in Demand
  </h2>
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "rgba(30,20,60,0.95)" }} />
      <YAxis tick={{ fontSize: 11, fill: "rgba(30,20,60,0.95)" }} />
      <Tooltip contentStyle={{ borderRadius: "10px", background: "rgba(30,20,60,0.95)", border: "1px solid rgba(124,111,205,0.4)", color: "white" }} />
      <Bar dataKey="frequency" fill="#7C6FCD" radius={[6, 6, 0, 0]} name="Frequency" />
    </BarChart>
  </ResponsiveContainer>
</GCard>

<GCard>
  <h2 style={{ fontSize: "15px", fontWeight: "600", margin: "0 0 20px 0", color: "black" }}>
    Skill Radar
  </h2>
  <ResponsiveContainer width="100%" height={220}>
    <RadarChart data={radarData}>
      <PolarGrid stroke="rgba(3, 3, 3, 0.15)" />
      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: "rgba(30,20,60,0.95)" }} />
      <Radar name="Demand" dataKey="value" stroke="#7C6FCD" fill="#7C6FCD" fillOpacity={0.3} />
    </RadarChart>
  </ResponsiveContainer>
</GCard>
      </div>

      {insights && (
        <GCard>
          <h2 style={{ fontSize: "15px", fontWeight: "600", margin: "0 0 16px 0", color: COLORS.text }}>
            Skill Demand Scores
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px" }}>
            {insights.demand_scores.map((s, i) => (
              <div key={i} style={{
                background: "linear-gradient(135deg, rgba(124,111,205,0.08), rgba(167,139,250,0.08))",
                borderRadius: "12px", padding: "14px",
                border: "1px solid rgba(124,111,205,0.15)"
              }}>
                <div style={{ fontSize: "12px", fontWeight: "600", color: COLORS.text, marginBottom: "6px" }}>{s.skill}</div>
                <div style={{ fontSize: "26px", fontWeight: "700", color: COLORS.primary }}>{s.demand_score}</div>
                <div style={{ fontSize: "11px", color: COLORS.textLight, marginTop: "4px" }}>
                  {s.frequency + " jobs / " + s.categories_count + " cat."}
                </div>
              </div>
            ))}
          </div>
        </GCard>
      )}
    </PageWrap>
  );
}

// ── Jobs Page ──────────────────────────────────
function JobsPage({ jobs }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(jobs.map(j => j.category))];
  const filtered = jobs.filter(job => {
    const matchSearch = search === "" ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      (job.extracted_skills || []).some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = category === "All" || job.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <PageWrap>
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: "700", margin: "0 0 4px 0", color: "white" }}>Job Listings</h1>
        <p style={{ color: COLORS.textLight, margin: 0, fontSize: "14px" }}>{filtered.length + " jobs found"}</p>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, company or skill..."
          style={{
            flex: 1, padding: "12px 16px", borderRadius: "12px",
            border: "1px solid rgba(124,111,205,0.2)", fontSize: "14px",
            outline: "none", background: "white",
            boxShadow: "0 2px 8px rgba(124,111,205,0.08)"
          }}
        />
        <select value={category} onChange={e => setCategory(e.target.value)}
          style={{
            padding: "12px 16px", borderRadius: "12px",
            border: "1px solid rgba(124,111,205,0.2)", fontSize: "14px",
            background: "white", cursor: "pointer", outline: "none",
            boxShadow: "0 2px 8px rgba(124,111,205,0.08)"
          }}
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((job, i) => (
          <div key={i} className="hover-lift" style={{ ...glassCard, padding: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <a href={job.url} target="_blank" rel="noreferrer"
                  style={{ fontSize: "15px", fontWeight: "600", color: COLORS.primary, textDecoration: "none" }}>
                  {job.title}
                </a>
                <div style={{ fontSize: "13px", color: COLORS.textLight, marginTop: "4px" }}>{job.company}</div>
              </div>
              <span style={{ background: "rgba(124,111,205,0.1)", color: COLORS.primary, padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" }}>
                {job.category}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
              {(job.extracted_skills || []).slice(0, 5).map((s, j) => (
                <span key={j} style={{ background: "rgba(124,111,205,0.08)", color: COLORS.primary, padding: "3px 8px", borderRadius: "6px", fontSize: "11px" }}>
                  {s}
                </span>
              ))}
              {(job.extracted_skills || []).length > 5 && (
                <span style={{ fontSize: "11px", color: COLORS.textLight }}>
                  {"+" + ((job.extracted_skills || []).length - 5) + " more"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </PageWrap>
  );
}

// ── Resume Page ────────────────────────────────
function ResumePage({ userName, profession }) {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileRef = useRef(null);

  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  setFileName(file.name);
  setUploading(true);
  try {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await axios.post(API + "/upload/resume", formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setResumeText(res.data.text);
  } catch (err) {
    const msg = err.response && err.response.data && err.response.data.error
      ? err.response.data.error
      : 'Failed to parse file.';
    setFileName('');
    alert(msg + ' Please paste your resume text in the box below.');
  } finally {
    setUploading(false);
  }
};

  const analyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(API + "/resume/analyze", {
        resumeText,
        profession: profession ? profession.id : "software-development"
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: "700", margin: "0 0 4px 0", color: "white" }}>
          AI Resume Analyzer
        </h1>
        <p style={{ color: COLORS.textLight, margin: 0, fontSize: "14px" }}>
          Upload your resume or paste text for personalized career analysis
        </p>
      </div>

      <GCard>
        {/* Upload button */}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          onChange={handleFileUpload}
          style={{ display: "none" }}
        />
        <div
          onClick={() => fileRef.current.click()}
          style={{
            border: "2px dashed rgba(124,111,205,0.3)",
            borderRadius: "12px", padding: "28px",
            textAlign: "center", cursor: "pointer",
            background: "rgba(124,111,205,0.03)",
            marginBottom: "16px",
            transition: "all 0.2s ease"
          }}
        >
          {uploading ? (
            <div style={{ color: COLORS.primary, fontSize: "14px" }}>Parsing your resume...</div>
          ) : fileName ? (
            <div>
              <div style={{ fontSize: "28px", marginBottom: "8px" }}>✅</div>
              <div style={{ color: COLORS.primary, fontSize: "14px", fontWeight: "600" }}>{fileName}</div>
              <div style={{ color: COLORS.textLight, fontSize: "12px", marginTop: "4px" }}>Click to upload a different file</div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>📄</div>
              <div style={{ color: COLORS.primary, fontSize: "14px", fontWeight: "600" }}>
                Click to upload resume
              </div>
              <div style={{ color: COLORS.textLight, fontSize: "12px", marginTop: "6px" }}>
                PDF, TXT supported (max 5MB)
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", color: COLORS.textLight, fontSize: "13px", marginBottom: "16px" }}>
          — or paste your resume text —
        </div>

        <textarea
          value={resumeText}
          onChange={e => setResumeText(e.target.value)}
          placeholder="Paste your resume text here..."
          style={{
            width: "100%", height: "160px", padding: "14px",
            border: "1px solid rgba(124,111,205,0.2)", borderRadius: "12px",
            fontSize: "13px", resize: "vertical", fontFamily: "sans-serif",
            boxSizing: "border-box", outline: "none",
            background: "rgba(124,111,205,0.03)", lineHeight: "1.6"
          }}
        />

        <button
          onClick={analyze}
          disabled={loading || !resumeText.trim()}
          style={{
            marginTop: "14px", padding: "12px 32px",
            background: loading || !resumeText.trim()
              ? "#ccc"
              : "linear-gradient(135deg, #7C6FCD, #a78bfa)",
            color: "white", border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: "600",
            cursor: loading || !resumeText.trim() ? "not-allowed" : "pointer",
            boxShadow: loading ? "none" : "0 4px 20px rgba(124,111,205,0.35)",
            transition: "all 0.2s ease"
          }}
        >
          {loading ? "Analyzing with AI..." : "Analyze My Resume"}
        </button>
      </GCard>

      {result && (
        <div className="fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {result.overview && (
            <GCard style={{ background: "linear-gradient(135deg, rgba(124,111,205,0.08), rgba(167,139,250,0.05))", border: "1px solid rgba(124,111,205,0.2)" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", color: COLORS.primary, margin: "0 0 12px 0" }}>
                AI Career Overview
              </h3>
              <p style={{ fontSize: "14px", color: COLORS.text, lineHeight: "1.8", margin: 0 }}>
                {result.overview}
              </p>
            </GCard>
          )}

          <div style={{
            background: "linear-gradient(135deg, #7C6FCD, #a78bfa)",
            borderRadius: "16px", padding: "24px", color: "white",
            display: "flex", alignItems: "center", gap: "24px",
            boxShadow: "0 8px 32px rgba(124,111,205,0.35)"
          }}>
            <div style={{ fontSize: "56px", fontWeight: "800" }}>{result.match_score + "%"}</div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "700" }}>Market Match Score</div>
              <div style={{ fontSize: "13px", opacity: 0.8, marginTop: "6px" }}>
                {result.user_skills.length + " skills detected out of " + result.total_market_skills + " tracked"}
              </div>
              <div style={{ marginTop: "12px", height: "6px", background: "rgba(255,255,255,0.3)", borderRadius: "3px", width: "200px" }}>
                <div style={{ height: "100%", width: result.match_score + "%", background: "white", borderRadius: "3px" }} />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <GCard>
              <div style={{ fontSize: "13px", fontWeight: "600", color: COLORS.success, marginBottom: "12px" }}>
                Your Strong Skills
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {result.strong_skills.length === 0 && (
                  <span style={{ fontSize: "13px", color: COLORS.textLight }}>No exact market matches found</span>
                )}
                {result.strong_skills.map((s, i) => (
                  <span key={i} style={{ background: "rgba(109,191,158,0.15)", color: COLORS.success, padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "500" }}>
                    {s}
                  </span>
                ))}
              </div>
            </GCard>

            <GCard>
              <div style={{ fontSize: "13px", fontWeight: "600", color: COLORS.danger, marginBottom: "12px" }}>
                Skills to Learn Next
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {result.missing_skills.slice(0, 5).map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", color: COLORS.text }}>{s.skill}</span>
                    <span style={{ background: "rgba(224,112,112,0.12)", color: COLORS.danger, padding: "2px 10px", borderRadius: "20px", fontSize: "11px" }}>
                      {"score: " + s.demand_score}
                    </span>
                  </div>
                ))}
              </div>
            </GCard>
          </div>

          <GCard>
            <div style={{ fontSize: "13px", color: COLORS.textLight, marginBottom: "12px", fontWeight: "500" }}>
              All skills AI extracted from your resume:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {result.user_skills.map((s, i) => (
                <span key={i} style={{ background: "rgba(124,111,205,0.1)", color: COLORS.primary, padding: "4px 12px", borderRadius: "20px", fontSize: "12px" }}>
                  {s}
                </span>
              ))}
            </div>
          </GCard>
        </div>
      )}
    </PageWrap>
  );
}
// ── Learn Page ─────────────────────────────────
function LearnPage({ skills }) {
  const topSkills = skills.slice(0, 12);
  return (
    <PageWrap>
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: "700", margin: "0 0 4px 0", color: "white" }}>
          Learning Resources
        </h1>
        <p style={{ color: COLORS.textLight, margin: 0, fontSize: "14px" }}>
          Curated resources for the most in-demand skills in your field
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
        {topSkills.map((skill, i) => {
          const resUrl = LEARNING_RESOURCES[skill.skill_name]
            ? LEARNING_RESOURCES[skill.skill_name]
            : "https://www.google.com/search?q=learn+" + skill.skill_name + "+tutorial";
          const hasResource = !!LEARNING_RESOURCES[skill.skill_name];
          return (
            <div key={i} className="hover-lift" style={{ ...glassCard, padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div style={{ fontSize: "15px", fontWeight: "600", color: COLORS.text }}>{skill.skill_name}</div>
                <span style={{ background: "rgba(124,111,205,0.1)", color: COLORS.primary, padding: "3px 8px", borderRadius: "20px", fontSize: "11px" }}>
                  {"#" + (i + 1)}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: COLORS.textLight, marginBottom: "16px" }}>
                {"Appears in " + skill.frequency + " job listings"}
              </div>
              <div style={{ marginBottom: "16px", height: "4px", background: "rgba(124,111,205,0.1)", borderRadius: "2px" }}>
                <div style={{
                  height: "100%", borderRadius: "2px",
                  background: "linear-gradient(90deg, #7C6FCD, #a78bfa)",
                  width: Math.min(100, skill.frequency * 10) + "%"
                }} />
              </div>
              <a href={resUrl} target="_blank" rel="noreferrer"
                style={{
                  display: "inline-block", padding: "8px 18px",
                  background: hasResource ? "linear-gradient(135deg, #7C6FCD, #a78bfa)" : "rgba(124,111,205,0.08)",
                  color: hasResource ? "white" : COLORS.primary,
                  borderRadius: "8px", fontSize: "13px",
                  textDecoration: "none", fontWeight: "500",
                  border: hasResource ? "none" : "1px solid rgba(124,111,205,0.2)",
                  boxShadow: hasResource ? "0 4px 12px rgba(124,111,205,0.3)" : "none"
                }}
              >
                {hasResource ? "Start Learning" : "Find Resources"}
              </a>
            </div>
          );
        })}
      </div>
    </PageWrap>
  );
}

// ── Interview Prep Page ────────────────────────
function InterviewPage({ skills, userName }) {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const generateQuestions = async (skill) => {
    setSelectedSkill(skill);
    setLoading(true);
    setQuestions([]);
    try {
      const res = await axios.post(API + "/resume/interview", { skill: skill.skill_name });
      setQuestions(res.data.questions || []);
    } catch (err) {
      setQuestions([
        "What is " + skill.skill_name + " and how have you used it?",
        "Describe a challenging problem you solved using " + skill.skill_name,
        "What are the best practices for " + skill.skill_name + "?",
        "How does " + skill.skill_name + " compare to alternatives?",
        "Walk me through a project where you used " + skill.skill_name,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: "700", margin: "0 0 4px 0", color: "white" }}>
          Interview Prep
        </h1>
        <p style={{ color: COLORS.textLight, margin: 0, fontSize: "14px" }}>
          AI-generated interview questions for top market skills
        </p>
      </div>

      <GCard>
        <div style={{ fontSize: "14px", fontWeight: "500", color: COLORS.text, marginBottom: "14px" }}>
          Select a skill to generate interview questions:
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {skills.slice(0, 12).map((skill, i) => (
            <button key={i}
              onClick={() => generateQuestions(skill)}
              style={{
                padding: "8px 16px", borderRadius: "20px", fontSize: "13px",
                fontWeight: "500", cursor: "pointer", border: "none",
                background: selectedSkill && selectedSkill.skill_name === skill.skill_name
                  ? "linear-gradient(135deg, #7C6FCD, #a78bfa)"
                  : "rgba(124,111,205,0.1)",
                color: selectedSkill && selectedSkill.skill_name === skill.skill_name
                  ? "white" : COLORS.primary,
                transition: "all 0.2s ease",
                boxShadow: selectedSkill && selectedSkill.skill_name === skill.skill_name
                  ? "0 4px 12px rgba(124,111,205,0.3)" : "none"
              }}
            >
              {skill.skill_name}
            </button>
          ))}
        </div>
      </GCard>

      {loading && (
        <GCard style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px", animation: "pulse 1s ease infinite" }}>🤔</div>
          <div style={{ color: COLORS.textLight, fontSize: "14px" }}>
            Generating interview questions...
          </div>
        </GCard>
      )}

      {questions.length > 0 && selectedSkill && (
        <GCard>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: COLORS.text, margin: "0 0 20px 0" }}>
            {"Interview Questions: " + selectedSkill.skill_name}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {questions.map((q, i) => (
              <div key={i} className="fade-in" style={{
                display: "flex", gap: "14px", alignItems: "flex-start",
                padding: "14px", borderRadius: "10px",
                background: "rgba(124,111,205,0.05)",
                border: "1px solid rgba(124,111,205,0.1)",
                animationDelay: i * 0.1 + "s"
              }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #7C6FCD, #a78bfa)",
                  color: "white", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "13px", fontWeight: "700"
                }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: "14px", color: COLORS.text, lineHeight: "1.6" }}>{q}</div>
              </div>
            ))}
          </div>
        </GCard>
      )}
    </PageWrap>
  );
}

// ── Skill Roadmap Page ─────────────────────────
function RoadmapPage({ skills, profession }) {
  const levels = [
    {
      level: "Beginner",
      color: COLORS.success,
      bg: "rgba(109,191,158,0.1)",
      skills: skills.slice(6, 10).map(s => s.skill_name),
      desc: "Start here — foundational skills with high demand"
    },
    {
      level: "Intermediate",
      color: COLORS.warning,
      bg: "rgba(232,168,56,0.1)",
      skills: skills.slice(3, 7).map(s => s.skill_name),
      desc: "Build on your foundation — mid-level market demand"
    },
    {
      level: "Advanced",
      color: COLORS.danger,
      bg: "rgba(224,112,112,0.1)",
      skills: skills.slice(0, 4).map(s => s.skill_name),
      desc: "Top market demand — stand out from the crowd"
    },
  ];

  return (
    <PageWrap>
      <div>
        <h1 style={{ fontSize: "26px", fontWeight: "700", margin: "0 0 4px 0", color: "white" }}>
          Skill Roadmap
        </h1>
        <p style={{ color: COLORS.textLight, margin: 0, fontSize: "14px" }}>
          {profession ? "Your personalized " + profession.label + " learning path" : "Your personalized learning path based on market demand"}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {levels.map((lvl, i) => (
          <div key={i} className="hover-lift" style={{ ...glassCard, padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: lvl.bg, border: "2px solid " + lvl.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", fontWeight: "700", color: lvl.color
              }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "700", color: lvl.color }}>{lvl.level}</div>
                <div style={{ fontSize: "12px", color: COLORS.textLight }}>{lvl.desc}</div>
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {lvl.skills.map((s, j) => (
                <span key={j} style={{
                  padding: "6px 14px", borderRadius: "20px", fontSize: "13px",
                  background: lvl.bg, color: lvl.color,
                  border: "1px solid " + lvl.color + "40", fontWeight: "500"
                }}>
                  {s}
                </span>
              ))}
            </div>
            {i < levels.length - 1 && (
              <div style={{ marginTop: "20px", textAlign: "center", color: COLORS.textLight, fontSize: "20px" }}>
                ↓
              </div>
            )}
          </div>
        ))}
      </div>

      <GCard style={{ background: "linear-gradient(135deg, rgba(124,111,205,0.08), rgba(167,139,250,0.05))", border: "1px solid rgba(124,111,205,0.2)", textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>🎯</div>
        <div style={{ fontSize: "16px", fontWeight: "700", color: COLORS.text, marginBottom: "8px" }}>
          Pro Tip
        </div>
        <div style={{ fontSize: "14px", color: COLORS.textLight, lineHeight: "1.7" }}>
          Focus on the Advanced skills first if you already have programming experience. The market rewards specialization over breadth.
        </div>
      </GCard>
    </PageWrap>
  );
}

// ── Main App ───────────────────────────────────
export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [userName, setUserName] = useState("");
  const [profession, setProfession] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  // Responsive mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // auto adjust sidebar based on screen
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!onboarded) return;

    const fetchData = async () => {
      try {
        const profId = profession ? profession.id : "software-development";

        const [skillsRes, jobsRes, insightsRes] = await Promise.all([
          axios.get(API + "/profession/" + profId + "/skills"),
          axios.get(API + "/profession/" + profId + "/jobs"),
          axios.get(API + "/insights"),
        ]);

        setSkills(skillsRes.data.skills || skillsRes.data);
        setJobs(jobsRes.data);
        setInsights(insightsRes.data);

      } catch (err) {
        console.error("Error:", err);

        // fallback
        try {
          const [skillsRes, jobsRes, insightsRes] = await Promise.all([
            axios.get(API + "/skills/top"),
            axios.get(API + "/jobs"),
            axios.get(API + "/insights"),
          ]);

          setSkills(skillsRes.data);
          setJobs(jobsRes.data);
          setInsights(insightsRes.data);

        } catch (e) {
          console.error(e);
        }

      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [onboarded]);

  const handleOnboardComplete = (name, prof) => {
    setUserName(name);
    setProfession(prof);
    setOnboarded(true);
  };

  // Navigation handling
  const handleNavClick = (id) => {
    setPage(id);

    // auto close only on mobile
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  if (!onboarded) {
    return (
      <div>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }

          ::placeholder {
            color: rgba(255,255,255,0.5);
          }
        `}</style>

        <SplashScreen onComplete={handleOnboardComplete} />
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ position: "fixed", inset: 0 }}>
        <AnimatedBg />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            gap: "16px"
          }}
        >
          <div
            className="shimmer-text"
            style={{
              fontSize: "36px",
              fontWeight: "800"
            }}
          >
            JobIQ
          </div>

          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "14px"
            }}
          >
            {"Loading your " + (profession ? profession.label : "") + " intelligence..."}
          </div>
        </div>

        <style>{`
          @keyframes shimmer {
            from { background-position: -200% center; }
            to { background-position: 200% center; }
          }

          .shimmer-text {
            background: linear-gradient(90deg, #fff 0%, #c4b5fd 50%, #fff 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 3s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      }}
    >
      <AnimatedBg />

      <style>{`
        * { box-sizing: border-box; }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%,100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shimmer {
          from { background-position: -200% center; }
          to { background-position: 200% center; }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes blob1 {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(100px,50px) scale(1.2); }
        }

        @keyframes blob2 {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(-80px,-60px) scale(1.1); }
        }

        @keyframes blob3 {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(60px,-80px) scale(0.9); }
        }

        .fade-in-up {
          animation: fadeInUp 0.6s ease forwards;
        }

        .fade-in {
          animation: fadeIn 0.4s ease forwards;
        }

        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hover-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(124,111,205,0.2);
        }

        .prof-card {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .prof-card:hover {
          transform: translateY(-4px) scale(1.02);
        }

        .nav-item {
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .nav-item:hover {
          background: rgba(255,255,255,0.1) !important;
        }

        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #c4b5fd 50%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        ::placeholder {
          color: rgba(255,255,255,0.5);
        }

        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(124,111,205,0.3);
          border-radius: 3px;
        }
      `}</style>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          width: "100%"
        }}
      >

        {/* Hamburger Button */}
        <button
          onClick={() => setSidebarOpen(prev => !prev)}
          style={{
            position: "fixed",
            top: "20px",
            left:
  sidebarOpen && !isMobile
    ? "250px"
    : sidebarOpen && isMobile
    ? "246px"
    : "20px",

            zIndex: 200,
            background: "rgba(124,111,205,0.9)",
            border: "none",
            borderRadius: "10px",
            width: "40px",
            height: "40px",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
            transition: "left 0.3s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>

        {/* Mobile overlay */}
        {sidebarOpen && isMobile && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              zIndex: 99
            }}
          />
        )}

        {/* Sidebar wrapper */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 100,
            transition: "transform 0.3s ease",

            transform:
              isMobile
                ? (sidebarOpen ? "translateX(0)" : "translateX(-100%)")
                : (sidebarOpen ? "translateX(0)" : "translateX(-230px)")
          }}
        >
          <Sidebar
            page={page}
            setPage={handleNavClick}
            userName={userName}
            profession={profession}
            isOpen={true}
          />
        </div>

        {/* Main content */}
        <div
          style={{
            flex: 1,
            padding: "24px",
            overflowY: "auto",
            width: "100%",

          marginLeft:
  isMobile
    ? "0"
    : (sidebarOpen ? "260px" : "24px"),

            transition: "margin-left 0.3s ease"
          }}
        >
          {page === "dashboard" && (
            <DashboardPage
              skills={skills}
              jobs={jobs}
              insights={insights}
              userName={userName}
              profession={profession}
            />
          )}

          {page === "jobs" && (
            <JobsPage jobs={jobs} />
          )}

          {page === "resume" && (
            <ResumePage
              userName={userName}
              profession={profession}
            />
          )}

          {page === "learn" && (
            <LearnPage skills={skills} />
          )}

          {page === "interview" && (
            <InterviewPage
              skills={skills}
              userName={userName}
            />
          )}

          {page === "roadmap" && (
            <RoadmapPage
              skills={skills}
              profession={profession}
            />
          )}
        </div>
      </div>
    </div>
  );
}
  


