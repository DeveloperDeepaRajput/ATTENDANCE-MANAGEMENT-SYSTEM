import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  FileCode, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Settings, 
  User, 
  Info, 
  LogOut, 
  Calendar, 
  Copy, 
  Download, 
  Check, 
  Folder, 
  FolderOpen, 
  Monitor, 
  Code, 
  Terminal, 
  Sparkles, 
  RefreshCw, 
  BookOpen, 
  FileText,
  AlertTriangle,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { javaFiles, JavaFile } from "./javaCodeData";

// Types for State Persistence
interface StudentState {
  name: string;
  rollNumber: string;
  course: string;
  semester: string;
  section: string;
  attendedClasses: number;
  totalClasses: number;
}

interface HistoryLog {
  date: string;
  status: "Present" | "Absent";
  attended: number;
  total: number;
  percentage: number;
}

export default function App() {
  // ------------------------------------------
  // STATE MANAGEMENT (PERSISTENT & REACTIVE)
  // ------------------------------------------
  const [student, setStudent] = useState<StudentState>(() => {
    const saved = localStorage.getItem("sams_student");
    if (saved) return JSON.parse(saved);
    return {
      name: "John Doe",
      rollNumber: "CS2026104",
      course: "B.Tech Computer Science",
      semester: "4th Semester",
      section: "Section-A",
      attendedClasses: 15,
      totalClasses: 18,
    };
  });

  const [history, setHistory] = useState<HistoryLog[]>(() => {
    const saved = localStorage.getItem("sams_history");
    if (saved) return JSON.parse(saved);
    return [
      { date: "2026-06-25", status: "Present", attended: 11, total: 13, percentage: 84.6 },
      { date: "2026-06-26", status: "Present", attended: 12, total: 14, percentage: 85.7 },
      { date: "2026-06-29", status: "Absent", attended: 12, total: 15, percentage: 80.0 },
      { date: "2026-06-30", status: "Present", attended: 13, total: 16, percentage: 81.3 },
      { date: "2026-07-01", status: "Present", attended: 14, total: 17, percentage: 82.4 },
      { date: "2026-07-02", status: "Present", attended: 15, total: 18, percentage: 83.3 },
    ];
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("sams_student", JSON.stringify(student));
  }, [student]);

  useEffect(() => {
    localStorage.setItem("sams_history", JSON.stringify(history));
  }, [history]);

  // General App Workspaces: "simulator" | "developer_guide"
  const [activeTab, setActiveTab] = useState<"simulator" | "developer_guide">("simulator");

  // Code Explorer States
  const [selectedJavaFile, setSelectedJavaFile] = useState<JavaFile>(javaFiles.find(f => f.name === "Main.java") || javaFiles[0]);
  const [copiedFileName, setCopiedFileName] = useState<string | null>(null);

  // Simulated Swing Application states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("student123");
  const [loginPassword, setLoginPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  
  // Dashboard Swing frames views: "dashboard" | "attendance" | "history" | "profile" | "settings" | "about"
  const [dashboardView, setDashboardView] = useState<string>("dashboard");

  // Dialogue Popups
  const [showStartupPopup, setShowStartupPopup] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ title: string; msg: string; color: string } | null>(null);

  // Dynamic Quotes
  const quotes = [
    "Consistency is the key to mastering your education.",
    "Eighty percent of success is showing up. - Woody Allen",
    "Punctuality is not about being on time, it's about respecting commitments.",
    "Your future is created by what you do today, not tomorrow.",
    "Every single lecture is a stepping stone to your career goals.",
    "Education is the passport to the future, and attendance is the stamp!"
  ];
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);

  // Dynamic Quote refresher trigger
  const rotateQuote = () => {
    const nextIdx = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[nextIdx]);
  };

  // Clock state
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      // Format time as hh:mm:ss AM/PM
      setCurrentTime(now.toLocaleTimeString("en-US", { hour12: true }));
      // Format date
      setCurrentDate(now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Swing Color Schemes
  const themes = [
    { name: "Blue Theme (Default)", primary: "bg-blue-700 text-blue-700 border-blue-700", hex: "#1e40af", text: "text-blue-700", bg: "bg-blue-50" },
    { name: "Light Mode", primary: "bg-slate-500 text-slate-500 border-slate-500", hex: "#64748b", text: "text-slate-600", bg: "bg-slate-50" },
    { name: "Dark Mode", primary: "bg-slate-900 text-slate-900 border-slate-900", hex: "#0f172a", text: "text-slate-900", bg: "bg-slate-900" },
    { name: "Purple Theme", primary: "bg-purple-700 text-purple-700 border-purple-700", hex: "#6d28d9", text: "text-purple-700", bg: "bg-purple-50" },
    { name: "Green Theme", primary: "bg-teal-700 text-teal-700 border-teal-700", hex: "#0d9488", text: "text-teal-700", bg: "bg-teal-50" },
  ];
  const [activeTheme, setActiveTheme] = useState(themes[0]);

  // Calculations
  const attendanceRate = student.totalClasses > 0 ? (student.attendedClasses / student.totalClasses) * 100 : 0;

  // Bracket Mapping for Notification and Color Indicators
  const getBracketDetails = (pct: number) => {
    if (student.totalClasses === 0) {
      return {
        title: "Welcome to a New Semester!",
        desc: "No classes registered. Mark Present or Absent to start tracking!",
        color: "bg-blue-50 border-blue-200 text-blue-800",
        badge: "bg-blue-100 text-blue-800",
        hex: "#3b82f6",
        emoji: "📖",
        tip: "Attendance calculations will load automatically."
      };
    }
    if (pct >= 95.0) {
      return {
        title: "🏆 Outstanding!",
        desc: `You have an excellent attendance of ${pct.toFixed(1)}%. Keep inspiring everyone with your dedication!`,
        color: "bg-emerald-50 border-emerald-200 text-emerald-800",
        badge: "bg-emerald-100 text-emerald-800",
        hex: "#10b981",
        emoji: "🏆",
        tip: "Perfect presence rate! Top of the batch."
      };
    } else if (pct >= 75.0) {
      return {
        title: "🎉 Wow!",
        desc: `You have great attendance of ${pct.toFixed(1)}%. Such a punctual and responsible student. Keep it up!`,
        color: "bg-blue-50 border-blue-200 text-blue-800",
        badge: "bg-blue-100 text-blue-800",
        hex: "#3b82f6",
        emoji: "🎉",
        tip: "Safe and compliant! Maintains normal requirements."
      };
    } else if (pct >= 60.0) {
      return {
        title: "🙂 Good.",
        desc: `Your attendance (${pct.toFixed(1)}%) is acceptable, but try not to miss more classes.`,
        color: "bg-yellow-50 border-yellow-200 text-yellow-800",
        badge: "bg-yellow-100 text-yellow-800",
        hex: "#eab308",
        emoji: "🙂",
        tip: "Approaching danger. Try to attend next few classes."
      };
    } else if (pct >= 50.0) {
      return {
        title: "⚠ Warning!",
        desc: `Your attendance has dropped to ${pct.toFixed(1)}%. Attend classes regularly, otherwise you may fall below required limits.`,
        color: "bg-orange-50 border-orange-200 text-orange-800",
        badge: "bg-orange-100 text-orange-800",
        hex: "#f97316",
        emoji: "⚠",
        tip: "Low attendance warning! Risk of detention triggers soon."
      };
    } else {
      return {
        title: "🚨 ALERT!",
        desc: `Your attendance (${pct.toFixed(1)}%) is critically low! You are at risk of being detained from examinations. Please attend immediately!`,
        color: "bg-red-50 border-red-200 text-red-800",
        badge: "bg-red-100 text-red-800",
        hex: "#ef4444",
        emoji: "🚨",
        tip: "CRITICAL LIMIT! Progress improvement plan strongly recommended."
      };
    }
  };

  const bracket = getBracketDetails(attendanceRate);

  // ------------------------------------------
  // INTERACTIVE EVENT HANDLERS
  // ------------------------------------------
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (loginUsername === "student123" && loginPassword === "password") {
      setLoginError("");
      setIsLoggedIn(true);
      setShowStartupPopup(true); // Open start popup!
      setDashboardView("dashboard");
      rotateQuote();
    } else {
      setLoginError("Invalid Username or Password. Try student123 & password");
    }
  };

  const markAttendance = (isPresent: boolean) => {
    const updatedAttended = student.attendedClasses + (isPresent ? 1 : 0);
    const updatedTotal = student.totalClasses + 1;
    const currentPct = (updatedAttended / updatedTotal) * 100;

    const newStudent = {
      ...student,
      attendedClasses: updatedAttended,
      totalClasses: updatedTotal,
    };
    setStudent(newStudent);

    // Append to simulated TXT ledger
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0];
    const newHistoryEntry: HistoryLog = {
      date: formattedDate,
      status: isPresent ? "Present" : "Absent",
      attended: updatedAttended,
      total: updatedTotal,
      percentage: Math.round(currentPct * 10) / 10,
    };

    setHistory([...history, newHistoryEntry]);

    // Show custom toast notification mimicking Swing JDialog popup
    setToastNotification({
      title: isPresent ? "Attendance Logged Successfully" : "Absence Logged Successfully",
      msg: isPresent 
        ? "You have marked yourself Present. Your total attendance percentage has updated." 
        : "You have marked yourself Absent. Check your warning triggers if your percentage falls.",
      color: isPresent ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-red-500 bg-red-50 text-red-800",
    });
  };

  const resetAllData = () => {
    const clearedStudent = {
      ...student,
      attendedClasses: 0,
      totalClasses: 0,
    };
    setStudent(clearedStudent);
    setHistory([]);
    setToastNotification({
      title: "Data Reset Complete",
      msg: "Both local files student_profile.dat and attendance_history.txt have been wiped clean.",
      color: "border-blue-500 bg-blue-50 text-blue-800",
    });
  };

  // Canvas drawing for Pie Chart mimicking Swing Graphics
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, 150, 150);
        
        const cx = 75;
        const cy = 75;
        const r = 60;

        if (student.totalClasses === 0) {
          // Draw empty slate circle
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, 2 * Math.PI);
          ctx.fillStyle = "#e2e8f0";
          ctx.fill();
          
          ctx.font = "bold 13px sans-serif";
          ctx.fillStyle = "#64748b";
          ctx.textAlign = "center";
          ctx.fillText("No Data", cx, cy + 5);
          return;
        }

        const presentPct = attendanceRate / 100;
        const absentPct = 1 - presentPct;

        let startAngle = -Math.PI / 2; // Start from top 12 o'clock

        // Present Section (Green)
        const presentAngle = presentPct * 2 * Math.PI;
        if (presentPct > 0) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, r, startAngle, startAngle + presentAngle);
          ctx.lineTo(cx, cy);
          ctx.fillStyle = "#22c55e"; // Emerald green
          ctx.fill();
        }

        // Absent Section (Red)
        if (absentPct > 0) {
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, r, startAngle + presentAngle, startAngle + 2 * Math.PI);
          ctx.lineTo(cx, cy);
          ctx.fillStyle = "#ef4444"; // Red
          ctx.fill();
        }

        // Inner white circle to make a clean donut style look
        ctx.beginPath();
        ctx.arc(cx, cy, 32, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // Inner text percentage indicator
        ctx.font = "bold 11px monospace";
        ctx.fillStyle = "#1e293b";
        ctx.textAlign = "center";
        ctx.fillText(`${attendanceRate.toFixed(0)}%`, cx, cy + 4);
      }
    }
  }, [student, attendanceRate]);

  // Utility to copy Java Source Code text to clipboard
  const handleCopyCode = (file: JavaFile) => {
    navigator.clipboard.writeText(file.code);
    setCopiedFileName(file.name);
    setTimeout(() => setCopiedFileName(null), 2000);
  };

  // Utility to trigger instant file downloads of Java code
  const handleDownloadFile = (file: JavaFile) => {
    const element = document.createElement("a");
    const blob = new Blob([file.code], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(blob);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* ------------------------------------------
          TOP GLOBAL HEADER & SWITCH WORKSPACE
          ------------------------------------------ */}
      <header className="border-b border-slate-800 bg-slate-950 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white p-2 rounded-lg shadow-md shadow-indigo-900/40">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              SAMS Portal <span className="text-xs bg-indigo-900/60 text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-700/50">Minor Project Hub</span>
            </h1>
            <p className="text-xs text-slate-400">Java Swing Training Submission & High-Fidelity App Simulator</p>
          </div>
        </div>

        {/* Tab Controls to toggle Simulator and Source Explorer */}
        <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800 self-start md:self-center">
          <button
            onClick={() => setActiveTab("simulator")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "simulator"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Monitor className="w-4 h-4" />
            Interactive Swing App Simulator
          </button>
          <button
            onClick={() => setActiveTab("developer_guide")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "developer_guide"
                ? "bg-indigo-600 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Code className="w-4 h-4" />
            Java Project Hub & IDE Code
          </button>
        </div>
      </header>

      {/* ------------------------------------------
          MAIN CONTENT WORKSPACE AREA
          ------------------------------------------ */}
      <main className="flex-1 overflow-auto bg-slate-900 p-4 md:p-6 lg:p-8 flex items-stretch justify-center">
        
        {/* TAB 1: SWING SIMULATOR AREA */}
        {activeTab === "simulator" && (
          <div className="w-full max-w-6xl flex flex-col gap-6 lg:gap-8 items-center justify-center">
            
            {/* Desktop frame wrapping Swing Frame */}
            <div className="w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[680px]">
              
              {/* Window Header (Title Bar) */}
              <div className="bg-slate-850 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0 select-none">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <span className="text-lg">🎓</span>
                  <span>SAMS - Java Swing Window Frame</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 cursor-not-allowed"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 cursor-not-allowed"></span>
                  <span className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setIsLoggedIn(false)}></span>
                </div>
              </div>

              {/* Window Body */}
              <div className="flex-1 bg-slate-100 text-slate-800 overflow-hidden relative flex flex-col">
                
                {/* ------------------------------------------
                    SWING SCREEN A: UNAUTHENTICATED LOGIN
                    ------------------------------------------ */}
                {!isLoggedIn ? (
                  <div className="flex-1 flex items-stretch min-h-0 bg-slate-50">
                    
                    {/* Gradient Left Side Banner Panel */}
                    <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 p-8 flex-col justify-between text-white relative overflow-hidden">
                      {/* Grid background mesh overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
                      
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-3xl">🎓</span>
                          <span className="font-extrabold text-xl tracking-wider">SAMS</span>
                        </div>
                        <h2 className="text-2xl font-bold mt-6 tracking-tight">Smart Attendance</h2>
                        <h3 className="text-blue-300 text-xs font-semibold tracking-widest uppercase mt-1">Management System</h3>
                      </div>

                      <div className="relative space-y-4">
                        <p className="text-sm text-slate-200 leading-relaxed">
                          A fully integrated Java Swing educational platform featuring real-time percentage meters, dynamic quotes, colorful warnings, and table log storage.
                        </p>
                        <div className="border-t border-blue-600/50 pt-4 flex items-center justify-between text-xs text-blue-200">
                          <span>📅 Year: 2026</span>
                          <span>📌 Minor Project submission</span>
                        </div>
                      </div>
                    </div>

                    {/* Clean Login Controls Form (Right Panel) */}
                    <div className="flex-1 md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
                      <div className="max-w-md w-full mx-auto space-y-6">
                        <div className="text-center md:text-left space-y-1">
                          <h3 className="text-2xl font-bold text-slate-900">Student Login Portal</h3>
                          <p className="text-sm text-slate-500">Access credentials via the SAMS database</p>
                        </div>

                        {loginError && (
                          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
                            ⚠️ {loginError}
                          </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">👤 Username</label>
                            <input
                              type="text"
                              value={loginUsername}
                              onChange={(e) => setLoginUsername(e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                              placeholder="student123"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block">🔑 Password</label>
                            <input
                              type={showPassword ? "text" : "password"}
                              value={loginPassword}
                              onChange={(e) => setLoginPassword(e.target.value)}
                              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition"
                              placeholder="password"
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600 font-medium">
                              <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={(e) => setShowPassword(e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                              />
                              Show Password
                            </label>
                            <span className="text-xs text-blue-600 font-medium hover:underline cursor-pointer" onClick={() => {
                              setLoginUsername("student123");
                              setLoginPassword("password");
                            }}>Reset default fields</span>
                          </div>

                          <div className="pt-2 flex gap-3">
                            <button
                              type="submit"
                              className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-lg shadow-md transition cursor-pointer text-sm"
                            >
                              Login
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setLoginUsername("");
                                setLoginPassword("");
                                setLoginError("");
                              }}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold py-2.5 px-4 rounded-lg transition text-sm"
                            >
                              Clear
                            </button>
                          </div>
                        </form>

                        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800">
                          <strong>💡 Demo Access Guide:</strong><br />
                          Enter <strong>student123</strong> as username and <strong>password</strong> as password to login.
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  
                  // ------------------------------------------
                  // SWING SCREEN B: AUTHENTICATED DASHBOARD FRAME
                  // ------------------------------------------
                  <div className="flex-1 flex min-h-0 bg-slate-100">
                    
                    {/* Swing Sidebar Drawer */}
                    <aside className="w-56 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-950 select-none shrink-0">
                      
                      {/* Logo and header */}
                      <div className="px-4 py-5 border-b border-slate-950 flex items-center gap-2">
                        <span className="text-xl">🎓</span>
                        <div>
                          <h4 className="font-extrabold text-sm tracking-wider text-white">SAMS Portal</h4>
                          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">Active session</span>
                        </div>
                      </div>

                      {/* Nav list */}
                      <nav className="flex-1 p-3 space-y-1">
                        {[
                          { id: "dashboard", label: "Dashboard", icon: "📊" },
                          { id: "attendance", label: "Attendance Entry", icon: "📝" },
                          { id: "history", label: "Attendance History", icon: "🗓" },
                          { id: "profile", label: "Student Profile", icon: "👤" },
                          { id: "settings", label: "Theme Colors", icon: "⚙" },
                          { id: "about", label: "About SAMS", icon: "ℹ" },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setDashboardView(item.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2.5 ${
                              dashboardView === item.id
                                ? "bg-blue-700 text-white shadow-md shadow-slate-950/20"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                          >
                            <span className="text-sm">{item.icon}</span>
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </nav>

                      {/* Footer logout */}
                      <div className="p-3 border-t border-slate-950">
                        <button
                          onClick={() => setShowLogoutConfirm(true)}
                          className="w-full px-3 py-2 text-left rounded-lg text-xs font-bold text-red-400 hover:bg-red-900/20 hover:text-red-300 transition flex items-center gap-2.5"
                        >
                          <LogOut className="w-3.5 h-3.5 text-red-400" />
                          <span>🚪 Logout</span>
                        </button>
                      </div>
                    </aside>

                    {/* Swing Workspace frame (Right of Sidebar) */}
                    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 text-slate-800 overflow-y-auto">
                      
                      {/* Top Bar (Greeting, Clock, Date) */}
                      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shrink-0">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Welcome Student, {student.name}!</h4>
                          <p className="text-[11px] text-slate-500 font-medium italic mt-0.5" key={currentQuote}>
                            {currentQuote}
                          </p>
                        </div>
                        <div className="text-right flex flex-col items-start sm:items-end self-stretch sm:self-center">
                          <span className="font-mono text-xs font-extrabold text-blue-700 flex items-center gap-1.5 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            {currentTime || "12:00:00 PM"}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium mt-1">{currentDate}</span>
                        </div>
                      </header>

                      {/* Primary Content Switcher */}
                      <div className="flex-1 p-6 overflow-auto">
                        
                        {/* VIEW 1: MAIN DASHBOARD VIEW */}
                        {dashboardView === "dashboard" && (
                          <div className="space-y-6">
                            
                            {/* Dynamic Motivational Widget Card (Swing custom notification) */}
                            <div className={`p-4 border rounded-xl shadow-sm ${bracket.color} transition-all duration-300`}>
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">{bracket.emoji}</span>
                                <div className="space-y-1">
                                  <h4 className="font-bold text-sm">{bracket.title}</h4>
                                  <p className="text-xs leading-relaxed opacity-95">{bracket.desc}</p>
                                  <p className="text-[10px] uppercase font-bold tracking-wider opacity-80 pt-1 border-t border-current/20 mt-1">
                                    💡 Tip: {bracket.tip}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Attendance Cards Grid layout */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Card A: Percentage */}
                              <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between h-28 hover:shadow transition">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Attendance Percentage</span>
                                <span className="text-3xl font-extrabold text-blue-700 block my-1">
                                  {student.totalClasses > 0 ? `${attendanceRate.toFixed(1)}%` : "0.0%"}
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium block">
                                  Calculated on recorded lectures log
                                </span>
                              </div>

                              {/* Card B: Attended */}
                              <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between h-28 hover:shadow transition">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Classes Attended</span>
                                <span className="text-3xl font-extrabold text-emerald-600 block my-1">
                                  {student.attendedClasses} <span className="text-sm font-medium text-slate-500">Lectures</span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium block">
                                  Total of {student.totalClasses} registered classes
                                </span>
                              </div>

                              {/* Card C: Missed */}
                              <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between h-28 hover:shadow transition">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Classes Missed</span>
                                <span className="text-3xl font-extrabold text-red-500 block my-1">
                                  {student.totalClasses - student.attendedClasses} <span className="text-sm font-medium text-slate-500">Lectures</span>
                                </span>
                                <span className="text-[10px] text-slate-500 font-medium block">
                                  Absences impacting percentage
                                </span>
                              </div>
                            </div>

                            {/* Row of Progress Bar & custom Pie Chart */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              
                              {/* Progress bar and compliance box */}
                              <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm lg:col-span-2 flex flex-col justify-between gap-4">
                                <div className="space-y-1">
                                  <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest">Attendance Progress Bar</h4>
                                  <p className="text-xs text-slate-600 font-medium">Visual bracket representation of current status</p>
                                </div>

                                <div className="space-y-2">
                                  {/* Progress bar outer container */}
                                  <div className="w-full bg-slate-100 rounded-full h-5 overflow-hidden border border-slate-200 p-0.5 flex items-stretch">
                                    <div 
                                      className="rounded-full h-full text-[10px] font-bold text-white flex items-center justify-center transition-all duration-500"
                                      style={{ 
                                        width: `${Math.max(attendanceRate, 5)}%`, 
                                        backgroundColor: bracket.hex 
                                      }}
                                    >
                                      {attendanceRate >= 15 ? `${attendanceRate.toFixed(1)}%` : ""}
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                                    <span>0%</span>
                                    <span>50% warning</span>
                                    <span>75% safe bracket</span>
                                    <span>100%</span>
                                  </div>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 leading-relaxed flex items-center gap-3">
                                  <span className="text-lg">💡</span>
                                  <span>
                                    Attendance requirements are strictly regulated. Maintain <strong>above 75.0%</strong> to prevent registration blockades.
                                  </span>
                                </div>
                              </div>

                              {/* Pie chart canvas card */}
                              <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-between text-center min-h-[220px]">
                                <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest self-start">Graphics Pie Chart</h4>
                                
                                <div className="relative my-2">
                                  <canvas 
                                    ref={canvasRef} 
                                    width={150} 
                                    height={150}
                                    className="block mx-auto"
                                  />
                                </div>

                                <div className="flex justify-center items-center gap-4 text-xs font-bold text-slate-600">
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                                    <span>Present</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded bg-red-500"></span>
                                    <span>Absent</span>
                                  </div>
                                </div>
                              </div>

                            </div>

                          </div>
                        )}

                        {/* VIEW 2: ATTENDANCE ENTRY PANEL */}
                        {dashboardView === "attendance" && (
                          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 space-y-6">
                            <div className="text-center space-y-2">
                              <h3 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
                                📝 Attendance Recorder
                              </h3>
                              <p className="text-xs text-slate-500">
                                Update attendance metrics. Clicking will immediately recompute stats and save to files.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                              <button
                                onClick={() => markAttendance(true)}
                                className="p-6 bg-emerald-50 hover:bg-emerald-100/85 border border-emerald-200 hover:border-emerald-300 rounded-xl text-center group transition duration-200 cursor-pointer flex flex-col items-center gap-3"
                              >
                                <div className="bg-emerald-500 text-white p-3 rounded-full group-hover:scale-110 transition shadow-md shadow-emerald-200">
                                  <CheckCircle className="w-7 h-7" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-bold text-emerald-800 text-sm">MARK PRESENT</h4>
                                  <p className="text-[11px] text-emerald-600 font-medium">Increment attended and total classes</p>
                                </div>
                              </button>

                              <button
                                onClick={() => markAttendance(false)}
                                className="p-6 bg-red-50 hover:bg-red-100/85 border border-red-200 hover:border-red-300 rounded-xl text-center group transition duration-200 cursor-pointer flex flex-col items-center gap-3"
                              >
                                <div className="bg-red-500 text-white p-3 rounded-full group-hover:scale-110 transition shadow-md shadow-red-200">
                                  <XCircle className="w-7 h-7" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="font-bold text-red-800 text-sm">MARK ABSENT</h4>
                                  <p className="text-[11px] text-red-600 font-medium">Increment total classes as absence</p>
                                </div>
                              </button>
                            </div>

                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs text-slate-600">
                              <span className="font-bold text-slate-800 block">📊 Real-Time Impact Evaluation</span>
                              <div className="flex justify-between">
                                <span>Current State:</span>
                                <strong>{student.attendedClasses} / {student.totalClasses} classes ({attendanceRate.toFixed(1)}%)</strong>
                              </div>
                              <div className="flex justify-between text-emerald-600">
                                <span>If Present marked next:</span>
                                <strong>{student.attendedClasses + 1} / {student.totalClasses + 1} classes ({(((student.attendedClasses + 1) / (student.totalClasses + 1)) * 100).toFixed(1)}%)</strong>
                              </div>
                              <div className="flex justify-between text-red-600">
                                <span>If Absent marked next:</span>
                                <strong>{student.attendedClasses} / {student.totalClasses + 1} classes ({((student.attendedClasses / (student.totalClasses + 1)) * 100).toFixed(1)}%)</strong>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* VIEW 3: HISTORY LOG PANEL */}
                        {dashboardView === "history" && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white p-4 border border-slate-200 rounded-xl shadow-sm">
                              <div>
                                <h3 className="font-bold text-slate-900 text-sm">🗓 Log Ledger database</h3>
                                <p className="text-[11px] text-slate-500">History records matching txt storage entries</p>
                              </div>
                              <button
                                onClick={resetAllData}
                                className="px-3 py-1.5 bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg cursor-pointer transition flex items-center gap-1.5"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                Reset logs data
                              </button>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                              <div className="max-h-[380px] overflow-auto">
                                <table className="w-full text-left border-collapse text-xs">
                                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase sticky top-0 border-b border-slate-200">
                                    <tr>
                                      <th className="p-3">Log Date</th>
                                      <th className="p-3">Status</th>
                                      <th className="p-3">Attended Classes</th>
                                      <th className="p-3">Total Classes</th>
                                      <th className="p-3">Compliance Rate</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {history.length === 0 ? (
                                      <tr>
                                        <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                                          No history entries found. Use the Attendance entry page to add records!
                                        </td>
                                      </tr>
                                    ) : (
                                      history.map((entry, index) => (
                                        <tr key={index} className="hover:bg-slate-50/50">
                                          <td className="p-3 font-semibold text-slate-700">{entry.date}</td>
                                          <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded font-bold ${
                                              entry.status === "Present" 
                                                ? "bg-emerald-100 text-emerald-800" 
                                                : "bg-red-100 text-red-800"
                                            }`}>
                                              {entry.status}
                                            </span>
                                          </td>
                                          <td className="p-3 font-medium">{entry.attended}</td>
                                          <td className="p-3 font-medium">{entry.total}</td>
                                          <td className="p-3 font-mono font-bold text-slate-700">{entry.percentage.toFixed(1)}%</td>
                                        </tr>
                                      ))
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* VIEW 4: STUDENT PROFILE VIEW */}
                        {dashboardView === "profile" && (
                          <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 px-6 py-8 text-center text-white relative">
                              <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:16px_16px]" />
                              
                              <div className="relative inline-block w-20 h-20 rounded-full border-4 border-white/30 bg-white/10 text-4xl flex items-center justify-center shadow-lg mx-auto mb-3">
                                👨‍🎓
                              </div>
                              <h3 className="relative font-bold text-lg text-white">{student.name}</h3>
                              <p className="relative text-xs text-blue-200 font-medium mt-0.5">ID: {student.rollNumber}</p>
                            </div>

                            <div className="p-6 space-y-4 text-xs">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Course Program</span>
                                  <span className="text-slate-800 font-semibold text-xs block">{student.course}</span>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Semester</span>
                                  <span className="text-slate-800 font-semibold text-xs block">{student.semester}</span>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Section</span>
                                  <span className="text-slate-800 font-semibold text-xs block">{student.section}</span>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-slate-400 font-bold uppercase tracking-wider block">Database Rank</span>
                                  <span className="text-slate-800 font-semibold text-xs block">Active Student</span>
                                </div>
                              </div>

                              <hr className="border-slate-100" />

                              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                                <span className="font-bold text-slate-700 block">📁 Saved Data Location:</span>
                                <div className="font-mono text-[11px] text-slate-500 space-y-1">
                                  <div>• Profile DB: <span className="text-indigo-600 font-semibold">student_profile.dat</span></div>
                                  <div>• History DB: <span className="text-indigo-600 font-semibold">attendance_history.txt</span></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* VIEW 5: SETTINGS & CONFIGURATION */}
                        {dashboardView === "settings" && (
                          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
                            <div>
                              <h3 className="font-bold text-slate-900 text-sm">⚙ System Settings & Configurations</h3>
                              <p className="text-xs text-slate-500">Configure visual layouts and themes dynamically.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {themes.map((theme) => (
                                <button
                                  key={theme.name}
                                  onClick={() => setActiveTheme(theme)}
                                  className={`p-4 border text-center rounded-xl font-bold text-xs transition relative overflow-hidden flex flex-col items-center justify-center gap-2 cursor-pointer bg-white ${
                                    activeTheme.name === theme.name 
                                      ? "border-indigo-600 shadow-md scale-[1.02] bg-indigo-50/20" 
                                      : "border-slate-200 hover:border-slate-300 hover:shadow-sm"
                                  }`}
                                >
                                  <div className="w-6 h-6 rounded-full shadow border border-white" style={{ backgroundColor: theme.hex }} />
                                  <span className="text-slate-700">{theme.name}</span>
                                  {activeTheme.name === theme.name && (
                                    <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-0.5">
                                      <Check className="w-3 h-3" />
                                    </div>
                                  )}
                                </button>
                              ))}
                            </div>

                            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs text-slate-600">
                              <span className="font-bold text-slate-800 block">💡 Java Swing Theme Rendering</span>
                              <p>
                                Selecting a theme updates component properties dynamically inside Swing frame objects by overriding colors inside components.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* VIEW 6: ABOUT PAGE */}
                        {dashboardView === "about" && (
                          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 md:p-8 max-w-2xl mx-auto space-y-6">
                            <div className="text-center space-y-1">
                              <h3 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-2">
                                🎓 Smart Attendance Management System
                              </h3>
                              <p className="text-xs text-slate-400 font-semibold">Minor Training Project Demo</p>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                              <p>
                                This software acts as a fully compliant, premium submission for standard 1-month college student minor training courses. Built from scratch using standard Java and Java Swing libraries.
                              </p>
                              <div className="space-y-2 bg-slate-50 p-4 border border-slate-200 rounded-lg">
                                <span className="font-bold text-slate-800 block">📚 Core Architecture Framework:</span>
                                <ul className="list-disc pl-5 space-y-1">
                                  <li><strong>Swing Core:</strong> Overrides panel borders, implements multi-threaded dynamic clocks, and sets Nimbus style guidelines.</li>
                                  <li><strong>Encapsulated OOP Model:</strong> Employs structured, serializable model objects with strictly private attributes and public mutators.</li>
                                  <li><strong>Local Storage System:</strong> Replaces heavy database queries with local serial file streams and text files for full, zero-config desktop portability.</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                )}

                {/* ------------------------------------------
                    SIMULATED DIALOGS & OVERLAYS (SWING DIALOGS)
                    ------------------------------------------ */}
                {/* Startup reminder dialog */}
                <AnimatePresence>
                  {showStartupPopup && isLoggedIn && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-slate-900 border-2 border-blue-500 rounded-2xl w-full max-w-md overflow-hidden text-white shadow-2xl relative"
                      >
                        {/* Decorative bottom ribbon */}
                        <div className="absolute bottom-0 left-0 right-0 h-2.5 bg-blue-500" />
                        
                        <div className="p-6 space-y-4">
                          <div className="text-center space-y-1">
                            <span className="text-3xl block">📢</span>
                            <h3 className="text-lg font-bold text-blue-400 tracking-wider">GOOD MORNING!</h3>
                            <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">Daily Reminder Popup</p>
                          </div>

                          <div className="text-center text-xs text-slate-300 leading-relaxed px-2 space-y-2">
                            <p>Don't forget to mark your attendance today!</p>
                            <p className="font-semibold text-white">Every single class matters for your grades and future!</p>
                            <p className="text-slate-400 italic">Have a highly productive day ahead.</p>
                          </div>

                          <div className="pt-2 text-center">
                            <button
                              onClick={() => setShowStartupPopup(false)}
                              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition shadow-md shadow-blue-900/30 cursor-pointer"
                            >
                              Get Started
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* Confirm logout dialog */}
                <AnimatePresence>
                  {showLogoutConfirm && (
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50">
                      <motion.div 
                        initial={{ scale: 0.92, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.92, opacity: 0 }}
                        className="bg-white rounded-xl w-full max-w-sm overflow-hidden text-slate-800 shadow-2xl border border-slate-200"
                      >
                        <div className="p-5 space-y-4">
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">❓</span>
                            <div className="space-y-1">
                              <h4 className="font-bold text-slate-900 text-sm">Confirm Logout</h4>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                Are you sure you want to logout from the Smart Attendance Portal?
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2.5 pt-2">
                            <button
                              onClick={() => {
                                setShowLogoutConfirm(false);
                                setIsLoggedIn(false);
                              }}
                              className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
                            >
                              Yes, Logout
                            </button>
                            <button
                              onClick={() => setShowLogoutConfirm(false)}
                              className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                            >
                              No, Stay
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

                {/* Instant JDialog notification Toast */}
                <AnimatePresence>
                  {toastNotification && (
                    <div className="absolute bottom-4 right-4 z-50 max-w-sm w-full">
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className={`p-4 border rounded-xl shadow-lg border-l-4 ${toastNotification.color}`}
                      >
                        <div className="flex justify-between items-start gap-2 text-xs">
                          <div className="space-y-1">
                            <span className="font-bold block">{toastNotification.title}</span>
                            <p className="leading-relaxed opacity-90">{toastNotification.msg}</p>
                          </div>
                          <button 
                            onClick={() => setToastNotification(null)}
                            className="text-slate-400 hover:text-slate-700 font-bold px-1"
                          >
                            ×
                          </button>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>

              </div>

            </div>

            {/* Simulated Desktop Metadata Footnote */}
            <div className="w-full flex justify-between items-center px-4 py-2 bg-slate-950/40 rounded-xl border border-slate-800 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Ported to Web view
              </span>
              <span>Java Swing GUI Simulator (Aesthetic Override)</span>
              <span>No SQL DB Configuration required</span>
            </div>

          </div>
        )}

        {/* TAB 2: DEVELOPER GUIDE & JAVA SOURCE CODE AREA */}
        {activeTab === "developer_guide" && (
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[600px]">
            
            {/* File Explorer sidebar (4 Cols on large) */}
            <div className="lg:col-span-3 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-indigo-400" />
                    Java Files Directory
                  </h3>
                  <p className="text-[11px] text-slate-500">College Minor project source structure</p>
                </div>

                <hr className="border-slate-800" />

                {/* Simulated Explorer Tree */}
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-1 text-indigo-400 font-bold select-none p-1">
                    <Folder className="w-4 h-4" />
                    <span>sams-project/</span>
                  </div>
                  
                  <div className="pl-4 space-y-0.5">
                    <div className="flex items-center gap-1 text-indigo-300 font-bold select-none p-1">
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>src/</span>
                    </div>

                    {/* Java File nodes */}
                    <div className="pl-4 space-y-1">
                      {javaFiles.map((file) => (
                        <button
                          key={file.name}
                          onClick={() => setSelectedJavaFile(file)}
                          className={`w-full text-left p-1 rounded transition flex items-center gap-2 ${
                            selectedJavaFile.name === file.name
                              ? "bg-indigo-600/20 border-l-2 border-indigo-500 text-white font-semibold"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                          }`}
                        >
                          <FileCode className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                          <span className="truncate">{file.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-500 p-1 pl-4">
                      <FileText className="w-3.5 h-3.5" />
                      <span>attendance_history.txt</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 p-1 pl-4">
                      <FileText className="w-3.5 h-3.5" />
                      <span>student_profile.dat</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset database files hint */}
              <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl space-y-1.5 text-[11px] text-slate-400 leading-relaxed">
                <strong>📝 Text File storage:</strong>
                <p>The system stores log history to standard comma delimited lines and uses Serializable instances to save profiles locally.</p>
              </div>
            </div>

            {/* IDE Editor view (9 Cols on large) */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              
              {/* Main code box */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col flex-1 shadow-xl">
                
                {/* Editor Header / Tool bar */}
                <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-indigo-400" />
                    <div>
                      <span className="font-bold text-slate-200 text-xs block">{selectedJavaFile.name}</span>
                      <span className="text-[10px] text-slate-500 font-medium block">Path: /sams-project/{selectedJavaFile.path}</span>
                    </div>
                  </div>

                  {/* Actions copy / download */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyCode(selectedJavaFile)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1.5"
                    >
                      {copiedFileName === selectedJavaFile.name ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy code</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDownloadFile(selectedJavaFile)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1.5 shadow-md shadow-indigo-900/20"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download .java</span>
                    </button>
                  </div>
                </div>

                {/* File description pane */}
                <div className="bg-indigo-950/20 border-b border-indigo-900/30 px-4 py-2.5 text-[11px] text-indigo-200/90 leading-relaxed font-medium">
                  <strong>ℹ️ File Role:</strong> {selectedJavaFile.description}
                </div>

                {/* IDE Core code block with lines */}
                <div className="flex-1 overflow-auto max-h-[460px] font-mono text-xs p-4 bg-slate-950 text-slate-300">
                  <pre className="whitespace-pre overflow-x-auto text-left leading-normal">
                    {selectedJavaFile.code}
                  </pre>
                </div>

              </div>

              {/* Detailed compilation & submission guide */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  Submission Guide & Compilation Instructions
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
                  <div className="space-y-3">
                    <span className="font-extrabold text-white text-xs block border-b border-slate-800 pb-1.5 uppercase tracking-wider text-emerald-400">
                      Step 1: File Setup Arrangement
                    </span>
                    <p className="leading-relaxed">
                      Create a root folder named <code className="bg-slate-900 text-indigo-400 px-1 py-0.5 rounded font-mono">sams-project</code> on your machine. Inside it, create a subdirectory named <code className="bg-slate-900 text-indigo-400 px-1 py-0.5 rounded font-mono">src</code>.
                    </p>
                    <p className="leading-relaxed text-slate-400">
                      Download or copy all 9 files displayed in the explorer and save them directly inside the <code className="bg-slate-900 text-slate-300 px-1 py-0.5 rounded font-mono">src/</code> folder. Make sure the file names match perfectly (e.g., <code className="bg-slate-900 text-slate-300 px-1 py-0.5 rounded font-mono">Student.java</code> with a capital S).
                    </p>
                  </div>

                  <div className="space-y-3">
                    <span className="font-extrabold text-white text-xs block border-b border-slate-800 pb-1.5 uppercase tracking-wider text-emerald-400">
                      Step 2: Command Line Run
                    </span>
                    <p className="leading-relaxed">
                      Open your command prompt or terminal inside the <code className="bg-slate-900 text-indigo-400 px-1 py-0.5 rounded font-mono">sams-project</code> folder, compile the package, and run the main entry point:
                    </p>
                    
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 space-y-1 font-mono text-[10px] text-slate-300">
                      <div className="flex justify-between items-center text-slate-500 border-b border-slate-800 pb-1 mb-1">
                        <span>Terminal (CMD / Bash)</span>
                        <Play className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div className="text-emerald-400"># 1. Compile all Java source files</div>
                      <div className="text-slate-100 font-bold">javac src/*.java</div>
                      <div className="text-emerald-400 pt-1"># 2. Launch the Application</div>
                      <div className="text-slate-100 font-bold">java src.Main</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-xs text-slate-300 space-y-2">
                  <span className="font-bold text-white block flex items-center gap-1.5 text-indigo-300">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    Key Object-Oriented (OOP) Principles demonstrated:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-[11px] text-slate-400 pt-1">
                    <div>
                      <strong className="text-slate-200 block">✓ Encapsulation</strong>
                      All fields in <code className="font-mono text-[10px]">Student.java</code> are private, edited only via public getters/setters.
                    </div>
                    <div>
                      <strong className="text-slate-200 block">✓ Inheritance</strong>
                      JFrames and JPanels are customized using inheritance (<code className="font-mono text-[10px]">extends JFrame</code>).
                    </div>
                    <div>
                      <strong className="text-slate-200 block">✓ Exception Handling</strong>
                      Local operations (I/O, multi-threading, casting) are safely nested in try-catch-finally clauses.
                    </div>
                    <div>
                      <strong className="text-slate-200 block">✓ Data Persistence</strong>
                      Loads and saves serializable binary objects locally, removing any SQL server requirement.
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* ------------------------------------------
          GLOBAL PERSISTENT APP FOOTER
          ------------------------------------------ */}
      <footer className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 shrink-0 gap-2">
        <span>Smart Attendance Management System • Submission Blueprint</span>
        <span className="font-medium text-slate-500">Designed and built with modern UI standards</span>
      </footer>

    </div>
  );
}
