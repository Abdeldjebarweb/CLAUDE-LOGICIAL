'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Vote, CheckCircle, Loader2, Clock, BarChart2, Lock } from 'lucide-react'

export default function VotesPage() {
  const [votes, setVotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [votingId, setVotingId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState('')
  const [emailSaisi, setEmailSaisi] = useState(false)
  const [reponses, setReponses] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Récupérer email depuis le portail membre
    const saved = localStorage.getItem('aeab_membre')
    if (saved) {
      const m = JSON.parse(saved)
      setUserEmail(m.email)
      setEmailSaisi(true)
    }
    supabase.from('votes').select('*, vote_reponses(choix)').eq('actif', true).order('created_at', { ascending: false })
      .then(({ data }) => { setVotes(data || []); setLoading(false) })
  }, [])

  const handleVote = async (voteId: string) => {
    if (!userEmail || !reponses[voteId]) return
    setVotingId(voteId)
    const { error } = await supabase.from('vote_reponses').insert([{
      vote_id: voteId,
      membre_email: userEmail,
      choix: reponses[voteId],
    }])
    setVotingId(null)
    if (error && error.code === '23505') {
      alert('Vous avez déjà voté pour ce sondage.')
    } else if (!error) {
      setSubmitted({ ...submitted, [voteId]: true })
    }
  }

  const getResultats = (vote: any) => {
    const reponsesList: string[] = (vote.vote_reponses || []).map((r: any) => r.choix)
    const total = reponsesList.length
    const options: string[] = vote.options || []
    return options.map((opt: string) => ({
      option: opt,
      count: reponsesList.filter(r => r === opt).length,
      pct: total > 0 ? Math.round((reponsesList.filter(r => r === opt).length / total) * 100) : 0,
    }))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-vert border-t-transparent rounded-full" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl font-bold text-white">Votes & Sondages</h1>
          <p className="text-white/80 mt-4">Participez aux décisions de l&apos;association</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4">

          {/* Email */}
          {!emailSaisi && (
            <div className="bg-white rounded-xl border p-5 mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Entrez votre email pour voter :</p>
              <div className="flex gap-3">
                <input type="email" className="form-input flex-1" placeholder="votre@email.com"
                  value={userEmail} onChange={e => setUserEmail(e.target.value)} />
                <button onClick={() => setEmailSaisi(true)} disabled={!userEmail}
                  className="btn-primary text-sm px-4">Confirmer</button>
              </div>
            </div>
          )}

          {votes.length > 0 ? (
            <div className="space-y-6">
              {votes.map(vote => {
                const hasVoted = submitted[vote.id]
                const resultats = getResultats(vote)
                const totalVotes = (vote.vote_reponses || []).length
                const isExpired = vote.date_fin && new Date(vote.date_fin) < new Date()

                return (
                  <div key={vote.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <h3 className="font-heading font-bold text-xl text-gray-900">{vote.titre}</h3>
                        {isExpired
                          ? <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full flex-shrink-0">⏰ Terminé</span>
                          : <span className="text-xs bg-vert-50 text-vert px-2 py-1 rounded-full flex-shrink-0 font-semibold">🟢 En cours</span>
                        }
                      </div>
                      {vote.description && <p className="text-gray-500 text-sm mb-5">{vote.description}</p>}

                      {vote.date_fin && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
                          <Clock className="w-3.5 h-3.5" />
                          Date limite : {new Date(vote.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      )}

                      {/* Résultats si vote effectué ou résultats publics */}
                      {(hasVoted || isExpired || vote.resultats_publics) ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <BarChart2 className="w-4 h-4 text-vert" />
                            Résultats ({totalVotes} vote{totalVotes > 1 ? 's' : ''})
                          </div>
                          {resultats.map(r => (
                            <div key={r.option}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className={reponses[vote.id] === r.option ? 'font-semibold text-vert' : 'text-gray-700'}>{r.option}</span>
                                <span className="text-gray-500">{r.count} vote{r.count > 1 ? 's' : ''} ({r.pct}%)</span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-vert rounded-full transition-all" style={{ width: `${r.pct}%` }} />
                              </div>
                            </div>
                          ))}
                          {hasVoted && <p className="text-xs text-vert mt-2 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Votre vote a été enregistré</p>}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {!isExpired && (vote.options || []).map((opt: string) => (
                            <button key={opt} type="button"
                              onClick={() => setReponses({ ...reponses, [vote.id]: opt })}
                              className={`w-full text-left p-3 rounded-xl border-2 text-sm transition-all ${reponses[vote.id] === opt ? 'border-vert bg-vert-50 text-vert font-semibold' : 'border-gray-200 hover:border-vert hover:bg-vert-50 text-gray-700'}`}>
                              {reponses[vote.id] === opt ? '✅ ' : '○ '}{opt}
                            </button>
                          ))}
                          {!isExpired && emailSaisi && (
                            <button onClick={() => handleVote(vote.id)}
                              disabled={!reponses[vote.id] || votingId === vote.id}
                              className="btn-primary w-full mt-3 flex items-center justify-center gap-2">
                              {votingId === vote.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Vote className="w-4 h-4" />}
                              Voter
                            </button>
                          )}
                          {!emailSaisi && (
                            <p className="text-xs text-gray-400 text-center mt-2">Entrez votre email ci-dessus pour voter</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <Vote className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Aucun sondage actif pour le moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
