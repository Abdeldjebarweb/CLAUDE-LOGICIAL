'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Megaphone } from 'lucide-react'

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<any>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    supabase.from('site_settings')
      .select('*')
      .in('key', ['announcement_text', 'announcement_active', 'announcement_color'])
      .then(({ data }) => {
        if (!data) return
        const obj: Record<string, string> = {}
        data.forEach((r: any) => { obj[r.key] = r.value })
        if (obj.announcement_active === 'true' && obj.announcement_text) {
          setAnnouncement(obj)
        }
      })
  }, [])

  if (!announcement || dismissed) return null

  const bg = announcement.announcement_color || 'vert'
  const bgClass = bg === 'rouge' ? 'bg-rouge' : bg === 'yellow' ? 'bg-yellow-500' : 'bg-vert'

  return (
    <div className={`${bgClass} text-white py-2.5 px-4 relative`}>
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm font-medium">
        <Megaphone className="w-4 h-4 flex-shrink-0" />
        <span>{announcement.announcement_text}</span>
        <button onClick={() => setDismissed(true)} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
