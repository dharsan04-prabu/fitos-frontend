import { useState, useEffect, useRef, useCallback } from "react";

// ─── CONFIG ───────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ─── ICONS (inline SVG, no dependency) ───────────────────
const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  plan:     "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  progress: "M22 12h-4l-3 9L9 3l-3 9H2",
  coach:    "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5z",
  camera:   "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8",
  check:    "M20 6L9 17l-5-5",
  fire:     "M12 2c0 0-5.5 5-5.5 10a5.5 5.5 0 0011 0C17.5 7 12 2 12 2z",
  bolt:     "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  arrow:    "M5 12h14M12 5l7 7-7 7",
  send:     "M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z",
  x:        "M18 6L6 18M6 6l12 12",
  plus:     "M12 5v14M5 12h14",
  trend:    "M23 6l-9.5 9.5-5-5L1 18",
};

// ─── THEME ───────────────────────────────────────────────
const theme = {
  bg:       "#0a0f1a",
  surface:  "#111827",
  surfaceHover: "#162033",
  border:   "rgba(99,179,237,0.12)",
  borderHover: "rgba(99,179,237,0.28)",
  accent:   "#38bdf8",
  accentDim: "rgba(56,189,248,0.12)",
  accentMid: "rgba(56,189,248,0.22)",
  text:     "#e2e8f0",
  textMuted: "#64748b",
  textDim:  "#94a3b8",
  green:    "#34d399",
  greenDim: "rgba(52,211,153,0.12)",
  red:      "#f87171",
  redDim:   "rgba(248,113,113,0.12)",
  amber:    "#fbbf24",
  amberDim: "rgba(251,191,36,0.12)",
};

// ─── GLOBAL STYLES ────────────────────────────────────────
const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: ${theme.bg}; color: ${theme.text}; font-family: 'Syne', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${theme.border}; border-radius: 2px; }
  input, select, textarea { font-family: 'Syne', sans-serif; outline: none; }
  button { font-family: 'Syne', sans-serif; cursor: pointer; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
  .fade-up { animation: fadeUp 0.4s ease both; }
  .pulse { animation: pulse 1.5s ease infinite; }
`;

// ─── SHARED COMPONENTS ────────────────────────────────────
const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{
    background: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: 16,
    padding: "20px 24px",
    transition: "border-color 0.2s",
    ...(onClick ? { cursor: "pointer" } : {}),
    ...style,
  }}
  onMouseEnter={e => { if(onClick) e.currentTarget.style.borderColor = theme.borderHover; }}
  onMouseLeave={e => { if(onClick) e.currentTarget.style.borderColor = theme.border; }}>
    {children}
  </div>
);

const Input = ({ label, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 11, color: theme.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</label>}
    <input {...props} style={{
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${theme.border}`,
      borderRadius: 10,
      padding: "10px 14px",
      color: theme.text,
      fontSize: 14,
      width: "100%",
      transition: "border-color 0.2s",
      ...props.style,
    }}
    onFocus={e => e.target.style.borderColor = theme.accent}
    onBlur={e => e.target.style.borderColor = theme.border}
    />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 11, color: theme.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</label>}
    <select {...props} style={{
      background: "rgba(255,255,255,0.04)",
      border: `1px solid ${theme.border}`,
      borderRadius: 10,
      padding: "10px 14px",
      color: theme.text,
      fontSize: 14,
      width: "100%",
    }}>
      {children}
    </select>
  </div>
);

const Btn = ({ children, variant = "primary", loading, style, ...props }) => (
  <button {...props} disabled={loading || props.disabled} style={{
    padding: "12px 24px",
    borderRadius: 10,
    border: variant === "primary" ? "none" : `1px solid ${theme.border}`,
    background: variant === "primary"
      ? `linear-gradient(135deg, ${theme.accent}, #0ea5e9)`
      : "rgba(255,255,255,0.04)",
    color: variant === "primary" ? "#0a0f1a" : theme.text,
    fontWeight: 600,
    fontSize: 14,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.7 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "opacity 0.2s, transform 0.1s",
    ...style,
  }}
  onMouseDown={e => { e.currentTarget.style.transform = "scale(0.98)"; }}
  onMouseUp={e => { e.currentTarget.style.transform = "scale(1)"; }}
  >
    {loading ? <span style={{ width:14,height:14,border:`2px solid rgba(0,0,0,0.3)`,borderTopColor:"#000",borderRadius:"50%",animation:"spin 0.7s linear infinite",display:"inline-block" }} /> : null}
    {children}
  </button>
);

const Metric = ({ label, value, unit, color = theme.accent }) => (
  <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${theme.border}`, borderRadius: 12, padding: "16px 18px" }}>
    <div style={{ fontSize: 11, color: theme.textMuted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
    <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}<span style={{ fontSize: 13, color: theme.textMuted, fontWeight: 400, marginLeft: 3 }}>{unit}</span></div>
  </div>
);

const Badge = ({ children, color = theme.accent }) => (
  <span style={{
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    background: color === theme.accent ? theme.accentDim : color + "22",
    color,
    border: `1px solid ${color}33`,
  }}>{children}</span>
);

// ─── PLAN TAB ─────────────────────────────────────────────
function PlanTab() {
  const [form, setForm] = useState({
    weight: "", height: "", age: "", target: "", duration: "12",
    goal: "lose", activity: "light", diet: "non-veg", sex: "male",
  });
  const [plan, setPlan]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");
  const planRef = useRef(null);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const generate = async () => {
    setLoading(true); setError("");
    try {
      const res  = await fetch(`${API_BASE}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, targetWeight: form.target }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPlan(data);
      setTimeout(() => planRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError(e.message || "Could not connect to server. Is it running?");
    }
    setLoading(false);
  };

  const dayColor = d => d.includes("Rest") ? theme.green : theme.accent;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Fitness Profile</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Input label="Current weight (kg)" type="number" value={form.weight} onChange={set("weight")} placeholder="68" />
          <Input label="Height (cm)"          type="number" value={form.height} onChange={set("height")} placeholder="170" />
          <Input label="Target weight (kg)"  type="number" value={form.target} onChange={set("target")} placeholder="62" />
          <Input label="Duration (weeks)"     type="number" value={form.duration} onChange={set("duration")} placeholder="12" />
          <Input label="Age"                  type="number" value={form.age} onChange={set("age")} placeholder="25" />
          <Select label="Sex" value={form.sex} onChange={set("sex")}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </Select>
          <Select label="Goal" value={form.goal} onChange={set("goal")}>
            <option value="lose">Lose weight</option>
            <option value="gain">Gain muscle</option>
            <option value="maintain">Maintain & tone</option>
          </Select>
          <Select label="Activity level" value={form.activity} onChange={set("activity")}>
            <option value="sedentary">Sedentary (desk job)</option>
            <option value="light">Lightly active (1–3 days/wk)</option>
            <option value="moderate">Moderately active (3–5 days/wk)</option>
            <option value="active">Very active (6–7 days/wk)</option>
          </Select>
          <Select label="Diet preference" value={form.diet} onChange={set("diet")} style={{ gridColumn: "1 / -1" }}>
            <option value="non-veg">Non-vegetarian</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="eggetarian">Eggetarian</option>
          </Select>
        </div>
        {error && <div style={{ marginTop: 12, fontSize: 13, color: theme.red, background: theme.redDim, padding: "8px 12px", borderRadius: 8 }}>{error}</div>}
        <Btn loading={loading} style={{ width: "100%", marginTop: 16 }} onClick={generate}>
          <Icon d={Icons.bolt} size={16} color="#0a0f1a" />
          {loading ? "Generating your plan..." : "Generate My Plan"}
        </Btn>
      </Card>

      {plan && (
        <div ref={planRef} className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <Metric label="Daily Calories" value={plan.calories} unit="kcal" />
            <Metric label="BMI"            value={plan.bmi}     unit=""      color={plan.bmi > 25 ? theme.amber : theme.green} />
            <Metric label="Protein Goal"   value={plan.protein} unit="g/day" color={theme.green} />
          </div>

          <Card>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
              <Badge>{plan.weeklyGoal}</Badge>
              <Badge color={theme.green}>TDEE {plan.tdee} kcal</Badge>
            </div>

            <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted, marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Weekly Exercise Plan</div>
            {plan.workout.map((day, i) => (
              <div key={i} style={{ padding: "12px 0", borderBottom: i < 6 ? `1px solid ${theme.border}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{day.day}</span>
                  <Badge color={dayColor(day.focus)}>{day.focus}</Badge>
                </div>
                <div style={{ fontSize: 12, color: theme.textDim, lineHeight: 1.8 }}>
                  {day.exercises.join(" · ")}
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <div style={{ fontSize: 13, fontWeight: 600, color: theme.textMuted, marginBottom: 14, letterSpacing: "0.06em", textTransform: "uppercase" }}>Daily Meal Plan</div>
            {Object.entries(plan.diet).map(([meal, food]) => (
              <div key={meal} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${theme.border}` }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: theme.accent, marginTop: 6, flexShrink: 0 }} />
                <div>
                  <span style={{ fontWeight: 600, fontSize: 13, textTransform: "capitalize" }}>{meal.replace(/_/g, " ")}: </span>
                  <span style={{ fontSize: 13, color: theme.textDim }}>{food}</span>
                </div>
              </div>
            ))}
          </Card>

          {plan.tips && (
            <Card style={{ background: theme.accentDim, border: `1px solid ${theme.accentMid}` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.accent, marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Coach Tips</div>
              {plan.tips.map((tip, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "6px 0", fontSize: 13, color: theme.textDim }}>
                  <Icon d={Icons.check} size={14} color={theme.green} />
                  {tip}
                </div>
              ))}
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SCAN TAB ─────────────────────────────────────────────
function ScanTab() {
  const [preview, setPreview]   = useState(null);
  const [file, setFile]         = useState(null);
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleFile = f => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const scan = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res  = await fetch(`${API_BASE}/api/predict`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (e) {
      setResult({ error: e.message });
    }
    setLoading(false);
  };

  const confColor = c => c >= 80 ? theme.green : c >= 50 ? theme.amber : theme.red;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <Card>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Scan Your Food</div>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current.click()}
          style={{
            border: `2px dashed ${dragging ? theme.accent : theme.border}`,
            borderRadius: 14,
            padding: preview ? 0 : "48px 24px",
            textAlign: "center",
            cursor: "pointer",
            transition: "border-color 0.2s",
            overflow: "hidden",
            background: dragging ? theme.accentDim : "transparent",
          }}>
          {preview
            ? <img src={preview} alt="food" style={{ width: "100%", maxHeight: 320, objectFit: "cover", borderRadius: 12 }} />
            : <>
                <Icon d={Icons.camera} size={40} color={theme.textMuted} />
                <div style={{ marginTop: 12, color: theme.textDim, fontSize: 14 }}>Drop an image here or click to upload</div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>Supports JPG, PNG, WEBP</div>
              </>}
          <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }}
            onChange={e => handleFile(e.target.files[0])} />
        </div>
        {preview && (
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <Btn loading={loading} style={{ flex: 1 }} onClick={scan}>
              <Icon d={Icons.bolt} size={16} color="#0a0f1a" />
              {loading ? "Analysing..." : "Identify Food"}
            </Btn>
            <Btn variant="ghost" style={{ flex: 0 }} onClick={() => { setPreview(null); setFile(null); setResult(null); }}>
              <Icon d={Icons.x} size={16} />
            </Btn>
          </div>
        )}
      </Card>

      {result && !result.error && (
        <div className="fade-up">
          <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, textTransform: "capitalize" }}>{result.food.replace(/_/g, " ")}</div>
                <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>
                  Confidence: <span style={{ color: confColor(result.confidence), fontWeight: 600 }}>{result.confidence}%</span>
                </div>
              </div>
              <Badge color={theme.amber}>{result.calories} kcal</Badge>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
              <Metric label="Carbs"   value={result.carbs}   unit="g" color={theme.amber} />
              <Metric label="Protein" value={result.protein} unit="g" color={theme.green} />
              <Metric label="Fat"     value={result.fat}     unit="g" color={theme.red}   />
            </div>
            <div style={{ background: theme.greenDim, border: `1px solid ${theme.green}33`, borderRadius: 10, padding: "10px 14px", fontSize: 13, color: theme.textDim }}>
              <span style={{ color: theme.green, fontWeight: 600 }}>Healthier swap: </span>{result.suggestion}
            </div>
          </Card>
        </div>
      )}
      {result?.error && (
        <Card style={{ background: theme.redDim, border: `1px solid ${theme.red}33` }}>
          <div style={{ color: theme.red, fontSize: 14 }}>{result.error}</div>
        </Card>
      )}
    </div>
  );
}

// ─── PROGRESS TAB ────────────────────────────────────────
function ProgressTab() {
  const [entries, setEntries] = useState([]);
  const [streak, setStreak]   = useState(0);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef();

  const logWeight = async () => {
    const w = parseFloat(input);
    if (isNaN(w) || w < 20 || w > 300) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/progress/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "default", weight: w }),
      });
      const data = await res.json();
      setEntries(data.weights || []);
      setStreak(data.streak || 0);
      setInput("");
    } catch {
      // Offline mode
      const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      const updated = [...entries, { date: today, weight: w }];
      setEntries(updated);
      setStreak(s => s + 1);
      setInput("");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!canvasRef.current || entries.length < 2) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext("2d");
    const W = canvas.width  = canvas.offsetWidth;
    const H = canvas.height = 180;
    ctx.clearRect(0, 0, W, H);

    const weights = entries.map(e => e.weight);
    const min = Math.min(...weights) - 1;
    const max = Math.max(...weights) + 1;
    const xStep = W / (entries.length - 1);
    const yScale = (H - 40) / (max - min);

    const points = entries.map((e, i) => ({
      x: i * xStep,
      y: H - 20 - (e.weight - min) * yScale,
    }));

    // Fill
    ctx.beginPath();
    ctx.moveTo(points[0].x, H - 20);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, H - 20);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgba(56,189,248,0.25)");
    grad.addColorStop(1, "rgba(56,189,248,0)");
    ctx.fillStyle = grad;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const cx = (points[i-1].x + points[i].x) / 2;
      ctx.bezierCurveTo(cx, points[i-1].y, cx, points[i].y, points[i].x, points[i].y);
    }
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth   = 2.5;
    ctx.stroke();

    // Dots
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = theme.accent;
      ctx.fill();
    });
  }, [entries]);

  const total = entries.length >= 2
    ? (entries[entries.length - 1].weight - entries[0].weight).toFixed(1)
    : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Streak */}
      <Card style={{ background: streak >= 7 ? "linear-gradient(135deg,rgba(251,191,36,0.08),rgba(251,191,36,0.02))" : theme.surface }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 48, fontWeight: 700, color: theme.amber, lineHeight: 1 }}>{streak}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon d={Icons.fire} size={16} color={theme.amber} />
              Day streak
            </div>
            <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 2 }}>
              {streak === 0 ? "Log your first weight to start!" : streak < 3 ? "Great start — keep going!" : streak < 7 ? "You're building momentum 🔥" : "You're unstoppable! 🏆"}
            </div>
          </div>
        </div>
      </Card>

      {/* Log */}
      <Card>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Log Today's Weight</div>
        <div style={{ display: "flex", gap: 10 }}>
          <Input placeholder="e.g. 67.5" type="number" step="0.1"
            value={input} onChange={e => setInput(e.target.value)}
            style={{ flex: 1 }}
            onKeyDown={e => e.key === "Enter" && logWeight()} />
          <Btn loading={loading} style={{ whiteSpace: "nowrap", flex: 0 }} onClick={logWeight}>
            <Icon d={Icons.plus} size={16} color="#0a0f1a" />Log
          </Btn>
        </div>
      </Card>

      {/* Chart */}
      {entries.length >= 2 && (
        <Card className="fade-up">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Weight Trend</div>
            {total !== null && (
              <Badge color={parseFloat(total) < 0 ? theme.green : theme.red}>
                {parseFloat(total) < 0 ? "" : "+"}{total} kg overall
              </Badge>
            )}
          </div>
          <canvas ref={canvasRef} style={{ width: "100%", display: "block" }} />
        </Card>
      )}

      {/* Log list */}
      {entries.length > 0 && (
        <Card>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>History</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxHeight: 260, overflowY: "auto" }}>
            {[...entries].reverse().map((e, i) => {
              const prev = i < entries.length - 1 ? entries[entries.length - 2 - i] : null;
              const diff = prev ? (e.weight - prev.weight).toFixed(1) : null;
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < entries.length - 1 ? `1px solid ${theme.border}` : "none", fontSize: 14 }}>
                  <span style={{ color: theme.textDim }}>{e.date}</span>
                  <span style={{ fontWeight: 600 }}>
                    {e.weight} kg
                    {diff !== null && (
                      <span style={{ marginLeft: 8, fontSize: 12, color: parseFloat(diff) < 0 ? theme.green : theme.red }}>
                        {parseFloat(diff) > 0 ? "+" : ""}{diff}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── COACH TAB ────────────────────────────────────────────
function CoachTab() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey! I'm your AI fitness coach. Ask me anything — workouts, nutrition, motivation, plateaus, or how to stay consistent. I'm here for you! 💪" }
  ]);
  const [input, setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const quickPrompts = [
    "I feel tired and want to skip today",
    "What should I eat before a workout?",
    "I hit a weight loss plateau",
    "How do I stay consistent?",
    "Best exercises for a beginner?",
    "How much protein do I really need?",
  ];

  const send = async (msg) => {
    const text = msg || input.trim();
    if (!text) return;
    setInput("");
    const updated = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setLoading(true);
    try {
      const history = updated.filter(m => m.role !== "assistant" || updated.indexOf(m) > 0)
        .slice(-10).map(m => ({ role: m.role, content: m.content }));
      const res  = await fetch(`${API_BASE}/api/coach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", content: "Connection error. Make sure your server is running." }]);
    }
    setLoading(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: theme.accentDim, border: `1px solid ${theme.accentMid}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon d={Icons.bolt} size={16} color={theme.accent} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14 }}>FitOS AI Coach</div>
            <div style={{ fontSize: 11, color: theme.green, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: theme.green, display: "inline-block" }} />Online
            </div>
          </div>
        </div>

        <div style={{ padding: "16px 20px", minHeight: 380, maxHeight: 420, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              maxWidth: "82%",
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              background: m.role === "user"
                ? `linear-gradient(135deg, ${theme.accent}, #0ea5e9)`
                : "rgba(255,255,255,0.05)",
              color: m.role === "user" ? "#0a0f1a" : theme.text,
              border: m.role === "user" ? "none" : `1px solid ${theme.border}`,
              borderRadius: 14,
              borderBottomRightRadius: m.role === "user" ? 4 : 14,
              borderBottomLeftRadius:  m.role === "user" ? 14 : 4,
              padding: "10px 14px",
              fontSize: 14,
              lineHeight: 1.6,
            }}>{m.content}</div>
          ))}
          {loading && (
            <div style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.05)", border: `1px solid ${theme.border}`, borderRadius: 14, borderBottomLeftRadius: 4, padding: "10px 16px", display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: theme.textMuted, animation: "pulse 1.2s ease infinite", animationDelay: `${i * 0.2}s`, display: "inline-block" }} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ padding: "12px 20px 16px", borderTop: `1px solid ${theme.border}` }}>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask your coach..."
              style={{
                flex: 1, background: "rgba(255,255,255,0.04)", border: `1px solid ${theme.border}`,
                borderRadius: 10, padding: "10px 14px", color: theme.text, fontSize: 14,
                outline: "none",
              }}
              onFocus={e => e.target.style.borderColor = theme.accent}
              onBlur={e => e.target.style.borderColor = theme.border}
            />
            <button onClick={() => send()} style={{
              width: 42, height: 42, borderRadius: 10, border: "none",
              background: `linear-gradient(135deg,${theme.accent},#0ea5e9)`,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}>
              <Icon d={Icons.send} size={16} color="#0a0f1a" />
            </button>
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {quickPrompts.map((p, i) => (
          <button key={i} onClick={() => send(p)} style={{
            padding: "6px 12px", borderRadius: 999, border: `1px solid ${theme.border}`,
            background: "transparent", color: theme.textDim, fontSize: 12, cursor: "pointer",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={e => { e.target.style.borderColor = theme.accent; e.target.style.color = theme.accent; }}
          onMouseLeave={e => { e.target.style.borderColor = theme.border; e.target.style.color = theme.textDim; }}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────
const TABS = [
  { id: "plan",     label: "Plan",     icon: Icons.plan },
  { id: "scan",     label: "Scan",     icon: Icons.camera },
  { id: "progress", label: "Progress", icon: Icons.trend },
  { id: "coach",    label: "Coach",    icon: Icons.coach },
];

export default function App() {
  const [tab, setTab] = useState("plan");

  return (
    <>
      <style>{globalCSS}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <header style={{
          borderBottom: `1px solid ${theme.border}`,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(10,15,26,0.8)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `linear-gradient(135deg,${theme.accent},#0ea5e9)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>~
              <Icon d={Icons.bolt} size={16} color="#0a0f1a" />
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.02em" }}>FitOS</div>
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted }}>AI Fitness System</div>
        </header>

        {/* Nav */}
        <nav style={{
          display: "flex",
          borderBottom: `1px solid ${theme.border}`,
          background: "rgba(10,15,26,0.6)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 65,
          zIndex: 9,
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "14px 8px",
              background: "transparent",
              border: "none",
              borderBottom: tab === t.id ? `2px solid ${theme.accent}` : "2px solid transparent",
              color: tab === t.id ? theme.accent : theme.textMuted,
              fontSize: 12,
              fontWeight: tab === t.id ? 700 : 500,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              transition: "color 0.2s",
              cursor: "pointer",
            }}>
              <Icon d={t.icon} size={18} color={tab === t.id ? theme.accent : theme.textMuted} />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main style={{ flex: 1, padding: "24px 16px 40px", maxWidth: 680, margin: "0 auto", width: "100%" }}>
          {tab === "plan"     && <PlanTab />}
          {tab === "scan"     && <ScanTab />}
          {tab === "progress" && <ProgressTab />}
          {tab === "coach"    && <CoachTab />}
        </main>
      </div>
    </>
  );
}