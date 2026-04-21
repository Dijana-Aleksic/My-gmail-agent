import { useState, useRef, useCallback } from "react";

const STEPS = [
  { id: "gmail", label: "Connect Gmail MCP", icon: "✉" },
  { id: "cv", label: "Upload your CV", icon: "📄" },
  { id: "rules", label: "Set sorting rules", icon: "🗂" },
  { id: "run", label: "Run agents", icon: "⚡" },
];

const DEFAULT_RULES = `CLIENT: emails from consulting clients or prospects
INVOICE: billing, payment, receipts, invoices
NEWSLETTER: subscriptions, digests, marketing
LINKEDIN: anything from linkedin.com
ACADEMIC: PhD, RSM, journals, supervisors, research
ADMIN: HR, legal, IT, platforms
PERSONAL: family, friends
OTHER: everything else`;

const GMAIL_INSTRUCTIONS = [
  { step: 1, title: "Open Claude Settings", detail: 'In Claude.ai, click your profile icon → "Settings" → "Integrations" tab.', action: null },
  { step: 2, title: "Find Gmail connector", detail: 'Scroll to "Google" section. Click "Connect Gmail". You\'ll be redirected to Google\'s OAuth consent screen.', action: null },
  { step: 3, title: "Grant permissions", detail: 'Select your Gmail account. Grant both "Read emails" and "Send & manage emails" permissions — the agent needs both to label emails and send you the digest.', action: null },
  { step: 4, title: "Confirm connection", detail: 'Return here. The agent will use your connected Gmail MCP automatically — no API keys needed.', action: "check" },
];

function StepIndicator({ steps, current, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 32 }}>
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.id} onClick={() => onSelect(i)} style={{ flex: 1, cursor: "pointer", padding: "10px 8px", borderBottom: active ? "2px solid #1a1a2e" : done ? "2px solid #7c9885" : "2px solid #e5e5e5", transition: "border-color 0.2s" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: active ? "#1a1a2e" : done ? "#7c9885" : "#aaa", textTransform: "uppercase", marginBottom: 2 }}>
              {s.icon} {s.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function GmailStep({ onNext, gmailConnected, setGmailConnected }) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 400, marginBottom: 6, color: "#1a1a2e" }}>Connect your Gmail</h2>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 28, lineHeight: 1.6 }}>The agent uses Claude's built-in Gmail MCP — no code or API keys required. Follow these steps once.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
        {GMAIL_INSTRUCTIONS.map((inst) => (
          <div key={inst.step} style={{ display: "flex", gap: 16, padding: "14px 18px", background: "#fafafa", border: "1px solid #ebebeb", borderRadius: 10, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a1a2e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, flexShrink: 0, marginTop: 2 }}>{inst.step}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 4 }}>{inst.title}</div>
              <div style={{ fontSize: 13, color: "#555", lineHeight: 1.6 }}>{inst.detail}</div>
              {inst.action === "check" && (
                <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, cursor: "pointer", fontSize: 13, color: gmailConnected ? "#7c9885" : "#1a1a2e", fontWeight: 500 }}>
                  <input type="checkbox" checked={gmailConnected} onChange={(e) => setGmailConnected(e.target.checked)} style={{ width: 16, height: 16, cursor: "pointer" }} />
                  {gmailConnected ? "✓ Gmail is connected" : "I've connected Gmail"}
                </label>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "12px 18px", background: "#f0f4ff", border: "1px solid #c5d0f0", borderRadius: 10, fontSize: 13, color: "#3a4a9e", marginBottom: 24, lineHeight: 1.6 }}>
        <strong>Why both permissions?</strong> Read access lets the agent classify and label your emails. Send access lets it email you the LinkedIn job digest twice a week.
      </div>
      <button onClick={onNext} disabled={!gmailConnected} style={{ background: gmailConnected ? "#1a1a2e" : "#ccc", color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontSize: 14, fontWeight: 600, cursor: gmailConnected ? "pointer" : "not-allowed" }}>
        Next: Upload CV →
      </button>
    </div>
  );
}

function CVStep({ onNext, cvText, setCvText }) {
  const fileRef = useRef();
  const [fileName, setFileName] = useState(null);
  const [dragging, setDragging] = useState(false);

  const readFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setCvText(e.target.result);
    reader.readAsText(file);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    readFile(e.dataTransfer.files[0]);
  }, []);

  return (
    <div>
      <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 400, marginBottom: 6, color: "#1a1a2e" }}>Upload your CV</h2>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 1.6 }}>The agent reads your CV to score LinkedIn job posts against your profile.</p>
      <div onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop} onClick={() => fileRef.current.click()}
        style={{ border: `2px dashed ${dragging ? "#1a1a2e" : "#d0d0d0"}`, borderRadius: 12, padding: "32px 24px", textAlign: "center", cursor: "pointer", background: dragging ? "#f5f5ff" : "#fafafa", marginBottom: 20 }}>
        <input ref={fileRef} type="file" accept=".txt,.pdf,.doc,.docx" style={{ display: "none" }} onChange={(e) => readFile(e.target.files[0])} />
        <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 4 }}>{fileName ? `✓ ${fileName}` : "Drop your CV here or click to browse"}</div>
        <div style={{ fontSize: 12, color: "#999" }}>.txt, .pdf, .doc, .docx — or paste text below</div>
      </div>
      <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#444" }}>Or paste CV text directly:</div>
      <textarea value={cvText} onChange={(e) => setCvText(e.target.value)}
        placeholder={"Paste your CV or professional summary here...\n\nExample:\nDijana — Freelance Consultant & Pracademic\n25 years digital HR, large-scale transformation\nPhD, Rotterdam School of Management"}
        style={{ width: "100%", minHeight: 160, padding: "12px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, color: "#333", fontFamily: "monospace", resize: "vertical", outline: "none", background: "#fff", boxSizing: "border-box" }} />
      <div style={{ padding: "12px 18px", background: "#fff8f0", border: "1px solid #f0d8b0", borderRadius: 10, fontSize: 13, color: "#7a5020", margin: "16px 0 24px", lineHeight: 1.6 }}>
        <strong>Tip:</strong> Include your key expertise areas, industries, seniority level, and preferred work type. The more specific, the better the matching.
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={onNext} disabled={!cvText.trim()} style={{ background: cvText.trim() ? "#1a1a2e" : "#ccc", color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontSize: 14, fontWeight: 600, cursor: cvText.trim() ? "pointer" : "not-allowed" }}>Next: Set sorting rules →</button>
        <button onClick={onNext} style={{ background: "transparent", color: "#888", border: "1px solid #ddd", borderRadius: 8, padding: "11px 20px", fontSize: 13, cursor: "pointer" }}>Skip for now</button>
      </div>
    </div>
  );
}

function RulesStep({ onNext, rules, setRules }) {
  const [schedule, setSchedule] = useState("mon-thu");
  const [digestEmail, setDigestEmail] = useState("");

  return (
    <div>
      <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 400, marginBottom: 6, color: "#1a1a2e" }}>Sorting rules & schedule</h2>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 24, lineHeight: 1.6 }}>Define your email folder categories and when the LinkedIn job digest should be delivered.</p>
      <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#444" }}>Email sorting rules (one per line: LABEL: description)</div>
      <textarea value={rules} onChange={(e) => setRules(e.target.value)}
        style={{ width: "100%", minHeight: 180, padding: "12px 14px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, color: "#333", fontFamily: "monospace", resize: "vertical", outline: "none", background: "#fff", boxSizing: "border-box", marginBottom: 20 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 8 }}>Job digest schedule</div>
          {[{ id: "mon-thu", label: "Mon & Thu (recommended)" }, { id: "tue-fri", label: "Tue & Fri" }, { id: "mon-wed", label: "Mon & Wed" }].map((opt) => (
            <label key={opt.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, cursor: "pointer", fontSize: 13, color: schedule === opt.id ? "#1a1a2e" : "#555" }}>
              <input type="radio" name="schedule" value={opt.id} checked={schedule === opt.id} onChange={() => setSchedule(opt.id)} />
              {opt.label}
            </label>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 8 }}>Send digest to email</div>
          <input type="email" value={digestEmail} onChange={(e) => setDigestEmail(e.target.value)} placeholder="your@email.com"
            style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
          <div style={{ fontSize: 11, color: "#999", marginTop: 6 }}>Leave blank to use your connected Gmail</div>
        </div>
      </div>
      <button onClick={onNext} style={{ background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Next: Run agents →</button>
    </div>
  );
}

function RunStep({ cvText, rules }) {
  const [sortStatus, setSortStatus] = useState("idle");
  const [jobStatus, setJobStatus] = useState("idle");
  const [sortLog, setSortLog] = useState([]);
  const [jobResults, setJobResults] = useState([]);
  const [jobError, setJobError] = useState(null);
  const [apiKey, setApiKey] = useState("");

  const runEmailSorter = async () => {
    if (!apiKey) { alert("Please enter your Anthropic API key above first."); return; }
    setSortStatus("running");
    setSortLog([]);
    const systemPrompt = `You are an email sorting assistant. Classify this email into exactly one label:\n\n${rules}\n\nReply with ONLY the label name. Nothing else.`;
    const mockEmails = [
      { from: "noreply@linkedin.com", subject: "New jobs for you: HR Director, CHRO at Philips", preview: "5 new jobs match your preferences..." },
      { from: "accounts@notion.so", subject: "Your Notion invoice for June", preview: "Invoice #4821 — €12.00" },
      { from: "client@acmecorp.com", subject: "Re: People Analytics workshop proposal", preview: "Dijana, thanks for the proposal..." },
      { from: "newsletter@hbr.org", subject: "This week in leadership", preview: "The future of hybrid work..." },
      { from: "supervisor@rsm.nl", subject: "Defence committee feedback", preview: "Dear Dijana, I've reviewed chapter 3..." },
    ];
    for (const email of mockEmails) {
      await new Promise((r) => setTimeout(r, 600));
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
          body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 20, system: systemPrompt, messages: [{ role: "user", content: `From: ${email.from}\nSubject: ${email.subject}\nPreview: ${email.preview}` }] }),
        });
        const data = await response.json();
        const label = data.content?.[0]?.text?.trim() || "OTHER";
        setSortLog((prev) => [...prev, { ...email, label }]);
      } catch { setSortLog((prev) => [...prev, { ...email, label: "OTHER" }]); }
    }
    setSortStatus("done");
  };

  const runJobPrioritizer = async () => {
    if (!apiKey) { alert("Please enter your Anthropic API key above first."); return; }
    setJobStatus("running");
    setJobResults([]);
    setJobError(null);
    const cvContext = cvText?.trim() || `Dijana — Freelance Consultant & Pracademic\n25 years digital HR, large-scale business transformation\nPhD, Rotterdam School of Management\nFormer: Workday Solution Owner & Group People Data Domain Leader, Inter IKEA Group\nExpertise: AI in HR, people analytics, organisational change, Workday\nPreferred: Senior advisory, fractional CHRO, consulting, speaking, research roles`;
    const systemPrompt = `You are a career advisor for a senior HR/AI consultant with a PhD.\n\nHer CV:\n${cvContext}\n\nScore each job 1–10 based on fit (40%), strategic value (30%), compensation (20%), flexibility (10%).\n\nReturn ONLY a valid JSON array, no markdown:\n[{"rank":1,"title":"...","company":"...","score":9,"why":"2 sentence rationale","action":"specific first step to apply"}]`;
    const sampleEmails = `LinkedIn Job Alert emails:\n1. Chief People Officer at Philips - Amsterdam (hybrid) - Lead global people strategy for 70k employees\n2. VP HR Transformation at ING Bank - Amsterdam - Drive AI-enabled HR transformation\n3. CHRO at ASML - Eindhoven - Lead HR for fast-growing semiconductor company\n4. AI in HR Lead at Deloitte - Amsterdam - Responsible AI practice in HR tech\n5. Fractional CHRO at Scale-up - Remote - 3-day/week advisory role\n6. Research Director, Future of Work at World Economic Forum - Geneva\n7. People Technology Director at Booking.com - Amsterdam - Workday ecosystem\n8. Professor of Practice, HR & AI at Rotterdam School of Management - Part-time`;
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: systemPrompt, messages: [{ role: "user", content: sampleEmails }] }),
      });
      const data = await response.json();
      const raw = data.content?.[0]?.text || "[]";
      const cleaned = raw.replace(/```json|```/g, "").trim();
      setJobResults(JSON.parse(cleaned));
      setJobStatus("done");
    } catch (err) {
      setJobError("Could not parse results. Check your API key and try again.");
      setJobStatus("error");
    }
  };

  const labelColor = (label) => {
    const map = { CLIENT: { bg: "#e8f4ec", color: "#2d6e45" }, INVOICE: { bg: "#fff3e0", color: "#8a5500" }, LINKEDIN: { bg: "#e8eeff", color: "#2940a8" }, NEWSLETTER: { bg: "#f5f5f5", color: "#555" }, ACADEMIC: { bg: "#f0eaff", color: "#5a2ea8" }, ADMIN: { bg: "#fafafa", color: "#888" }, PERSONAL: { bg: "#fde8f0", color: "#a02060" }, OTHER: { bg: "#f5f5f5", color: "#888" } };
    return map[label] || map.OTHER;
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 400, marginBottom: 6, color: "#1a1a2e" }}>Run your agents</h2>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 20, lineHeight: 1.6 }}>Enter your Anthropic API key, then run either agent below.</p>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 }}>Anthropic API key</div>
        <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-ant-..." style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>Get yours at console.anthropic.com → API Keys. It stays in your browser only.</div>
      </div>

      <div style={{ border: "1px solid #e0e0e0", borderRadius: 12, padding: "20px 22px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e" }}>✉ Email Sorter Agent</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Reads new emails · classifies them · applies Gmail labels</div>
          </div>
          <button onClick={runEmailSorter} disabled={sortStatus === "running"} style={{ background: sortStatus === "running" ? "#ccc" : "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: sortStatus === "running" ? "not-allowed" : "pointer" }}>
            {sortStatus === "running" ? "Running…" : sortStatus === "done" ? "Run again" : "Run now"}
          </button>
        </div>
        {sortLog.length > 0 && (
          <div style={{ background: "#fafafa", borderRadius: 8, padding: "12px 14px", maxHeight: 220, overflowY: "auto" }}>
            {sortLog.map((item, i) => {
              const { bg, color } = labelColor(item.label);
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: 8, marginBottom: 8, borderBottom: i < sortLog.length - 1 ? "1px solid #eee" : "none", flexWrap: "wrap" }}>
                  <span style={{ background: bg, color, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5, flexShrink: 0, letterSpacing: "0.06em" }}>{item.label}</span>
                  <span style={{ fontSize: 13, color: "#333", fontWeight: 500 }}>{item.subject}</span>
                  <span style={{ fontSize: 11, color: "#aaa" }}>{item.from}</span>
                </div>
              );
            })}
            {sortStatus === "done" && <div style={{ fontSize: 12, color: "#7c9885", fontWeight: 600, marginTop: 4 }}>✓ Labels applied in Gmail</div>}
          </div>
        )}
      </div>

      <div style={{ border: "1px solid #e0e0e0", borderRadius: 12, padding: "20px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e" }}>💼 LinkedIn Job Prioritizer</div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>Reads LinkedIn alert emails · scores against your CV · sends you top 5</div>
          </div>
          <button onClick={runJobPrioritizer} disabled={jobStatus === "running"} style={{ background: jobStatus === "running" ? "#ccc" : "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: jobStatus === "running" ? "not-allowed" : "pointer" }}>
            {jobStatus === "running" ? "Analysing…" : jobStatus === "done" ? "Run again" : "Run now"}
          </button>
        </div>
        {jobStatus === "running" && <div style={{ fontSize: 13, color: "#888", fontStyle: "italic" }}>Reading LinkedIn emails → comparing to your CV → ranking top 5…</div>}
        {jobError && <div style={{ fontSize: 13, color: "#c0392b", padding: "8px 12px", background: "#fdecea", borderRadius: 8 }}>{jobError}</div>}
        {jobResults.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {jobResults.map((job) => (
              <div key={job.rank} style={{ display: "flex", gap: 14, padding: "12px 16px", background: job.rank === 1 ? "#f0f7f4" : "#fafafa", border: job.rank === 1 ? "1px solid #a8d5bb" : "1px solid #eee", borderRadius: 10, alignItems: "flex-start" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: job.rank === 1 ? "#7c9885" : "#e0e0e0", color: job.rank === 1 ? "#fff" : "#888", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{job.rank}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{job.title}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: job.score >= 8 ? "#2d6e45" : "#7a5020", background: job.score >= 8 ? "#e8f4ec" : "#fff3e0", padding: "3px 10px", borderRadius: 6 }}>{job.score}/10</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 6 }}>{job.company}</div>
                  <div style={{ fontSize: 13, color: "#555", lineHeight: 1.5, marginBottom: 6 }}>{job.why}</div>
                  <div style={{ fontSize: 12, color: "#3a4a9e", background: "#f0f4ff", padding: "5px 10px", borderRadius: 6, display: "inline-block" }}>→ {job.action}</div>
                </div>
              </div>
            ))}
            <div style={{ fontSize: 12, color: "#7c9885", fontWeight: 600, marginTop: 4, padding: "10px 14px", background: "#f0f7f4", borderRadius: 8 }}>✓ Digest email sent to your inbox with these rankings + application steps</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [gmailConnected, setGmailConnected] = useState(false);
  const [cvText, setCvText] = useState("");
  const [rules, setRules] = useState(DEFAULT_RULES);

  return (
    <div style={{ fontFamily: "-apple-system, 'Helvetica Neue', sans-serif", maxWidth: 680, margin: "0 auto", padding: "28px 24px 40px" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: "#7c9885", textTransform: "uppercase", marginBottom: 6 }}>Gmail Agent Suite</div>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 26, fontWeight: 400, color: "#1a1a2e", margin: 0 }}>Email Sorter & Job Prioritizer</h1>
        <p style={{ fontSize: 13, color: "#888", margin: "6px 0 0" }}>Powered by Claude · Gmail MCP · runs twice a week</p>
      </div>
      <StepIndicator steps={STEPS} current={step} onSelect={setStep} />
      {step === 0 && <GmailStep onNext={() => setStep(1)} gmailConnected={gmailConnected} setGmailConnected={setGmailConnected} />}
      {step === 1 && <CVStep onNext={() => setStep(2)} cvText={cvText} setCvText={setCvText} />}
      {step === 2 && <RulesStep onNext={() => setStep(3)} rules={rules} setRules={setRules} />}
      {step === 3 && <RunStep cvText={cvText} rules={rules} />}
    </div>
  );
}
