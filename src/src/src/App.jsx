import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Video, DollarSign, Search, X, Plus } from 'lucide-react'

const CONFIG = {
  ADMIN_WHATSAPP: '+573127276293',
  ADMIN_EMAIL: 'jorgenelgiraldo@gmail.com',
  PAYPAL_LINK: 'https://www.paypal.com/paypalme/mrtango',
}

const STATUSES = { PENDING:'PENDING', APPROVED:'APPROVED', REJECTED:'REJECTED' }

const initialInstructors = [
  { id:'i1', name:'Nelson Nay', photoUrl:'https://images.unsplash.com/photo-1520975682039-7d12f1a63e0e?w=1200&q=80', videoUrl:'https://www.youtube.com/watch?v=dQw4w9WgXcQ', bio:'Elegant leader focused on musicality and embrace.', rate:45, status:STATUSES.APPROVED, availability:['Oct 27 · 10:00','Oct 27 · 14:00','Oct 28 · 11:30'] },
  { id:'i2', name:'Luara Castañeda', photoUrl:'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1200&q=80', videoUrl:'https://www.youtube.com/watch?v=oHg5SJYRHA0', bio:'Powerful follower, technique and adornos.', rate:45, status:STATUSES.APPROVED, availability:['Oct 27 · 09:00','Oct 28 · 16:00'] },
]

const store = {
  read(k, f){ try{ return JSON.parse(localStorage.getItem(k) || 'null') ?? f } catch { return f } },
  write(k, v){ localStorage.setItem(k, JSON.stringify(v)) }
}

export default function App(){
  const [role, setRole] = useState('STUDENT')
  const [data, setData] = useState(()=> store.read('tpl-data', { instructors: initialInstructors, bookings: [] }))
  const [search, setSearch] = useState('')

  useEffect(()=> store.write('tpl-data', data), [data])

  const approve = (id, status) => setData(d=> ({...d, instructors: d.instructors.map(i=> i.id===id ? {...i, status} : i)}))
  const addInstructor = i => setData(d=> ({...d, instructors:[...d.instructors, i]}))
  const addBooking = b => setData(d=> ({...d, bookings:[...d.bookings, b]}))
  const markPaid = (id, paid) => setData(d=> ({...d, bookings: d.bookings.map(b=> b.id===id ? {...b, paid} : b)}))

  const approved = useMemo(()=> data.instructors.filter(i=> i.status===STATUSES.APPROVED), [data.instructors])
  const filtered = useMemo(()=> approved.filter(i=> i.name.toLowerCase().includes(search.toLowerCase()) || i.bio.toLowerCase().includes(search.toLowerCase())), [approved, search])

  return (
    <div>
      <header style={{position:'sticky',top:0,background:'#fff',borderBottom:'1px solid #e5e7eb'}}>
        <div style={{maxWidth:1100, margin:'0 auto', padding:16, display:'flex', gap:12, alignItems:'center'}}>
          <motion.div initial={{y:-8,opacity:0}} animate={{y:0,opacity:1}} style={{fontWeight:600,fontSize:20}}>Tango Private Lessons</motion.div>
          <div style={{marginLeft:'auto', display:'flex', gap:8, border:'1px solid #e5e7eb', padding:6, borderRadius:12}}>
            {['ADMIN','INSTRUCTOR','STUDENT'].map(r => (
              <button key={r} onClick={()=>setRole(r)} style={{border:'none', background: role===r?'#111827':'transparent', color: role===r?'#fff':'#111', borderRadius:10, padding:'8px 10px'}}>{r}</button>
            ))}
          </div>
        </div>
      </header>

      <main style={{maxWidth:1100, margin:'0 auto', padding:16}}>
        {role==='ADMIN' && <Admin data={data} approve={approve} markPaid={markPaid} />}
        {role==='INSTRUCTOR' && <Instructor addInstructor={addInstructor} />}
        {role==='STUDENT' && <Student list={filtered} search={search} setSearch={setSearch} addBooking={addBooking} />}
      </main>
    </div>
  )
}

function Section({title, subtitle}){ return (<div style={{margin:'10px 0 6px 0'}}><div style={{fontWeight:600}}>{title}</div><div style={{color:'#6b7280'}}>{subtitle}</div></div>) }
function Card({children}){ return <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:18, padding:16}}>{children}</div> }
function Field({label, children}){ return <div style={{display:'grid', gap:6}}><div style={{color:'#6b7280',fontSize:12}}>{label}</div>{children}</div> }

function Admin({data, approve, markPaid}){
  const pending = data.instructors.filter(i=> i.status===STATUSES.PENDING)
  const approved = data.instructors.filter(i=> i.status===STATUSES.APPROVED)
  return (
    <div style={{display:'grid', gap:16}}>
      <Section title="Pending instructors" subtitle="Approve or reject new instructors"/>
      <div style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))'}}>
        {pending.length===0 && <Card>No pending instructors</Card>}
        {pending.map(i => (
          <Card key={i.id}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{fontWeight:600}}>{i.name}</div><span>${i.rate}/hr</span></div>
            <div style={{color:'#6b7280', marginTop:6}}>{i.bio}</div>
            <a href={i.videoUrl} target="_blank" rel="noreferrer" style={{color:'#2563eb'}}>Watch video</a>
            <div style={{display:'flex', gap:8, marginTop:10}}>
              <button style={{background:'#111827',color:'#fff',borderRadius:12,padding:'8px 12px'}} onClick={()=>approve(i.id, STATUSES.APPROVED)}>Approve</button>
              <button onClick={()=>approve(i.id, STATUSES.REJECTED)}>Reject</button>
            </div>
          </Card>
        ))}
      </div>

      <Section title="Bookings" subtitle="Mark payments as paid/pending"/>
      <div style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))'}}>
        {data.bookings.length===0 && <Card>No bookings yet</Card>}
        {data.bookings.map(b => (
          <Card key={b.id}>
            <div style={{display:'flex',justifyContent:'space-between'}}><div style={{fontWeight:600}}>{b.instructorName} · {b.slot}</div><span>{b.paid?'PAID':'PENDING'}</span></div>
            <div style={{color:'#6b7280'}}>{b.studentName} · {b.studentPhone}</div>
            <div style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
              <div style={{fontWeight:600}}>${b.amount} USD</div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>markPaid(b.id,false)}>Mark Pending</button>
                <button style={{background:'#111827',color:'#fff',borderRadius:12,padding:'8px 12px'}} onClick={()=>markPaid(b.id,true)}><Check size={16}/> Mark Paid</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Instructor({addInstructor}){
  const [form, setForm] = useState({ name:'', photoUrl:'', videoUrl:'', bio:'', rate:'45' })
  const [slots, setSlots] = useState(['Oct 29 · 10:00','Oct 29 · 15:00'])
  const submit = () => {
    if(!form.name || !form.photoUrl || !form.videoUrl || !form.bio) return alert('Please complete all fields.')
    const i = { id: crypto.randomUUID(), name: form.name, photoUrl: form.photoUrl, videoUrl: form.videoUrl, bio: form.bio, rate: Number(form.rate||45), status: STATUSES.PENDING, availability: slots }
    addInstructor(i); alert('Application sent. Admin will review and approve.'); setForm({ name:'', photoUrl:'', videoUrl:'', bio:'', rate:'45' })
  }
  return (
    <div style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))'}}>
      <Card>
        <div style={{fontWeight:600, marginBottom:8}}>Apply as Instructor</div>
        <div style={{display:'grid', gap:10}}>
          <Field label="Full name"><input value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/></Field>
          <Field label="Photo URL"><input value={form.photoUrl} onChange={e=>setForm({...form, photoUrl:e.target.value})}/></Field>
          <Field label="Tango video URL"><input value={form.videoUrl} onChange={e=>setForm({...form, videoUrl:e.target.value})}/></Field>
          <Field label="Short bio"><textarea rows="3" value={form.bio} onChange={e=>setForm({...form, bio:e.target.value})}/></Field>
          <Field label="Hourly rate (USD)"><input type="number" value={form.rate} onChange={e=>setForm({...form, rate:e.target.value})}/></Field>
          <div><button style={{background:'#111827',color:'#fff',borderRadius:12,padding:'8px 12px'}} onClick={submit}><Check size={16}/> Submit application</button></div>
        </div>
      </Card>

      <Card>
        <div style={{fontWeight:600, marginBottom:8}}>Set Availability</div>
        <div style={{display:'grid', gap:8}}>
          {slots.map((s,idx)=> (
            <div key={idx} style={{display:'flex', gap:8}}>
              <input value={s} onChange={e=> setSlots(slots.map((t,i)=> i===idx? e.target.value : t))}/>
              <button onClick={()=> setSlots(slots.filter((_,i)=> i!==idx))}><X size={16}/></button>
            </div>
          ))}
          <button onClick={()=> setSlots([...slots,'Oct 30 · 11:00'])}><Plus size={16}/> Add slot</button>
        </div>
      </Card>
    </div>
  )
}

function Student({list, search, setSearch, addBooking}){
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  return (
    <div style={{display:'grid', gap:16}}>
      <div style={{display:'flex', gap:8}}><Search size={16}/><input placeholder="Search instructor or style" value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:320}}/></div>
      <div style={{display:'grid', gap:16, gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))'}}>
        {list.map(i => (
          <Card key={i.id}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{fontWeight:600}}>{i.name}</div><span><DollarSign size={14}/> {i.rate}/hr</span></div>
            <div style={{color:'#6b7280', margin:'8px 0'}}>Slots: {i.availability.join(', ')}</div>
            <a href={i.videoUrl} target="_blank" rel="noreferrer" style={{color:'#2563eb', display:'inline-flex', gap:6}}><Video size={16}/> Watch video</a>
            <div style={{marginTop:10}}><button style={{background:'#111827',color:'#fff',borderRadius:12,padding:'8px 12px'}} onClick={()=>{ setSelected(i); setOpen(true); }}>Book this instructor</button></div>
          </Card>
        ))}
      </div>

      {open && selected && <BookingModal onClose={()=>setOpen(false)} instructor={selected} addBooking={addBooking}/>}
    </div>
  )
}

function BookingModal({onClose, instructor, addBooking}){
  const [slot, setSlot] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  const canPay = instructor && slot && name && phone

  const createBooking = () => {
    const amount = Number(instructor.rate || 0).toFixed(2)
    const b = { id: crypto.randomUUID(), instructorId: instructor.id, instructorName: instructor.name, slot, studentName: name, studentPhone: phone, amount: instructor.rate, paid: false }
    addBooking(b)

    try { window.open(`${CONFIG.PAYPAL_LINK}/${amount}USD`, '_blank') } catch {}

    try {
      const waText = `NEW BOOKING%0AInstructor: ${encodeURIComponent(instructor.name)}%0ASlot: ${encodeURIComponent(slot)}%0AStudent: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0AAmount: $${amount} USD`
      const waUrl = `https://wa.me/${CONFIG.ADMIN_WHATSAPP.replace(/\\D/g, '')}?text=${waText}`
      window.open(waUrl, '_blank')
    } catch {}

    try {
      const subject = `New Tango Booking — ${instructor.name}`
      const body = `Instructor: ${instructor.name}\\nSlot: ${slot}\\nStudent: ${name}\\nPhone: ${phone}\\nAmount: $${amount} USD`
      window.open(`mailto:${CONFIG.ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    } catch {}

    setConfirmOpen(true)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <div style={{fontWeight:600}}>Book {instructor.name}</div>
          <button onClick={onClose}><X size={16}/></button>
        </div>
        <div style={{display:'grid', gap:10, marginTop:10}}>
          <Field label="Select a time slot">
            <select value={slot} onChange={e=>setSlot(e.target.value)}>
              <option value="">Choose...</option>
              {(instructor.availability||[]).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Your name"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/></Field>
          <Field label="WhatsApp/Phone"><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+57 312 727 6293"/></Field>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6}}>
            <div style={{color:'#6b7280'}}>Amount: <b>${instructor.rate} USD</b></div>
            <button className="primary" disabled={!canPay} onClick={createBooking}><Check size={16}/> Pay with PayPal (Admin)</button>
          </div>
        </div>

        {confirmOpen && (
          <div className="card" style={{marginTop:12}}>
            <div className="body">
              <div style={{fontWeight:600, marginBottom:6}}>Booking started</div>
              <div className="muted">We opened PayPal to pay the administrator and also sent a WhatsApp/email notification. Once the admin confirms payment, your booking will be marked as <b>PAID</b>.</div>
              <div style={{marginTop:10}}><button onClick={()=>{ onClose(); }}>Close</button></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
"""

# write files
open(f"{root}/package.json","w").write(json.dumps(package_json, indent=2))
open(f"{root}/vite.config.js","w").write(vite_config)
open(f"{root}/index.html","w").write(index_html)
open(f"{src}/main.jsx","w").write(main_jsx)
open(f"{src}/App.jsx","w").write(app_jsx)
open(f"{root}/README.md","w").write(readme)

# zip
import zipfile
zip_path = "/mnt/data/tango-private-lessons.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for folder, _, files in os.walk(root):
        for f in files:
            full = os.path.join(folder, f)
            arc = os.path.relpath(full, root)
            z.write(full, arcname=f"tango-private-lessons/{arc}")

zip_path
