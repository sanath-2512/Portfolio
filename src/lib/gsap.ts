import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

gsap.registerPlugin(ScrollTrigger, CustomEase)
CustomEase.create('expo.custom', 'M0,0 C0.16,1 0.3,1 1,1')

export { gsap, ScrollTrigger }
