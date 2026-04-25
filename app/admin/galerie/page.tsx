'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, X, Upload, Loader2 } from 'lucide-react'

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [caption, setCaption] = useState('')
  const [album, setAlbum] = useState('')

  const load = async () => {
    const { data } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => {
    load()
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const handleAdd = async () => {
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `galerie/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('documents').upload(fileName, file)
    if (error) { alert('Erreur upload'); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)
    await supabase.from('gallery_items').insert([{ image_url: urlData.publicUrl, caption, album }])
    setUploading(false)
    setShowAdd(false)
    setFile(null)
    setPreview('')
    setCaption('')
    setAlbum('')
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer cette photo ?')) return
    await supabase.from('gallery_items').delete().eq('id', id)
    load()
  }

  // Grouper par album
  const albums = Array.from(new Set(items.map(i => i.album || "Sans album")))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Galerie ({items.length} photos)</h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter une photo
        </button>
      </div>

      {/* Modal upload */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">Ajouter une photo</h3>
              <button onClick={() => setShowAdd(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              {/* Zone upload */}
              <div>
                <label className="form-label">Photo *</label>
                <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${preview ? 'border-vert' : 'border-gray-300 hover:border-vert'}`}
                  onClick={() => document.getElementById('galerie-upload')?.click()}>
                  <input id="galerie-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-lg" />
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Cliquez pour choisir une image</p>
                      <p className="text-xs text-gray-300">JPG, PNG, WEBP</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="form-label">Légende</label>
                <input className="form-input" placeholder="Description de la photo" value={caption} onChange={e => setCaption(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Album</label>
                <input className="form-input" placeholder="Ex: Fête de l'Aïd 2024" value={album} onChange={e => setAlbum(e.target.value)} />
              </div>
              <button onClick={handleAdd} disabled={!file || uploading}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Upload...</> : <><Upload className="w-4 h-4" /> Ajouter</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Galerie par album */}
      {albums.map(albumName => (
        <div key={albumName} className="mb-8">
          <h3 className="font-heading font-bold text-base mb-3 text-gray-700">
            📁 {albumName} ({items.filter(i => (i.album || 'Sans album') === albumName).length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.filter(i => (i.album || 'Sans album') === albumName).map(item => (
              <div key={item.id} className="relative group rounded-xl overflow-hidden border bg-gray-50 aspect-square">
                <img src={item.image_url} alt={item.caption || ''} className="w-full h-full object-cover" />
                <button onClick={() => remove(item.id)}
                  className="absolute top-2 right-2 bg-rouge text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                    <p className="text-white text-xs truncate">{item.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">Aucune photo dans la galerie.</p>
          <button onClick={() => setShowAdd(true)} className="text-vert text-sm mt-2 hover:underline">
            + Ajouter la première photo
          </button>
        </div>
      )}
    </div>
  )
}
