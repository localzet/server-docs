import {forwardRef} from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import {motion, useScroll, useTransform} from 'framer-motion'
import {Logo} from '@/components/Logo'
import {MobileNavigation, useIsInsideMobileNavigation, useMobileNavigationStore,} from '@/components/MobileNavigation'
import {ModeToggle} from '@/components/ModeToggle'
import {MobileSearch, Search} from '@/components/Search'
import {useRouter} from 'next/router'

const projects = [
    {id: 'server', title: 'Server', href: '/'},
    {id: 'cluster', title: 'Cluster', href: '/projects/cluster'},
    {id: 'cron', title: 'Cron', href: '/projects/cron'},
    {id: 'httpclient', title: 'HTTP Client', href: '/projects/httpclient'},
    {id: 'mqtt', title: 'MQTT', href: '/projects/mqtt'},
    {id: 'psr7', title: 'PSR-7', href: '/projects/psr7'},
    {id: 'proxy', title: 'Proxy', href: '/projects/proxy'},
    {id: 'socks5', title: 'SOCKS5', href: '/projects/socks5'},
    {id: 'socketio', title: 'Socket.IO', href: '/projects/socketio'},
    {id: 'storage', title: 'Storage', href: '/projects/storage'},
    {id: 'tunnel', title: 'Tunnel', href: '/projects/tunnel'},
    {id: 'noter', title: 'Noter', href: '/projects/noter'},
]

function TopLevelNavItem({href, children}) {
    return (
        <li>
            <Link
                href={href}
                className="text-sm leading-5 text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
                {children}
            </Link>
        </li>
    )
}

export const Header = forwardRef(function Header({className}, ref) {
    let router = useRouter()
    let currentProject = router.pathname.startsWith('/projects/') ? router.pathname.split('/')[2] : 'server'
    let {isOpen: mobileNavIsOpen} = useMobileNavigationStore()
    let isInsideMobileNavigation = useIsInsideMobileNavigation()

    let {scrollY} = useScroll()
    let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
    let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

    return (
        <motion.div
            ref={ref}
            className={clsx(
                className,
                'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80',
                !isInsideMobileNavigation &&
                'backdrop-blur-sm dark:backdrop-blur lg:left-72 xl:left-80',
                isInsideMobileNavigation
                    ? 'bg-white dark:bg-slate-900'
                    : 'bg-white/[var(--bg-opacity-light)] dark:bg-slate-900/[var(--bg-opacity-dark)]'
            )}
            style={{
                '--bg-opacity-light': bgOpacityLight,
                '--bg-opacity-dark': bgOpacityDark,
            }}
        >
            <div
                className={clsx(
                    'absolute inset-x-0 top-full h-px transition',
                    (isInsideMobileNavigation || !mobileNavIsOpen) &&
                    'bg-slate-900/7.5 dark:bg-white/7.5'
                )}
            />
            <Search/>
            <div className="flex items-center gap-5 lg:hidden">
                <MobileNavigation/>
                <Link href="/" aria-label="Home">
                    <Logo />
                </Link>
            </div>
            <div className="flex items-center gap-5">
                <nav className="hidden md:block">
                    <ul role="list" className="flex max-w-[min(70vw,52rem)] items-center gap-1 overflow-x-auto">
                        {projects.map((project) => (
                            <li key={project.id}>
                                <Link
                                    href={project.href}
                                    aria-current={currentProject === project.id ? 'page' : undefined}
                                    className={clsx(
                                            'whitespace-nowrap rounded-md px-2 py-1.5 text-sm transition',
                                        currentProject === project.id
                                            ? 'bg-slate-900/5 text-slate-900 dark:bg-white/10 dark:text-white'
                                            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                                    )}
                                >
                                    {project.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="hidden md:block md:h-5 md:w-px md:bg-slate-900/10 md:dark:bg-white/15"/>
                <div className="flex gap-4">
                    <select
                        aria-label="Выбрать проект"
                        className="max-w-28 rounded-md border border-slate-900/10 bg-transparent px-2 text-xs text-slate-700 dark:border-white/10 dark:text-slate-300 md:hidden"
                        value={currentProject}
                        onChange={(event) => router.push(projects.find((project) => project.id === event.target.value)?.href ?? '/')}
                    >
                        {projects.map((project) => <option key={project.id} value={project.id}>{project.title}</option>)}
                    </select>
                    <MobileSearch/>
                    <ModeToggle/>
                </div>
            </div>
        </motion.div>
    )
})
