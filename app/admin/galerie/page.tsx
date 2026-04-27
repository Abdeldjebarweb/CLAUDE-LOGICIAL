'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, X, Upload, Loader2, FolderPlus, Images } from 'lucide-react'

const CATEGORIES = ['Sortie', 'Aïd', 'Ramadan', 'Événement', 'Réunion', 'Voyage', 'Autre']

export default function AdminGallery() {
  const [items, setItems] = useState<any[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [albumName, setAlbumName] = useState('')
  const [category, setCategory] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [caption, setCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = async () => {
    const { data } = await supabase.from('gallery_items').select('*').order('event_date', { ascending: false }).order('created_at', { ascending: false })
    setItems(data || [])
  }

  useEffect(() => { load() }, [])

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || [])
    setFiles(selected)
    setPreviews(selected.map(f => URL.createObjectURL(f)))
  }

  const handleAdd = async () => {
    if (!files.length || !albumName) return
    setUploading(true)
    setUploadProgress(0)

    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      const ext = f.name.split('.').pop()
      const fileName = `galerie/${Date.now()}-${i}.${ext}`
      const { error } = await supabase.storage.from('documents').upload(fileName, f)
      if (error) { console.error('Upload error:', error); continue }
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)
      await supabase.from('gallery_items').insert([{
        image_url: urlData.publicUrl,
        caption: caption || null,
        album: albumName,
        category: category || null,
        event_date: eventDate || null,
      }])
      setUploadProgress(Math.round(((i + 1) / files.length) * 100))
    }

    setUploading(false)
    setShowAdd(false)
    setFiles([])
    setPreviews([])
    setAlbumName('')
    setCategory('')
    setEventDate('')
    setCaption('')
    load()
  }

  const remove = async (id: string, imageUrl: string) => {
    if (!confirm('Supprimer cette photo ?')) return
    const path = imageUrl.split('/documents/')[1]
    if (path) await supabase.storage.from('documents').remove([path])
    await supabase.from('gallery_items').delete().eq('id', id)
    load()
  }

  const removeAlbum = async (albumName: string) => {
    if (!confirm(`Supprimer tout l'album "${albumName}" ?`)) return
    const albumItems = items.filter(i => i.album === albumName)
    for (const item of albumItems) {
      const path = item.image_url.split('/documents/')[1]
      if (path) await supabase.storage.from('documents').remove([path])
    }
    await supabase.from('gallery_items').delete().in('id', albumItems.map(i => i.id))
    load()
  }

  // Grouper par album
  const albums = Array.from(new Set(items.map(i => i.album || 'Sans album')))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Galerie ({items.length} photos · {albums.length} albums)</h2>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Ajouter des photos
        </button>
      </div>

      {/* Modal upload */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => !uploading && setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-5">
              <h3 className="font-heading font-bold text-lg">Ajouter des photos</h3>
              {!uploading && <button onClick={() => setShowAdd(false)}><X className="w-5 h-5" /></button>}
            </div>

            <div className="space-y-4">
              {/* Zone upload multiple */}
              <div>
                <label className="form-label">Photos * <span className="text-gray-400 font-normal">(plusieurs possibles)</span></label>
                <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${previews.length ? 'border-vert' : 'border-gray-300 hover:border-vert'}`}
                  onClick={() => fileInputRef.current?.click()}>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFilesChange} />
                  {previews.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        {previews.slice(0, 8).map((p, i) => (
                          <img key={i} src={p} alt="" className="w-full aspect-square object-cover rounded-lg" />
                        ))}
                        {previews.length > 8 && (
                          <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-500">+{previews.length - 8}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-vert font-semibold">{files.length} photo(s) sélectionnée(s)</p>
                      <p className="text-xs text-gray-400 mt-1">Cliquez pour changer</p>
                    </div>
                  ) : (
                    <div className="py-4">
                      <Images className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 font-medium">Cliquez pour sélectionner des photos</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP · Sélection multiple possible</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Album */}
              <div>
                <label className="form-label">Nom de l'album *</label>
                <div className="relative">
                  <FolderPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input className="form-input pl-9" placeholder="Ex: Sortie Aïd 2025"
                    value={albumName} onChange={e => setAlbumName(e.target.value)} />
                </div>
                {/* Suggestions albums existants */}
                {albums.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {albums.filter(a => a !== 'Sans album').map(a => (
                      <button key={a} type="button" onClick={() => setAlbumName(a)}
                        className="text-xs bg-gray-100 hover:bg-vert-50 hover:text-vert px-2.5 py-1 rounded-full transition-colors">
                        {a}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Catégorie */}
              <div>
                <label className="form-label">Catégorie</label>
                <select className="form-input" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Sélectionner...</option>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="form-label">Date de l'événement</label>
                <input type="date" className="form-input" value={eventDate} onChange={e => setEventDate(e.target.value)} />
              </div>

              {/* Légende */}
              <div>
                <label className="form-label">Légende (optionnel)</label>
                <input className="form-input" placeholder="Description commune pour ces photos"
                  value={caption} onChange={e => setCaption(e.target.value)} />
              </div>

              {/* Progress bar */}
              {uploading && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Upload en cours...</span>
                    <span className="font-semibold text-vert">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-vert h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              <button onClick={handleAdd} disabled={!files.length || !albumName || uploading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {uploading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Upload {uploadProgress}%...</>
                  : <><Upload className="w-4 h-4" /> Uploader {files.length > 0 ? `${files.length} photo(s)` : ''}</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Albums */}
      {albums.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Images className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Aucune photo dans la galerie.</p>
          <button onClick={() => setShowAdd(true)} className="text-vert text-sm mt-2 hover:underline">+ Ajouter les premières photos</button>
        </div>
      ) : (
        albums.map(albumName => {
          const albumItems = items.filter(i => (i.album || 'Sans album') === albumName)
          const firstItem = albumItems[0]
          return (
            <div key={albumName} className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-heading font-bold text-base text-gray-800 flex items-center gap-2">
                    📁 {albumName}
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{albumItems.length} photo(s)</span>
                  </h3>
                  {firstItem?.event_date && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      📅 {new Date(firstItem.event_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {firstItem?.category && ` · ${firstItem.category}`}
                    </p>
                  )}
                </div>
                <button onClick={() => removeAlbum(albumName)}
                  className="text-xs text-rouge hover:underline flex items-center gap-1">
                  <Trash2 className="w-3 h-3" /> Supprimer l'album
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {albumItems.map(item => (
                  <div key={item.id} className="relative group rounded-xl overflow-hidden border bg-gray-50 aspect-square">
                    <img src={item.image_url} alt={item.caption || ''} className="w-full h-full object-cover" />
                    <button onClick={() => remove(item.id, item.image_url)}
                      className="absolute top-1.5 right-1.5 bg-rouge text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                      <Trash2 className="w-3 h-3" />
                    </button>
                    {item.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-1.5">
                        <p className="text-white text-xs truncate">{item.caption}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
