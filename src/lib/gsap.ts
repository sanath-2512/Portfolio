import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ScrollTrigger is driven manually from the Lenis scroll callback, so lag
// smoothing must be off or the two disagree after a stall.
gsap.ticker.lagSmoothing(0)

export { gsap, ScrollTrigger }
