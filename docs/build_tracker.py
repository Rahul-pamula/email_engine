import re
import json
from typing import List, Dict, Any, Optional

md_path = "docs/phases/phase_wise_plan.md"
html_path = "docs/progress.html"

with open(md_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

phases: List[Dict[str, Any]] = []
current_phase: Optional[Dict[str, Any]] = None
current_sub: Optional[str] = None

for line in lines:
    line = line.strip()
    if not line:
        continue
    
    # Check for Phase
    phase_match = re.search(r'(PHASE\s+[\d\.]+.*?)$', line)
    if phase_match and "—" in line:
        title = phase_match.group(1).strip()
        current_phase = {"title": title, "tasks": []}
        phases.append(current_phase)
        current_sub = None
        continue
        
    # Check for Category [BACKEND] etc
    if line.startswith("[") and line.endswith("]"):
        current_sub = line
        continue

    # Check for checklist item (standard markdown)
    task_match = re.search(r'-\s+\[(.)\]\s+(.*)', line)
    if not task_match:
        # Check original format just in case
        task_match = re.search(r'(☐|✔)\s+(.*)', line)
        
    if task_match and current_phase is not None:
        is_done = task_match.group(1).lower() == 'x' or task_match.group(1) == '✔'
        text = task_match.group(2)
        if current_sub:
            text = f"<span class='text-xs font-bold text-indigo-400 mr-2 uppercase block sm:inline'>{current_sub}</span> {text}"
        
        # Safely append
        if current_phase is not None and "tasks" in current_phase and isinstance(current_phase["tasks"], list): # type: ignore
            current_phase["tasks"].append({"text": text, "done": is_done}) # type: ignore

html_template = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Engine - Phase Tracker</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', system-ui, sans-serif; background-color: #09090b; color: #fafafa; }
        .glass { background: rgba(24, 24, 27, 0.6); backdrop-filter: blur(16px); border: 1px solid rgba(63, 63, 70, 0.4); }
    </style>
</head>
<body class="p-4 sm:p-8 min-h-screen">
    <div class="max-w-4xl mx-auto">
        <div class="mb-10 text-center">
            <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">Email Engine Launch Tracker</h1>
            <p class="text-zinc-400">Interactive Phase Execution Plan</p>
            <div class="mt-6 flex flex-wrap justify-center gap-3 sm:gap-6 text-sm font-medium">
                <div class="glass px-5 py-3 rounded-xl text-emerald-400 shadow-md">Completed: <span id="master-completed" class="font-bold text-lg ml-1">0</span></div>
                <div class="glass px-5 py-3 rounded-xl text-indigo-400 shadow-md">Total Tasks: <span id="master-total" class="font-bold text-lg ml-1">0</span></div>
                <div class="glass px-5 py-3 rounded-xl text-amber-400 shadow-md">Overall Progress: <span id="master-percent" class="font-bold text-lg ml-1">0</span>%</div>
            </div>
        </div>
        
        <div id="phases-container" class="space-y-6"></div>
    </div>

    <script>
        const phasesData = MAGIC_JSON;
        // Load overrides from localStorage
        const savedState = JSON.parse(localStorage.getItem('shrmail_phases_tracker') || '{}');
        let totalTasks = 0;
        let completedTasks = 0;

        const container = document.getElementById('phases-container');
        
        function updateMasterStats() {
            document.getElementById('master-completed').textContent = completedTasks;
            document.getElementById('master-total').textContent = totalTasks;
            document.getElementById('master-percent').textContent = 
                totalTasks > 0 ? Math.round((completedTasks/totalTasks)*100) : 0;
        }

        phasesData.forEach((phase, pIndex) => {
            if (phase.tasks.length === 0) return;
            
            const pCard = document.createElement('div');
            pCard.className = 'glass rounded-2xl p-6 shadow-xl transition-all duration-300 hover:border-indigo-500/30';
            
            let phaseCompleted = 0;
            
            const taskHeader = document.createElement('div');
            taskHeader.className = 'flex flex-col sm:flex-row justify-between sm:items-center mb-5 border-b border-zinc-800 pb-4 gap-2';
            const progressHue = phase.title.includes('DONE') ? 'text-emerald-400 bg-emerald-400/10' : 'text-zinc-300 bg-zinc-800';
            taskHeader.innerHTML = `<h2 class="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                                        <div class="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                                        ${phase.title}
                                    </h2>
                                    <span class="text-xs font-mono px-3 py-1.5 rounded-lg border border-zinc-700/50 ${progressHue}" id="stat-${pIndex}"></span>`;
            pCard.appendChild(taskHeader);
            
            const taskList = document.createElement('div');
            taskList.className = 'space-y-2';
            
            phase.tasks.forEach((task, tIndex) => {
                totalTasks++;
                const taskId = `task-${pIndex}-${tIndex}`;
                // Determine truth from localStorage first, fallback to markdown state
                let isChecked = savedState[taskId] !== undefined ? savedState[taskId] : task.done;
                if (isChecked) { completedTasks++; phaseCompleted++; }
                
                const tDiv = document.createElement('div');
                tDiv.className = 'flex items-start gap-4 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors group';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = taskId;
                checkbox.checked = isChecked;
                checkbox.className = 'mt-1 w-5 h-5 text-indigo-500 bg-zinc-900 border-zinc-700 rounded-md focus:ring-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 cursor-pointer transition-all';
                
                checkbox.addEventListener('change', (e) => {
                    savedState[taskId] = e.target.checked;
                    localStorage.setItem('shrmail_phases_tracker', JSON.stringify(savedState));
                    
                    if(e.target.checked) { completedTasks++; phaseCompleted++; } 
                    else { completedTasks--; phaseCompleted--; }
                    
                    updateMasterStats();
                    document.getElementById(`stat-${pIndex}`).textContent = `${phaseCompleted} / ${phase.tasks.length} DONE`;
                    label.classList.toggle('line-through', e.target.checked);
                    label.classList.toggle('text-zinc-500', e.target.checked);
                    label.classList.toggle('text-zinc-200', !e.target.checked);
                });
                
                const label = document.createElement('label');
                label.htmlFor = taskId;
                label.className = `text-sm leading-relaxed cursor-pointer select-none block w-full transition-all duration-200 ${isChecked ? 'line-through text-zinc-500' : 'text-zinc-200'}`;
                label.innerHTML = task.text;
                
                tDiv.appendChild(checkbox);
                tDiv.appendChild(label);
                taskList.appendChild(tDiv);
            });
            
            pCard.appendChild(taskList);
            container.appendChild(pCard);
            
            // Initial Phase Stat
            document.getElementById(`stat-${pIndex}`).textContent = `${phaseCompleted} / ${phase.tasks.length} DONE`;
        });
        
        updateMasterStats();
    </script>
</body>
</html>"""

html_out = html_template.replace("MAGIC_JSON", json.dumps(phases))
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_out)

print(f"Generated {html_path} successfully!")
