import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const revalidate = 60

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', params.slug)
    .eq('status', 'published')
    .single()

  if (!article) notFound()

  return (
    <article className="py-12 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <Link href="/actualites" className="inline-flex items-center gap-2 text-sm text-vert font-semibold mb-8 hover:gap-3 transition-all">
          <ArrowLeft className="w-4 h-4" /> Retour aux actualités
        </Link>
        {article.category && (
          <span className="inline-block text-xs font-semibold text-vert bg-vert-50 px-3 py-1 rounded-full mb-4">{article.category}</span>
        )}
        <h1 className="font-heading text-3xl lg:text-4xl font-bold text-gray-900">{article.title}</h1>
        <p className="text-sm text-gray-400 mt-3">
          {article.author && `Par ${article.author} · `}
          {new Date(article.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        {article.image_url && (
          <div className="mt-8 rounded-2xl overflow-hidden">
            <img src={article.image_url} alt={article.title} className="w-full aspect-[16/9] object-cover" />
          </div>
        )}
        <div className="mt-10 prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {article.content}
        </div>
      </div>
    </article>
  )
}
