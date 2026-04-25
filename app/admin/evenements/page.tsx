'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Loader2, X, Upload, Calendar, MapPin } from 'lucide-react'

const empty = { title: '', description: '', image_url: '', date: '', time: '', location: '', maps_link: '', capacity: '', is_free: true, price: '', organizer: '', registration_link: '', status: 'upcoming' }

export default function AdminEvents() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  const load = async () => {
    const { data } = await supabase.from('events').select('*').order('date', { ascending: false })
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
    if (!imageFile) return editing.image_url || null
    setUploading(true)
    const ext = imageFile.name.split('.').pop()
    const fileName = `evenements/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('documents').upload(fileName, imageFile)
    setUploading(false)
    if (error) return editing.image_url || null
    const { data } = supabase.storage.from('documents').getPublicUrl(fileName)
    return data.publicUrl
  }

  const save = async () => {
    if (!editing.title) return
    setLoading(true)
    const imageUrl = await uploadImage()
    const payload = {
      ...editing,
      image_url: imageUrl,
      capacity: editing.capacity ? parseInt(editing.capacity) : null,
      price: editing.price ? parseFloat(editing.price) : null,
    }
    if (editing.id) {
      await supabase.from('events').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('events').insert([payload])
    }
    setEditing(null)
    setImageFile(null)
    setPreview('')
    setLoading(false)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return
    await supabase.from('events').delete().eq('id', id)
    load()
  }

  const openEdit = (item: any) => {
    setEditing(item)
    setImageFile(null)
    setPreview(item.image_url || '')
  }

  const statusColors: Record<string, string> = {
    upcoming: 'bg-vert-50 text-vert',
    ongoing: 'bg-blue-50 text-blue-700',
    past: 'bg-gray-100 text-gray-500',
    cancelled: 'bg-rouge-50 text-rouge',
  }
  const statusLabels: Record<string, string> = {
    upcoming: '📅 À venir',
    ongoing: '🟢 En cours',
    past: '⚪ Passé',
    cancelled: '❌ Annulé',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Événements ({items.length})</h2>
        <button onClick={() => openEdit({ ...empty })} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvel événement
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">{editing.id ? 'Modifier' : 'Nouvel événement'}</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Titre *</label>
                <input className="form-input" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Description</label>
                <textarea rows={3} className="form-input" value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              </div>

              {/* Upload image */}
              <div>
                <label className="form-label">Image</label>
                <div className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer ${preview ? 'border-vert' : 'border-gray-300 hover:border-vert'}`}
                  onClick={() => document.getElementById('event-img')?.click()}>
                  <input id="event-img" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-32 object-cover rounded-lg" />
                  ) : (
                    <div><Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" /><p className="text-sm text-gray-400">Cliquez pour uploader</p></div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Date *</label>
                  <input type="date" className="form-input" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Heure</label>
                  <input className="form-input" value={editing.time || ''} onChange={e => setEditing({ ...editing, time: e.target.value })} placeholder="18h00" />
                </div>
              </div>
              <div>
                <label className="form-label">Lieu</label>
                <input className="form-input" value={editing.location || ''} onChange={e => setEditing({ ...editing, location: e.target.value })} placeholder="Adresse ou nom du lieu" />
              </div>
              <div>
                <label className="form-label">Lien Google Maps</label>
                <input className="form-input" value={editing.maps_link || ''} onChange={e => setEditing({ ...editing, maps_link: e.target.value })} placeholder="https://maps.google.com/..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Organisateur</label>
                  <input className="form-input" value={editing.organizer || ''} onChange={e => setEditing({ ...editing, organizer: e.target.value })} />
                </div>
                <div>
                  <label className="form-label">Capacité max</label>
                  <input type="number" className="form-input" value={editing.capacity || ''} onChange={e => setEditing({ ...editing, capacity: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={editing.is_free} onChange={e => setEditing({ ...editing, is_free: e.target.checked })} className="w-4 h-4 accent-vert" />
                    Événement gratuit
                  </label>
                </div>
                {!editing.is_free && (
                  <div>
                    <label className="form-label">Prix (€)</label>
                    <input type="number" className="form-input" value={editing.price || ''} onChange={e => setEditing({ ...editing, price: e.target.value })} />
                  </div>
                )}
              </div>
              <div>
                <label className="form-label">Lien d&apos;inscription</label>
                <input className="form-input" value={editing.registration_link || ''} onChange={e => setEditing({ ...editing, registration_link: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Statut</label>
                <select className="form-input" value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}>
                  <option value="upcoming">📅 À venir</option>
                  <option value="ongoing">🟢 En cours</option>
                  <option value="past">⚪ Passé</option>
                  <option value="cancelled">❌ Annulé</option>
                </select>
              </div>
              <button onClick={save} disabled={loading || uploading || !editing.title} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading || uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> {uploading ? 'Upload...' : 'Enregistrement...'}</> : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map(e => (
          <div key={e.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
            {e.image_url && <img src={e.image_url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold truncate">{e.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[e.status] || ''}`}>{statusLabels[e.status] || e.status}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                {e.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(e.date).toLocaleDateString('fr-FR')}{e.time ? ` à ${e.time}` : ''}</span>}
                {e.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location}</span>}
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => openEdit(e)} className="p-1.5 rounded-lg text-vert hover:bg-vert-50"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => remove(e.id)} className="p-1.5 rounded-lg text-rouge hover:bg-rouge-50"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center py-12 text-gray-400">Aucun événement</div>}
      </div>
    </div>
  )
}
