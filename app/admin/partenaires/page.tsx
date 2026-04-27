'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

const empty = { name: '', description: '', logo_url: '', website: '', category: '' }

export default function AdminPartners() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const load = async () => { const { data } = await supabase.from('partners').select('*').order('name'); setItems(data || []) }
  useEffect(() => { load() }, [])
  const save = async () => {
    setLoading(true)
    if (editing.id) {
      const { error } = await supabase.from('partners').update(editing).eq('id', editing.id)
      if (error) console.error("Supabase error:", error.message)
    } else {
      const { error } = await supabase.from('partners').insert([editing])
      if (error) console.error("Supabase error:", error.message)
    }
    setEditing(null)
    setLoading(false)
    load()
  }
  const remove = async (id: string) => { if (confirm('Supprimer ?')) { await supabase.from('partners').delete().eq('id', id); load() } }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Partenaires ({items.length})</h2>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Ajouter</button>
      </div>
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4"><h3 className="font-heading font-bold">{editing.id ? 'Modifier' : 'Ajouter'}</h3><button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="form-label">Nom</label><input className="form-input" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><label className="form-label">Description</label><textarea rows={3} className="form-input" value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
              <div><label className="form-label">Logo URL</label><input className="form-input" value={editing.logo_url || ''} onChange={e => setEditing({ ...editing, logo_url: e.target.value })} /></div>
              <div><label className="form-label">Site web</label><input className="form-input" value={editing.website || ''} onChange={e => setEditing({ ...editing, website: e.target.value })} /></div>
              <div><label className="form-label">Catégorie</label><input className="form-input" value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })} /></div>
              <button onClick={save} disabled={loading} className="btn-primary w-full">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(p => (
          <div key={p.id} className="bg-white rounded-xl border p-4">
            <div className="flex items-start gap-3">
              {p.logo_url ? <img src={p.logo_url} alt="" className="w-12 h-12 object-contain" /> : <div className="w-12 h-12 rounded bg-vert-50 flex items-center justify-center text-vert font-bold">{p.name?.charAt(0)}</div>}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{p.name}</p>
                {p.category && <span className="text-xs text-vert">{p.category}</span>}
              </div>
              <button onClick={() => setEditing({ ...p })} className="text-vert"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(p.id)} className="text-rouge"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
