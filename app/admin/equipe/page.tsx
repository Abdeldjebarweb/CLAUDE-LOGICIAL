'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from 'lucide-react'

const empty = { name: '', role: '', description: '', photo_url: '', email: '', order_index: 0, is_active: true }

export default function AdminTeam() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  const load = async () => {
    const { data } = await supabase.from('team_members').select('*').order('order_index')
    setItems(data || [])
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setImageFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return editing.photo_url || null
    setUploading(true)
    const ext = imageFile.name.split('.').pop()
    const fileName = `equipe/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('documents').upload(fileName, imageFile)
    setUploading(false)
    if (error) return editing.photo_url || null
    const { data } = supabase.storage.from('documents').getPublicUrl(fileName)
    return data.publicUrl
  }

  const save = async () => {
    setLoading(true)
    const photoUrl = await uploadImage()
    const payload = { ...editing, photo_url: photoUrl, order_index: parseInt(editing.order_index) || 0 }
    if (editing.id) {
      await supabase.from('team_members').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('team_members').insert([payload])
    }
    setEditing(null)
    setImageFile(null)
    setPreview('')
    setLoading(false)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer ce membre ?')) return
    await supabase.from('team_members').delete().eq('id', id)
    load()
  }

  const openEdit = (item: any) => {
    setEditing(item)
    setImageFile(null)
    setPreview(item.photo_url || '')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Équipe ({items.length})</h2>
        <button onClick={() => openEdit({ ...empty })} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter un membre
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 className="font-heading font-bold">{editing.id ? 'Modifier' : 'Ajouter un membre'}</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {/* Photo upload */}
              <div>
                <label className="form-label">Photo</label>
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-full overflow-hidden border-2 border-dashed flex items-center justify-center cursor-pointer ${preview ? 'border-vert' : 'border-gray-300'}`}
                    onClick={() => document.getElementById('team-photo')?.click()}>
                    <input id="team-photo" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    {preview ? (
                      <img src={preview} alt="photo" className="w-full h-full object-cover" />
                    ) : (
                      <Upload className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Cliquez sur le cercle</p>
                    <p className="text-xs text-gray-400">JPG, PNG recommandé</p>
                  </div>
                </div>
              </div>

              <div><label className="form-label">Nom *</label><input className="form-input" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><label className="form-label">Rôle *</label><input className="form-input" value={editing.role} onChange={e => setEditing({ ...editing, role: e.target.value })} placeholder="Ex: Président, Trésorier..." /></div>
              <div><label className="form-label">Description</label><textarea rows={3} className="form-input" value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Email</label><input type="email" className="form-input" value={editing.email || ''} onChange={e => setEditing({ ...editing, email: e.target.value })} /></div>
                <div><label className="form-label">Ordre d&apos;affichage</label><input type="number" className="form-input" value={editing.order_index} onChange={e => setEditing({ ...editing, order_index: e.target.value })} /></div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={editing.is_active} onChange={e => setEditing({ ...editing, is_active: e.target.checked })} className="w-4 h-4 accent-vert" />
                Visible sur le site
              </label>
              <button onClick={save} disabled={loading || uploading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading || uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> {uploading ? 'Upload photo...' : 'Enregistrement...'}</> : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(m => (
          <div key={m.id} className={`bg-white rounded-xl border p-4 ${!m.is_active ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-full bg-vert-100 flex-shrink-0 overflow-hidden">
                {m.photo_url
                  ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-vert text-xl font-bold">{m.name?.charAt(0)}</div>}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{m.name}</h3>
                <p className="text-xs text-vert">{m.role}</p>
                {!m.is_active && <span className="text-xs text-gray-400">Masqué</span>}
              </div>
            </div>
            {m.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{m.description}</p>}
            <div className="flex gap-2 mt-3 justify-end">
              <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg text-vert hover:bg-vert-50"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(m.id)} className="p-1.5 rounded-lg text-rouge hover:bg-rouge-50"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-3 text-center py-12 text-gray-400">Aucun membre dans l&apos;équipe</div>}
      </div>
    </div>
  )
}
