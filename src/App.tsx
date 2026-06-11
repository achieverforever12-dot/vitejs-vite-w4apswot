import { useState } from "react";
import {
  LayoutDashboard, AlertTriangle, FileCheck, FileText,
  ClipboardCheck, Plus, X, CheckCircle, Clock, AlertCircle,
  Shield, Bell, Search, ChevronDown, ChevronRight,
  TrendingUp, ArrowUpRight, Filter, MoreVertical, User
} from "lucide-react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const NCRS = [
  { id: "NCR-2024-041", part: "MS21042-3 Lock Nut", drawing: "DWG-4421-C", supplier: "Precision Parts Co.", severity: "Major", status: "Open", date: "2024-06-01", assignee: "Vikram Nair", clause: "8.7", description: "Thread form out of tolerance on 12 of 50 pieces. GO/NO-GO gauge failure at incoming inspection." },
  { id: "NCR-2024-040", part: "NAS6204-16 Hex Bolt", drawing: "DWG-3310-B", supplier: "FastenerTech Ltd.", severity: "Minor", status: "In Progress", date: "2024-05-28", assignee: "Anita Rao", clause: "8.5.1", description: "Surface finish Ra exceeds 1.6 µm on 3 parts. Visible tool marks on shank." },
  { id: "NCR-2024-039", part: "AN960-10 Washer", drawing: "DWG-2201-A", supplier: "Internal – Press Shop", severity: "Minor", status: "Closed", date: "2024-05-22", assignee: "Kiran Mehta", clause: "8.5.1", description: "Flatness deviation of 0.15mm against 0.10mm tolerance. Accepted under MRB with use-as-is disposition." },
  { id: "NCR-2024-038", part: "MS27183-14 Washer", drawing: "DWG-2204-A", supplier: "Orbital Fasteners", severity: "Observation", status: "Closed", date: "2024-05-18", assignee: "Vikram Nair", clause: "8.4", description: "Material cert missing heat lot number. Supplier issued corrected cert same day." },
  { id: "NCR-2024-037", part: "NAS1149C0332R Washer", drawing: "DWG-2198-B", supplier: "Orbital Fasteners", severity: "Major", status: "Open", date: "2024-05-14", assignee: "Anita Rao", clause: "8.7", description: "Cadmium plating thickness below minimum spec on full lot of 200 pcs. Lot quarantined." },
  { id: "NCR-2024-036", part: "MS21042-4 Lock Nut", drawing: "DWG-4425-C", supplier: "Internal – Forging", severity: "Minor", status: "In Progress", date: "2024-05-10", assignee: "Kiran Mehta", clause: "8.5.2", description: "Torque-off value at lower bound of specification. Root cause under investigation." },
];

const FAIS = [
  { id: "FAI-2024-018", part: "NAS6204-16 Hex Bolt", rev: "C", drawing: "DWG-3310-B", customer: "Collins Aerospace", status: "Approved", submitted: "2024-05-30", forms: { f1: true, f2: true, f3: true }, completeness: 100 },
  { id: "FAI-2024-017", part: "MS21042-3 Lock Nut", rev: "D", drawing: "DWG-4421-C", customer: "Spirit AeroSystems", status: "In Review", submitted: "2024-06-03", forms: { f1: true, f2: true, f3: false }, completeness: 72 },
  { id: "FAI-2024-016", part: "AN960-10 Washer", rev: "A", drawing: "DWG-2201-A", customer: "Safran USA", status: "Draft", submitted: "—", forms: { f1: true, f2: false, f3: false }, completeness: 33 },
  { id: "FAI-2024-015", part: "NAS1149C0332R Washer", rev: "B", drawing: "DWG-2198-B", customer: "Ducommun Inc.", status: "Rejected", submitted: "2024-05-20", forms: { f1: true, f2: true, f3: true }, completeness: 100 },
  { id: "FAI-2024-014", part: "MS27183-14 Washer", rev: "A", drawing: "DWG-2204-A", customer: "Triumph Group", status: "Approved", submitted: "2024-05-08", forms: { f1: true, f2: true, f3: true }, completeness: 100 },
];

const DOCUMENTS = [
  { id: "QP-001", title: "Quality Management System Manual", type: "Quality Plan", rev: "E", status: "Approved", owner: "Suresh Pillai", reviewDate: "2025-01-15", clause: "4.4" },
  { id: "WI-014", title: "Incoming Inspection Procedure", type: "Work Instruction", rev: "C", status: "Approved", owner: "Vikram Nair", reviewDate: "2024-09-01", clause: "8.4" },
  { id: "WI-021", title: "FAI Package Assembly – AS9102", type: "Work Instruction", rev: "B", status: "Under Review", owner: "Anita Rao", reviewDate: "2024-07-20", clause: "8.5.1.1" },
  { id: "QP-009", title: "NCR & Disposition Procedure", type: "Quality Plan", rev: "D", status: "Approved", owner: "Kiran Mehta", reviewDate: "2024-11-30", clause: "8.7" },
  { id: "FO-003", title: "CAPA Form – Root Cause Analysis", type: "Form", rev: "B", status: "Approved", owner: "Anita Rao", reviewDate: "2025-03-01", clause: "10.2" },
  { id: "SP-007", title: "Supplier Qualification Procedure", type: "Specification", rev: "C", status: "Approved", owner: "Suresh Pillai", reviewDate: "2024-12-15", clause: "8.4.1" },
  { id: "WI-031", title: "Calibration & Measurement Control", type: "Work Instruction", rev: "A", status: "Draft", owner: "Vikram Nair", reviewDate: "—", clause: "7.1.5" },
];

const AUDITS = [
  { id: "AUD-2024-02", title: "AS9100D Surveillance Audit – Clause 8 (Operations)", type: "External", auditor: "BSI Group", date: "2024-07-15", status: "Scheduled", findings: 0, clauses: ["8.1","8.4","8.5","8.7"] },
  { id: "AUD-2024-01", title: "Internal Audit – Design & Development (Cl. 8.3)", type: "Internal", auditor: "Anita Rao", date: "2024-05-10", status: "Closed", findings: 2, clauses: ["8.3"] },
  { id: "AUD-2023-04", title: "Internal Audit – Support Processes (Cl. 7)", type: "Internal", auditor: "Kiran Mehta", date: "2023-11-20", status: "Closed", findings: 1, clauses: ["7.1","7.2","7.3","7.4","7.5"] },
  { id: "AUD-2023-03", title: "AS9100D Recertification Audit", type: "External", auditor: "Bureau Veritas", date: "2023-08-05", status: "Closed", findings: 0, clauses: ["4","5","6","7","8","9","10"] },
];

const CLAUSE_DATA = [
  { id: "4", title: "Context of the Org", coverage: 90 },
  { id: "5", title: "Leadership", coverage: 85 },
  { id: "6", title: "Planning", coverage: 80 },
  { id: "7", title: "Support", coverage: 75 },
  { id: "8", title: "Operations", coverage: 88 },
  { id: "9", title: "Performance Eval.", coverage: 70 },
  { id: "10", title: "Improvement", coverage: 82 },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const severityColor = (s) => ({
  Major: "bg-red-100 text-red-700 border border-red-200",
  Minor: "bg-amber-100 text-amber-700 border border-amber-200",
  Observation: "bg-blue-100 text-blue-700 border border-blue-200",
}[s] || "bg-slate-100 text-slate-600");

const statusColor = (s) => ({
  Open: "bg-red-100 text-red-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Closed: "bg-green-100 text-green-700",
  Approved: "bg-green-100 text-green-700",
  "In Review": "bg-amber-100 text-amber-700",
  Draft: "bg-slate-100 text-slate-600",
  Rejected: "bg-red-100 text-red-700",
  Scheduled: "bg-blue-100 text-blue-700",
}[s] || "bg-slate-100 text-slate-600");

const Badge = ({ label, className }) => (
  <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${className}`}>{label}</span>
);

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "ncr", label: "NCRs", icon: AlertTriangle },
  { id: "fai", label: "First Articles", icon: FileCheck },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "audits", label: "Audits", icon: ClipboardCheck },
];

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ setView }) {
  const openNCRs = NCRS.filter(n => n.status === "Open").length;
  const inProgressFAIs = FAIS.filter(f => f.status !== "Approved").length;
  const overdueCAPAs = 2;
  const avgCoverage = Math.round(CLAUSE_DATA.reduce((s, c) => s + c.coverage, 0) / CLAUSE_DATA.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Quality Overview</p>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Good morning, Chirag</h2>
        <p className="text-sm text-slate-500 mt-0.5">AS9100D Surveillance Audit in <span className="font-semibold text-slate-700">35 days</span> — BSI Group · July 15, 2024</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Open NCRs", value: openNCRs, sub: "2 major severity", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", action: "ncr" },
          { label: "FAIs Pending", value: inProgressFAIs, sub: "1 customer-submitted", icon: FileCheck, color: "text-amber-600", bg: "bg-amber-50", action: "fai" },
          { label: "Overdue CAPAs", value: overdueCAPAs, sub: "Past due date", icon: Clock, color: "text-orange-600", bg: "bg-orange-50", action: "ncr" },
          { label: "Audit Readiness", value: `${avgCoverage}%`, sub: "AS9100D clause coverage", icon: Shield, color: "text-blue-600", bg: "bg-blue-50", action: "audits" },
        ].map(card => (
          <button key={card.label} onClick={() => setView(card.action)}
            className="bg-white rounded-xl p-4 border border-slate-200 text-left hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <div className={`text-3xl font-bold tracking-tight ${card.color}`}>{card.value}</div>
            <div className="text-xs font-semibold text-slate-600 mt-1">{card.label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{card.sub}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Clause Coverage */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">AS9100D Clause Coverage</p>
              <p className="text-sm text-slate-600 mt-0.5">Evidence mapped across all clauses</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{avgCoverage}%</div>
              <div className="text-xs text-slate-400">Overall readiness</div>
            </div>
          </div>
          <div className="space-y-3">
            {CLAUSE_DATA.map(c => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-5 text-right text-xs font-mono font-bold text-slate-400">{c.id}</div>
                <div className="text-xs text-slate-600 w-36 truncate">{c.title}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-2 rounded-full transition-all ${c.coverage >= 85 ? "bg-green-500" : c.coverage >= 70 ? "bg-amber-400" : "bg-red-400"}`}
                    style={{ width: `${c.coverage}%` }} />
                </div>
                <div className="w-10 text-right text-xs font-semibold text-slate-500">{c.coverage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Recent Activity</p>
          <div className="space-y-3">
            {[
              { icon: AlertTriangle, color: "text-red-500 bg-red-50", text: "NCR-2024-041 opened", sub: "MS21042-3 Lock Nut · Major", time: "2h ago" },
              { icon: FileCheck, color: "text-amber-500 bg-amber-50", text: "FAI-2024-017 submitted", sub: "Spirit AeroSystems · In Review", time: "5h ago" },
              { icon: CheckCircle, color: "text-green-500 bg-green-50", text: "NCR-2024-039 closed", sub: "MRB disposition approved", time: "1d ago" },
              { icon: FileText, color: "text-blue-500 bg-blue-50", text: "WI-021 under review", sub: "FAI Assembly Procedure", time: "2d ago" },
              { icon: Shield, color: "text-slate-500 bg-slate-100", text: "BSI audit confirmed", sub: "July 15, 2024 · AS9100D", time: "3d ago" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`p-1.5 rounded-lg ${item.color.split(" ")[1]} flex-shrink-0 mt-0.5`}>
                  <item.icon className={`w-3 h-3 ${item.color.split(" ")[0]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 truncate">{item.text}</p>
                  <p className="text-xs text-slate-400 truncate">{item.sub}</p>
                </div>
                <span className="text-xs text-slate-300 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NCR VIEW ────────────────────────────────────────────────────────────────
function NCRView() {
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ part: "", supplier: "", description: "", severity: "Minor", assignee: "" });
  const [ncrs, setNcrs] = useState(NCRS);

  const tabs = ["All", "Open", "In Progress", "Closed"];
  const filtered = filter === "All" ? ncrs : ncrs.filter(n => n.status === filter);

  const handleCreate = () => {
    if (!form.part || !form.description) return;
    const newNCR = {
      id: `NCR-2024-0${42 + ncrs.length - NCRS.length + 1}`,
      part: form.part, supplier: form.supplier || "Internal",
      drawing: "TBD", severity: form.severity, status: "Open",
      date: new Date().toISOString().split("T")[0],
      assignee: form.assignee || "Unassigned", clause: "8.7",
      description: form.description,
    };
    setNcrs([newNCR, ...ncrs]);
    setShowModal(false);
    setForm({ part: "", supplier: "", description: "", severity: "Minor", assignee: "" });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Non-Conformance Reports</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">NCR Register</h2>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New NCR
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit">
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filter === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {t}
            {t !== "All" && <span className="ml-1.5 text-xs text-slate-400">{ncrs.filter(n => t === "All" || n.status === t).length}</span>}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {["NCR ID", "Part Number", "Supplier / Source", "Severity", "Status", "Date", "Assigned To"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((ncr, i) => (
              <tr key={ncr.id} onClick={() => setSelected(ncr)}
                className="border-b border-slate-50 hover:bg-blue-50/50 cursor-pointer transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-bold text-blue-600">{ncr.id}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800 text-xs">{ncr.part}</div>
                  <div className="text-xs text-slate-400">{ncr.drawing}</div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">{ncr.supplier}</td>
                <td className="px-4 py-3"><Badge label={ncr.severity} className={severityColor(ncr.severity)} /></td>
                <td className="px-4 py-3"><Badge label={ncr.status} className={statusColor(ncr.status)} /></td>
                <td className="px-4 py-3 text-xs text-slate-500 font-mono">{ncr.date}</td>
                <td className="px-4 py-3 text-xs text-slate-600">{ncr.assignee}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm">No NCRs in this category</div>
        )}
      </div>

      {/* NCR Detail Panel */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50" onClick={() => setSelected(null)}>
          <div className="bg-white h-full w-full max-w-lg shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <p className="font-mono text-sm font-bold text-blue-600">{selected.id}</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">{selected.part}</p>
                <div className="flex gap-2 mt-2">
                  <Badge label={selected.severity} className={severityColor(selected.severity)} />
                  <Badge label={selected.status} className={statusColor(selected.status)} />
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {[
                ["Drawing", selected.drawing], ["Supplier / Source", selected.supplier],
                ["AS9100D Clause", selected.clause], ["Assigned To", selected.assignee], ["Date Raised", selected.date],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm text-slate-800 font-medium">{value}</p>
                </div>
              ))}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-lg p-3">{selected.description}</p>
              </div>
              <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-3">
                <button className="px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Initiate CAPA
                </button>
                <button className="px-4 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors">
                  Close NCR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Raise New NCR</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: "Part Number / Description *", key: "part", placeholder: "e.g. NAS6204-16 Hex Bolt" },
                { label: "Supplier / Source", key: "supplier", placeholder: "e.g. FastenerTech Ltd. or Internal" },
                { label: "Assigned To", key: "assignee", placeholder: "e.g. Vikram Nair" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{field.label}</label>
                  <input value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-300" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Severity</label>
                <div className="flex gap-2">
                  {["Major", "Minor", "Observation"].map(s => (
                    <button key={s} onClick={() => setForm({ ...form, severity: s })}
                      className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all ${form.severity === s ? severityColor(s) + " border-current" : "border-slate-200 text-slate-500 hover:border-slate-300"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description of Nonconformance *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3} placeholder="Describe the nonconformance in detail: what was found, where, on how many parts..."
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-300 resize-none" />
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleCreate}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Raise NCR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FAI VIEW ────────────────────────────────────────────────────────────────
function FAIView() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">AS9102 First Article Inspections</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">FAI Tracker</h2>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> New FAI
        </button>
      </div>

      <div className="grid gap-4">
        {FAIS.map(fai => (
          <div key={fai.id} onClick={() => setSelected(fai === selected ? null : fai)}
            className="bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-600">{fai.id}</span>
                  <Badge label={fai.status} className={statusColor(fai.status)} />
                </div>
                <p className="font-bold text-slate-900">{fai.part}</p>
                <p className="text-xs text-slate-500 mt-0.5">Rev {fai.rev} · {fai.drawing} · Customer: <span className="font-medium text-slate-700">{fai.customer}</span></p>
              </div>
              <div className="text-right ml-4">
                <div className={`text-2xl font-bold ${fai.completeness === 100 ? "text-green-600" : fai.completeness >= 60 ? "text-amber-600" : "text-red-500"}`}>
                  {fai.completeness}%
                </div>
                <div className="text-xs text-slate-400">Complete</div>
              </div>
            </div>

            {/* Forms Status */}
            <div className="flex gap-3 mt-4">
              {[
                { label: "Form 1", sub: "Design Accountability", done: fai.forms.f1 },
                { label: "Form 2", sub: "Product Accountability", done: fai.forms.f2 },
                { label: "Form 3", sub: "Characteristics", done: fai.forms.f3 },
              ].map(f => (
                <div key={f.label} className={`flex-1 rounded-lg p-3 border ${f.done ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {f.done
                      ? <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                      : <Clock className="w-3.5 h-3.5 text-slate-400" />}
                    <span className={`text-xs font-bold ${f.done ? "text-green-700" : "text-slate-500"}`}>{f.label}</span>
                  </div>
                  <p className="text-xs text-slate-400">{f.sub}</p>
                </div>
              ))}
            </div>

            {/* Expanded detail */}
            {selected === fai && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[["Submission Date", fai.submitted], ["Customer", fai.customer], ["Drawing", fai.drawing], ["Revision", `Rev ${fai.rev}`]].map(([k, v]) => (
                    <div key={k}>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{k}</p>
                      <p className="text-sm font-medium text-slate-800 mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                    Continue FAI
                  </button>
                  <button className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors">
                    Export PDF Package
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DOCUMENTS VIEW ──────────────────────────────────────────────────────────
function DocumentsView() {
  const [search, setSearch] = useState("");
  const filtered = DOCUMENTS.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Controlled Documents</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Document Register</h2>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Document
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by title or document ID..."
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-300 bg-white" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              {["Doc ID", "Title", "Type", "Rev", "Status", "Owner", "Next Review"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(doc => (
              <tr key={doc.id} className="border-b border-slate-50 hover:bg-blue-50/50 cursor-pointer transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-bold text-blue-600">{doc.id}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800 text-xs">{doc.title}</div>
                  <div className="text-xs text-slate-400">Clause {doc.clause}</div>
                </td>
                <td className="px-4 py-3"><Badge label={doc.type} className="bg-slate-100 text-slate-600 text-xs" /></td>
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-600">{doc.rev}</td>
                <td className="px-4 py-3"><Badge label={doc.status} className={statusColor(doc.status)} /></td>
                <td className="px-4 py-3 text-xs text-slate-600">{doc.owner}</td>
                <td className="px-4 py-3 text-xs text-slate-500 font-mono">{doc.reviewDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm">No documents match your search</div>
        )}
      </div>
    </div>
  );
}

// ─── AUDITS VIEW ─────────────────────────────────────────────────────────────
function AuditsView() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Internal & External Audits</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Audit Schedule</h2>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Schedule Audit
        </button>
      </div>

      {/* Upcoming alert */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-800">Surveillance Audit in 35 days</p>
          <p className="text-xs text-amber-700 mt-0.5">BSI Group · AS9100D · Scope: Clause 8 (Operations) · Ensure all Clause 8 evidence is current and accessible.</p>
        </div>
      </div>

      <div className="space-y-4">
        {AUDITS.map(audit => (
          <div key={audit.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs font-bold text-blue-600">{audit.id}</span>
                  <Badge label={audit.type} className={audit.type === "External" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"} />
                  <Badge label={audit.status} className={statusColor(audit.status)} />
                </div>
                <p className="font-bold text-slate-900">{audit.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{audit.auditor} · {audit.date}</p>
              </div>
              <div className="ml-4 text-right">
                <div className={`text-2xl font-bold ${audit.findings === 0 ? "text-green-600" : "text-amber-600"}`}>{audit.findings}</div>
                <div className="text-xs text-slate-400">Finding{audit.findings !== 1 ? "s" : ""}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {audit.clauses.map(c => (
                <span key={c} className="text-xs font-mono font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100">
                  Cl. {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function AxisQMS() {
  const [view, setView] = useState("dashboard");

  const renderView = () => {
    switch (view) {
      case "dashboard": return <Dashboard setView={setView} />;
      case "ncr": return <NCRView />;
      case "fai": return <FAIView />;
      case "documents": return <DocumentsView />;
      case "audits": return <AuditsView />;
      default: return <Dashboard setView={setView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 flex flex-col flex-shrink-0 border-r border-slate-800">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-tight">AxisQMS</p>
              <p className="text-xs text-slate-500">AS9100D</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(item => (
            <button key={item.id} onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                view === item.id
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
              {item.id === "ncr" && (
                <span className={`ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full ${view === "ncr" ? "bg-blue-500 text-white" : "bg-red-900 text-red-400"}`}>
                  {NCRS.filter(n => n.status === "Open").length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 pb-4 border-t border-slate-800 pt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">C</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">Chirag</p>
              <p className="text-xs text-slate-500 truncate">Quality Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>AxisQMS</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-slate-700 capitalize">{view === "ncr" ? "NCRs" : view === "fai" ? "First Articles" : view.charAt(0).toUpperCase() + view.slice(1)}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="text-xs text-slate-400 pl-2 border-l border-slate-200">Certification: <span className="font-bold text-green-600">Active</span></div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </div>
      </main>
    </div>
  );
}