import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react'
import { notFound } from 'next/navigation'

export const revalidate = 60

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  // Chercher par slug OU par id
  let { data: article } = await supabase.from('articles').select('*')
    .eq('slug', params.slug).eq('status', 'published').single()

  if (!article) {
    const { data } = await supabase.from('articles').select('*')
      .eq('id', params.slug).eq('status', 'published').single()
    article = data
  }

  if (!article) return notFound()

  // Articles récents
  const { data: recents } = await supabase.from('articles').select('id, title, slug, image_url, created_at')
    .eq('status', 'published').neq('id', article.id).order('created_at', { ascending: false }).limit(3)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero image */}
      {article.image_url && (
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link href="/actualites" className="inline-flex items-center gap-2 text-vert hover:underline text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Retour aux actualités
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border p-8">
          {/* Meta */}
          <div className="flex flex-wrap gap-3 mb-4">
            {article.category && (
              <span className="flex items-center gap-1 text-xs bg-vert-50 text-vert px-3 py-1 rounded-full font-semibold">
                <Tag className="w-3 h-3" /> {article.category}
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              {new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {article.author && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <User className="w-3 h-3" /> {article.author}
              </span>
            )}
          </div>

          <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          <div className="prose prose-green max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {article.content}
          </div>
        </div>

        {/* Articles récents */}
        {recents && recents.length > 0 && (
          <div className="mt-10">
            <h2 className="font-heading text-xl font-bold text-gray-900 mb-5">Autres articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recents.map((a: any) => (
                <Link key={a.id} href={`/actualites/${a.slug || a.id}`}
                  className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
                  {a.image_url && <img src={a.image_url} alt={a.title} className="w-full h-28 object-cover rounded-lg mb-3" />}
                  <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">{a.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{new Date(a.created_at).toLocaleDateString('fr-FR')}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
