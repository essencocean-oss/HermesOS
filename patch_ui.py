from pathlib import Path
p = Path('ui/index.html')
t = p.read_text(encoding='utf-8')
panel = '<div class="section" style="margin-top:18px;">Processes</div><div id="processes"><div class="chat-bubble">No active processes.</div></div><button class="btn" style="margin-top:8px;" onclick="startDemoProcess()">Start demo process</button>'
t = t.replace('<div class="section" style="margin-top:18px;">System</div>', panel + '<div class="section" style="margin-top:18px;">System</div>')
js = 'function startDemoProcess(){fetch("http://localhost:8000/processes/users/demo/processes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({skill:"daily-brief"})}).then(()=>loadProcesses()).catch(()=>alert("Registry not reachable"))}\nfunction loadProcesses(){fetch("http://localhost:8000/users/demo/processes").then(r=>r.json()).then(d=>{const el=document.getElementById("processes");if(!el)return;el.innerHTML=d.map(x=>"<div class=\\'chat-bubble\\'><b>"+x.skill+"</b> • "+x.status+"<br><small>"+(x.started_at||"")+"</small></div>").join("")||"No active processes.";})}\n'
t = t.replace('function boot(){', js + 'function boot(){')
p.write_text(t, encoding='utf-8')
print('Done')