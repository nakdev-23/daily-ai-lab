import Link from "next/link"
import Image from "next/image"
import { BookOpen, Target, FileText, Flame, Star, Check, Clock, ChevronRight } from "lucide-react"

const MISSIONS = [
  { icon: BookOpen, title: "เรียนจบบทเรียน 1 บท", xp: 20, current: 1, total: 1, done: true },
  { icon: Target, title: "ทำแบบฝึกหัดให้ได้ 80% ขึ้นไป", xp: 20, current: 0, total: 1, done: false },
  { icon: FileText, title: "อ่านเอกสาร 1 หน้า", xp: 10, current: 0, total: 1, done: false },
  { icon: Flame, title: "เรียนต่อเนื่องให้ครบ 7 วัน", xp: 50, current: 5, total: 7, done: false },
  { icon: Star, title: "เก็บแต้มรวม 300 แต้มวันนี้", xp: 30, current: 120, total: 300, done: false },
]

export default function MissionsPage() {
  return (
    <div className="max-w-[700px] mx-auto px-8 py-8">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">เป้าหมายวันนี้ <Target size={22} className="text-[#6B4EFF]" /></h1>
          <p className="text-sm text-gray-400 flex items-center gap-1.5"><Clock size={14} /> เริ่มนับใหม่อีก 18 ชม. 12 นาที</p>
        </div>
        <Image src="/assets/daily-ai-lab/mascot/cockatiel-avatar.png" alt="Mascot" width={64} height={64} className="ml-auto drop-shadow-md" />
      </div>

      <div className="space-y-4">
        {MISSIONS.map((m) => (
          <div key={m.title} className={`bg-white border rounded-2xl p-5 shadow-sm transition-all ${m.done ? "border-green-200 bg-green-50/30" : "border-[#ede9ff]"}`}>
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${m.done ? "bg-green-100 text-green-600" : "bg-[#f5f3ff] text-[#6B4EFF]"}`}>
                  {m.done ? <Check size={20} /> : <m.icon size={20} />}
                </div>
                <div>
                  <p className={`text-[14px] font-semibold ${m.done ? "text-gray-400 line-through" : "text-gray-800"}`}>{m.title}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">{m.current}/{m.total}</p>
                </div>
              </div>
              <span className={`text-[14px] font-bold shrink-0 ${m.done ? "text-green-500" : "text-[#6B4EFF]"}`}>+{m.xp} แต้ม</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${m.done ? "bg-green-400" : "bg-[#6B4EFF]"}`}
                style={{ width: `${Math.min((m.current / m.total) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/daily-learn/chatgpt-basics/2-2" className="flex-1 bg-[#6B4EFF] text-white text-sm font-bold py-3 rounded-xl text-center hover:bg-[#5535e8] transition-colors">
          <span className="inline-flex items-center justify-center gap-1">เริ่มเรียนเลย <ChevronRight size={16} /></span>
        </Link>
        <Link href="/dashboard" className="flex-1 bg-white border border-[#ede9ff] text-gray-600 text-sm font-medium py-3 rounded-xl text-center hover:bg-[#f5f3ff] transition-colors">
          กลับหน้าเรียน
        </Link>
      </div>
    </div>
  )
}
