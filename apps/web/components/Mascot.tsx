"use client"

import Image from "next/image"
import { useState } from "react"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion"

const BASE = "/assets/daily-ai-lab/mascot"

export const POSES = {
  hero: `${BASE}/cockatiel-superhero.png`,
  avatar: `${BASE}/cockatiel-avatar.png`,
  wave: `${BASE}/cockatiel-wave.png`,
  thumbsup: `${BASE}/cockatiel-thumbsup.png`,
  fly: `${BASE}/cockatiel-fly.png`,
  laptop: `${BASE}/cockatiel-laptop.png`,
  celebrate: `${BASE}/cockatiel-celebrate.png`,
  reading: `${BASE}/cockatiel-reading.png`,
  sad: `${BASE}/cockatiel-sad.png`,
  ohno: `${BASE}/cockatiel-ohno.png`,
} as const

export type MascotPose = keyof typeof POSES

type Props = {
  pose?: MascotPose
  size?: number
  /** gentle vertical floating loop */
  float?: boolean
  /** periodic squash that reads as a blink/nod */
  blink?: boolean
  /** 3D parallax tilt toward the pointer */
  tilt?: boolean
  /** swap to this pose while hovered (e.g. "wave") */
  hoverPose?: MascotPose
  priority?: boolean
  className?: string
}

export default function Mascot({
  pose = "hero",
  size = 280,
  float = true,
  blink = true,
  tilt = false,
  hoverPose,
  priority = false,
  className = "",
}: Props) {
  const reduce = useReducedMotion()
  const [hovered, setHovered] = useState(false)

  // Pointer parallax tilt
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 150, damping: 15 })
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 150, damping: 15 })
  const x = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 150, damping: 18 })

  const activePose = hovered && hoverPose ? hoverPose : pose

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!tilt) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() {
    setHovered(false)
    mx.set(0)
    my.set(0)
  }

  // Idle float/blink is a pure-CSS compositor animation (cheap, smooth under load).
  const idleClass = !reduce && (float || blink) ? "mascot-idle" : ""

  return (
    <div
      className={`relative ${className}`}
      style={{ perspective: tilt ? 900 : undefined, width: size, height: size }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX: tilt ? rotateX : 0, rotateY: tilt ? rotateY : 0, x: tilt ? x : 0, transformStyle: "preserve-3d" }}
        className="w-full h-full"
      >
        <div className={`w-full h-full ${idleClass}`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePose}
              initial={{ opacity: 0, scale: 0.88, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="w-full h-full"
            >
              <Image
                src={POSES[activePose]}
                alt="Daily AI Lab Mascot"
                width={size}
                height={size}
                priority={priority}
                draggable={false}
                className="w-full h-full object-contain drop-shadow-2xl select-none pointer-events-none"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
