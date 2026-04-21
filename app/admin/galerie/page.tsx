'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react'

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ image_url: '', caption: '', album: '' })
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const load = async () => {
    const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleAdd = async () => {
    setUploading(true)
    let imageUrl = form.image_url

    if (file) {
      const ext = file.name.split('.').pop()
      const fileName = `galerie/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('documents').upload(fileName, file)
      if (!error) {
        const { data } = supabase.storage.from('documents').getPublicUrl(fileName)
        imageUrl = data.publicUrl
      }
    }

    if (!imageUrl) { setUploading(false); return }

    await supabase.from('gallery_items').insert([{ ...form, image_url: imageUrl }])
    setShowAdd(false)
    setForm({ image_url: '', caption: '', album: '' })
    setFile(null)
    setPreview(null)
    setUploading(false)
    load()
  }

  const remove = async (id: string) => {
    if (confirm('Supprimer cette photo ?')) {
      await supabase.from('gallery_items').delete().eq('id', id)
      load()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Galerie ({items.length} photos)</h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter une photo
        </button>
      </div>

      {/* Modal ajout */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">Ajouter une photo</h3>
              <button onClick={() => setShowAdd(false)}><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4">
              {/* Upload fichier */}
              <div>
                <label className="form-label">Photo *</label>
                <div
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${preview ? 'border-vert' : 'border-gray-300 hover:border-vert'}`}
                  onClick={() => document.getElementById('gallery-upload')?.click()}
                >
                  <input id="gallery-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  {preview ? (
                    <div>
                      <img src={preview} alt="preview" className="w-full h-32 object-cover rounded-lg mb-2" />
                      <p className="text-xs text-vert">{file?.name}</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Cliquez pour uploader une image</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 10 Mo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ou URL */}
              {!file && (
                <div>
                  <label className="form-label">Ou URL de l&apos;image</label>
                  <input className="form-input" placeholder="https://..." value={form.image_url}
                    onChange={e => setForm({ ...form, image_url: e.target.value })} />
                </div>
              )}

              <div>
                <label className="form-label">Légende</label>
                <input className="form-input" placeholder="Description de la photo" value={form.caption}
                  onChange={e => setForm({ ...form, caption: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Album</label>
                <input className="form-input" placeholder="Ex: Fête de l'Aïd 2024" value={form.album}
                  onChange={e => setForm({ ...form, album: e.target.value })} />
              </div>

              <button onClick={handleAdd} disabled={uploading || (!file && !form.image_url)}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Upload en cours...</> : <><Plus className="w-4 h-4" /> Ajouter</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grille photos */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
              <img src={item.image_url} alt={item.caption || ''} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                {item.caption && <p className="text-white text-xs text-center line-clamp-2">{item.caption}</p>}
                {item.album && <span className="text-white/70 text-xs">{item.album}</span>}
                <button onClick={() => remove(item.id)}
                  className="mt-2 bg-rouge text-white p-2 rounded-lg hover:bg-rouge-700 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Aucune photo dans la galerie.</p>
          <button onClick={() => setShowAdd(true)} className="text-vert text-sm mt-2 hover:underline">
            + Ajouter la première photo
          </button>
        </div>
      )}
    </div>
  )
}
