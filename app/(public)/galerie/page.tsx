import { supabase } from '@/lib/supabase'
import { Camera } from 'lucide-react'

export const revalidate = 60
export const metadata = { title: 'Galerie – AEAB' }

export default async function GaleriePage() {
  const { data: items } = await supabase.from('gallery_items').select('*').order('created_at', { ascending: false })

  return (
    <>
      <section className="hero-gradient py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white">Galerie</h1>
          <p className="text-white/80 mt-4 text-lg">Les moments forts de notre communauté.</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items && items.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="break-inside-avoid rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                  <img src={item.image_url} alt={item.caption || 'Photo'} className="w-full group-hover:scale-105 transition-transform duration-500" />
                  {item.caption && (
                    <div className="p-3 bg-white"><p className="text-sm text-gray-600">{item.caption}</p></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>La galerie sera alimentée prochainement.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
