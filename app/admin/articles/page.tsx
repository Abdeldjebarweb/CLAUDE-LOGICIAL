'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Loader2, X, Upload } from 'lucide-react'

const empty = { title: '', slug: '', content: '', image_url: '', category: '', author: '', status: 'draft' as const }

// Compression image côté client
async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, 1)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(blob => {
        resolve(new File([blob!], file.name, { type: 'image/jpeg' }))
      }, 'image/jpeg', quality)
    }
    img.src = URL.createObjectURL(file)
  })
}

export default function AdminArticles() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')

  const load = async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
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
    const compressed = await compressImage(imageFile)
    const fileName = `articles/${Date.now()}.jpg`
    const { error } = await supabase.storage.from('documents').upload(fileName, compressed)
    setUploading(false)
    if (error) return null
    const { data } = supabase.storage.from('documents').getPublicUrl(fileName)
    return data.publicUrl
  }

  const save = async () => {
    if (!editing.title) return
    setLoading(true)
    const imageUrl = await uploadImage()
    const slug = editing.slug || editing.title.toLowerCase()
      .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const payload = { ...editing, slug, image_url: imageUrl }

    if (editing.id) {
      await supabase.from('articles').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('articles').insert([payload])
    }
    setEditing(null)
    setImageFile(null)
    setPreview('')
    setLoading(false)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return
    await supabase.from('articles').delete().eq('id', id)
    load()
  }

  const openEdit = (item: any) => {
    setEditing(item)
    setImageFile(null)
    setPreview(item.image_url || '')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Articles ({items.length})</h2>
        <button onClick={() => openEdit({ ...empty })} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvel article
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">{editing.id ? 'Modifier' : 'Nouvel article'}</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="form-label">Titre *</label>
                <input className="form-input" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
              </div>

              {/* Upload image */}
              <div>
                <label className="form-label">Image de l&apos;article</label>
                <div className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${preview ? 'border-vert' : 'border-gray-300 hover:border-vert'}`}
                  onClick={() => document.getElementById('article-img')?.click()}>
                  <input id="article-img" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  {preview ? (
                    <img src={preview} alt="preview" className="w-full h-32 object-cover rounded-lg" />
                  ) : (
                    <div><Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" /><p className="text-sm text-gray-400">Cliquez pour uploader une image</p></div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Catégorie</label>
                  <input className="form-input" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })} placeholder="Ex: Actualités" />
                </div>
                <div>
                  <label className="form-label">Auteur</label>
                  <input className="form-input" value={editing.author} onChange={e => setEditing({ ...editing, author: e.target.value })} placeholder="Nom de l'auteur" />
                </div>
              </div>

              <div>
                <label className="form-label">Contenu *</label>
                <textarea rows={8} className="form-input font-mono text-sm" value={editing.content}
                  onChange={e => setEditing({ ...editing, content: e.target.value })} />
              </div>

              <div>
                <label className="form-label">Statut</label>
                <select className="form-input" value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}>
                  <option value="draft">📝 Brouillon</option>
                  <option value="published">✅ Publié</option>
                </select>
              </div>

              <button onClick={save} disabled={loading || uploading || !editing.title}
                className="btn-primary w-full flex items-center justify-center gap-2">
                {loading || uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> {uploading ? 'Upload...' : 'Enregistrement...'}</> : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Titre</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Catégorie</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Auteur</th>
              <th className="px-4 py-3 text-left font-semibold">Statut</th>
              <th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium max-w-xs truncate">
                  {a.image_url && <img src={a.image_url} alt="" className="w-8 h-8 rounded object-cover inline-block mr-2 align-middle" />}
                  {a.title}
                </td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{a.category || '—'}</td>
                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{a.author || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'published' ? 'bg-vert-50 text-vert' : 'bg-gray-100 text-gray-500'}`}>
                    {a.status === 'published' ? '✅ Publié' : '📝 Brouillon'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs hidden sm:table-cell">
                  {new Date(a.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex gap-1 justify-end">
                    <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-vert hover:bg-vert-50">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => remove(a.id)} className="p-1.5 rounded-lg text-rouge hover:bg-rouge-50">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Aucun article</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
