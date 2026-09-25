import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// ScrollTrigger is driven from the Lenis scroll callback, so lag smoothing
// must be off or the two disagree after a stall.
gsap.ticker.lagSmoothing(0)

export { gsap, ScrollTrigger, SplitText }
