/**
 * GSAP et ses plugins, enregistrés une seule fois pour tout le site.
 * (Depuis GSAP 3.13, tous les plugins sont gratuits.)
 */
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { Draggable } from 'gsap/Draggable'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, Draggable, InertiaPlugin, DrawSVGPlugin, useGSAP)

/** Respecte le réglage « réduire les animations » du système. */
export const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export { gsap, ScrollTrigger, SplitText, Draggable, useGSAP }
