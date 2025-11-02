import {useRef} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import clsx from 'clsx'
import {AnimatePresence, motion, useIsPresent} from 'framer-motion'
import {useIsInsideMobileNavigation} from '@/components/MobileNavigation'
import {useSectionStore} from '@/components/SectionProvider'
import {Tag} from '@/components/Tag'
import {remToPx} from '@/lib/remToPx'

function useInitialValue(value, condition = true) {
    let initialValue = useRef(value).current
    return condition ? initialValue : value
}

function TopLevelNavItem({href, children}) {
    return (
        <li className="md:hidden">
            <Link
                href={href}
                className="block py-1 text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
                {children}
            </Link>
        </li>
    )
}

function NavLink({href, tag, active, isAnchorLink = false, children}) {
    return (
        <Link
            href={href}
            aria-current={active ? 'page' : undefined}
            className={clsx(
                'flex justify-between gap-2 py-1 pr-3 text-sm transition',
                isAnchorLink ? 'pl-7' : 'pl-4',
                active
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            )}
        >
            <span className="truncate">{children}</span>
            {tag && (
                <Tag variant="small" color="slate">
                    {tag}
                </Tag>
            )}
        </Link>
    )
}

function VisibleSectionHighlight({group, pathname}) {
    let [sections, visibleSections] = useInitialValue(
        [
            useSectionStore((s) => s.sections),
            useSectionStore((s) => s.visibleSections),
        ],
        useIsInsideMobileNavigation()
    )

    let isPresent = useIsPresent()
    let firstVisibleSectionIndex = Math.max(
        0,
        [{id: '_top'}, ...sections].findIndex(
            (section) => section.id === visibleSections[0]
        )
    )
    let itemHeight = remToPx(2)
    let height = isPresent
        ? Math.max(1, visibleSections.length) * itemHeight
        : itemHeight
    let top =
        group.links.findIndex((link) => link.href === pathname) * itemHeight +
        firstVisibleSectionIndex * itemHeight

    return (
        <motion.div
            layout
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {delay: 0.2}}}
            exit={{opacity: 0}}
            className="absolute inset-x-0 top-0 bg-slate-800/2.5 will-change-transform dark:bg-white/2.5"
            style={{borderRadius: 8, height, top}}
        />
    )
}

function ActivePageMarker({group, pathname}) {
    let itemHeight = remToPx(2)
    let offset = remToPx(0.25)
    let activePageIndex = group.links.findIndex((link) => link.href === pathname)
    let top = offset + activePageIndex * itemHeight

    return (
        <motion.div
            layout
            className="absolute left-2 h-6 w-px bg-sky-500"
            initial={{opacity: 0}}
            animate={{opacity: 1, transition: {delay: 0.2}}}
            exit={{opacity: 0}}
            style={{top}}
        />
    )
}

function NavigationGroup({group, className}) {
    // If this is the mobile navigation then we always render the initial
    // state, so that the state does not change during the close animation.
    // The state will still update when we re-open (re-render) the navigation.
    let isInsideMobileNavigation = useIsInsideMobileNavigation()
    let [router, sections] = useInitialValue(
        [useRouter(), useSectionStore((s) => s.sections)],
        isInsideMobileNavigation
    )

    let isActiveGroup =
        group.links.findIndex((link) => link.href === router.pathname) !== -1

    return (
        <li className={clsx('relative mt-6', className)}>
            <motion.h2
                layout="position"
                className="text-xs font-semibold text-slate-900 dark:text-white"
            >
                {group.title}
            </motion.h2>
            <div className="relative mt-3 pl-2">
                <AnimatePresence initial={!isInsideMobileNavigation}>
                    {isActiveGroup && (
                        <VisibleSectionHighlight group={group} pathname={router.pathname}/>
                    )}
                </AnimatePresence>
                <motion.div
                    layout
                    className="absolute inset-y-0 left-2 w-px bg-slate-900/10 dark:bg-white/5"
                />
                <AnimatePresence initial={false}>
                    {isActiveGroup && (
                        <ActivePageMarker group={group} pathname={router.pathname}/>
                    )}
                </AnimatePresence>
                <ul role="list" className="border-l border-transparent">
                    {group.links.map((link) => (
                        <motion.li key={link.href} layout="position" className="relative">
                            <NavLink href={link.href} active={link.href === router.pathname}>
                                {link.title}
                            </NavLink>
                            <AnimatePresence mode="popLayout" initial={false}>
                                {link.href === router.pathname && sections.length > 0 && (
                                    <motion.ul
                                        role="list"
                                        initial={{opacity: 0}}
                                        animate={{
                                            opacity: 1,
                                            transition: {delay: 0.1},
                                        }}
                                        exit={{
                                            opacity: 0,
                                            transition: {duration: 0.15},
                                        }}
                                    >
                                        {sections.map((section) => (
                                            <li key={section.id}>
                                                <NavLink
                                                    href={`${link.href}#${section.id}`}
                                                    tag={section.tag}
                                                    isAnchorLink
                                                >
                                                    {section.title}
                                                </NavLink>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </li>
    )
}

export const navigation = [
    {
        title: 'Введение',
        links: [
            {title: 'Обзор', href: '/'},
            {title: 'Преимущества', href: '/features'},
            {title: 'Принцип работы', href: '/principle'},
            {title: 'Примеры использования', href: '/example'},
        ],
    },
    {
        title: 'Установка',
        links: [
            {title: 'Предупреждения', href: '/must-read'},
            {title: 'Системные требования', href: '/install/requirement'},
            {title: 'Установка и настройка', href: '/install/install'},
            {title: 'Запуск и управление', href: '/install/start-and-stop'},
        ],
    },
    {
        title: 'Разработка',
        links: [
            // { title: 'Перед началом', href: '/development/before' },
            {title: 'Структура', href: '/development/structure'},
            {title: 'Основной процесс', href: '/development/process'},
            // { title: 'Рекомендации', href: '/development/standard' },
        ],
    },
    {
        title: 'Протоколы',
        links: [
            {title: 'Что за протоколы?', href: '/protocols'},
            {title: 'Классы протоколов', href: '/protocols/custom'},
        ],
    },
    {
        title: 'HTTP',
        links: [
            {title: 'Запрос', href: '/http/request'},
            {title: 'Ответ', href: '/http/response'},
            {title: 'Сессия', href: '/http/session'},
            {title: 'Управление сессией', href: '/http/session-control'},
            {title: 'SSE', href: '/http/SSE'},
        ],
    },
    {
        title: 'Архитектура',
        links: [
            {title: 'Обзор архитектуры', href: '/architecture/overview'},
            {title: 'Модель процессов', href: '/architecture/process-model'},
            {title: 'Событийные циклы', href: '/architecture/event-loops'},
            {title: 'Обработка соединений', href: '/architecture/connections'},
            {title: 'Протоколы', href: '/architecture/protocols'},
            {title: 'Производительность', href: '/architecture/performance'},
            {title: 'Безопасность', href: '/architecture/security'},
        ],
    },
    {
        title: 'API Reference',
        links: [
            {title: 'Server', href: '/api/server'},
            {title: 'Connection', href: '/api/connection'},
            {title: 'Timer', href: '/api/timer'},
        ],
    },
    {
        title: 'Продвинутые темы',
        links: [
            {title: 'Масштабирование', href: '/advanced/scaling'},
            {title: 'Развертывание', href: '/advanced/deployment'},
            {title: 'Решение проблем', href: '/advanced/troubleshooting'},
            {title: 'Лучшие практики', href: '/advanced/best-practices'},
        ],
    },
    {
        title: 'Исследования',
        links: [
            {title: 'Обзор исследований', href: '/research'},
            {title: 'Научные концепции', href: '/research/concepts'},
            {title: 'Бенчмарки', href: '/research/benchmarks'},
            {title: 'Сравнение', href: '/research/comparison'},
        ],
    },
]

export function Navigation(props) {
    return (
        <nav {...props}>
            <ul role="list">
                {/*<TopLevelNavItem href="#">Documentation</TopLevelNavItem>*/}
                {/*<TopLevelNavItem href="#">Support</TopLevelNavItem>*/}
                {navigation.map((group, groupIndex) => (
                    <NavigationGroup
                        key={group.title}
                        group={group}
                        className={groupIndex === 0 && 'md:mt-0'}
                    />
                ))}
            </ul>
        </nav>
    )
}
