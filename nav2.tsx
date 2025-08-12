import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, LogIn, User, Search as SearchIcon, ChevronDown } from 'lucide-react'

const links = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' }, // has submenu
    { name: 'Pricing', href: '#pricing' },
    { name: 'Docs', href: '#docs' } // has submenu
]

// Submenu data for desktop
const submenus: Record<string, { label: string; href: string; desc?: string }[]> = {
    Features: [
        { label: 'Starter Kit', href: '#starter', desc: 'Get going quickly' },
        { label: 'Animations', href: '#anim', desc: 'Framer Motion patterns' },
        { label: 'Layouts', href: '#layouts', desc: 'Headers, footers, grids' }
    ],
    Docs: [
        { label: 'Getting Started', href: '#docs-start', desc: 'Install & first steps' },
        { label: 'Components', href: '#docs-components', desc: 'Props & usage' },
        { label: 'Changelog', href: '#docs-changelog', desc: 'What’s new' }
    ]
}

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [hidden, setHidden] = useState(false)
    const [openMenu, setOpenMenu] = useState<string | null>(null) // which top-level submenu is open
    const panelRef = useRef<HTMLDivElement | null>(null)
    const lastScrollY = useRef(0)

    // Hide on scroll down, show on scroll up (kept your behavior)
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY
            if (y > lastScrollY.current && y > 80) setHidden(true)
            else setHidden(false)
            lastScrollY.current = y
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Close mobile drawer or submenu on Escape (kept + extended)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMobileOpen(false)
                setOpenMenu(null)
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [])

    // Close submenu on outside click
    useEffect(() => {
        if (!openMenu) return
        const handler = (e: MouseEvent) => {
            if (!panelRef.current) return
            const target = e.target as Node
            if (!panelRef.current.contains(target)) setOpenMenu(null)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [openMenu])

    // Lock page scroll when any overlay is open
    useEffect(() => {
        const anyOverlay = mobileOpen || !!openMenu
        const prev = document.body.style.overflow
        if (anyOverlay) document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = prev
        }
    }, [mobileOpen, openMenu])

    // Simulated auth state; wire this to your real auth later
    const isAuthenticated = false

    const toggleSubmenu = (name: string) => {
        setOpenMenu((cur) => (cur === name ? null : name))
    }

    return (
        <>
            {/* Sticky top nav that animates up/down on scroll */}
            <motion.div
                className="sticky top-0 z-50 bg-white border-b border-white/10"
                animate={{ y: hidden ? -96 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
                <div className="container flex h-16 md:h-20 items-center gap-4">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2  group">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 1.5 3 6v12l9 4.5L21 18V6L12 1.5Z" />
                        </svg>
                        <span className="my-logo">PINES DIGITAL</span>
                    </a>

                    {/* Desktop nav */}
                    <nav className="ml-auto hidden md:flex items-center gap-2">
                        {links.map((l) => {
                            const hasSub = l.name in submenus
                            if (!hasSub) {
                                return (
                                    <a
                                        key={l.name}
                                        href={l.href}
                                        className="px-3 py-2 rounded-xl text-sm font-medium text-black hover:text-black hover:bg-white/10 transition-colors"
                                    >
                                        {l.name}
                                    </a>
                                )
                            }
                            // Button that opens submenu
                            const open = openMenu === l.name
                            return (
                                <button
                                    key={l.name}
                                    type="button"
                                    onClick={() => toggleSubmenu(l.name)}
                                    aria-expanded={open}
                                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-black hover:text-black hover:bg-white/10 transition-colors"
                                >
                                    {l.name}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                                </button>
                            )
                        })}

                        {/* Search (kept your styling) */}
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 pointer-events-none" />
                            <input
                                type="search"
                                placeholder="Search…"
                                className="w-56 rounded-xl pl-9 pr-3 py-2 text-sm bg-slate-950/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        </div>

                        {/* Auth button (kept) */}
                        {isAuthenticated ? (
                            <a
                                href="#account"
                                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white text-black font-medium hover:bg-white/90"
                            >
                                <User className="h-4 w-4" />
                                Account
                            </a>
                        ) : (
                            <a
                                href="#login"
                                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 ring-1 ring-white/15 hover:ring-white/30"
                            >
                                <LogIn className="h-4 w-4" />
                                Log in
                            </a>
                        )}

                        {/* Desktop submenu panel + dark backdrop */}
                        <AnimatePresence>
                            {openMenu && (
                                <>
                                    {/* Backdrop that darkens whole site; click to close */}
                                    <motion.div
                                        className="fixed inset-0 z-40 bg-black/50"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setOpenMenu(null)}
                                    />
                                    {/* Panel */}
                                    <motion.div
                                        ref={panelRef}
                                        className="fixed left-0 right-0 z-50"
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ type: 'spring', bounce: 0, duration: 0.22 }}
                                        style={{ top: '4rem' }} // 64px for h-16; adjusts automatically on md by CSS below
                                    >
                                        <div className="container md:pt-4">
                                            <div className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white shadow-xl">
                                                <div className="grid gap-2 p-4 sm:grid-cols-2 md:grid-cols-3">
                                                    {submenus[openMenu].map((item) => (
                                                        <a
                                                            key={item.label}
                                                            href={item.href}
                                                            className="rounded-xl p-3 hover:bg-black/5 text-black"
                                                            onClick={() => setOpenMenu(null)}
                                                        >
                                                            <div className="text-sm font-semibold">{item.label}</div>
                                                            {item.desc && (
                                                                <div className="text-sm text-gray-600 mt-1">{item.desc}</div>
                                                            )}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Responsive adjust for md:h-20 (80px) top offset */}
                                    <style>{`
                    @media (min-width: 768px){
                      [style*="top: 4rem"] { top: 5rem !important; } /* 80px */
                    }
                  `}</style>
                                </>
                            )}
                        </AnimatePresence>
                    </nav>

                    {/* Mobile menu button (kept) */}
                    <button
                        className="ml-auto md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl ring-1 ring-white/15 hover:ring-white/30"
                        aria-label="Open menu"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </motion.div>

            {/* Mobile drawer (kept) */}
            <motion.aside
                className="fixed inset-0 z-50 md:hidden"
                initial={false}
                animate={{ pointerEvents: mobileOpen ? 'auto' : 'none' }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/50"
                    onClick={() => setMobileOpen(false)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mobileOpen ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                />
                {/* Panel */}
                <motion.div
                    className="absolute right-0 top-0 h-full w-[82%] max-w-sm glass border-l border-white/10 p-6"
                    initial={{ x: '100%' }}
                    animate={{ x: mobileOpen ? 0 : '100%' }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                >
                    <div className="flex items-center justify-between">
                        <a href="#" className="flex items-center gap-2 font-semibold" onClick={() => setMobileOpen(false)}>
                            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 1.5 3 6v12l9 4.5L21 18V6L12 1.5Z" />
                            </svg>
                            <span>YourLogo</span>
                        </a>
                        <button
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-white/15 hover:ring-white/30"
                            aria-label="Close menu"
                            onClick={() => setMobileOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="mt-6">
                        {/* Mobile search (kept) */}
                        <div className="relative mb-4">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 pointer-events-none" />
                            <input
                                type="search"
                                placeholder="Search…"
                                className="w-full rounded-xl pl-9 pr-3 py-2 text-sm bg-slate-950/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        </div>

                        {/* Mobile links (kept simple; closes drawer on click) */}
                        <nav className="grid gap-1 text-base">
                            {links.map((l) => (
                                <a
                                    key={l.name}
                                    href={l.href}
                                    className="rounded-xl px-3 py-3 text-black hover:text-black hover:bg-white/10"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {l.name}
                                </a>
                            ))}
                        </nav>

                        <div className="mt-6 grid gap-2">
                            {isAuthenticated ? (
                                <a
                                    href="#account"
                                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 bg-white text-slate-900 font-medium hover:bg-white/90"
                                >
                                    <User className="h-4 w-4" />
                                    Account
                                </a>
                            ) : (
                                <a
                                    href="#login"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 ring-1 ring-white/15 hover:ring-white/30"
                                >
                                    <LogIn className="h-4 w-4" />
                                    Log in
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.aside>
        </>
    )
}
