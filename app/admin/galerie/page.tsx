'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, X } from 'lucide-react'

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ image_url: '', caption: '', album: '' })

  const load = async () => { const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false }); setItems(data || []) }
  useEffect(() => { load() }, [])

  const add = async () => {
    await supabase.from('gallery_items').insert([form])
    setShowAdd(false); setForm({ image_url: '', caption: '', album: '' }); load()
  }
  const remove = async (id: string) => { if (confirm('Supprimer ?')) { await supabase.from('gallery_items').delete().eq('id', id); load() } }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Galerie ({items.length})</h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Ajouter</button>
      </div>
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4"><h3 className="font-heading font-bold">Ajouter une photo</h3><button onClick={() => setShowAdd(false)}><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div><label className="form-label">URL de l&apos;image</label><input className="form-input" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} /></div>
              <div><label className="form-label">Légende</label><input className="form-input" value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} /></div>
              <div><label className="form-label">Album</label><input className="form-input" value={form.album} onChange={e => setForm({ ...form, album: e.target.value })} /></div>
              <button onClick={add} className="btn-primary w-full">Ajouter</button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(i => (
          <div key={i.id} className="relative group rounded-xl overflow-hidden border">
            <img src={i.image_url} alt={i.caption || ''} className="w-full aspect-square object-cover" />
            <button onClick={() => remove(i.id)} className="absolute top-2 right-2 bg-rouge text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5" /></button>
            {i.caption && <p className="p-2 text-xs text-gray-600 truncate">{i.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
