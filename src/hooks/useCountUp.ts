import { useEffect, useState } from "react"

export function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)

    const timer = window.setInterval(() => {
      start += step
      if (start >= target) {
        setValue(target)
        window.clearInterval(timer)
      } else {
        setValue(Math.floor(start))
      }
    }, 16)

    return () => window.clearInterval(timer)
  }, [target, duration])

  return value
}
