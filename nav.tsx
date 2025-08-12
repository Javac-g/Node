import { useEffect, useState } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, LogIn, User, Search as SearchIcon } from 'lucide-react'

const links = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Docs', href: '#docs' }
]

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [hidden, setHidden] = useState(false)
    const { scrollY } = useScroll()

    // Hide on scroll down, show on scroll up
    useMotionValueEvent(scrollY, 'change', (latest) => {
        const prev = scrollY.getPrevious() ?? 0
        setHidden(latest > prev && latest > 80)
    })

    // Close mobile drawer on Escape
    useEffect(() => {
        if (!mobileOpen) return
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [mobileOpen])

    // Simulated auth state; wire this to your real auth later
    const isAuthenticated = false

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
                        {links.map((l) => (
                            <a
                                key={l.name}
                                href={l.href}
                                className="px-3 py-2 rounded-xl text-sm font-medium text-black hover:text-black hover:bg-white/10 transition-colors"
                            >
                                {l.name}
                            </a>
                        ))}

                        {/* Search */}
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 pointer-events-none" />
                            <input
                                type="search"
                                placeholder="Search…"
                                className="w-56 rounded-xl pl-9 pr-3 py-2 text-sm bg-slate-950/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        </div>

                        {/* Auth button */}
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
                    </nav>

                    {/* Mobile menu button */}
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
                        <a href="#" className="flex items-center gap-2 font-semibold">
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
                        {/* Mobile search */}
                        <div className="relative mb-4">
                            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60 pointer-events-none" />
                            <input
                                type="search"
                                placeholder="Search…"
                                className="w-full rounded-xl pl-9 pr-3 py-2 text-sm bg-slate-950/60 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                            />
                        </div>

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
