'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react'

const empty = { title: '', description: '', image_url: '', date: '', time: '', location: '', maps_link: '', capacity: '', is_free: true, price: '', organizer: '', registration_link: '', status: 'upcoming' }

export default function AdminEvents() {
  const [items, setItems] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const load = async () => { const { data } = await supabase.from('events').select('*').order('date', { ascending: false }); setItems(data || []) }
  useEffect(() => { load() }, [])

  const save = async () => {
    setLoading(true)
    const payload = { ...editing, capacity: editing.capacity ? parseInt(editing.capacity) : null, price: editing.price ? parseFloat(editing.price) : null }
    if (editing.id) await supabase.from('events').update(payload).eq('id', editing.id)
    else await supabase.from('events').insert([payload])
    setEditing(null); setLoading(false); load()
  }

  const remove = async (id: string) => { if (confirm('Supprimer ?')) { await supabase.from('events').delete().eq('id', id); load() } }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Événements ({items.length})</h2>
        <button onClick={() => setEditing({ ...empty })} className="btn-primary text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Nouveau</button>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">{editing.id ? 'Modifier' : 'Nouvel événement'}</h3>
              <button onClick={() => setEditing(null)}><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="form-label">Titre</label><input className="form-input" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><label className="form-label">Description</label><textarea rows={4} className="form-input" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
              <div><label className="form-label">Image URL</label><input className="form-input" value={editing.image_url || ''} onChange={e => setEditing({ ...editing, image_url: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Date</label><input type="date" className="form-input" value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} /></div>
                <div><label className="form-label">Heure</label><input className="form-input" value={editing.time} onChange={e => setEditing({ ...editing, time: e.target.value })} placeholder="18h00" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Lieu</label><input className="form-input" value={editing.location} onChange={e => setEditing({ ...editing, location: e.target.value })} /></div>
                <div><label className="form-label">Lien Maps</label><input className="form-input" value={editing.maps_link || ''} onChange={e => setEditing({ ...editing, maps_link: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="form-label">Places</label><input type="number" className="form-input" value={editing.capacity || ''} onChange={e => setEditing({ ...editing, capacity: e.target.value })} /></div>
                <div>
                  <label className="form-label">Gratuit ?</label>
                  <select className="form-input" value={editing.is_free ? 'true' : 'false'} onChange={e => setEditing({ ...editing, is_free: e.target.value === 'true' })}>
                    <option value="true">Oui</option><option value="false">Non</option>
                  </select>
                </div>
                <div><label className="form-label">Prix (€)</label><input type="number" className="form-input" value={editing.price || ''} onChange={e => setEditing({ ...editing, price: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="form-label">Organisateur</label><input className="form-input" value={editing.organizer || ''} onChange={e => setEditing({ ...editing, organizer: e.target.value })} /></div>
                <div><label className="form-label">Lien inscription</label><input className="form-input" value={editing.registration_link || ''} onChange={e => setEditing({ ...editing, registration_link: e.target.value })} /></div>
              </div>
              <div>
                <label className="form-label">Statut</label>
                <select className="form-input" value={editing.status} onChange={e => setEditing({ ...editing, status: e.target.value })}>
                  <option value="upcoming">À venir</option><option value="past">Passé</option>
                </select>
              </div>
              <button onClick={save} disabled={loading} className="btn-primary w-full">{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left font-semibold">Titre</th><th className="px-4 py-3 text-left font-semibold hidden sm:table-cell">Date</th><th className="px-4 py-3 text-left font-semibold">Statut</th><th className="px-4 py-3 text-right font-semibold">Actions</th></tr></thead>
          <tbody className="divide-y">
            {items.map(e => (
              <tr key={e.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium truncate max-w-[200px]">{e.title}</td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{e.date ? new Date(e.date).toLocaleDateString('fr-FR') : '—'}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${e.status === 'upcoming' ? 'bg-vert-50 text-vert' : 'bg-gray-100 text-gray-500'}`}>{e.status === 'upcoming' ? 'À venir' : 'Passé'}</span></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing({ ...e })} className="text-vert mr-2"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => remove(e.id)} className="text-rouge"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">Aucun événement</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
