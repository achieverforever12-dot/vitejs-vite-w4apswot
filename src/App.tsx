import { useState, useRef } from "react";
import {
  LayoutDashboard, AlertTriangle, FileCheck, FileText, ClipboardCheck,
  Plus, X, CheckCircle, Clock, AlertCircle, Shield, Bell, Search,
  ChevronRight, ArrowUpRight, Menu, Eye, Upload, Download, Paperclip,
  Bot, Send, Sparkles, Mic, MicOff, Volume2, VolumeX
} from "lucide-react";

// ═══ INITIAL DATA ════════════════════════════════════════════════════════════
const INIT_NCRS = [
  { id:"NCR-2024-041", part:"MS21042-3 Lock Nut", drawing:"DWG-4421-C", supplier:"Precision Parts Co.", severity:"Major", status:"Open", date:"2024-06-01", assignee:"Vikram Nair", clause:"8.7", description:"Thread form out of tolerance on 12 of 50 pieces. GO/NO-GO gauge failure at incoming inspection.", disposition:"Return to Supplier", capa:{ rootCause:"", why1:"", why2:"", why3:"", action:"", actionAssignee:"", dueDate:"", status:"Not Started" }, attachments:[] },
  { id:"NCR-2024-040", part:"NAS6204-16 Hex Bolt", drawing:"DWG-3310-B", supplier:"FastenerTech Ltd.", severity:"Minor", status:"In Progress", date:"2024-05-28", assignee:"Anita Rao", clause:"8.5.1", description:"Surface finish Ra exceeds 1.6 µm on 3 parts. Visible tool marks on shank.", disposition:"Rework", capa:{ rootCause:"Worn cutting tool", why1:"Tool exceeded recommended life", why2:"No tool life tracking system in place", why3:"Process not defined in work instructions", action:"Implement tool life tracking on CNC line 3", actionAssignee:"Kiran Mehta", dueDate:"2024-06-30", status:"In Progress" }, attachments:[] },
  { id:"NCR-2024-039", part:"AN960-10 Washer", drawing:"DWG-2201-A", supplier:"Internal – Press Shop", severity:"Minor", status:"Closed", date:"2024-05-22", assignee:"Kiran Mehta", clause:"8.5.1", description:"Flatness deviation of 0.15mm against 0.10mm tolerance. Accepted under MRB.", disposition:"Use As Is", capa:{ rootCause:"Die wear", why1:"Die inspection interval too long", why2:"No cycle-based maintenance trigger", why3:"Maintenance schedule based on time not usage", action:"Revised die inspection to every 5000 cycles", actionAssignee:"Vikram Nair", dueDate:"2024-06-10", status:"Closed" }, attachments:[] },
  { id:"NCR-2024-038", part:"MS27183-14 Washer", drawing:"DWG-2204-A", supplier:"Orbital Fasteners", severity:"Observation", status:"Closed", date:"2024-05-18", assignee:"Vikram Nair", clause:"8.4", description:"Material cert missing heat lot number. Supplier issued corrected cert same day.", disposition:"Use As Is", capa:{ rootCause:"", why1:"", why2:"", why3:"", action:"", actionAssignee:"", dueDate:"", status:"Not Started" }, attachments:[] },
  { id:"NCR-2024-037", part:"NAS1149C0332R Washer", drawing:"DWG-2198-B", supplier:"Orbital Fasteners", severity:"Major", status:"Open", date:"2024-05-14", assignee:"Anita Rao", clause:"8.7", description:"Cadmium plating thickness below minimum spec on full lot of 200 pcs. Lot quarantined.", disposition:"Return to Supplier", capa:{ rootCause:"", why1:"", why2:"", why3:"", action:"", actionAssignee:"", dueDate:"", status:"Not Started" }, attachments:[] },
];

const INIT_FAIS = [
  { id:"FAI-2024-018", part:"NAS6204-16 Hex Bolt", rev:"C", drawing:"DWG-3310-B", customer:"Collins Aerospace", status:"Approved", submitted:"2024-05-30", form1:{ drawingNumber:"DWG-3310-B", drawingRevision:"C", partNumber:"NAS6204-16", specification:"NAS620 Series", designOrgName:"AxisParts Ltd.", approvalStatus:"Approved" }, form2:{ manufacturer:"AxisParts Ltd.", cageCode:"1ABK9", poNumber:"PO-2024-1124", serialLot:"LOT-2405-C", quantity:"50", deliveryDate:"2024-05-25" }, form3Rows:[{ balloon:"1", desc:"Overall Length", nominal:"25.40", tolerance:"±0.25", actual:"25.38", result:"Pass" },{ balloon:"2", desc:"Thread Major Dia.", nominal:"6.35", tolerance:"±0.05", actual:"6.33", result:"Pass" },{ balloon:"3", desc:"Head Height", nominal:"4.00", tolerance:"±0.10", actual:"4.02", result:"Pass" }], attachments:{ drawing:[], materialCerts:[], processCerts:[] } },
  { id:"FAI-2024-017", part:"MS21042-3 Lock Nut", rev:"D", drawing:"DWG-4421-C", customer:"Spirit AeroSystems", status:"In Review", submitted:"2024-06-03", form1:{ drawingNumber:"DWG-4421-C", drawingRevision:"D", partNumber:"MS21042-3", specification:"MIL-N-25027", designOrgName:"AxisParts Ltd.", approvalStatus:"Pending" }, form2:{ manufacturer:"AxisParts Ltd.", cageCode:"1ABK9", poNumber:"PO-2024-1198", serialLot:"LOT-2406-A", quantity:"100", deliveryDate:"2024-06-01" }, form3Rows:[{ balloon:"1", desc:"Thread Internal Dia.", nominal:"4.76", tolerance:"±0.05", actual:"4.75", result:"Pass" },{ balloon:"2", desc:"Width Across Flats", nominal:"7.94", tolerance:"±0.08", actual:"7.93", result:"Pass" }], attachments:{ drawing:[], materialCerts:[], processCerts:[] } },
  { id:"FAI-2024-016", part:"AN960-10 Washer", rev:"A", drawing:"DWG-2201-A", customer:"Safran USA", status:"Draft", submitted:"—", form1:{ drawingNumber:"DWG-2201-A", drawingRevision:"A", partNumber:"AN960-10", specification:"AN960 Standard", designOrgName:"", approvalStatus:"Draft" }, form2:{ manufacturer:"", cageCode:"", poNumber:"", serialLot:"", quantity:"", deliveryDate:"" }, form3Rows:[], attachments:{ drawing:[], materialCerts:[], processCerts:[] } },
];

const INIT_DOCS = [
  { id:"QP-001", title:"Quality Management System Manual", type:"Quality Plan", rev:"E", status:"Approved", owner:"Suresh Pillai", reviewDate:"2025-01-15", clause:"4.4", file:null },
  { id:"WI-014", title:"Incoming Inspection Procedure", type:"Work Instruction", rev:"C", status:"Approved", owner:"Vikram Nair", reviewDate:"2024-09-01", clause:"8.4", file:null },
  { id:"WI-021", title:"FAI Package Assembly – AS9102", type:"Work Instruction", rev:"B", status:"Under Review", owner:"Anita Rao", reviewDate:"2024-07-20", clause:"8.5.1.1", file:null },
  { id:"QP-009", title:"NCR & Disposition Procedure", type:"Quality Plan", rev:"D", status:"Approved", owner:"Kiran Mehta", reviewDate:"2024-11-30", clause:"8.7", file:null },
  { id:"FO-003", title:"CAPA Form – Root Cause Analysis", type:"Form", rev:"B", status:"Approved", owner:"Anita Rao", reviewDate:"2025-03-01", clause:"10.2", file:null },
  { id:"SP-007", title:"Supplier Qualification Procedure", type:"Specification", rev:"C", status:"Approved", owner:"Suresh Pillai", reviewDate:"2024-12-15", clause:"8.4.1", file:null },
];

const INIT_AUDITS = [
  { id:"AUD-2024-02", title:"AS9100D Surveillance Audit – Clause 8", type:"External", auditor:"BSI Group", date:"2024-07-15", status:"Scheduled", clauses:["8.1","8.4","8.5","8.7"], scope:"Operations, production controls, supplier management, nonconforming output", findings:[], attachments:[] },
  { id:"AUD-2024-01", title:"Internal Audit – Design & Development", type:"Internal", auditor:"Anita Rao", date:"2024-05-10", status:"Closed", clauses:["8.3"], scope:"Design and development planning, inputs, outputs, reviews", findings:[{ id:"F001", clause:"8.3.3", type:"Minor", description:"Design review records incomplete for 2 of 8 reviewed projects.", status:"Closed" },{ id:"F002", clause:"8.3.5", type:"Observation", description:"Design output documents not consistently referencing applicable specifications.", status:"Closed" }], attachments:[] },
];

const CLAUSE_DATA = [
  { id:"4", title:"Context of the Org", coverage:90 },
  { id:"5", title:"Leadership", coverage:85 },
  { id:"6", title:"Planning", coverage:80 },
  { id:"7", title:"Support", coverage:75 },
  { id:"8", title:"Operations", coverage:88 },
  { id:"9", title:"Performance Eval.", coverage:70 },
  { id:"10", title:"Improvement", coverage:82 },
];

// ═══ SHARED ════════════════════════════════════════════════════════════════════
const Badge = ({ label, className }) => <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${className}`}>{label}</span>;

const sc = (s) => ({ Open:"bg-red-100 text-red-700", "In Progress":"bg-amber-100 text-amber-700", Closed:"bg-green-100 text-green-700", Approved:"bg-green-100 text-green-700", "In Review":"bg-amber-100 text-amber-700", Draft:"bg-slate-100 text-slate-600", Rejected:"bg-red-100 text-red-700", Scheduled:"bg-blue-100 text-blue-700", "Not Started":"bg-slate-100 text-slate-500", "Under Review":"bg-purple-100 text-purple-700" }[s] || "bg-slate-100 text-slate-600");

const sevc = (s) => ({ Major:"bg-red-100 text-red-700 border border-red-200", Minor:"bg-amber-100 text-amber-700 border border-amber-200", Observation:"bg-blue-100 text-blue-700 border border-blue-200" }[s] || "bg-slate-100 text-slate-600");

const fmtSize = (b) => b < 1024 ? b+"B" : b < 1048576 ? (b/1024).toFixed(1)+"KB" : (b/1048576).toFixed(1)+"MB";

const mkFile = (f) => ({ id:Date.now()+Math.random(), name:f.name, type:f.type, size:f.size, url:URL.createObjectURL(f), uploadedAt:new Date().toISOString() });

// ─── File Viewer ──────────────────────────────────────────────────────────────
function FileViewer({ file, onClose }) {
  if (!file) return null;
  const isPDF = file.type==="application/pdf";
  const isImg = file.type?.startsWith("image/");
  return (
    <div className="fixed inset-0 bg-black/95 z-[200] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-700 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="w-4 h-4 text-blue-400 flex-shrink-0"/>
          <span className="text-white text-sm font-medium truncate">{file.name}</span>
          <span className="text-slate-400 text-xs hidden sm:block flex-shrink-0">{fmtSize(file.size)}</span>
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <a href={file.url} download={file.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-white text-xs font-semibold rounded-lg hover:bg-slate-600 transition-colors">
            <Download className="w-3 h-3"/>Download
          </a>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-700 rounded-lg transition-colors"><X className="w-4 h-4 text-white"/></button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex items-center justify-center bg-slate-800 p-2 sm:p-4">
        {isPDF ? (
          <object data={file.url} type="application/pdf" className="w-full h-full rounded-lg">
            <div className="text-center text-white p-8">
              <p className="mb-4 text-slate-300">PDF viewer not available. Use the download button above.</p>
              <a href={file.url} download={file.name} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">Download PDF</a>
            </div>
          </object>
        ) : isImg ? (
          <img src={file.url} alt={file.name} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"/>
        ) : (
          <div className="text-center text-white">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4"/>
            <p className="text-lg font-semibold mb-2">{file.name}</p>
            <p className="text-slate-400 text-sm mb-4">No preview available for this file type</p>
            <a href={file.url} download={file.name} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm inline-flex items-center gap-2"><Download className="w-4 h-4"/>Download</a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Upload Button ────────────────────────────────────────────────────────────
function UploadBtn({ onUpload, label, accept, block }) {
  const ref = useRef(null);
  const onChange = (e) => { const f=e.target.files[0]; if(f){ onUpload(mkFile(f)); e.target.value=""; } };
  return (
    <>
      <input ref={ref} type="file" className="hidden" onChange={onChange} accept={accept||"*"}/>
      {block ? (
        <button onClick={()=>ref.current.click()} className="w-full flex flex-col items-center gap-2 p-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center"><Upload className="w-5 h-5 text-blue-500"/></div>
          <div className="text-center"><p className="text-sm font-semibold text-slate-700">{label||"Click to upload"}</p><p className="text-xs text-slate-400 mt-0.5">PDF, DOCX, XLSX, JPG, PNG</p></div>
        </button>
      ) : (
        <button onClick={()=>ref.current.click()} className="flex items-center gap-1.5 px-3 py-1.5 border border-dashed border-blue-300 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors">
          <Upload className="w-3 h-3"/>{label||"Upload"}
        </button>
      )}
    </>
  );
}

// ─── File Row ─────────────────────────────────────────────────────────────────
function FileRow({ file, onView }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0"><FileText className="w-4 h-4 text-blue-600"/></div>
      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-slate-700 truncate">{file.name}</p><p className="text-xs text-slate-400">{fmtSize(file.size)}</p></div>
      <button onClick={()=>onView(file)} className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0">
        <Eye className="w-3 h-3"/>View
      </button>
    </div>
  );
}

// ═══ DASHBOARD ════════════════════════════════════════════════════════════════
function Dashboard({ setView, ncrs, fais }) {
  const openNCRs = ncrs.filter(n=>n.status==="Open").length;
  const pendingFAIs = fais.filter(f=>f.status!=="Approved").length;
  const avg = Math.round(CLAUSE_DATA.reduce((s,c)=>s+c.coverage,0)/CLAUSE_DATA.length);
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Quality Overview</p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Good morning, Chirag</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">BSI Surveillance Audit in <span className="font-bold text-slate-700">35 days</span> · July 15, 2024</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label:"Open NCRs", value:openNCRs, sub:"2 major severity", icon:AlertTriangle, color:"text-red-600", bg:"bg-red-50", nav:"ncr" },
          { label:"FAIs Pending", value:pendingFAIs, sub:"1 customer review", icon:FileCheck, color:"text-amber-600", bg:"bg-amber-50", nav:"fai" },
          { label:"Overdue CAPAs", value:2, sub:"Past due date", icon:Clock, color:"text-orange-600", bg:"bg-orange-50", nav:"ncr" },
          { label:"Audit Readiness", value:`${avg}%`, sub:"Clause coverage", icon:Shield, color:"text-blue-600", bg:"bg-blue-50", nav:"audits" },
        ].map(c=>(
          <button key={c.label} onClick={()=>setView(c.nav)} className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 text-left hover:border-blue-300 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className={`p-1.5 sm:p-2 rounded-lg ${c.bg}`}><c.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${c.color}`}/></div>
              <ArrowUpRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transition-colors"/>
            </div>
            <div className={`text-2xl sm:text-3xl font-bold tracking-tight ${c.color}`}>{c.value}</div>
            <div className="text-xs font-semibold text-slate-600 mt-0.5">{c.label}</div>
            <div className="text-xs text-slate-400 hidden sm:block">{c.sub}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">AS9100D Clause Coverage</p><p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Evidence mapped across all clauses</p></div>
            <div className="text-right"><div className="text-xl sm:text-2xl font-bold text-blue-600">{avg}%</div><div className="text-xs text-slate-400">Readiness</div></div>
          </div>
          <div className="space-y-2.5">
            {CLAUSE_DATA.map(c=>(
              <div key={c.id} className="flex items-center gap-2 sm:gap-3">
                <div className="w-5 text-right text-xs font-mono font-bold text-slate-400">{c.id}</div>
                <div className="text-xs text-slate-600 w-24 sm:w-36 truncate">{c.title}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-2 rounded-full ${c.coverage>=85?"bg-green-500":c.coverage>=70?"bg-amber-400":"bg-red-400"}`} style={{width:`${c.coverage}%`}}/>
                </div>
                <div className="w-10 text-right text-xs font-semibold text-slate-500">{c.coverage}%</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Recent Activity</p>
          <div className="space-y-3">
            {[
              { icon:AlertTriangle, col:"text-red-500 bg-red-50", text:"NCR-2024-041 opened", sub:"MS21042-3 · Major", time:"2h ago" },
              { icon:FileCheck, col:"text-amber-500 bg-amber-50", text:"FAI-2024-017 submitted", sub:"Spirit AeroSystems", time:"5h ago" },
              { icon:CheckCircle, col:"text-green-500 bg-green-50", text:"NCR-2024-039 closed", sub:"MRB disposition", time:"1d ago" },
              { icon:FileText, col:"text-blue-500 bg-blue-50", text:"WI-021 under review", sub:"FAI Assembly Procedure", time:"2d ago" },
              { icon:Shield, col:"text-slate-500 bg-slate-100", text:"BSI audit confirmed", sub:"July 15, 2024", time:"3d ago" },
            ].map((item,i)=>(
              <div key={i} className="flex items-start gap-2.5">
                <div className={`p-1.5 rounded-lg ${item.col.split(" ")[1]} flex-shrink-0 mt-0.5`}><item.icon className={`w-3 h-3 ${item.col.split(" ")[0]}`}/></div>
                <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-slate-700 truncate">{item.text}</p><p className="text-xs text-slate-400 truncate">{item.sub}</p></div>
                <span className="text-xs text-slate-300 flex-shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ NCR VIEW ══════════════════════════════════════════════════════════════════
function NCRView({ onViewFile }) {
  const [ncrs, setNcrs] = useState(INIT_NCRS);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [detailTab, setDetailTab] = useState("details");
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ part:"", supplier:"", drawing:"", description:"", severity:"Minor", assignee:"", disposition:"Rework" });
  const [tempCapa, setTempCapa] = useState({});

  const tabs = ["All","Open","In Progress","Closed"];
  const filtered = filter==="All" ? ncrs : ncrs.filter(n=>n.status===filter);

  const createNCR = () => {
    if(!form.part||!form.description) return;
    const n = { id:`NCR-2024-0${50+ncrs.length}`, ...form, date:new Date().toISOString().split("T")[0], clause:"8.7", capa:{rootCause:"",why1:"",why2:"",why3:"",action:"",actionAssignee:"",dueDate:"",status:"Not Started"}, attachments:[] };
    setNcrs([n,...ncrs]); setShowCreate(false); setForm({part:"",supplier:"",drawing:"",description:"",severity:"Minor",assignee:"",disposition:"Rework"});
  };

  const addAttachment = (file) => {
    setNcrs(ncrs.map(n=>n.id===selected.id?{...n,attachments:[...n.attachments,file]}:n));
    setSelected(prev=>({...prev,attachments:[...prev.attachments,file]}));
  };

  const saveCapa = () => {
    setNcrs(ncrs.map(n=>n.id===selected.id?{...n,capa:{...n.capa,...tempCapa}}:n));
    setSelected(prev=>({...prev,capa:{...prev.capa,...tempCapa}}));
    setTempCapa({});
    alert("CAPA saved successfully.");
  };

  const closeNCR = (ncrId) => {
    setNcrs(ncrs.map(n=>n.id===ncrId?{...n,status:"Closed"}:n));
    setSelected(prev=>prev?{...prev,status:"Closed"}:prev);
  };

  const openDetail = (ncr) => { setSelected(ncr); setDetailTab("details"); setTempCapa({...ncr.capa}); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-0.5">Non-Conformance Reports</p><h2 className="text-xl sm:text-2xl font-bold text-slate-900">NCR Register</h2></div>
        <button onClick={()=>setShowCreate(true)} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"><Plus className="w-3.5 h-3.5"/>New NCR</button>
      </div>
      <div className="flex gap-1 bg-slate-100 p-1 rounded-lg w-fit overflow-x-auto">
        {tabs.map(t=>(
          <button key={t} onClick={()=>setFilter(t)} className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${filter===t?"bg-white text-slate-900 shadow-sm":"text-slate-500 hover:text-slate-700"}`}>
            {t} {t!=="All"&&<span className="ml-1 text-slate-400">{ncrs.filter(n=>n.status===t).length}</span>}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead><tr className="border-b border-slate-100">{["NCR ID","Part Number","Supplier","Severity","Status","Assigned To"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(ncr=>(
                <tr key={ncr.id} onClick={()=>openDetail(ncr)} className="border-b border-slate-50 hover:bg-blue-50/50 cursor-pointer transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-blue-600">{ncr.id}</td>
                  <td className="px-4 py-3"><div className="font-medium text-slate-800 text-xs">{ncr.part}</div><div className="text-xs text-slate-400">{ncr.drawing}</div></td>
                  <td className="px-4 py-3 text-xs text-slate-600">{ncr.supplier}</td>
                  <td className="px-4 py-3"><Badge label={ncr.severity} className={sevc(ncr.severity)}/></td>
                  <td className="px-4 py-3"><Badge label={ncr.status} className={sc(ncr.status)}/></td>
                  <td className="px-4 py-3 text-xs text-slate-600">{ncr.assignee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length===0&&<div className="py-12 text-center text-slate-400 text-sm">No NCRs in this category</div>}
      </div>

      {/* Detail Panel */}
      {selected&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-stretch justify-end" onClick={()=>setSelected(null)}>
          <div className="bg-white w-full max-w-lg h-full flex flex-col shadow-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
            <div className="p-4 sm:p-5 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div><span className="font-mono text-xs font-bold text-blue-600">{selected.id}</span><p className="font-bold text-slate-900 text-base sm:text-lg mt-0.5">{selected.part}</p><div className="flex gap-2 mt-1.5"><Badge label={selected.severity} className={sevc(selected.severity)}/><Badge label={selected.status} className={sc(selected.status)}/></div></div>
                <button onClick={()=>setSelected(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4 text-slate-500"/></button>
              </div>
              <div className="flex gap-1 mt-3 bg-slate-100 p-1 rounded-lg">
                {["details","capa","attachments"].map(t=>(
                  <button key={t} onClick={()=>setDetailTab(t)} className={`flex-1 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${detailTab===t?"bg-white text-slate-900 shadow-sm":"text-slate-500"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {detailTab==="details"&&(
                <>
                  {[["Drawing",selected.drawing],["Supplier",selected.supplier],["AS9100D Clause",selected.clause],["Disposition",selected.disposition],["Date Raised",selected.date],["Assigned To",selected.assignee]].map(([k,v])=>(
                    <div key={k}><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{k}</p><p className="text-sm font-medium text-slate-800 mt-0.5">{v}</p></div>
                  ))}
                  <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Description</p><p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 leading-relaxed">{selected.description}</p></div>
                  <div className="flex gap-2 pt-2">
                    {selected.status!=="Closed"&&<button onClick={()=>closeNCR(selected.id)} className="flex-1 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors">Close NCR</button>}
                    <button onClick={()=>setDetailTab("capa")} className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Manage CAPA</button>
                  </div>
                </>
              )}
              {detailTab==="capa"&&(
                <>
                  <div className="flex items-center justify-between"><p className="text-sm font-bold text-slate-800">CAPA Status</p><Badge label={selected.capa.status} className={sc(selected.capa.status)}/></div>
                  <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Root Cause Summary</p><textarea value={tempCapa.rootCause??selected.capa.rootCause} onChange={e=>setTempCapa({...tempCapa,rootCause:e.target.value})} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" placeholder="Describe root cause..."/></div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">5-Why Analysis</p>
                    {["why1","why2","why3"].map((w,i)=>(
                      <div key={w} className="flex gap-2 items-start">
                        <span className="text-xs font-bold text-blue-600 mt-2.5 w-12 flex-shrink-0">Why {i+1}</span>
                        <input value={tempCapa[w]??selected.capa[w]} onChange={e=>setTempCapa({...tempCapa,[w]:e.target.value})} className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder={`Because...`}/>
                      </div>
                    ))}
                  </div>
                  <div><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Corrective Action</p><textarea value={tempCapa.action??selected.capa.action} onChange={e=>setTempCapa({...tempCapa,action:e.target.value})} rows={2} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" placeholder="Describe the corrective action..."/></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-xs font-semibold text-slate-500 mb-1">Assigned To</p><input value={tempCapa.actionAssignee??selected.capa.actionAssignee} onChange={e=>setTempCapa({...tempCapa,actionAssignee:e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Name"/></div>
                    <div><p className="text-xs font-semibold text-slate-500 mb-1">Due Date</p><input type="date" value={tempCapa.dueDate??selected.capa.dueDate} onChange={e=>setTempCapa({...tempCapa,dueDate:e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
                  </div>
                  <button onClick={saveCapa} className="w-full py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Save CAPA</button>
                </>
              )}
              {detailTab==="attachments"&&(
                <>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Evidence Files ({selected.attachments.length})</p>
                  <UploadBtn onUpload={addAttachment} label="Attach Evidence" accept=".pdf,.jpg,.png,.docx,.xlsx" block/>
                  {selected.attachments.length===0?<p className="text-sm text-slate-400 text-center py-4">No attachments yet</p>:
                    <div className="space-y-2">{selected.attachments.map(f=><FileRow key={f.id} file={f} onView={onViewFile}/>)}</div>}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreate&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={()=>setShowCreate(false)}>
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10"><h3 className="text-base font-bold text-slate-900">Raise New NCR</h3><button onClick={()=>setShowCreate(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4 text-slate-500"/></button></div>
            <div className="p-5 space-y-4">
              {[{l:"Part Number / Description *",k:"part",p:"e.g. NAS6204-16 Hex Bolt"},{l:"Supplier / Source",k:"supplier",p:"e.g. FastenerTech or Internal"},{l:"Drawing Number",k:"drawing",p:"e.g. DWG-3310-B"},{l:"Assigned To",k:"assignee",p:"e.g. Vikram Nair"}].map(f=>(
                <div key={f.k}><label className="block text-xs font-semibold text-slate-600 mb-1.5">{f.l}</label><input value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})} placeholder={f.p} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-300"/></div>
              ))}
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Severity</label><div className="flex gap-2">{["Major","Minor","Observation"].map(s=><button key={s} onClick={()=>setForm({...form,severity:s})} className={`flex-1 py-2 rounded-lg border text-xs font-semibold transition-all ${form.severity===s?sevc(s)+" border-current":"border-slate-200 text-slate-500"}`}>{s}</button>)}</div></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Disposition</label><select value={form.disposition} onChange={e=>setForm({...form,disposition:e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"><option>Rework</option><option>Use As Is</option><option>Scrap</option><option>Return to Supplier</option></select></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Description *</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3} placeholder="Describe the nonconformance in detail..." className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none placeholder-slate-300"/></div>
            </div>
            <div className="px-5 pb-5 flex gap-3"><button onClick={()=>setShowCreate(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50">Cancel</button><button onClick={createNCR} className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Raise NCR</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ FAI VIEW ══════════════════════════════════════════════════════════════════
function FAIView({ onViewFile }) {
  const [fais, setFais] = useState(INIT_FAIS);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("overview");
  const [showCreate, setShowCreate] = useState(false);
  const [newFAI, setNewFAI] = useState({ part:"", rev:"", drawing:"", customer:"" });

  const update = (faiId, patch) => { setFais(fais.map(f=>f.id===faiId?{...f,...patch}:f)); setSelected(prev=>prev?{...prev,...patch}:prev); };

  const addFile = (section, file) => {
    const att = { ...selected.attachments, [section]:[...selected.attachments[section],file] };
    update(selected.id, { attachments:att });
  };

  const addRow = () => {
    const row = { balloon:String(selected.form3Rows.length+1), desc:"", nominal:"", tolerance:"", actual:"", result:"—" };
    update(selected.id, { form3Rows:[...selected.form3Rows,row] });
  };

  const editRow = (i,k,v) => {
    const rows = selected.form3Rows.map((r,idx)=>idx===i?{...r,[k]:v}:r);
    update(selected.id, { form3Rows:rows });
  };

  const calcPct = (f) => { const t=[f.form1.drawingNumber,f.form1.partNumber,f.form2.manufacturer,f.form2.poNumber,f.form3Rows.length>0].filter(Boolean).length; return Math.round((t/5)*100); };

  const createFAI = () => {
    if(!newFAI.part) return;
    const f = { id:`FAI-2024-0${20+fais.length}`, ...newFAI, status:"Draft", submitted:"—", form1:{drawingNumber:newFAI.drawing,drawingRevision:newFAI.rev,partNumber:newFAI.part,specification:"",designOrgName:"",approvalStatus:"Draft"}, form2:{manufacturer:"",cageCode:"",poNumber:"",serialLot:"",quantity:"",deliveryDate:""}, form3Rows:[], attachments:{drawing:[],materialCerts:[],processCerts:[]} };
    setFais([f,...fais]); setShowCreate(false); setNewFAI({part:"",rev:"",drawing:"",customer:""});
  };

  const F1_FIELDS = [["drawingNumber","Drawing Number"],["drawingRevision","Drawing Revision"],["partNumber","Part Number"],["specification","Applicable Specification"],["designOrgName","Design Org Name"]];
  const F2_FIELDS = [["manufacturer","Manufacturer Name"],["cageCode","CAGE Code"],["poNumber","Purchase Order No."],["serialLot","Serial / Lot Number"],["quantity","Quantity"],["deliveryDate","Delivery Date"]];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-0.5">AS9102 First Article Inspections</p><h2 className="text-xl sm:text-2xl font-bold text-slate-900">FAI Tracker</h2></div>
        <button onClick={()=>setShowCreate(true)} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"><Plus className="w-3.5 h-3.5"/>New FAI</button>
      </div>
      <div className="space-y-3">
        {fais.map(fai=>{
          const pct=calcPct(fai);
          return (
            <div key={fai.id} className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="p-4 sm:p-5 flex items-center justify-between cursor-pointer" onClick={()=>{setSelected(fai===selected?null:fai);setTab("overview");}}>
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1 flex-wrap"><span className="font-mono text-xs font-bold text-blue-600">{fai.id}</span><Badge label={fai.status} className={sc(fai.status)}/></div>
                  <p className="font-bold text-slate-900 text-sm">{fai.part}</p>
                  <p className="text-xs text-slate-500 mt-0.5 hidden sm:block">Rev {fai.rev} · {fai.drawing} · {fai.customer}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-2xl font-bold ${pct===100?"text-green-600":pct>=60?"text-amber-600":"text-red-500"}`}>{pct}%</div>
                  <div className="text-xs text-slate-400">Complete</div>
                </div>
              </div>
              {selected?.id===fai.id&&(
                <div className="border-t border-slate-100">
                  <div className="flex overflow-x-auto bg-slate-50 border-b border-slate-100">
                    {["overview","form1","form2","form3","attachments"].map(t=>(
                      <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${tab===t?"border-blue-600 text-blue-600 bg-white":"border-transparent text-slate-500 hover:text-slate-700"}`}>
                        {t==="form1"?"Form 1":t==="form2"?"Form 2":t==="form3"?"Form 3":t.charAt(0).toUpperCase()+t.slice(1)}
                      </button>
                    ))}
                  </div>
                  <div className="p-4 sm:p-5">
                    {tab==="overview"&&(
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[["Customer",selected.customer],["Drawing",selected.drawing],["Revision",`Rev ${selected.rev}`],["Status",selected.status],["Submitted",selected.submitted]].map(([k,v])=>(
                          <div key={k}><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{k}</p><p className="text-sm font-medium text-slate-800 mt-0.5">{v}</p></div>
                        ))}
                        <div className="sm:col-span-2 flex gap-2 pt-2">
                          <button onClick={()=>setTab("form1")} className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Fill Forms</button>
                          <button onClick={()=>setTab("attachments")} className="flex-1 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors">Attachments</button>
                        </div>
                      </div>
                    )}
                    {tab==="form1"&&(
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Form 1 – Design Accountability</p>
                        {F1_FIELDS.map(([k,l])=>(
                          <div key={k}><label className="block text-xs font-semibold text-slate-500 mb-1">{l}</label><input value={selected.form1[k]} onChange={e=>{const f1={...selected.form1,[k]:e.target.value};update(selected.id,{form1:f1});}} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
                        ))}
                      </div>
                    )}
                    {tab==="form2"&&(
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Form 2 – Product Accountability</p>
                        {F2_FIELDS.map(([k,l])=>(
                          <div key={k}><label className="block text-xs font-semibold text-slate-500 mb-1">{l}</label><input value={selected.form2[k]} onChange={e=>{const f2={...selected.form2,[k]:e.target.value};update(selected.id,{form2:f2});}} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
                        ))}
                      </div>
                    )}
                    {tab==="form3"&&(
                      <div className="space-y-3">
                        <div className="flex items-center justify-between"><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Form 3 – Characteristic Accountability</p><button onClick={addRow} className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"><Plus className="w-3 h-3"/>Add Row</button></div>
                        {selected.form3Rows.length===0?<p className="text-sm text-slate-400 text-center py-6">No characteristics added yet. Click "Add Row" to start.</p>:(
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs min-w-[500px]">
                              <thead><tr className="bg-slate-50">{["#","Characteristic","Nominal","Tolerance","Actual","Result"].map(h=><th key={h} className="px-2 py-2 text-left font-semibold text-slate-500 border border-slate-200">{h}</th>)}</tr></thead>
                              <tbody>
                                {selected.form3Rows.map((r,i)=>(
                                  <tr key={i}>
                                    <td className="px-2 py-1.5 border border-slate-200 font-mono text-center w-8">{r.balloon}</td>
                                    <td className="px-2 py-1.5 border border-slate-200"><input value={r.desc} onChange={e=>editRow(i,"desc",e.target.value)} className="w-full min-w-[120px] focus:outline-none text-slate-700" placeholder="e.g. Overall Length"/></td>
                                    <td className="px-2 py-1.5 border border-slate-200"><input value={r.nominal} onChange={e=>editRow(i,"nominal",e.target.value)} className="w-16 focus:outline-none text-center font-mono text-slate-700"/></td>
                                    <td className="px-2 py-1.5 border border-slate-200"><input value={r.tolerance} onChange={e=>editRow(i,"tolerance",e.target.value)} className="w-16 focus:outline-none text-center font-mono text-slate-700"/></td>
                                    <td className="px-2 py-1.5 border border-slate-200"><input value={r.actual} onChange={e=>editRow(i,"actual",e.target.value)} className="w-16 focus:outline-none text-center font-mono text-slate-700"/></td>
                                    <td className="px-2 py-1.5 border border-slate-200">
                                      <select value={r.result} onChange={e=>editRow(i,"result",e.target.value)} className={`text-xs font-semibold rounded px-1.5 py-0.5 border-0 focus:outline-none ${r.result==="Pass"?"bg-green-100 text-green-700":r.result==="Fail"?"bg-red-100 text-red-700":"bg-slate-100 text-slate-500"}`}>
                                        <option>—</option><option>Pass</option><option>Fail</option>
                                      </select>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                    {tab==="attachments"&&(
                      <div className="space-y-5">
                        {[["drawing","Balloon Drawing (PDF)"],["materialCerts","Material Certifications"],["processCerts","Special Process Certs (Nadcap)"]].map(([key,label])=>(
                          <div key={key}>
                            <div className="flex items-center justify-between mb-2"><p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">{label}</p><UploadBtn onUpload={f=>addFile(key,f)} label="Upload" accept=".pdf,.jpg,.png"/></div>
                            {selected.attachments[key].length===0?<p className="text-xs text-slate-400 py-2">No files uploaded</p>:<div className="space-y-2">{selected.attachments[key].map(f=><FileRow key={f.id} file={f} onView={onViewFile}/>)}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showCreate&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={()=>setShowCreate(false)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between"><h3 className="text-base font-bold text-slate-900">New First Article Inspection</h3><button onClick={()=>setShowCreate(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4 text-slate-500"/></button></div>
            <div className="p-5 space-y-4">
              {[{l:"Part Number *",k:"part",p:"e.g. NAS6204-16 Hex Bolt"},{l:"Revision",k:"rev",p:"e.g. C"},{l:"Drawing Number",k:"drawing",p:"e.g. DWG-3310-B"},{l:"Customer",k:"customer",p:"e.g. Collins Aerospace"}].map(f=>(
                <div key={f.k}><label className="block text-xs font-semibold text-slate-600 mb-1.5">{f.l}</label><input value={newFAI[f.k]} onChange={e=>setNewFAI({...newFAI,[f.k]:e.target.value})} placeholder={f.p} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-300"/></div>
              ))}
            </div>
            <div className="px-5 pb-5 flex gap-3"><button onClick={()=>setShowCreate(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50">Cancel</button><button onClick={createFAI} className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Create FAI</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ DOCUMENTS VIEW ══════════════════════════════════════════════════════════
function DocumentsView({ onViewFile }) {
  const [docs, setDocs] = useState(INIT_DOCS);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [upForm, setUpForm] = useState({ title:"", type:"Work Instruction", owner:"", clause:"", rev:"A" });
  const [upFile, setUpFile] = useState(null);

  const filtered = docs.filter(d=>{
    const matchF = filter==="All"||d.status===filter;
    const matchS = d.title.toLowerCase().includes(search.toLowerCase())||d.id.toLowerCase().includes(search.toLowerCase());
    return matchF&&matchS;
  });

  const uploadDoc = () => {
    if(!upForm.title) return;
    const id = `DOC-${Date.now().toString().slice(-4)}`;
    setDocs([{ id, ...upForm, status:upFile?"Under Review":"Draft", reviewDate:"TBD", file:upFile||null },...docs]);
    setShowUpload(false); setUpForm({title:"",type:"Work Instruction",owner:"",clause:"",rev:"A"}); setUpFile(null);
  };

  const approve = (id) => setDocs(docs.map(d=>d.id===id?{...d,status:"Approved"}:d));
  const attachFile = (docId, file) => setDocs(docs.map(d=>d.id===docId?{...d,file,status:"Under Review"}:d));

  const tabs=["All","Approved","Under Review","Draft"];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-0.5">Controlled Documents</p><h2 className="text-xl sm:text-2xl font-bold text-slate-900">Document Register</h2></div>
        <button onClick={()=>setShowUpload(true)} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"><Plus className="w-3.5 h-3.5"/>Add Document</button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by title or ID..." className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"/></div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto">
          {tabs.map(t=><button key={t} onClick={()=>setFilter(t)} className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${filter===t?"bg-white text-slate-900 shadow-sm":"text-slate-500 hover:text-slate-700"}`}>{t}</button>)}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead><tr className="border-b border-slate-100">{["Doc ID","Title","Type","Rev","Status","File","Actions"].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(doc=>(
                <tr key={doc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-blue-600">{doc.id}</td>
                  <td className="px-4 py-3"><div className="font-medium text-slate-800 text-xs">{doc.title}</div><div className="text-xs text-slate-400">Clause {doc.clause}</div></td>
                  <td className="px-4 py-3"><Badge label={doc.type} className="bg-slate-100 text-slate-600"/></td>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-slate-600">{doc.rev}</td>
                  <td className="px-4 py-3"><Badge label={doc.status} className={sc(doc.status)}/></td>
                  <td className="px-4 py-3">
                    {doc.file ? (
                      <button onClick={()=>onViewFile(doc.file)} className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        <Eye className="w-3 h-3"/>View
                      </button>
                    ) : (
                      <UploadBtn onUpload={f=>attachFile(doc.id,f)} label="Upload" accept=".pdf,.docx,.xlsx"/>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {doc.status!=="Approved"&&<button onClick={()=>approve(doc.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"><CheckCircle className="w-3 h-3"/>Approve</button>}
                    {doc.status==="Approved"&&<span className="text-xs text-green-600 font-semibold flex items-center gap-1"><CheckCircle className="w-3 h-3"/>Approved</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length===0&&<div className="py-12 text-center text-slate-400 text-sm">No documents match your search</div>}
      </div>
      {showUpload&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={()=>setShowUpload(false)}>
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white"><h3 className="text-base font-bold text-slate-900">Add New Document</h3><button onClick={()=>setShowUpload(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4 text-slate-500"/></button></div>
            <div className="p-5 space-y-4">
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Document Title *</label><input value={upForm.title} onChange={e=>setUpForm({...upForm,title:e.target.value})} placeholder="e.g. Incoming Inspection Procedure" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Document Type</label><select value={upForm.type} onChange={e=>setUpForm({...upForm,type:e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"><option>Work Instruction</option><option>Quality Plan</option><option>Specification</option><option>Form</option><option>Procedure</option></select></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Revision</label><input value={upForm.rev} onChange={e=>setUpForm({...upForm,rev:e.target.value})} placeholder="e.g. A" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Owner</label><input value={upForm.owner} onChange={e=>setUpForm({...upForm,owner:e.target.value})} placeholder="e.g. Vikram Nair" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">AS9100D Clause</label><input value={upForm.clause} onChange={e=>setUpForm({...upForm,clause:e.target.value})} placeholder="e.g. 8.4" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-2">Upload Document File</label>
                {upFile ? (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0"/>
                    <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-green-700 truncate">{upFile.name}</p><p className="text-xs text-green-600">{fmtSize(upFile.size)}</p></div>
                    <button onClick={()=>setUpFile(null)} className="p-1 hover:bg-green-100 rounded"><X className="w-3 h-3 text-green-600"/></button>
                  </div>
                ) : <UploadBtn onUpload={setUpFile} label="Click to upload document" accept=".pdf,.docx,.xlsx,.jpg,.png" block/>}
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-3"><button onClick={()=>setShowUpload(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50">Cancel</button><button onClick={uploadDoc} className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Add Document</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ AUDITS VIEW ══════════════════════════════════════════════════════════════
function AuditsView({ onViewFile }) {
  const [audits, setAudits] = useState(INIT_AUDITS);
  const [selected, setSelected] = useState(null);
  const [tab, setTab] = useState("overview");
  const [showCreate, setShowCreate] = useState(false);
  const [showFinding, setShowFinding] = useState(false);
  const [newAudit, setNewAudit] = useState({ title:"", type:"Internal", auditor:"", date:"", scope:"", clauses:"" });
  const [newFinding, setNewFinding] = useState({ clause:"", type:"Minor", description:"" });

  const createAudit = () => {
    if(!newAudit.title) return;
    const a = { id:`AUD-2024-0${3+audits.length}`, ...newAudit, clauses:newAudit.clauses.split(",").map(s=>s.trim()).filter(Boolean), status:"Scheduled", findings:[], attachments:[] };
    setAudits([a,...audits]); setShowCreate(false); setNewAudit({title:"",type:"Internal",auditor:"",date:"",scope:"",clauses:""});
  };

  const addFinding = () => {
    if(!newFinding.description) return;
    const f = { id:`F${Date.now().toString().slice(-4)}`, ...newFinding, status:"Open" };
    const updated = { ...selected, findings:[...selected.findings,f] };
    setAudits(audits.map(a=>a.id===selected.id?updated:a)); setSelected(updated); setShowFinding(false); setNewFinding({clause:"",type:"Minor",description:""});
  };

  const closeFinding = (fid) => {
    const updated = { ...selected, findings:selected.findings.map(f=>f.id===fid?{...f,status:"Closed"}:f) };
    setAudits(audits.map(a=>a.id===selected.id?updated:a)); setSelected(updated);
  };

  const addAttachment = (file) => {
    const updated = { ...selected, attachments:[...selected.attachments,file] };
    setAudits(audits.map(a=>a.id===selected.id?updated:a)); setSelected(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-0.5">Internal & External Audits</p><h2 className="text-xl sm:text-2xl font-bold text-slate-900">Audit Schedule</h2></div>
        <button onClick={()=>setShowCreate(true)} className="flex items-center gap-1.5 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"><Plus className="w-3.5 h-3.5"/>Schedule Audit</button>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"/>
        <p className="text-xs font-semibold text-amber-800">BSI Surveillance Audit in 35 days — July 15, 2024 · Ensure all Clause 8 evidence is current and accessible.</p>
      </div>
      <div className="space-y-3">
        {audits.map(audit=>(
          <div key={audit.id} className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all">
            <div className="p-4 sm:p-5 flex items-center justify-between cursor-pointer" onClick={()=>{setSelected(audit===selected?null:audit);setTab("overview");}}>
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap"><span className="font-mono text-xs font-bold text-blue-600">{audit.id}</span><Badge label={audit.type} className={audit.type==="External"?"bg-purple-100 text-purple-700":"bg-slate-100 text-slate-600"}/><Badge label={audit.status} className={sc(audit.status)}/></div>
                <p className="font-bold text-slate-900 text-sm">{audit.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{audit.auditor} · {audit.date}</p>
              </div>
              <div className="text-right flex-shrink-0"><div className={`text-2xl font-bold ${audit.findings.length===0?"text-green-600":"text-amber-600"}`}>{audit.findings.length}</div><div className="text-xs text-slate-400">Finding{audit.findings.length!==1?"s":""}</div></div>
            </div>
            {selected?.id===audit.id&&(
              <div className="border-t border-slate-100">
                <div className="flex overflow-x-auto bg-slate-50 border-b border-slate-100">
                  {["overview","findings","attachments"].map(t=><button key={t} onClick={()=>setTab(t)} className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${tab===t?"border-blue-600 text-blue-600 bg-white":"border-transparent text-slate-500 hover:text-slate-700"}`}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>)}
                </div>
                <div className="p-4 sm:p-5">
                  {tab==="overview"&&(
                    <div className="space-y-3">
                      {[["Auditor",selected.auditor],["Date",selected.date],["Type",selected.type]].map(([k,v])=><div key={k}><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{k}</p><p className="text-sm font-medium text-slate-800 mt-0.5">{v}</p></div>)}
                      <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scope</p><p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 mt-1">{selected.scope}</p></div>
                      <div><p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Clauses in Scope</p><div className="flex flex-wrap gap-1.5">{selected.clauses.map(c=><span key={c} className="font-mono text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">Cl. {c}</span>)}</div></div>
                    </div>
                  )}
                  {tab==="findings"&&(
                    <div className="space-y-3">
                      <div className="flex items-center justify-between"><p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Findings ({selected.findings.length})</p><button onClick={()=>setShowFinding(true)} className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"><Plus className="w-3 h-3"/>Add Finding</button></div>
                      {selected.findings.length===0?<p className="text-sm text-slate-400 text-center py-6">No findings recorded yet</p>:
                        selected.findings.map(f=>(
                          <div key={f.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1"><span className="font-mono text-xs font-bold text-blue-600">Cl. {f.clause}</span><Badge label={f.type} className={sevc(f.type)}/><Badge label={f.status} className={sc(f.status)}/></div>
                                <p className="text-xs text-slate-700">{f.description}</p>
                              </div>
                              {f.status==="Open"&&<button onClick={()=>closeFinding(f.id)} className="px-2.5 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors flex-shrink-0">Close</button>}
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                  {tab==="attachments"&&(
                    <div className="space-y-3">
                      <UploadBtn onUpload={addAttachment} label="Attach Audit Report or Evidence" accept=".pdf,.docx,.xlsx" block/>
                      {selected.attachments.length===0?<p className="text-sm text-slate-400 text-center py-4">No attachments</p>:<div className="space-y-2">{selected.attachments.map(f=><FileRow key={f.id} file={f} onView={onViewFile}/>)}</div>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {showFinding&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={()=>setShowFinding(false)}>
          <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl" onClick={e=>e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between"><h3 className="text-base font-bold text-slate-900">Record Audit Finding</h3><button onClick={()=>setShowFinding(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4 text-slate-500"/></button></div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">AS9100D Clause</label><input value={newFinding.clause} onChange={e=>setNewFinding({...newFinding,clause:e.target.value})} placeholder="e.g. 8.5.1" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Finding Type</label><select value={newFinding.type} onChange={e=>setNewFinding({...newFinding,type:e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"><option>Major</option><option>Minor</option><option>Observation</option></select></div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Finding Description *</label><textarea value={newFinding.description} onChange={e=>setNewFinding({...newFinding,description:e.target.value})} rows={3} placeholder="Describe the finding in detail..." className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"/></div>
            </div>
            <div className="px-5 pb-5 flex gap-3"><button onClick={()=>setShowFinding(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50">Cancel</button><button onClick={addFinding} className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Record Finding</button></div>
          </div>
        </div>
      )}
      {showCreate&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={()=>setShowCreate(false)}>
          <div className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white"><h3 className="text-base font-bold text-slate-900">Schedule Audit</h3><button onClick={()=>setShowCreate(false)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4 text-slate-500"/></button></div>
            <div className="p-5 space-y-4">
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Audit Title *</label><input value={newAudit.title} onChange={e=>setNewAudit({...newAudit,title:e.target.value})} placeholder="e.g. Internal Audit – Clause 8.5" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Type</label><select value={newAudit.type} onChange={e=>setNewAudit({...newAudit,type:e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"><option>Internal</option><option>External</option></select></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Date</label><input type="date" value={newAudit.date} onChange={e=>setNewAudit({...newAudit,date:e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Auditor Name</label><input value={newAudit.auditor} onChange={e=>setNewAudit({...newAudit,auditor:e.target.value})} placeholder="e.g. Anita Rao or BSI Group" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Clauses in Scope (comma separated)</label><input value={newAudit.clauses} onChange={e=>setNewAudit({...newAudit,clauses:e.target.value})} placeholder="e.g. 8.1, 8.4, 8.5" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"/></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1.5">Audit Scope</label><textarea value={newAudit.scope} onChange={e=>setNewAudit({...newAudit,scope:e.target.value})} rows={2} placeholder="Describe what processes and areas are in scope..." className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"/></div>
            </div>
            <div className="px-5 pb-5 flex gap-3"><button onClick={()=>setShowCreate(false)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-sm font-semibold rounded-lg hover:bg-slate-50">Cancel</button><button onClick={createAudit} className="flex-1 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">Schedule Audit</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ AUDIT ASSISTANT ═══════════════════════════════════════════════════════════
function buildKnowledgeBase() {
  // Cross-reference part numbers across NCRs, FAIs, Documents, Audits
  const parts = {};
  INIT_NCRS.forEach(n => {
    if (!parts[n.part]) parts[n.part] = { ncrs: [], fais: [], docs: [] };
    parts[n.part].ncrs.push(n);
  });
  INIT_FAIS.forEach(f => {
    if (!parts[f.part]) parts[f.part] = { ncrs: [], fais: [], docs: [] };
    parts[f.part].fais.push(f);
  });
  return parts;
}

const KB = buildKnowledgeBase();

function findPart(query) {
  const q = query.toLowerCase();
  return Object.keys(KB).find(p => q.includes(p.toLowerCase()) || p.toLowerCase().split(" ").some(w => w.length > 3 && q.includes(w.toLowerCase())));
}

function generateResponse(query, ncrs, fais, docs, audits) {
  const q = query.toLowerCase().trim();
  const part = findPart(query);

  // Greeting
  if (/^(hi|hello|hey)\b/.test(q)) {
    return { text: "Hello — I'm the AxisQMS Audit Assistant. Ask me about any part number, NCR, FAI, document, or clause and I'll pull the records directly from our quality system. For example: \"Tell me about NAS6204-16\" or \"Show me open NCRs against Clause 8.7.\"", refs: [] };
  }

  // Part-specific query
  if (part) {
    const data = KB[part];
    let text = `Here's the complete quality record for **${part}**:\n\n`;
    const refs = [];

    if (data.fais.length > 0) {
      text += `**First Article Inspection:**\n`;
      data.fais.forEach(f => {
        text += `${f.id} — Status: ${f.status}, Rev ${f.rev}, Customer: ${f.customer}. `;
        text += f.status === "Approved" ? `Approved and on file, submitted ${f.submitted}.\n` : `Currently ${f.status.toLowerCase()}.\n`;
        refs.push(f.id);
      });
      text += `\n`;
    }

    if (data.ncrs.length > 0) {
      text += `**Nonconformance History (${data.ncrs.length}):**\n`;
      data.ncrs.forEach(n => {
        text += `${n.id} — ${n.severity}, Status: ${n.status}, raised ${n.date}. Disposition: ${n.disposition}. `;
        if (n.capa.status !== "Not Started") {
          text += `CAPA ${n.capa.status}: ${n.capa.action || "action in progress"}.`;
        }
        text += `\n`;
        refs.push(n.id);
      });
      text += `\n`;
    } else {
      text += `**Nonconformance History:** No NCRs on record for this part. Clean history.\n\n`;
    }

    const relatedDocs = docs.filter(d => d.clause === "8.5.1" || d.clause === "8.7" || d.clause === "8.5.1.1");
    if (relatedDocs.length > 0) {
      text += `**Governing Documents:** ${relatedDocs.map(d => `${d.id} (${d.title}, Rev ${d.rev}, ${d.status})`).join("; ")}.\n`;
      relatedDocs.forEach(d => refs.push(d.id));
    }

    return { text, refs };
  }

  // Clause-based query
  const clauseMatch = q.match(/clause\s*(\d+(\.\d+)*)/);
  if (clauseMatch) {
    const clause = clauseMatch[1];
    const relatedNCRs = ncrs.filter(n => n.clause.startsWith(clause));
    const relatedDocs = docs.filter(d => d.clause.startsWith(clause));
    const clauseInfo = CLAUSE_DATA.find(c => c.id === clause.split(".")[0]);
    let text = `**Clause ${clause}** evidence summary:\n\n`;
    text += `Overall coverage for Clause ${clauseInfo?.id || clause} (${clauseInfo?.title || "—"}): ${clauseInfo?.coverage || "—"}%.\n\n`;
    if (relatedNCRs.length > 0) {
      text += `**Related NCRs (${relatedNCRs.length}):**\n`;
      relatedNCRs.forEach(n => text += `${n.id} — ${n.part}, ${n.severity}, ${n.status}.\n`);
      text += `\n`;
    }
    if (relatedDocs.length > 0) {
      text += `**Governing Documents:**\n`;
      relatedDocs.forEach(d => text += `${d.id} — ${d.title}, Rev ${d.rev}, ${d.status}.\n`);
    }
    if (relatedNCRs.length === 0 && relatedDocs.length === 0) {
      text += `No specific NCRs or documents directly tagged to clause ${clause} beyond the standard QMS manual.`;
    }
    return { text, refs: [...relatedNCRs.map(n => n.id), ...relatedDocs.map(d => d.id)] };
  }

  // Open NCRs query
  if (/open ncr|outstanding ncr|active ncr/.test(q)) {
    const open = ncrs.filter(n => n.status !== "Closed");
    let text = `There are **${open.length} open NCRs** currently:\n\n`;
    open.forEach(n => {
      text += `${n.id} — ${n.part}, ${n.severity} severity, Clause ${n.clause}, status: ${n.status}. `;
      text += n.capa.status !== "Not Started" ? `CAPA in progress (${n.capa.status}).\n` : `CAPA not yet initiated.\n`;
    });
    return { text, refs: open.map(n => n.id) };
  }

  // FAI status query
  if (/fai|first article/.test(q)) {
    let text = `**First Article Inspection status across all parts:**\n\n`;
    fais.forEach(f => {
      text += `${f.id} — ${f.part} (Rev ${f.rev}), Customer: ${f.customer}, Status: ${f.status}`;
      text += f.submitted !== "—" ? `, submitted ${f.submitted}.\n` : `, not yet submitted.\n`;
    });
    return { text, refs: fais.map(f => f.id) };
  }

  // Audit / surveillance query
  if (/audit|surveillance|bsi/.test(q)) {
    const upcoming = audits.find(a => a.status === "Scheduled");
    let text = "";
    if (upcoming) {
      text += `Our next external audit is **${upcoming.id}** — ${upcoming.title}, conducted by ${upcoming.auditor} on ${upcoming.date}. Scope covers clauses ${upcoming.clauses.join(", ")}.\n\n`;
    }
    const closed = audits.filter(a => a.status === "Closed");
    text += `Recent completed audits:\n`;
    closed.forEach(a => {
      text += `${a.id} — ${a.title} (${a.auditor}, ${a.date}). ${a.findings.length} finding(s), all closed.\n`;
    });
    return { text, refs: audits.map(a => a.id) };
  }

  // CAPA query
  if (/capa|corrective action/.test(q)) {
    const withCapa = ncrs.filter(n => n.capa.status !== "Not Started");
    let text = `**CAPA Status (${withCapa.length} active or completed):**\n\n`;
    withCapa.forEach(n => {
      text += `${n.id} (${n.part}) — CAPA ${n.capa.status}. Root cause: ${n.capa.rootCause || "under investigation"}. Action: ${n.capa.action || "pending"}. `;
      text += n.capa.actionAssignee ? `Assigned to ${n.capa.actionAssignee}, due ${n.capa.dueDate}.\n` : `\n`;
    });
    return { text, refs: withCapa.map(n => n.id) };
  }

  // Calibration / equipment - not in scope yet
  if (/calibrat/.test(q)) {
    return { text: "Calibration records aren't loaded into this module yet — that's part of the Phase 2 rollout. For now, I can answer questions about NCRs, FAIs, controlled documents, audits, and CAPAs across any part number.", refs: [] };
  }

  // Document query
  if (/document|procedure|work instruction|wi-|qp-/.test(q)) {
    let text = `**Controlled Document Register (${docs.length} documents):**\n\n`;
    docs.forEach(d => {
      text += `${d.id} — ${d.title}, Rev ${d.rev}, ${d.status}, owned by ${d.owner}, governs Clause ${d.clause}.\n`;
    });
    return { text, refs: docs.map(d => d.id) };
  }

  // Default fallback
  return {
    text: `I don't have a direct match for that in the current records. Try asking about a specific part number (e.g. "MS21042-3"), a clause (e.g. "Clause 8.7"), or a topic like "open NCRs," "FAI status," "CAPA status," or "audit schedule."`,
    refs: []
  };
}

function AuditAssistant({ ncrs, fais, docs, audits }) {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello — I'm the AxisQMS Audit Assistant. Ask me about any part number, NCR, FAI, controlled document, or AS9100D clause and I'll retrieve the relevant records in real time.\n\nTry: \"Tell me about NAS6204-16\" or \"Show me open NCRs.\"", refs: [] }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [speakEnabled, setSpeakEnabled] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  const suggestions = [
    "Tell me about MS21042-3 Lock Nut",
    "Show me open NCRs",
    "What's the status of Clause 8.7?",
    "Give me CAPA status",
    "Next surveillance audit?",
  ];

  const speak = (text) => {
    if (!speakEnabled || typeof window === "undefined" || !window.speechSynthesis) return;
    const clean = text.replace(/\*\*/g, "").replace(/\n+/g, ". ");
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => /en-(US|GB|IN)/.test(v.lang) && /female|Samantha|Google US English|Microsoft Aria/i.test(v.name));
    if (preferred) utter.voice = preferred;
    window.speechSynthesis.speak(utter);
  };

  const send = (text) => {
    const q = (text ?? input).trim();
    if (!q) return;
    const userMsg = { role: "user", text: q, refs: [] };
    const botMsg = generateResponse(q, ncrs, fais, docs, audits);
    setMessages(prev => [...prev, userMsg, { role: "bot", ...botMsg }]);
    setInput("");
    speak(botMsg.text);
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
  };

  const toggleListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setVoiceSupported(false); return; }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setListening(false);
      send(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-3 flex-shrink-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Interactive Audit Support</p>
          <Badge label="Beta" className="bg-purple-100 text-purple-700" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Audit Assistant</h2>
            <p className="text-xs text-slate-500 mt-1">Real-time Q&A over your live NCR, FAI, document, and audit records — ask by typing or speaking.</p>
          </div>
          <button onClick={() => setSpeakEnabled(!speakEnabled)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${speakEnabled ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
            {speakEnabled ? <Volume2 className="w-3.5 h-3.5"/> : <VolumeX className="w-3.5 h-3.5"/>}
            <span className="hidden sm:inline">{speakEnabled ? "Voice On" : "Voice Off"}</span>
          </button>
        </div>
      </div>

      {!voiceSupported && (
        <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs text-amber-700 flex items-center gap-2 flex-shrink-0">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0"/>
          Voice input isn't supported in this browser. Try Chrome or Edge on desktop or Android.
        </div>
      )}

      <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden min-h-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              {m.role === "bot" && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-3.5 py-2.5 text-sm whitespace-pre-line leading-relaxed ${m.role === "user" ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-700 border border-slate-100"}`}>
                {m.text.split("**").map((part, idx) => idx % 2 === 1 ? <strong key={idx} className="font-bold">{part}</strong> : part)}
                {m.refs?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-200">
                    {m.refs.map(r => (
                      <span key={r} className="font-mono text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100">{r}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {listening && (
            <div className="flex gap-2.5 justify-end">
              <div className="max-w-[75%] rounded-xl px-3.5 py-2.5 text-sm bg-blue-50 text-blue-600 border border-blue-200 flex items-center gap-2">
                <span className="flex gap-0.5">
                  <span className="w-1 h-3 bg-blue-400 rounded-full animate-pulse"/>
                  <span className="w-1 h-4 bg-blue-500 rounded-full animate-pulse" style={{animationDelay:"0.15s"}}/>
                  <span className="w-1 h-3 bg-blue-400 rounded-full animate-pulse" style={{animationDelay:"0.3s"}}/>
                </span>
                Listening...
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2 flex-shrink-0">
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)} className="flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors border border-blue-100">
                <Sparkles className="w-3 h-3" />{s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-slate-100 p-3 flex-shrink-0">
          <div className="flex gap-2">
            <button onClick={toggleListening} className={`p-2.5 rounded-lg transition-colors flex-shrink-0 ${listening ? "bg-red-500 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
              {listening ? <MicOff className="w-4 h-4"/> : <Mic className="w-4 h-4"/>}
            </button>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder={listening ? "Listening — speak now..." : "Ask about a part number, NCR, FAI, clause, or document..."}
              className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-300"
            />
            <button onClick={() => send()} className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">Responses are generated from live AxisQMS records — every reference is traceable to a source document.</p>
        </div>
      </div>
    </div>
  );
}

const NAV = [
  { id:"dashboard", label:"Dashboard", icon:LayoutDashboard },
  { id:"assistant", label:"Audit Assistant", icon:Bot },
  { id:"ncr", label:"NCRs", icon:AlertTriangle },
  { id:"fai", label:"First Articles", icon:FileCheck },
  { id:"documents", label:"Documents", icon:FileText },
  { id:"audits", label:"Audits", icon:ClipboardCheck },
];

export default function AxisQMS() {
  const [view, setView] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState(null);
  const [ncrs] = useState(INIT_NCRS);
  const [fais] = useState(INIT_FAIS);

  const navigate = (v) => { setView(v); setSidebarOpen(false); };

  return (
    <div className="flex h-screen bg-slate-950 font-sans overflow-hidden">
      {/* Mobile backdrop */}
      {sidebarOpen&&<div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={()=>setSidebarOpen(false)}/>}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-56 bg-slate-900 flex flex-col flex-shrink-0 border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${sidebarOpen?"translate-x-0":"-translate-x-full lg:translate-x-0"}`}>
        <div className="px-4 py-4 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center"><Shield className="w-4 h-4 text-white"/></div>
            <div><p className="text-sm font-bold text-white">AxisQMS</p><p className="text-xs text-slate-500">AS9100D</p></div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(item=>(
            <button key={item.id} onClick={()=>navigate(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${view===item.id?"bg-blue-600 text-white":"text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
              <item.icon className="w-4 h-4 flex-shrink-0"/>{item.label}
              {item.id==="ncr"&&<span className={`ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full ${view==="ncr"?"bg-blue-500 text-white":"bg-red-900 text-red-400"}`}>{INIT_NCRS.filter(n=>n.status==="Open").length}</span>}
            </button>
          ))}
        </nav>
        <div className="px-3 pb-4 border-t border-slate-800 pt-4 flex-shrink-0">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">C</div>
            <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white truncate">Chirag</p><p className="text-xs text-slate-500 truncate">Quality Manager</p></div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={()=>setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"><Menu className="w-4 h-4 text-slate-600"/></button>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="hidden sm:block">AxisQMS</span><ChevronRight className="w-3 h-3 hidden sm:block"/>
              <span className="font-semibold text-slate-700">{NAV.find(n=>n.id===view)?.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative"><Bell className="w-4 h-4 text-slate-500"/><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"/></button>
            <span className="text-xs text-slate-400 pl-2 border-l border-slate-200 hidden sm:block">Cert: <span className="font-bold text-green-600">Active</span></span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col">
          {view==="dashboard"&&<Dashboard setView={navigate} ncrs={ncrs} fais={fais}/>}
          {view==="assistant"&&<AuditAssistant ncrs={ncrs} fais={fais} docs={INIT_DOCS} audits={INIT_AUDITS}/>}
          {view==="ncr"&&<NCRView onViewFile={setViewingFile}/>}
          {view==="fai"&&<FAIView onViewFile={setViewingFile}/>}
          {view==="documents"&&<DocumentsView onViewFile={setViewingFile}/>}
          {view==="audits"&&<AuditsView onViewFile={setViewingFile}/>}
        </div>
      </main>

      {/* Global File Viewer */}
      {viewingFile&&<FileViewer file={viewingFile} onClose={()=>setViewingFile(null)}/>}
    </div>
  );
}