'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const empty = { name: '', role: '', description: '', photo_url: '', email: '', order_index: 0, is_active: true }

export default function AdminTeam() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const load = async () => { const { data } = await supabase.from('team_members').select('*').order('order_index'); setItems(data || []) }
  useEffect(() => { load() }, [])
  const save = async () => {
    setLoading(true)
    const p = { ...editing, order_index: parseInt(editing.order_index) || 0 }
    if (editing.id) await supabase.from('team_members').update(p).eq('id', editing.id)
    else await supabase.from('team_members').insert([p])
    setEditing(null); setLoading(false); load()
  }
  const remove = async (id: string) => { if (confirm('Supprimer ?')) { await supabase.from('team_members').delete().eq('id', id); load() } }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Équipe ({items.length})</h2>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Ajouter</button>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4"><h3 className="font-heading font-bold">{editing.id ? 'Modifier' : 'Ajouter'}</h3><button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="form-label">Nom</label><input className="form-input" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><label className="form-label">Rôle</label><input className="form-input" value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })} /></div>
              <div><label className="form-label">Description</label><textarea rows={3} className="form-input" value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
              <div><label className="form-label">Photo URL</label><input className="form-input" value={editing.photo_url || ''} onChange={e => setEditing({ ...editing, photo_url: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Email</label><input className="form-input" value={editing.email || ''} onChange={e => setEditing({ ...editing, email: e.target.value })} /></div>
                <div><label className="form-label">Ordre</label><input type="number" className="form-input" value={editing.order_index} onChange={e => setEditing({ ...editing, order_index: e.target.value })} /></div>
              </div>
              <div><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked })} /> Visible sur le site</label></div>
              <button onClick={save} disabled={loading} className="btn-primary w-full">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(m => (
          <div key={m.id} className={`bg-white rounded-xl border p-4 ${!m.is_active ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-vert-100 flex items-center justify-center text-vert font-bold overflow-hidden">
                {m.photo_url ? <img src={m.photo_url} alt="" className="w-full h-full object-cover" /> : m.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{m.name}</p>
                <p className="text-xs text-vert">{m.role}</p>
              </div>
              <button onClick={() => setEditing({ ...m })} className="text-vert"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(m.id)} className="text-rouge"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
