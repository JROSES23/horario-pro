/**
 * WeeklySchedule
 *
 * iOS-inspired glass weekly schedule component.
 * Requires Tailwind CSS v3+ with the following plugins/config:
 *   - backdrop-blur enabled (default in v3)
 *   - extended bg-opacity and border-opacity utilities
 *
 * Usage:
 *   import { WeeklySchedule } from '@/components/schedule/WeeklySchedule'
 *   import renatoData from '@/data/schedules/renato_schedule.json'
 *   <WeeklySchedule data={renatoData} />
 */

import React from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type BlockType = 'clase' | 'practica' | 'lab' | 'tut' | 'libre'

export interface ScheduleBlock {
  block:       number
  start_time:  string
  end_time:    string
  subject:     string
  code?:       string
  type:        BlockType
  room?:       string | null
  notes?:      string | null
}

export interface ScheduleData {
  owner:    string
  career:   string
  source?:  string
  semester: string
  time_blocks: Record<string, { start: string; end: string; label?: string }>
  week: {
    monday:    ScheduleBlock[]
    tuesday:   ScheduleBlock[]
    wednesday: ScheduleBlock[]
    thursday:  ScheduleBlock[]
    friday:    ScheduleBlock[]
    saturday?: ScheduleBlock[]
  }
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS = [
  { key: 'monday'    as const, label: 'Lunes'     },
  { key: 'tuesday'   as const, label: 'Martes'    },
  { key: 'wednesday' as const, label: 'Miércoles' },
  { key: 'thursday'  as const, label: 'Jueves'    },
  { key: 'friday'    as const, label: 'Viernes'   },
]

/** Ordered lecture block numbers (skips ALM / lunch) */
const BLOCK_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const BLOCK_RANGES: Record<number, string> = {
  1:  '08:30–09:30',
  2:  '09:40–10:40',
  3:  '10:50–11:50',
  4:  '12:00–13:00',
  5:  '14:30–15:30',
  6:  '15:40–16:40',
  7:  '16:50–17:50',
  8:  '18:00–19:00',
  9:  '19:10–20:10',
  10: '20:20–21:20',
}

// ─── Subject colour tokens (Tailwind utility strings) ─────────────────────────

const SUBJECT_STYLES: Record<string, { card: string; text: string; badge: string }> = {
  'Álgebra': {
    card:  'bg-indigo-50/90  border-indigo-200/60  shadow-indigo-100/40',
    text:  'text-indigo-800',
    badge: 'bg-indigo-100    text-indigo-600',
  },
  'Fund. Cálculo': {
    card:  'bg-violet-50/90  border-violet-200/60  shadow-violet-100/40',
    text:  'text-violet-800',
    badge: 'bg-violet-100    text-violet-600',
  },
  'Int. a la Química': {
    card:  'bg-emerald-50/90 border-emerald-200/60 shadow-emerald-100/40',
    text:  'text-emerald-800',
    badge: 'bg-emerald-100   text-emerald-600',
  },
  'Ing. y Sociedad': {
    card:  'bg-amber-50/90   border-amber-200/60   shadow-amber-100/40',
    text:  'text-amber-900',
    badge: 'bg-amber-100     text-amber-700',
  },
  'Hab. Com. en Inglés': {
    card:  'bg-rose-50/90    border-rose-200/60    shadow-rose-100/40',
    text:  'text-rose-800',
    badge: 'bg-rose-100      text-rose-600',
  },
}

const FALLBACK_STYLE = {
  card:  'bg-white/80 border-slate-200/60 shadow-slate-100/40',
  text:  'text-slate-800',
  badge: 'bg-slate-100 text-slate-500',
}

function subjectStyle(subject: string) {
  return SUBJECT_STYLES[subject] ?? FALLBACK_STYLE
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ClassCardProps {
  block: ScheduleBlock
}

function ClassCard({ block }: ClassCardProps) {
  const s = subjectStyle(block.subject)

  return (
    <div
      className={[
        'rounded-xl border px-3 py-2.5',
        'backdrop-blur-sm shadow-sm',
        'transition-shadow duration-150 hover:shadow-md',
        s.card,
      ].join(' ')}
    >
      {/* Subject name */}
      <p className={`text-[0.72rem] font-semibold leading-snug ${s.text}`}>
        {block.subject}
      </p>

      {/* Room */}
      {block.room && (
        <p className="mt-1 text-[0.62rem] text-slate-400 font-medium">
          {block.room}
        </p>
      )}

      {/* Code badge */}
      {block.code && (
        <span
          className={[
            'mt-1.5 inline-block rounded-md px-1.5 py-0.5',
            'text-[0.58rem] font-semibold tracking-wide',
            s.badge,
          ].join(' ')}
        >
          {block.code}
        </span>
      )}

      {/* Notes (e.g. "virtual") */}
      {block.notes && (
        <p className="mt-0.5 text-[0.58rem] italic text-slate-400">
          {block.notes}
        </p>
      )}
    </div>
  )
}

interface TimeColumnProps {
  blockNum: number
  isLunchAfter?: boolean
}

function TimeLabel({ blockNum }: TimeColumnProps) {
  return (
    <div className="flex flex-col items-end pr-3 py-1 select-none min-w-[72px]">
      <span className="text-[0.68rem] font-bold text-slate-400">
        {blockNum}°
      </span>
      <span className="text-[0.6rem] text-slate-300 tabular-nums">
        {BLOCK_RANGES[blockNum]}
      </span>
    </div>
  )
}

interface LunchDividerProps {
  colSpan: number
}

function LunchDivider() {
  return (
    <div className="col-span-full flex items-center gap-3 px-2 py-1.5">
      <div className="flex-1 h-px bg-slate-200/60" />
      <span className="text-[0.65rem] text-slate-300 font-medium tracking-widest uppercase">
        Almuerzo · 13:10–14:10
      </span>
      <div className="flex-1 h-px bg-slate-200/60" />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface WeeklyScheduleProps {
  data: ScheduleData
  /** Highlight today's column. Defaults to true. */
  highlightToday?: boolean
}

export function WeeklySchedule({ data, highlightToday = true }: WeeklyScheduleProps) {
  // Build lookup: day → blockNum → ScheduleBlock | undefined
  const lookup = React.useMemo(() => {
    const map: Record<string, Record<number, ScheduleBlock>> = {}
    for (const day of DAYS) {
      map[day.key] = {}
      for (const blk of data.week[day.key] ?? []) {
        map[day.key][blk.block] = blk
      }
    }
    return map
  }, [data])

  // Determine which block rows to show (skip rows where all days are empty)
  const activeBlocks = BLOCK_NUMS.filter(bn =>
    DAYS.some(d => lookup[d.key][bn] !== undefined)
  )

  // Today detection
  const todayIdx = highlightToday
    ? new Date().getDay() - 1  // Mon=0 … Fri=4, else -1 (Sat/Sun)
    : -1

  return (
    <div className="w-full font-sans antialiased">
      {/* ── Header card ──────────────────────────────────────── */}
      <div
        className={[
          'mb-5 flex items-center justify-between',
          'rounded-2xl border border-white/60 bg-white/70',
          'backdrop-blur-xl px-5 py-4 shadow-sm',
        ].join(' ')}
      >
        <div>
          <h2 className="text-base font-bold text-slate-800">{data.owner}</h2>
          <p className="text-xs text-slate-400 mt-0.5">{data.career}</p>
        </div>
        <div className="text-right">
          <span
            className={[
              'inline-block rounded-full px-3 py-1',
              'text-[0.7rem] font-semibold',
              'bg-slate-100 text-slate-500',
            ].join(' ')}
          >
            {data.semester}
          </span>
        </div>
      </div>

      {/* ── Grid container ───────────────────────────────────── */}
      <div
        className={[
          'rounded-2xl border border-white/60 bg-white/40',
          'backdrop-blur-xl shadow-sm overflow-hidden',
        ].join(' ')}
      >
        {/* ── Column headers ───────────────────────────────── */}
        <div
          className="grid border-b border-slate-100"
          style={{ gridTemplateColumns: '72px repeat(5, 1fr)' }}
        >
          {/* Time column header */}
          <div className="border-r border-slate-100 py-3" />

          {DAYS.map((day, i) => {
            const isToday = i === todayIdx
            return (
              <div
                key={day.key}
                className={[
                  'py-3 text-center',
                  i < DAYS.length - 1 ? 'border-r border-slate-100' : '',
                  isToday ? 'bg-indigo-50/60' : '',
                ].join(' ')}
              >
                <span
                  className={[
                    'text-[0.68rem] font-semibold uppercase tracking-wider',
                    isToday ? 'text-indigo-500' : 'text-slate-400',
                  ].join(' ')}
                >
                  {day.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* ── Rows ─────────────────────────────────────────── */}
        {activeBlocks.map((bn, rowIdx) => {
          const isAfterLunch = bn === 5 && activeBlocks.includes(4)
          const isNightBlock  = bn >= 8

          return (
            <React.Fragment key={bn}>
              {/* Lunch divider between block 4 and 5 */}
              {bn === 5 && (
                <div
                  className="grid border-b border-slate-100/80 bg-slate-50/40"
                  style={{ gridTemplateColumns: '72px repeat(5, 1fr)' }}
                >
                  <div className="col-span-full flex items-center gap-3 px-4 py-2">
                    <div className="h-px flex-1 bg-slate-200/70" />
                    <span className="text-[0.62rem] font-medium uppercase tracking-widest text-slate-300">
                      Almuerzo · 13:10–14:10
                    </span>
                    <div className="h-px flex-1 bg-slate-200/70" />
                  </div>
                </div>
              )}

              {/* Night gap before block 8 */}
              {bn === 8 && (
                <div
                  className="grid border-b border-slate-100/80 bg-slate-50/40"
                  style={{ gridTemplateColumns: '72px repeat(5, 1fr)' }}
                >
                  <div className="col-span-full flex items-center gap-3 px-4 py-2">
                    <div className="h-px flex-1 bg-slate-200/70" />
                    <span className="text-[0.62rem] font-medium uppercase tracking-widest text-slate-300">
                      17:50–18:00
                    </span>
                    <div className="h-px flex-1 bg-slate-200/70" />
                  </div>
                </div>
              )}

              {/* Block row */}
              <div
                className={[
                  'grid',
                  rowIdx < activeBlocks.length - 1 ? 'border-b border-slate-100/80' : '',
                  isNightBlock ? 'bg-slate-50/30' : '',
                ].join(' ')}
                style={{ gridTemplateColumns: '72px repeat(5, 1fr)' }}
              >
                {/* Time label */}
                <div className="flex flex-col items-end justify-center border-r border-slate-100 px-3 py-2 select-none">
                  <span className="text-[0.67rem] font-bold text-slate-400">{bn}°</span>
                  <span className="text-[0.57rem] text-slate-300 tabular-nums leading-tight mt-0.5">
                    {BLOCK_RANGES[bn]}
                  </span>
                </div>

                {/* Day cells */}
                {DAYS.map((day, i) => {
                  const blk     = lookup[day.key][bn]
                  const isToday = i === todayIdx

                  return (
                    <div
                      key={day.key}
                      className={[
                        'relative p-1.5',
                        i < DAYS.length - 1 ? 'border-r border-slate-100/80' : '',
                        isToday ? 'bg-indigo-50/30' : '',
                      ].join(' ')}
                      style={{ minHeight: '58px' }}
                    >
                      {blk ? (
                        <ClassCard block={blk} />
                      ) : (
                        // Empty cell — invisible placeholder
                        <div className="h-full min-h-[46px]" />
                      )}
                    </div>
                  )
                })}
              </div>
            </React.Fragment>
          )
        })}
      </div>

      {/* ── Legend ───────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap gap-2 px-1">
        {Object.entries(SUBJECT_STYLES).map(([subject, s]) => (
          <span
            key={subject}
            className={[
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1',
              'text-[0.67rem] font-medium border backdrop-blur-sm',
              s.card, s.text,
            ].join(' ')}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full opacity-60"
              style={{ background: 'currentColor' }}
            />
            {subject}
          </span>
        ))}
      </div>
    </div>
  )
}

export default WeeklySchedule
