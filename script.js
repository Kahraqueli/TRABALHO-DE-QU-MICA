// scripts.js - comportamento compartilhado para Rota do Bem

const API_ENDPOINT = '/api/anon-help'; // substitua pelo endpoint real do seu backend

function cryptoRandomId(len){
  const arr = new Uint8Array(len);
  window.crypto.getRandomValues(arr);
  return Array.from(arr).map(n=>n.toString(36)).join('').slice(0,len);
}

function getFormData(form){
  return {
    timestamp: new Date().toISOString(),
    age: form.querySelector('#age')?.value || null,
    role: form.querySelector('#role')?.value || null,
    topic: form.querySelector('#topic')?.value || null,
    message: form.querySelector('#message')?.value.trim() || null,
    shareSchool: form.querySelector('#shareSchool')?.checked || false,
    school: form.querySelector('#school')?.value.trim() || null,
    anonymousId: cryptoRandomId(10)
  }
}

async function sendAnon(form, msgEl){
  msgEl.textContent = '';
  const data = getFormData(form);
  if(!data.message){ msgEl.textContent = 'Por favor, escreva uma mensagem antes de enviar.'; return }
  try{
    const res = await fetch(API_ENDPOINT, {
      method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)
    });
    if(res.ok){ msgEl.style.color='var(--success)'; msgEl.textContent='Enviado com sucesso.'; form.reset(); }
    else { msgEl.style.color='var(--muted)'; msgEl.textContent='Envio falhou no servidor. Faça o download e entregue manualmente.'; }
  }catch(e){ msgEl.style.color='var(--muted)'; msgEl.textContent='Envio automático indisponível — baixe a cópia e entregue à equipe.' }
}

function downloadAnon(form, msgEl){
  const data = getFormData(form);
  if(!data.message){ msgEl.textContent='Escreva a mensagem antes de baixar.'; return }
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download = `pedido_ajuda_${data.anonymousId}.json`;
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  msgEl.style.color='var(--success)'; msgEl.textContent='Cópia baixada. Entregue o arquivo à equipe responsável.';
}

// Inicializador para página de formulário
function initFormPage(){
  const form = document.getElementById('anonForm');
  if(!form) return;
  const sendBtn = document.getElementById('sendBtn');
  const downloadBtn = document.getElementById('downloadBtn');
  const clearBtn = document.getElementById('clearBtn');
  const msgEl = document.getElementById('formMsg');

  sendBtn.addEventListener('click', ()=>sendAnon(form, msgEl));
  downloadBtn.addEventListener('click', ()=>downloadAnon(form, msgEl));
  clearBtn.addEventListener('click', ()=>{ if(confirm('Deseja limpar o formulário?')) form.reset(); });
}

// Auto init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', ()=>{
  initFormPage();
  // smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click', e=>{ e.preventDefault(); const t=document.querySelector(a.getAttribute('href')); if(t) t.scrollIntoView({behavior:'smooth'}); }));
});
