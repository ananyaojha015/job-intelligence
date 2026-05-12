import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from "recharts";

const API = "http://localhost:5000/api";

const COLORS = {
  primary: "#7C6FCD",
  primaryLight: "#EDE9FF",
  primaryDark: "#5A4FB3",
  bg: "#F5F0FF",
  card: "#FFFFFF",
  text: "#2D2D2D",
  textLight: "#8A8A9A",
  border: "#EDE9FF",
  success: "#6DBF9E",
  warning: "#E8A838",
  danger: "#E07070",
};

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
  "flask": "https://flask.palletsprojects.com/en/stable/quickstart/",
  "tensorflow": "https://www.tensorflow.org/tutorials",
  "pytorch": "https://pytorch.org/tutorials/",
  "git": "https://git-scm.com/doc",
  "github": "https://docs.github.com/en/get-started",
  "go": "https://go.dev/learn/",
  "vue": "https://vuejs.org/guide/introduction.html",
  "nlp": "https://huggingface.co/learn/nlp-course/",
};

function Sidebar({ page, setPage }) {
  const items = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "jobs", icon: "💼", label: "Jobs" },
    { id: "resume", icon: "📄", label: "Resume" },
    { id: "learn", icon: "🎓", label: "Learn" },
  ];

  return (
    <div style={{
      width: "220px", minHeight: "100vh", background: COLORS.card,
      borderRight: "1px solid " + COLORS.border, padding: "24px 16px",
      display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0
    }}>
      <div style={{ marginBottom: "32px", paddingLeft: "8px" }}>
        <div style={{ fontSize: "20px", fontWeight: "700", color: COLORS.primary }}>JobIQ</div>
        <div style={{ fontSize: "12px", color: COLORS.textLight }}>Intelligence Dashboard</div>
      </div>
      {items.map(item => (
        <div
          key={item.id}
          onClick={() => setPage(item.id)}
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
            background: page === item.id ? COLORS.primaryLight : "transparent",
            color: page === item.id ? COLORS.primary : COLORS.textLight,
            fontWeight: page === item.id ? "600" : "400",
            fontSize: "14px",
          }}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function StatCard({ title, value, subtitle, color, icon }) {
  return (
    <div style={{
      background: COLORS.card, borderRadius: "14px",
      padding: "20px", border: "1px solid " + COLORS.border,
      display: "flex", flexDirection: "column", gap: "8px"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: "13px", color: COLORS.textLight }}>{title}</div>
        <div style={{ fontSize: "20px" }}>{icon}</div>
      </div>
      <div style={{ fontSize: "32px", fontWeight: "700", color: color || COLORS.primary }}>{value}</div>
      {subtitle && <div style={{ fontSize: "12px", color: COLORS.textLight }}>{subtitle}</div>}
    </div>
  );
}

function DashboardPage({ skills, jobs, insights }) {
  const chartData = skills.slice(0, 8).map(s => ({
    name: s.skill_name.length > 10 ? s.skill_name.slice(0, 10) + ".." : s.skill_name,
    frequency: s.frequency,
    demand: insights && insights.demand_scores
      ? (insights.demand_scores.find(d => d.skill === s.skill_name) || { demand_score: 0 }).demand_score
      : 0
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 4px 0" }}>Hello, Ananya! 👋</h1>
        <p style={{ color: COLORS.textLight, margin: 0, fontSize: "14px" }}>
          Here is the latest job market intelligence
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <StatCard title="Total Jobs" value={jobs.length} icon="💼"
          subtitle="Tracked listings" color={COLORS.primary} />
        <StatCard
          title="Top Skill"
          value={skills.length > 0 ? skills[0].skill_name : "-"}
          icon="🔥"
          subtitle={"Demand: " + (insights && insights.demand_scores && insights.demand_scores.length > 0 ? insights.demand_scores[0].demand_score : 0)}
          color={COLORS.warning}
        />
        <StatCard title="Skills Tracked" value={skills.length} icon="📊"
          subtitle="Unique market skills" color={COLORS.success} />
      </div>

      <div style={{ background: COLORS.card, borderRadius: "14px", padding: "20px", border: "1px solid " + COLORS.border }}>
        <h2 style={{ fontSize: "15px", fontWeight: "600", margin: "0 0 20px 0" }}>Top Skills in Demand</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: COLORS.textLight }} />
            <YAxis tick={{ fontSize: 12, fill: COLORS.textLight }} />
            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid " + COLORS.border }} />
            <Bar dataKey="frequency" fill={COLORS.primary} radius={[6, 6, 0, 0]} name="Frequency" />
            <Bar dataKey="demand" fill="#C4BAF0" radius={[6, 6, 0, 0]} name="Demand Score" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {insights && (
        <div style={{ background: COLORS.card, borderRadius: "14px", padding: "20px", border: "1px solid " + COLORS.border }}>
          <h2 style={{ fontSize: "15px", fontWeight: "600", margin: "0 0 16px 0" }}>Skill Demand Scores</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
            {insights.demand_scores.map((s, i) => (
              <div key={i} style={{ background: COLORS.bg, borderRadius: "10px", padding: "14px", border: "1px solid " + COLORS.border }}>
                <div style={{ fontSize: "12px", fontWeight: "600", color: COLORS.text, marginBottom: "6px" }}>{s.skill}</div>
                <div style={{ fontSize: "26px", fontWeight: "700", color: COLORS.primary }}>{s.demand_score}</div>
                <div style={{ fontSize: "11px", color: COLORS.textLight, marginTop: "4px" }}>
                  {s.frequency + " jobs / " + s.categories_count + " categories"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 4px 0" }}>Job Listings</h1>
        <p style={{ color: COLORS.textLight, margin: 0, fontSize: "14px" }}>{filtered.length + " jobs found"}</p>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title, company or skill..."
          style={{
            flex: 1, padding: "10px 14px", borderRadius: "10px",
            border: "1px solid " + COLORS.border, fontSize: "14px",
            outline: "none", background: COLORS.card
          }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{
            padding: "10px 14px", borderRadius: "10px",
            border: "1px solid " + COLORS.border, fontSize: "14px",
            background: COLORS.card, cursor: "pointer", outline: "none"
          }}
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filtered.map((job, i) => (
          <div key={i} style={{ background: COLORS.card, borderRadius: "12px", padding: "16px", border: "1px solid " + COLORS.border }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <a href={job.url} target="_blank" rel="noreferrer"
                  style={{ fontSize: "15px", fontWeight: "600", color: COLORS.primary, textDecoration: "none" }}>
                  {job.title}
                </a>
                <div style={{ fontSize: "13px", color: COLORS.textLight, marginTop: "4px" }}>{job.company}</div>
              </div>
              <span style={{
                background: COLORS.primaryLight, color: COLORS.primary,
                padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "500"
              }}>
                {job.category}
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "12px" }}>
              {(job.extracted_skills || []).slice(0, 5).map((s, j) => (
                <span key={j} style={{ background: COLORS.bg, color: COLORS.primary, padding: "3px 8px", borderRadius: "6px", fontSize: "11px" }}>
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
    </div>
  );
}

function ResumePage() {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(API + "/resume/analyze", { resumeText });
      setResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 4px 0" }}>AI Resume Analyzer</h1>
        <p style={{ color: COLORS.textLight, margin: 0, fontSize: "14px" }}>
          Paste your resume and get personalized skill gap analysis
        </p>
      </div>

      <div style={{ background: COLORS.card, borderRadius: "14px", padding: "20px", border: "1px solid " + COLORS.border }}>
        <textarea
          value={resumeText}
          onChange={e => setResumeText(e.target.value)}
          placeholder="Paste your resume text here..."
          style={{
            width: "100%", height: "180px", padding: "12px",
            border: "1px solid " + COLORS.border, borderRadius: "10px",
            fontSize: "13px", resize: "vertical", fontFamily: "sans-serif",
            boxSizing: "border-box", outline: "none", background: COLORS.bg
          }}
        />
        <button
          onClick={analyze}
          disabled={loading}
          style={{
            marginTop: "12px", padding: "10px 28px",
            background: loading ? COLORS.textLight : COLORS.primary,
            color: "white", border: "none", borderRadius: "10px",
            fontSize: "14px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? "Analyzing with AI..." : "Analyze Resume"}
        </button>
      </div>

      {result && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{
            background: COLORS.primary, borderRadius: "14px", padding: "20px",
            color: "white", display: "flex", alignItems: "center", gap: "20px"
          }}>
            <div style={{ fontSize: "48px", fontWeight: "700" }}>{result.match_score + "%"}</div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "600" }}>Market Match Score</div>
              <div style={{ fontSize: "13px", opacity: 0.8, marginTop: "4px" }}>
                {result.user_skills.length + " skills detected / " + result.total_market_skills + " tracked in market"}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ background: COLORS.card, borderRadius: "14px", padding: "16px", border: "1px solid " + COLORS.border }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: COLORS.success, marginBottom: "12px" }}>
                Your Strong Skills
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {result.strong_skills.length === 0 && (
                  <span style={{ fontSize: "13px", color: COLORS.textLight }}>No exact matches found</span>
                )}
                {result.strong_skills.map((s, i) => (
                  <span key={i} style={{ background: "#E8F8F0", color: COLORS.success, padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ background: COLORS.card, borderRadius: "14px", padding: "16px", border: "1px solid " + COLORS.border }}>
              <div style={{ fontSize: "13px", fontWeight: "600", color: COLORS.danger, marginBottom: "12px" }}>
                Skills to Learn Next
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {result.missing_skills.slice(0, 5).map((s, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px" }}>{s.skill}</span>
                    <span style={{ background: "#FEE8E8", color: COLORS.danger, padding: "2px 8px", borderRadius: "20px", fontSize: "11px" }}>
                      {"score: " + s.demand_score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: COLORS.card, borderRadius: "14px", padding: "16px", border: "1px solid " + COLORS.border }}>
            <div style={{ fontSize: "13px", color: COLORS.textLight, marginBottom: "10px" }}>
              AI extracted these skills from your resume:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {result.user_skills.map((s, i) => (
                <span key={i} style={{ background: COLORS.primaryLight, color: COLORS.primary, padding: "3px 10px", borderRadius: "20px", fontSize: "12px" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LearnPage({ skills }) {
  const topSkills = skills.slice(0, 12);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div>
        <h1 style={{ fontSize: "24px", fontWeight: "700", margin: "0 0 4px 0" }}>Learning Resources</h1>
        <p style={{ color: COLORS.textLight, margin: 0, fontSize: "14px" }}>
          Curated resources for the most in-demand skills
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
        {topSkills.map((skill, i) => {
          const resUrl = LEARNING_RESOURCES[skill.skill_name]
            ? LEARNING_RESOURCES[skill.skill_name]
            : "https://www.google.com/search?q=learn+" + skill.skill_name + "+tutorial";
          const hasResource = !!LEARNING_RESOURCES[skill.skill_name];

          return (
            <div key={i} style={{ background: COLORS.card, borderRadius: "14px", padding: "18px", border: "1px solid " + COLORS.border }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ fontSize: "15px", fontWeight: "600", color: COLORS.text }}>{skill.skill_name}</div>
                <span style={{ background: COLORS.primaryLight, color: COLORS.primary, padding: "3px 8px", borderRadius: "20px", fontSize: "11px" }}>
                  {"#" + (i + 1)}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: COLORS.textLight, marginBottom: "14px" }}>
                {"Appears in " + skill.frequency + " job listings"}
              </div>
              <a
                href={resUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block", padding: "8px 16px",
                  background: hasResource ? COLORS.primary : COLORS.bg,
                  color: hasResource ? "white" : COLORS.primary,
                  borderRadius: "8px", fontSize: "13px",
                  textDecoration: "none", fontWeight: "500",
                  border: hasResource ? "none" : "1px solid " + COLORS.border
                }}
              >
                {hasResource ? "Start Learning" : "Search Resources"}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, jobsRes, insightsRes] = await Promise.all([
          axios.get(API + "/skills/top"),
          axios.get(API + "/jobs"),
          axios.get(API + "/insights"),
        ]);
        setSkills(skillsRes.data);
        setJobs(jobsRes.data);
        setInsights(insightsRes.data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: COLORS.bg, fontSize: "16px", color: COLORS.primary }}>
        Loading JobIQ...
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, fontFamily: "sans-serif" }}>
      <Sidebar page={page} setPage={setPage} />
      <div style={{ flex: 1, padding: "32px", overflowY: "auto", maxWidth: "900px" }}>
        {page === "dashboard" && <DashboardPage skills={skills} jobs={jobs} insights={insights} />}
        {page === "jobs" && <JobsPage jobs={jobs} />}
        {page === "resume" && <ResumePage />}
        {page === "learn" && <LearnPage skills={skills} />}
      </div>
    </div>
  );
}
