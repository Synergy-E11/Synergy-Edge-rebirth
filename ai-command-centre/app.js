const departments=[
{name:"ChatGPT",role:"Strategy, architecture & project control",symbol:"C",url:"https://chatgpt.com"},
{name:"Claude",role:"Software engineering & implementation",symbol:"A",url:"https://claude.ai"},
{name:"Gemini",role:"Visual research & design intelligence",symbol:"G",url:"https://gemini.google.com"},
{name:"Perplexity",role:"Web research & source verification",symbol:"P",url:"https://www.perplexity.ai"},
{name:"DeepSeek",role:"Technical review & code analysis",symbol:"D",url:"https://chat.deepseek.com"},
{name:"Grok",role:"Trends & innovation research",symbol:"X",url:"https://grok.com"},
{name:"Mistral",role:"Operations & documentation",symbol:"M",url:"https://chat.mistral.ai"}
];
const workflows={
full:["ChatGPT","Perplexity","Gemini","Claude","DeepSeek","Mistral"],
research:["Perplexity","Grok","ChatGPT"],
design:["Gemini","Perplexity","ChatGPT"],
build:["ChatGPT","Claude","DeepSeek","Gemini"],
operations:["Mistral","ChatGPT"]
};
const roleInstructions={
ChatGPT:"Act as project lead. Convert the objective into requirements, scope, architecture, milestones, acceptance criteria and risks. Do not claim implementation has happened.",
Claude:"Act as lead software engineer. Inspect the supplied project context, propose a safe implementation, produce maintainable code and explain files changed and tests required. Preserve existing functionality.",
Gemini:"Act as visual research lead. Analyse the supplied visual references, layout, typography, colour, accessibility and responsive behaviour. Return a concise design specification.",
Perplexity:"Act as research analyst. Find current, credible references relevant to the objective. Include source links, publication dates where available, key findings and uncertainties. Do not invent sources.",
DeepSeek:"Act as independent technical auditor. Review the proposed architecture or code for bugs, security issues, performance problems and simpler alternatives. Prioritise actionable findings.",
Grok:"Act as trend analyst. Identify relevant current trends, audience conversations and emerging opportunities. Separate verified signals from speculation and cite sources where possible.",
Mistral:"Act as operations lead. Convert the project into clear checklists, SOPs, documentation, handoff notes and a maintainable delivery process."
};
const $=s=>document.querySelector(s);
let tasks=JSON.parse(localStorage.getItem("se-ai-tasks")||"[]"),selectedTask=null;
function save(){localStorage.setItem("se-ai-tasks",JSON.stringify(tasks));renderTasks();renderStats()}
function renderStats(){$("#activeCount").textContent=String(tasks.filter(t=>t.status!=="Completed").length).padStart(2,"0");$("#doneCount").textContent=String(tasks.filter(t=>t.status==="Completed").length).padStart(2,"0")}
function renderTasks(){const root=$("#taskList");if(!tasks.length){root.innerHTML='<div class="empty-state">No tasks yet. Create your first workflow above.</div>';return}root.innerHTML=tasks.map(t=>`<article class="task-item"><div><h4>${escapeHtml(t.title)}</h4><p>${t.priority} priority · ${t.workflowLabel} · ${new Date(t.created).toLocaleDateString()}</p></div><div class="task-controls"><select aria-label="Task status" data-status="${t.id}">${["Queued","In progress","Review","Completed"].map(s=>`<option ${s===t.status?"selected":""}>${s}</option>`).join("")}</select><button class="mini-btn" data-open="${t.id}">Open</button></div></article>`).join("");root.querySelectorAll("[data-status]").forEach(el=>el.addEventListener("change",()=>{const t=tasks.find(x=>x.id===el.dataset.status);if(t){t.status=el.value;save()}}));root.querySelectorAll("[data-open]").forEach(el=>el.addEventListener("click",()=>openTask(el.dataset.open)))}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("#taskForm").addEventListener("submit",e=>{e.preventDefault();const type=$("#taskType").value;const t={id:crypto.randomUUID(),title:$("#taskTitle").value.trim(),detail:$("#taskDetail").value.trim(),workflow:type,workflowLabel:$("#taskType").selectedOptions[0].textContent,priority:$("#priority").value,status:"Queued",created:new Date().toISOString(),notes:""};tasks.unshift(t);save();e.target.reset();selectedTask=t.id;renderHandoffs(type);});
function renderProviders(){$("#providerList").innerHTML=departments.map(d=>`<div class="provider"><span class="provider-icon">${d.symbol}</span><div><strong>${d.name}</strong><small>${d.role}</small></div><span class="status-pill">NOT CONNECTED</span></div>`).join("")}
function renderHandoffs(type="full"){$("#handoffGrid").innerHTML=departments.filter(d=>workflows[type].includes(d.name)).map(d=>`<button class="handoff-card" data-dept="${d.name}"><strong>${d.name}</strong><span>${d.role}</span></button>`).join("");$("#handoffGrid").querySelectorAll("[data-dept]").forEach(b=>b.addEventListener("click",()=>makeBrief(b.dataset.dept,b)))}
function makeBrief(name,button){const t=tasks.find(x=>x.id===selectedTask);if(!t){$("#handoffOutput").value="Create or open a task first, then generate a department brief.";return}$("#handoffGrid").querySelectorAll(".handoff-card").forEach(x=>x.classList.remove("active"));button.classList.add("active");const d=departments.find(x=>x.name===name);$("#handoffOutput").value=`SYNERGY EDGE TECH / AI DEPARTMENT BRIEF\n\nTASK: ${t.title}\nPRIORITY: ${t.priority}\nOBJECTIVE & CONTEXT:\n${t.detail||"No additional context supplied."}\n\nYOUR ASSIGNED ROLE: ${d.role}\n\nINSTRUCTIONS:\n${roleInstructions[name]}\n\nCOLLABORATION RULES:\n- Work only within your assigned responsibility.\n- State assumptions and missing information.\n- Do not invent completed work, test results or sources.\n- Do not request or expose passwords, API keys or private client data.\n- Return: findings, recommended actions, deliverables, risks and next handoff.\n\nReturn concise, structured output that can be reviewed by the project lead.`;$("#copyStatus").textContent=""}
$("#copyBrief").addEventListener("click",async()=>{if(!$("#handoffOutput").value)return;try{await navigator.clipboard.writeText($("#handoffOutput").value);$("#copyStatus").textContent="Brief copied."}catch{$("#handoffOutput").select();$("#copyStatus").textContent="Select and copy the brief."}});
function openTask(id){const t=tasks.find(x=>x.id===id);if(!t)return;selectedTask=id;$("#dialogTitle").textContent=t.title;$("#dialogMeta").textContent=t.status+" · "+t.priority+" priority · "+t.workflowLabel;$("#taskNotes").value=t.notes||"";$("#taskDialog").showModal();renderHandoffs(t.workflow)}
$("#saveNotes").addEventListener("click",()=>{const t=tasks.find(x=>x.id===selectedTask);if(t){t.notes=$("#taskNotes").value;save()}});
$("#clearDone").addEventListener("click",()=>{tasks=tasks.filter(t=>t.status!=="Completed");save()});
$("#exportBtn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify({workspace:"Synergy Edge Tech AI Command Centre",exported:new Date().toISOString(),tasks},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="synergy-edge-ai-workspace.json";a.click();URL.revokeObjectURL(a.href)});
renderProviders();renderTasks();renderStats();renderHandoffs();
