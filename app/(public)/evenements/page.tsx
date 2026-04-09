import { supabase } from '@/lib/supabase'
import { Calendar, MapPin, Clock, ExternalLink } from 'lucide-react'

export const revalidate = 60
export const metadata = { title: 'Événements – AEAB' }

export default async function EvenementsPage() {
  const { data: upcoming } = await supabase.from('events').select('*').eq('status', 'upcoming').order('date')
  const { data: past } = await supabase.from('events').select('*').eq('status', 'past').order('date', { ascending: false }).limit(6)

  const EventCard = ({ event }: { event: any }) => (
    <div className="card group">
      <div className="aspect-[16/9] bg-vert-50 relative overflow-hidden">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-vert-200"><Calendar className="w-16 h-16" /></div>
        )}
        <div className="absolute top-3 left-3 bg-white rounded-lg px-3 py-1.5 shadow-md text-center">
          <span className="block text-lg font-bold text-vert leading-none">{new Date(event.date).getDate()}</span>
          <span className="block text-[10px] font-semibold text-gray-500 uppercase">{new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
        </div>
        {event.is_free && <span className="absolute top-3 right-3 bg-vert text-white text-xs font-bold px-2 py-0.5 rounded-full">Gratuit</span>}
      </div>
      <div className="p-5">
        <h3 className="font-heading font-bold text-lg text-gray-900">{event.title}</h3>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">{event.description}</p>
        <div className="flex flex-wrap gap-3 mt-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{event.time}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{event.location}</span>
        </div>
        <div className="flex gap-2 mt-4">
          {event.registration_link && (
            <a href={event.registration_link} target="_blank" rel="noopener" className="btn-primary text-xs !px-4 !py-2">S&apos;inscrire</a>
          )}
          {event.maps_link && (
            <a href={event.maps_link} target="_blank" rel="noopener" className="btn-outline text-xs !px-4 !py-2 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Maps
            </a>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <section className="hero-gradient py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Événements</h1>
          <p className="text-white/80 mt-4 text-lg">Retrouvez nos prochaines activités et événements passés.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-gray-900 mb-8">À venir</h2>
          {upcoming && upcoming.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{upcoming.map((e: any) => <EventCard key={e.id} event={e} />)}</div>
          ) : (
            <p className="text-center py-12 text-gray-400">Aucun événement à venir pour le moment.</p>
          )}

          {past && past.length > 0 && (
            <>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-8 mt-16">Événements passés</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-75">{past.map((e: any) => <EventCard key={e.id} event={e} />)}</div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
