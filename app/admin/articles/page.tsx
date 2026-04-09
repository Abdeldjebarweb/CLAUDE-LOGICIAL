'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react'

const empty = { title: '', slug: '', content: '', image_url: '', category: '', author: '', status: 'draft' as const }

export default function AdminArticles() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    setLoading(true)
    const slug = editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const payload = { ...editing, slug }
    if (editing.id) {
      await supabase.from('articles').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('articles').insert([payload])
    }
    setEditing(null)
    setLoading(false)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return
    await supabase.from('articles').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">Articles ({items.length})</h2>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nouvel article
        </button>
      </div>

      {/* Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">{editing.id ? 'Modifier' : 'Nouvel article'}</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="form-label">Titre</label><input className="form-input" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><label className="form-label">Image URL</label><input className="form-input" value={editing.image_url || ''} onChange={e => setEditing({ ...editing, image_url: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Catégorie</label><input className="form-input" value={editing.category || ''} onChange={e => setEditing({ ...editing, category: e.target.value })} /></div>
                <div><label className="form-label">Auteur</label><input className="form-input" value={editing.author || ''} onChange={e => setEditing({ ...editing, author: e.target.value })} /></div>
              </div>
              <div><label className="form-label">Contenu</label><textarea rows={10} className="form-input" value={editing.content} onChange={e => setEditing({ ...editing, content: e.target.value })} /></div>
              <div>
                <label className="form-label">Statut</label>
                <select className="form-input" value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}>
                  <option value="draft">Brouillon</option>
                  <option value="published">Publié</option>
                </select>
              </div>
              <button onClick={save} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-600">Titre</th>
              <th className="px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Catégorie</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Statut</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900 truncate max-w-[200px]">{a.title}</td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{a.category || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${a.status === 'published' ? 'bg-vert-50 text-vert' : 'bg-gray-100 text-gray-500'}`}>
                    {a.status === 'published' ? 'Publié' : 'Brouillon'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing({ ...a })} className="text-vert hover:text-vert-700 mr-2"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(a.id)} className="text-rouge hover:text-rouge-700"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Aucun article</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
