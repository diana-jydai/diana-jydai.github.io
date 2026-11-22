import { useEffect, useRef, useState } from 'react'
import profileImg from './dai-profile.png'
import iscasImg from './iscas.jpg'
import ipfaImg from './ipfa.jpg'
import icmlImg from './icml.jpg'
import tmlrImg from './tmlr.jpg'
import cmtnetImg from './cmtnet.jpg'
import fdmvgclImg from './fdmvgcl.jpg'
import governedImg from './governed.jpg'
import polarflowImg from './polarflow.jpg'
import sensorImg from './sensor.jpg'
import spectralImg from './spectral.jpg'
import iscasPaper from './ISCAS2026_ICNet_for_Mutimodal_PCB_Image_Analysis.pdf'
import icmlPaper from './2509.pdf'
import tmlrPaper from './6809.pdf'

// Monochrome icons (inherit currentColor)
const EmailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2.5" />
    <path d="m3.5 7 8.5 6.5L20.5 7" />
  </svg>
)

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 10.5V16M8 7.8v.1M12 16v-5.5M12 13c0-1.7 1-2.6 2.4-2.6S17 11.300 17 13v3" />
  </svg>
)

const ScholarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 4 2.5 9 12 14l9.5-5L12 4Z" />
    <path d="M6 11.500V16c0 1.200 2.700 2.500 6 2.500s6-1.300 6-2.500v-4.500" />
  </svg>
)

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.500v2M12 19.500v2M2.500 12h2M19.500 12h2M5.300 5.300l1.400 1.400M17.300 17.300l1.400 1.400M5.300 18.700l1.400-1.400M17.300 6.700l1.400-1.400" />
  </svg>
)

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 14.500A8.500 8.500 0 0 1 9.500 4 8.500 8.500 0 1 0 20 14.500Z" />
  </svg>
)

/** Drifting graph of nodes/edges behind the hero; nodes are pulled toward the cursor. */
function NetworkCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const parent = canvas.parentElement!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mouse = { x: -9999, y: -9999 }
    let w = 0
    let h = 0
    let raf = 0
    let visible = true
    type Node = { x: number; y: number; vx: number; vy: number; r: number }
    let nodes: Node[] = []

    const colors = () => {
      const light = document.documentElement.dataset.theme === 'light'
      return light
        ? { node: '10,143,104', edge: '36,87,214', a: 0.55 }
        : { node: '124,245,200', edge: '106,166,255', a: 0.5 }
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = parent.clientWidth
      h = parent.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(70, Math.max(26, (w * h) / 14000)))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 1.2 + Math.random() * 1.8,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const c = colors()
      const link = 130
      for (const n of nodes) {
        if (!reduce) {
          n.x += n.vx
          n.y += n.vy
          if (n.x < 0 || n.x > w) n.vx *= -1
          if (n.y < 0 || n.y > h) n.vy *= -1
          const dx = mouse.x - n.x
          const dy = mouse.y - n.y
          const d = Math.hypot(dx, dy)
          if (d < 180 && d > 1) {
            n.x += (dx / d) * 0.35
            n.y += (dy / d) * 0.35
          }
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y)
          if (d < link) {
            ctx.strokeStyle = `rgba(${c.edge},${(1 - d / link) * 0.35})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${c.node},${c.a})`
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = () => {
      if (visible) draw()
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
    }
    const onLeave = () => {
      mouse.x = mouse.y = -9999
    }
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(parent)

    resize()
    if (reduce) draw()
    else raf = requestAnimationFrame(loop)
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} className="net-canvas" aria-hidden="true" />
}

/** Fades sections in as they scroll into view. */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.08 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'light' || saved === 'dark') return saved
    } catch {
      /* storage unavailable */
    }
    return 'dark'
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))] as const
}

type NewsItem = {
  date: string
  text: string
}

type Publication = {
  title: string
  authors: string
  venue: string
  year: string
  image?: string
  links: Array<{ label: string; href: string }>
}

type Pendings = {
  title: string
  authors: string
  venue: string
  year: string
  image?: string
  links: Array<{ label: string; href: string }>
}

type Content = {
  siteTitle: string
  nav: {
    bio: string
    news: string
    publications: string
    pendings: string
    education: string
    contact: string
  }
  bioSection: {
    name: string
    title: string
    subtitle: string
    tagline: string
    interests: string[]
    affiliation: string
    mentor: string
    bio: string[]
  }
  news: NewsItem[]
  publications: {
    helper: string
    items: Publication[]
  }
  pendings: {
    helper: string
    items: Pendings[]
  }
  education: Array<{ period: string; title: string; description: string }>
  contact: {
    description: string
    links: Array<{ label: string; href: string }>
    email: string
    linkedin: string
    scholarLabel: string
    scholarHref: string
}
}

const content: Content = {
  siteTitle: 'Jingyang Dai 戴婧扬',
  nav: {
    bio: '',
    news: 'News',
    publications: 'Publications',
    pendings: 'Pendings',
    education: 'Education',
    contact: 'Contact',
  },
  bioSection: {
    name: 'Dai, Jingyang 戴婧扬',
    title: 'Ph.D. student @ NTU CCDS',
    subtitle: '',
    tagline: 'Research on multi-agent and recursive self-improvement/self-evolving AI systems.',
    interests: ['Self-evolving agents', 'Flow matching', 'Graph'],
    affiliation: '',
    mentor: '',
    bio: [
      'Hi there,',
      'I am currently a Ph.D. student at College of Computing and Data Science (CCDS) at Nanyang Technological University (NTU) supervised by <a href="https://scholar.google.com/citations?user=_Pvgwd0AAAAJ&hl=en" target="_blank" rel="noreferrer">Professor Liu Yang</a>. Previously, I was a Research Assistant/Project Officer in <a href="https://scholar.google.com/citations?user=BkCI7rEAAAAJ&hl=en" target="_blank" rel="noreferrer">Professor Tay Wee Peng</a>’s SIGNAL Group at NTU EEE, where I was co-supervised by <a href="https://scholar.google.com/citations?user=EA0VBD8AAAAJ&hl=en" target="_blank" rel="noreferrer">Dr. Ji Feng</a> doing ML and DL studies. Before that, during my undergraduate studies, I began my research journey at Temasek Laboratories @ NTU under <a href="https://scholar.google.com/citations?user=CUXiyR0AAAAJ&hl=en" target="_blank" rel="noreferrer">Professor Gwee Bah Hwee</a> and <a href="https://scholar.google.com/citations?user=F4ybyyIAAAAJ&hl=en" target="_blank" rel="noreferrer">Dr. Cheng Deruo</a>.',
    ],
  },
  news: [
    { date: '2026-09', text: 'One paper (Adaptive Multi-view Graph Contrastive Learning via Fractional-order Neural Diffusion Networks) was accepted to NeurIPS 2026.' },
    { date: '2026-09', text: 'One paper (Less is More: Towards Simple Graph Contrastive Learning) was accepted to NeurIPS 2026.' },
    { date: '2026-09', text: 'One paper (CMT-Net: Cross-Modal Multi-Task Learning for Automated Inspection of Integrated Circuits in Printed Circuit Boards) was accepted to IEEE Transactions on Circuits and Systems I: Regular Papers (TCAS-I).' },
    { date: '2026-08', text: 'Started my Ph.D. journey at NTU CCDS.' },
    { date: '2026-04', text: 'One paper (Explainable Error Detection in Integrated Circuits Image Segmentation via Graph Neural Networks) was accepted to Transactions on Machine Learning Research (TMLR).' },
    { date: '2026-01', text: 'Invited talk at Nanhua Futures & Davos Global Shapers Community on "Three key elements of AI".' },
    { date: '2026-01', text: 'One paper (ICNet) was accepted to IEEE ISCAS 2026.' },
    { date: '2025-07', text: 'Joined NTU SIGNAL group as a Project Officer.' },
    { date: '2025-07', text: 'Graduated from NTU with B.Eng. (Hons Distinction), minor in Design and System Thinking.' },
    { date: '2024-07', text: 'One paper (PCB surface component detection with computer vision assisted label generation) was accepted to IEEE IPFA 2024.' },
  ],
  publications: {
  helper: '',
  items: [
    {
      title: 'Less is More: Towards Simple Graph Contrastive Learning',
      authors:
        'Yanan Zhao, Feng Ji, Jingyang Dai, Jiaze Ma, and Wee Peng Tay',
      venue: 'Conference on Neural Information Processing Systems (NeurIPS)',
      year: '2026',
      image: icmlImg,
      links: [
        { label: 'Paper', href: icmlPaper },
        { label: 'arXiv', href: 'https://arxiv.org/abs/2509.25742' },
        { label: 'Code', href: 'https://github.com/YananZhao0630/BackToBasics-GCL' },
      ],
    },
    {
      title: 'Adaptive Multi-view Graph Contrastive Learning via Fractional-order Neural Diffusion Networks',
      authors:
        'Yanan Zhao, Feng Ji, Jingyang Dai, Jiaze Ma, Keyue Jiang, Kai Zhao, and Wee Peng Tay',
      venue: 'Conference on Neural Information Processing Systems (NeurIPS)',
      year: '2026',
      image: fdmvgclImg,
      links: [
        { label: 'arXiv', href: 'https://arxiv.org/abs/2511.06216' },
        { label: 'Code', href: 'https://github.com/YananZhao0630/FD-MVGCL' },
      ],
    },
    {
      title: 'From Algorithms to Agents: A Survey of LLM-Based Trading Systems',
      authors: 'Yebo Feng, Yichen Luo, Jingyang Dai, Chien-Chih Chen, Guangyan Gan, Jiahua Xu, Lin William Cong, Yang Liu',
      venue: 'SSRN 7610285',
      year: '2026',
      links: [{ label: 'SSRN', href: 'https://papers.ssrn.com/abstract=7610285' }],
    },
    {
      title: 'CMT-Net: Cross-Modal Multi-Task Learning for Automated Inspection of Integrated Circuits in Printed Circuit Boards',
      authors:
        'Xinrui Wang, Jingyang Dai, Deruo Cheng, Feng Ji, Yiqiong Shi, Bah Hwee Gwee',
      venue: 'IEEE Transactions on Circuits and Systems I: Regular Papers',
      year: '2026',
      image: cmtnetImg,
      links: [],
    },
    {
      title: 'Explainable Error Detection in Integrated Circuits Image Segmentation via Graph Neural Networks',
      authors:
        'Xiaoyu Ma, Jingyang Dai, Feng Ji, Deruo Cheng, Yiqiong Shi, Bah Hwee Gwee',
      venue: 'Transactions on Machine Learning Research (TMLR)',
      year: '2026',
      image: tmlrImg,
      links: [
        { label: 'Paper', href: tmlrPaper },
      ],
    },
    {
      title: 'ICNet: Cross-Modality Image Analysis for IC Localization in Printed Circuit Boards',
      authors:
        'Jingyang Dai, Deruo Cheng, Xinrui Wang, Feng Ji, Yiqiong Shi, and Bah-Hwee Gwee',
      venue: 'IEEE International Symposium on Circuits and Systems (ISCAS)',
      year: '2026',
      image: iscasImg,
      links: [
        { label: 'Paper', href: iscasPaper },
      ],
    },
    {
      title: 'PCB surface component detection with computer vision assisted label generation',
      authors:
        'Deruo Cheng, Jingyang Dai, Yee-Yang Tee, Yiqiong Shi, Bah-Hwee Gwee',
      venue: 'IEEE International Symposium on the Physical and Failure Analysis of Integrated Circuits (IPFA)',
      year: '2024',
      image: ipfaImg,
      links: [
        { label: 'Paper', href: 'https://dr.ntu.edu.sg/server/api/core/bitstreams/ef21bd9b-81cb-4bb7-aee7-092b11a07b52/content' },
      ],
    },
  ],
},
  pendings: {
  helper: '',
  items: [
    {
      title: 'PolarFlow: Spectral Geometric Flow Matching for Directed Graph Generation via Polar Decomposition',
      authors:
        'Yanan Zhao, Feng Ji, Alba Carballo-Castro, Jingyang Dai, Antonio Ortega, Pascal Frossard, Wee Peng Tay',
      venue: 'arXiv preprint arXiv:2610.41471',
      year: '2026',
      image: polarflowImg,
      links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2610.41471' }],
    },
    {
      title: 'Graph Spectral Series and Its Signatures',
      authors:
        'Feng Ji, Jingyang Dai, Apostolos Evangelidis, Xingchao Jian, Marco Rauscher, Alexander Schell',
      venue: 'arXiv preprint arXiv:2610.33348',
      year: '2026',
      image: spectralImg,
      links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2610.33348' }],
    },
    {
      title: 'Governed Self-Evolution for Autonomous Investing: A Multi-Agent LLM System with an Invariant Core',
      authors: 'Yebo Feng, Jingyang Dai, Liangrui Pan, Nelson Lau, Jiahua Xu, Yang Liu',
      venue: 'arXiv preprint arXiv:2610.30557',
      year: '2026',
      image: governedImg,
      links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2610.30557' }],
    },
    {
      title: 'Optimal Sensor Placement via Graph-constrained Flow Matching',
      authors: 'Feng Ji, Jingyang Dai, Wee Peng Tay, Sirajudeen Gulam Razul',
      venue: 'arXiv preprint arXiv:2607.19831',
      year: '2026',
      image: sensorImg,
      links: [{ label: 'arXiv', href: 'https://arxiv.org/abs/2607.19831' }],
    },
  ],
},
  education: [
    {
      period: '2021-2025',
      title: 'B.E. in Electrical and Electronic Engineering with Honors (Distinction), Minor in Design and System Thinking, Nanyang Technological University',
      description: 'CGPA: 4.30/5.00',
    },
  ],
  contact: {
    description: 'For more details, please visit the links below.',
    links: [
        { label: 'SIGNAL Members Page', href: 'https://wptay.github.io/members.html' },
    ],
    email: 'daij0019@e.ntu.edu.sg / jingyang.dai@ntu.edu.sg',
    linkedin: 'https://www.linkedin.com/in/jingyangdai',
    scholarLabel: 'Google Scholar',
    scholarHref: 'https://scholar.google.com/citations?hl=en&user=WX_382IAAAAJ',
  },
}

function venueBadge(venue: string): { label: string } {
  if (venue.includes('NeurIPS')) return { label: 'NeurIPS' }
  const acronym = venue.match(/\(([^)]+)\)/)
  if (acronym) return { label: acronym[1] }
  if (venue.startsWith('arXiv')) return { label: 'arXiv' }
  if (venue.startsWith('SSRN')) return { label: 'SSRN' }
  if (venue.includes('Transactions')) return { label: 'Journal' }
  return { label: 'Paper' }
}

function PublicationCard({ item }: { item: Publication }) {
  const badge = venueBadge(item.venue)
  return (
    <article className={`pub reveal ${item.image ? '' : 'no-img'}`}>
      {item.image && (
        <div className="pub-thumb">
          <img src={item.image} alt={item.title} loading="lazy" />
        </div>
      )}
      <div className="pub-body">
        <div className="pub-top">
          <span className="badge mono">{badge.label}</span>
          <span className="mono" style={{ color: 'var(--text-faint)' }}>
            {item.year}
          </span>
        </div>
        <h3>{item.title}</h3>
        <p className="authors">{item.authors}</p>
        <p className="venue">{item.venue}</p>
        {item.links.length > 0 && (
          <div className="links">
            {item.links.map((link) => (
              <a key={link.label + link.href} className="pill" href={link.href} target="_blank" rel="noreferrer">
                {link.label}
                <ArrowIcon />
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

function SectionHead({ idx, title }: { idx: string; title: string }) {
  return (
    <div className="section-head reveal">
      <span className="idx mono">{idx}</span>
      <h2>{title}</h2>
      <span className="rule" />
    </div>
  )
}

/** A little calico cat that runs along the bottom of the screen as the page scrolls. */
function Cat() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let last = window.scrollY
    let timer = 0

    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      const track = Math.max(0, window.innerWidth - el.offsetWidth - 32)
      el.style.setProperty('--x', `${16 + progress * track}px`)

      const dy = window.scrollY - last
      if (dy !== 0) {
        last = window.scrollY
        el.classList.toggle('flip', dy < 0)
        if (!reduce) {
          el.classList.add('running')
          window.clearTimeout(timer)
          timer = window.setTimeout(() => el.classList.remove('running'), 180)
        }
      }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div ref={ref} className="cat" aria-hidden="true">
      <div className="cat-flip">
        <svg viewBox="0 0 100 70" width="100%" role="presentation">
          <defs>
            <filter id="cat-fur" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.6" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <clipPath id="cat-body-clip">
              <ellipse cx="48" cy="42" rx="28" ry="17" />
            </clipPath>
            <clipPath id="cat-head-clip">
              <circle cx="72" cy="34" r="18" />
            </clipPath>
          </defs>
          <ellipse cx="50" cy="64.500" rx="34" ry="3.500" fill="rgba(0,0,0,0.3)" />
          <g className="cat-bob">
            <g filter="url(#cat-fur)" stroke="#b9a58f" strokeOpacity="0.55" strokeWidth="1">
              <rect className="leg leg-a" x="25" y="49" width="10" height="15" rx="5" fill="#fffaf0" />
              <rect className="leg leg-b" x="36" y="49" width="10" height="15" rx="5" fill="#fffaf0" />
              <path className="cat-tail" d="M22 46 C6 48 4 26 14 18" fill="none" stroke="#f0a050" strokeWidth="10" strokeLinecap="round" strokeOpacity="1" />
              <path className="cat-tail" d="M22 46 C6 48 4 26 14 18" pathLength="100" strokeDasharray="0 84 16" fill="none" stroke="#fffaf0" strokeWidth="10.500" strokeLinecap="round" strokeOpacity="1" />
              <ellipse cx="48" cy="42" rx="28" ry="17" fill="#fffaf0" />
              <g clipPath="url(#cat-body-clip)" stroke="none">
                <ellipse cx="44" cy="30" rx="17" ry="11" fill="#f0a050" />
                <ellipse cx="26" cy="47" rx="10" ry="13" fill="#3a3340" />
                <ellipse cx="58" cy="54" rx="6" ry="4" fill="#f0a050" />
              </g>
              <rect className="leg leg-b" x="56" y="49" width="10" height="15" rx="5" fill="#fffaf0" />
              <rect className="leg leg-a" x="67" y="49" width="10" height="15" rx="5" fill="#fffaf0" />
              <path d="M58 24 60 6 75 18Z" fill="#f0a050" stroke="#f0a050" strokeWidth="3" strokeLinejoin="round" strokeOpacity="1" />
              <path d="M70 18 84 6 89 26Z" fill="#3a3340" stroke="#3a3340" strokeWidth="3" strokeLinejoin="round" strokeOpacity="1" />
              <path d="M62 19 62.500 12 68 17Z" fill="#f7b3b3" stroke="#f7b3b3" strokeWidth="1.500" strokeLinejoin="round" strokeOpacity="1" />
              <path d="M77 17 83 12 84.500 21Z" fill="#f7b3b3" stroke="#f7b3b3" strokeWidth="1.500" strokeLinejoin="round" strokeOpacity="1" />
              <path d="M54 34 49 33 52.500 37 48 39 53 40Z" fill="#fffaf0" />
              <path d="M90 34 95 33 91.500 37 96 39 91 40Z" fill="#fffaf0" />
              <circle cx="72" cy="34" r="18" fill="#fffaf0" />
              <g clipPath="url(#cat-head-clip)" stroke="none">
                <path d="M52 14 69 14 66 30 56 36 50 30Z" fill="#f0a050" />
                <path d="M76 14 94 14 94 36 84 30Z" fill="#3a3340" />
              </g>
            </g>
            <g className="cat-eyes">
              <ellipse cx="65" cy="36" rx="3" ry="3.600" fill="#2a2430" />
              <ellipse cx="80" cy="36" rx="3" ry="3.600" fill="#2a2430" />
              <circle cx="64" cy="34.600" r="1.200" fill="#fff" />
              <circle cx="79" cy="34.600" r="1.200" fill="#fff" />
              <circle cx="66.200" cy="37.600" r="0.600" fill="#fff" />
              <circle cx="81.200" cy="37.600" r="0.600" fill="#fff" />
            </g>
            <ellipse cx="60" cy="42.500" rx="3.600" ry="2.200" fill="#f7a8a8" opacity="0.6" />
            <ellipse cx="85" cy="42.500" rx="3.600" ry="2.200" fill="#f7a8a8" opacity="0.6" />
            <path d="M71 40.500h3l-1.500 1.800Z" fill="#f08a9a" stroke="#f08a9a" strokeWidth="0.800" strokeLinejoin="round" />
            <path d="M72.500 42.300q-2.200 3-4.800 0.300M72.500 42.300q2.200 3 4.800 0.300" fill="none" stroke="#7a5a52" strokeWidth="1" strokeLinecap="round" />
            <g stroke="#7a5a52" strokeOpacity="0.45" strokeWidth="0.7" strokeLinecap="round">
              <path d="M57 40 49 38.500M57 42 50 43M88 40 96 38.500M88 42 95 43" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}

function App() {
  const [theme, toggleTheme] = useTheme()
  useReveal()

  useEffect(() => {
    document.documentElement.lang = 'en'
    document.title = 'Jingyang Dai — Ph.D. Student, NTU CCDS'
  }, [])

  const emails = content.contact.email.split('/').map((e) => e.trim()).filter(Boolean)
  const aboutParagraphs = content.bioSection.bio.filter((p) => p.length > 24)

  return (
    <>
      <nav className="nav">
        <div className="shell nav-inner">
          <a href="#top" className="brand">
            <span className="brand-mark">JD</span>
            {content.siteTitle.split(' ').slice(0, 2).join(' ')}
          </a>
          <div className="nav-links">
            <a href="#about"><span>01</span>About</a>
            <a href="#news"><span>02</span>{content.nav.news}</a>
            <a href="#publications"><span>03</span>{content.nav.publications}</a>
            <a href="#education"><span>04</span>{content.nav.education}</a>
            <a href="#contact"><span>05</span>{content.nav.contact}</a>
            <button
              type="button"
              className="theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </nav>

      <header className="hero" id="top">
        <NetworkCanvas />
        <div className="shell hero-grid">
          <div>
            <div className="status mono">
              <i />
              {content.bioSection.title}
            </div>
            <h1>
              Jingyang Dai
              <span className="cn">戴婧扬</span>
            </h1>
            <p className="tagline">
              Building AI systems that <em>make work more efficient</em>.
            </p>
            <p className="role">{content.bioSection.tagline}</p>
            <div className="chips">
              {content.bioSection.interests.map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
            <div className="cta">
              <a className="btn primary" href="#publications">
                Read my papers
              </a>
              <a className="btn" href={content.contact.scholarHref} target="_blank" rel="noreferrer">
                <ScholarIcon />
                Scholar
              </a>
              <a className="btn" href={content.contact.linkedin} target="_blank" rel="noreferrer">
                <LinkedInIcon />
                LinkedIn
              </a>
              <a className="btn" href={`mailto:${emails[emails.length - 1]}`}>
                <EmailIcon />
                Email
              </a>
            </div>
          </div>

          <div className="portrait-wrap">
            <div className="portrait">
              <img src={profileImg} alt="Jingyang Dai" />
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="shell">
          <section id="about" className="section">
            <SectionHead idx="01" title="About" />
            <div className="about reveal">
              {aboutParagraphs.map((paragraph, idx) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
          </section>

          <section id="news" className="section">
            <SectionHead idx="02" title={content.nav.news} />
            <ul className="timeline reveal">
              {content.news.map((item) => (
                <li key={item.date + item.text}>
                  <time className="mono">{item.date}</time>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="publications" className="section">
            <SectionHead idx="03" title={content.nav.publications} />
            <div className="pubs">
              {content.publications.items.map((item) => (
                <PublicationCard key={item.title} item={item} />
              ))}
            </div>

            {content.pendings.items.length > 0 && (
              <div id="pendings">
                <div className="subhead mono">Preprints</div>
                <div className="pubs">
                  {content.pendings.items.map((item) => (
                    <PublicationCard key={item.title} item={item} />
                  ))}
                </div>
              </div>
            )}
          </section>

          <section id="education" className="section">
            <SectionHead idx="04" title={content.nav.education} />
            <div className="duo">
              {content.education.map((item) => (
                <article key={item.period + item.title} className="card reveal">
                  <span className="mono">{item.period}</span>
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="contact" className="section">
            <SectionHead idx="05" title={content.nav.contact} />
            <div className="card reveal">
              <p>{content.contact.description}</p>
              <div className="contact-list">
                {emails.map((e) => (
                  <a key={e} href={`mailto:${e}`}>
                    <EmailIcon />
                    {e}
                  </a>
                ))}
                <a href={content.contact.linkedin} target="_blank" rel="noreferrer">
                  <LinkedInIcon />
                  LinkedIn
                </a>
                <a href={content.contact.scholarHref} target="_blank" rel="noreferrer">
                  <ScholarIcon />
                  {content.contact.scholarLabel}
                </a>
                {content.contact.links
                  .filter((link) => link.label && link.href)
                  .map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                      <ArrowIcon />
                      {link.label}
                    </a>
                  ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer>
        <div className="shell mono">
          <span>© 2026 Jingyang Dai</span>
          <span>Nanyang Technological University</span>
        </div>
      </footer>
      <Cat />
    </>
  )
}

export default App
