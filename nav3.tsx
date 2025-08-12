// src/components/Navbar.tsx
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search as SearchIcon, ChevronDown } from 'lucide-react'

/** ---------------------------
 *  DATA CONFIG (edit as needed)
 *  ---------------------------
 */

// Order and type of top-level items shown inline in the navbar
type TopItem =
    | { key: string; label: string; type: 'link'; href: string }
    | { key: string; label: string; type: 'menu' }

const TOP_ITEMS: TopItem[] = [
    { key: 'profile', label: 'Profile Menu', type: 'menu' },
    { key: 'dashboard', label: 'Dashboard', type: 'menu' },
    { key: 'tos', label: 'Terms of Service', type: 'menu' },
    { key: 'services', label: 'Services', type: 'menu' },
    { key: 'consulting', label: 'Consulting', type: 'link', href: 'https://www.pines-digital.com/consulting?lnk=L0G' },
    { key: 'support', label: 'Support', type: 'menu' },
    { key: 'think', label: 'Think 2025', type: 'link', href: 'https://www.pines-digital.com/events/think?lnk=L0G' },
]

// Simple link item
type LinkItem = { label: string; href: string }
// Section within a submenu (optional title)
type Section = { title?: string; items: LinkItem[] }

// Submenu content by key from TOP_ITEMS
const SUBMENUS: Record<string, Section[]> = {
    profile: [
        {
            title: 'login',
            items: [
                { label: 'My pines-digital', href: 'https://pines-digital.com/personal' },
                { label: 'Log in', href: 'https://pines-digital.com/login' },
            ],
        },
        {
            title: 'register',
            items: [
                { label: 'My pines-digital', href: 'https://pines-digital.com/personal' },
                { label: 'Log in', href: 'https://pines-digital.com/login' },
            ],
        },
    ],
    dashboard: [
        {
            items: [
                { label: 'Overview', href: 'https://www.pines-digital.com/overview' },
                { label: 'Invoices', href: 'https://www.pines-digital.com/invoices' },
                { label: 'Domains', href: 'https://www.pines-digital.com/domains-board' },
                { label: 'Hosting', href: 'https://research.pines-digital.com/hosting-board' },
                { label: "SSL's", href: 'https://www.pines-digital.com/ssl-board' },
                { label: 'Apps', href: 'https://www.pines-digital.com/apps-board' },
                { label: 'Private Email', href: 'https://www.pines-digital.com/mail-board' },
            ],
        },
    ],
    tos: [
        {
            items: [
                { label: 'General', href: 'https://www.pines-digital.com/tos-general' },
                { label: 'Domains policy', href: 'https://www.pines-digital.com/domains-tos' },
                { label: 'Hosting policy', href: 'https://www.pines-digital.com/hosting-tos' },
                { label: 'Phishing Reports API', href: 'https://pines-digital.com/tos-phishing' },
                { label: 'Universal Terms of Agreement', href: 'https://www.pines-digital.com/universal-tos' },
            ],
        },
    ],
    services: [
        {
            items: [
                { label: 'Domain names', href: 'https://www.pines-digital.com/products/domains' },
                { label: 'Hosting', href: 'https://www.pines-digital.com/products/hosting' },
                { label: 'SSL Certificates', href: 'https://www.pines-digital.com/products/ssl' },
                { label: 'Private Email', href: 'https://www.pines-digital.com/products/private-email' },
                { label: 'WordPress', href: 'https://www.pines-digital.com/managed-wordpress' },
                { label: 'Whois Guard', href: 'https://www.pines-digital.com/products/whois' },
                { label: 'pines-digital Cloud', href: 'https://www.pines-digital.com/cloud?lnk=flatitem' },
                { label: 'pines-digital Z', href: 'https://www.pines-digital.com/z?lnk=flatitem' },
                { label: 'Instana', href: 'https://www.pines-digital.com/products/instana?lnk=flatitem' },
                { label: 'MaaS360', href: 'https://www.pines-digital.com/products/maas360?lnk=flatitem' },
                { label: 'Maximo', href: 'https://www.pines-digital.com/products/maximo?lnk=flatitem' },
                { label: 'Planning Analytics', href: 'https://www.pines-digital.com/products/planning-analytics?lnk=flatitem' },
                { label: 'Robotic Process Automation (RPA)', href: 'https://www.pines-digital.com/products/robotic-process-automation?lnk=flatitem' },
                { label: 'Storage Defender', href: 'https://www.pines-digital.com/products/storage-defender?lnk=flatitem' },
                { label: 'Turbonomic', href: 'https://www.pines-digital.com/products/turbonomic?lnk=flatitem' },
                { label: 'watsonx', href: 'https://www.pines-digital.com/watsonx?lnk=flatitem' },
                { label: 'watsonx Assistant', href: 'https://www.pines-digital.com/products/watsonx-assistant?lnk=flatitem' },
                { label: 'watsonx Orchestrate', href: 'https://www.pines-digital.com/products/watsonx-orchestrate?lnk=flatitem' },
            ],
        },
    ],
    support: [
        {
            items: [
                { label: "What's New", href: 'https://www.pines-digital.com/new?lnk=flathl' },
                { label: 'Community', href: 'https://community.pines-digital.com/community/usercommunity?lnk=flathl' },
                { label: 'Developer', href: 'https://developer.pines-digital.com/technologies?lnk=flatitem' },
                { label: 'Documentation', href: 'https://www.pines-digital.com/docs/en?lnk=flatitem' },
                { label: 'Support Pages', href: 'https://www.pines-digital.com/support/pages/pines-digital-support-offerings?lnk=flatitem' },
            ],
        },
    ],
}

/** ---------------------------
 *  COMPONENT
 *  ---------------------------
 */

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [hidden, setHidden] = useState(false)
    const [openKey, setOpenKey] = useState<string | null>(null) // which submenu is open (desktop)
    const panelRef = useRef<HTMLDivElement | null>(null)
    const lastScrollY = useRef(0)

    // Scroll-hide (up shows, down hides after 80px)
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

    // ESC to close menus/drawer
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpenKey(null)
                setMobileOpen(false)
            }
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [])

    // Outside click to close submenu
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!openKey || !panelRef.current) return
            if (!panelRef.current.contains(e.target as Node)) setOpenKey(null)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [openKey])

    // Lock scroll when overlays are open
    useEffect(() => {
        const any = mobileOpen || !!openKey
        const prev = document.body.style.overflow
        if (any) document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = prev }
    }, [mobileOpen, openKey])

    const toggle = (key: string) => setOpenKey((cur) => (cur === key ? null : key))
    const closeAll = () => { setOpenKey(null); setMobileOpen(false) }

    return (
        <>
            {/* Top bar */}
            <motion.div
                className="sticky top-0 z-50 bg-white border-b border-white/10"
                animate={{ y: hidden ? -96 : 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
                <div className="container flex h-16 md:h-20 items-center gap-4">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2 group">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 1.5 3 6v12l9 4.5L21 18V6L12 1.5Z" />
                        </svg>
                        <span className="my-logo">PINES DIGITAL</span>
                    </a>

                    {/* Inline main nav */}
                    <nav className="ml-auto hidden md:flex items-center gap-1">
                        {TOP_ITEMS.map((item) => {
                            if (item.type === 'link') {
                                return (
                                    <a
                                        key={item.key}
                                        href={item.href}
                                        className="px-3 py-2 rounded-xl text-sm font-medium text-black hover:bg-black/5"
                                    >
                                        {item.label}
                                    </a>
                                )
                            }
                            const open = openKey === item.key
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    aria-expanded={open}
                                    onClick={() => toggle(item.key)}
                                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium text-black hover:bg-black/5"
                                >
                                    {item.label}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                                </button>
                            )
                        })}

                        {/* Search (kept your style) */}
                        <div className="relative ml-2">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 pointer-events-none" />
                            <input
                                type="search"
                                placeholder="Search…"
                                className="w-56 rounded-xl pl-9 pr-3 py-2 text-sm bg-slate-950/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        </div>

                        {/* Desktop overlay + panel */}
                        <AnimatePresence>
                            {openKey && (
                                <>
                                    {/* Backdrop */}
                                    <motion.div
                                        className="fixed inset-0 z-40 bg-black/50"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onClick={() => setOpenKey(null)}
                                    />
                                    {/* Panel */}
                                    <motion.div
                                        ref={panelRef}
                                        className="fixed left-0 right-0 z-50"
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ type: 'spring', bounce: 0, duration: 0.22 }}
                                        style={{ top: '4rem' }} // h-16; CSS below bumps for md:h-20
                                    >
                                        <div className="container md:pt-4">
                                            <div className="mx-auto rounded-2xl border border-white/10 bg-white shadow-xl">
                                                <div className="grid gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                                    {SUBMENUS[openKey]?.map((sec, si) => (
                                                        <div key={si}>
                                                            {sec.title && (
                                                                <div className="text-xs uppercase tracking-wider text-gray-500 mb-2">
                                                                    {sec.title}
                                                                </div>
                                                            )}
                                                            <ul className="space-y-1">
                                                                {sec.items.map((it) => (
                                                                    <li key={it.label}>
                                                                        <a
                                                                            href={it.href}
                                                                            className="block rounded-lg px-3 py-2 text-sm text-black hover:bg-black/5"
                                                                            onClick={() => setOpenKey(null)}
                                                                        >
                                                                            {it.label}
                                                                        </a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* md offset correction */}
                                        <style>{`
                      @media (min-width: 768px){
                        [style*="top: 4rem"] { top: 5rem !important; }
                      }
                    `}</style>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </nav>

                    {/* Mobile toggle */}
                    <button
                        className="ml-auto md:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl ring-1 ring-white/15 hover:ring-white/30"
                        aria-label="Open menu"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                </div>
            </motion.div>

            {/* Mobile drawer */}
            <motion.aside
                className="fixed inset-0 z-50 md:hidden"
                initial={false}
                animate={{ pointerEvents: mobileOpen ? 'auto' : 'none' }}
            >
                {/* Backdrop */}
                <motion.div
                    className="absolute inset-0 bg-black/50"
                    onClick={closeAll}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mobileOpen ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                />
                {/* Panel */}
                <motion.div
                    className="absolute right-0 top-0 h-full w-[82%] max-w-sm glass border-l border-white/10 p-6 overflow-y-auto"
                    initial={{ x: '100%' }}
                    animate={{ x: mobileOpen ? 0 : '100%' }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
                >
                    <div className="flex items-center justify-between">
                        <a href="#" className="flex items-center gap-2 font-semibold" onClick={closeAll}>
                            <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M12 1.5 3 6v12l9 4.5L21 18V6L12 1.5Z" />
                            </svg>
                            <span className="my-logo">PINES DIGITAL</span>
                        </a>
                        <button
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-white/15 hover:ring-white/30"
                            aria-label="Close menu"
                            onClick={closeAll}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Mobile sections: link items become buttons; menus become <details> */}
                    <div className="mt-6 space-y-3">
                        {TOP_ITEMS.map((it) =>
                            it.type === 'link' ? (
                                <a
                                    key={it.key}
                                    href={it.href}
                                    className="block rounded-xl px-3 py-3 text-base text-white/90 hover:bg-white/10"
                                    onClick={closeAll}
                                >
                                    {it.label}
                                </a>
                            ) : (
                                <details key={it.key} className="rounded-xl border border-white/10">
                                    <summary className="cursor-pointer select-none list-none px-3 py-3 text-base font-medium">
                                        {it.label}
                                    </summary>
                                    <div className="p-2 pt-0">
                                        {SUBMENUS[it.key]?.map((sec, si) => (
                                            <div key={si} className="mb-2">
                                                {sec.title && (
                                                    <div className="px-2 pb-1 text-[11px] uppercase tracking-wide text-gray-300">
                                                        {sec.title}
                                                    </div>
                                                )}
                                                {sec.items.map((li) => (
                                                    <a
                                                        key={li.label}
                                                        href={li.href}
                                                        className="block rounded-lg px-3 py-2 text-base text-white/90 hover:bg-white/10"
                                                        onClick={closeAll}
                                                    >
                                                        {li.label}
                                                    </a>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </details>
                            )
                        )}
                    </div>
                </motion.div>
            </motion.aside>
        </>
    )
}
