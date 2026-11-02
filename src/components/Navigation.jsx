// SPDX-FileCopyrightText: 2016-2026 Localzet Group
// SPDX-License-Identifier: AGPL-3.0-or-later
// Source: https://github.com/localzet/server-docs

import {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import clsx from 'clsx'
import {AnimatePresence, motion, useIsPresent} from 'framer-motion'
import {useIsInsideMobileNavigation} from '@/components/MobileNavigation'
import {useSectionStore} from '@/components/SectionProvider'
import {Tag} from '@/components/Tag'
import {remToPx} from '@/lib/remToPx'

function useInitialValue(value, condition = true) {
    let [initialValue] = useState(() => value)
    return condition ? initialValue : value
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

const serverNavigation = [
    {
        title: 'Текущая версия · 7.x',
        links: [
            {title: 'Обзор и версия', href: '/'},
            {title: 'Установка и первый сервер', href: '/current/start'},
            {title: 'Совместимость', href: '/current/compatibility'},
            {title: 'Процессы и команды', href: '/current/runtime'},
            {title: 'Event loop и таймеры', href: '/current/event-loops'},
            {title: 'Протоколы и framing', href: '/current/protocols'},
            {title: 'HTTP', href: '/current/http'},
            {title: 'Сессии', href: '/current/sessions'},
            {title: 'Gateway и TCP proxy', href: '/current/gateway'},
            {title: 'Безопасность', href: '/current/security'},
            {title: 'Эксплуатация', href: '/current/operations'},
            {title: 'Тесты и benchmark', href: '/current/testing'},
            {title: 'Сравнение реализаций', href: '/research/comparison'},
            {title: 'Границы benchmark', href: '/research/benchmarks'},
        ],
    },
    {
        title: 'Архитектура',
        links: [
            {title: 'Server', href: '/api-ref/server'},
            {title: 'Connection', href: '/api-ref/connection'},
            {title: 'Timer', href: '/api-ref/timer'},
        ],
    },
    {
        title: 'Архив документации',
        links: [
            {title: 'Установка и запуск', href: '/install/start-and-stop'},
            {title: 'HTTP API', href: '/http/request'},
            {title: 'Процесс и архитектура', href: '/architecture/overview'},
            {title: 'Deployment', href: '/advanced/deployment'},
        ],
    },
]

const clusterNavigation = [
    {
        title: 'Cluster',
        links: [
            {title: 'Обзор', href: '/projects/cluster'},
            {title: 'Установка', href: '/projects/cluster/install'},
            {title: 'Требования', href: '/projects/cluster/requirements'},
            {title: 'Запуск и остановка', href: '/projects/cluster/start-and-stop'},
            {title: 'Ключевые концепции', href: '/projects/cluster/must-read'},
            {title: 'Примеры', href: '/projects/cluster/example'},
            {title: 'Архитектура', href: '/projects/cluster/architecture'},
        ],
    },
]

const projectNavigation = {
    cron: [{title: 'Cron', links: [{title: 'Обзор', href: '/projects/cron'}, {title: 'Установка и расписания', href: '/projects/cron/start'}, {title: 'API и эксплуатация', href: '/projects/cron/reference'}]}],
    httpclient: [{title: 'HTTP Client', links: [{title: 'Обзор', href: '/projects/httpclient'}, {title: 'Первый запрос', href: '/projects/httpclient/start'}, {title: 'Запросы и обработка ответов', href: '/projects/httpclient/reference'}]}],
    mqtt: [{title: 'MQTT', links: [{title: 'Обзор и статус', href: '/projects/mqtt'}, {title: 'Подключение и обмен сообщениями', href: '/projects/mqtt/start'}, {title: 'Параметры и надёжность', href: '/projects/mqtt/reference'}]}],
    psr7: [{title: 'PSR-7', links: [{title: 'Обзор', href: '/projects/psr7'}, {title: 'Сообщения и потоки', href: '/projects/psr7/start'}, {title: 'Типы и правила работы', href: '/projects/psr7/reference'}]}],
    proxy: [{title: 'Proxy', links: [{title: 'Обзор и ограничения', href: '/projects/proxy'}, {title: 'Запуск и настройка доступа', href: '/projects/proxy/start'}, {title: 'Маршрутизация и эксплуатация', href: '/projects/proxy/reference'}]}],
    socks5: [{title: 'SOCKS5', links: [{title: 'Обзор', href: '/projects/socks5'}, {title: 'Установка и запуск', href: '/projects/socks5/start'}, {title: 'Настройки и ограничения', href: '/projects/socks5/reference'}]}],
    socketio: [{title: 'Socket.IO', links: [{title: 'Обзор и совместимость', href: '/projects/socketio'}, {title: 'Подключение к серверу', href: '/projects/socketio/start'}, {title: 'Namespaces, комнаты и доставка', href: '/projects/socketio/reference'}]}],
    storage: [{title: 'Storage', links: [{title: 'Обзор и безопасность', href: '/projects/storage'}, {title: 'Сервер и клиент', href: '/projects/storage/start'}, {title: 'Операции и ограничения', href: '/projects/storage/reference'}]}],
    tunnel: [{title: 'Tunnel', links: [{title: 'Обзор и протокол', href: '/projects/tunnel'}, {title: 'События и очереди', href: '/projects/tunnel/start'}, {title: 'Клиент, форматы и доставка', href: '/projects/tunnel/reference'}]}],
    noter: [{title: 'Noter', links: [{title: 'Обзор', href: '/projects/noter'}, {title: 'Установка и отправка заметки', href: '/projects/noter/start'}, {title: 'Настройка сервера-приёмника', href: '/projects/noter/reference'}]}],
}

export function getNavigation(pathname) {
    const projectId = pathname.startsWith('/projects/') ? pathname.split('/')[2] : null
    return projectId === 'cluster' ? clusterNavigation : projectNavigation[projectId] ?? serverNavigation
}

export const navigation = serverNavigation

export function Navigation(props) {
    let router = useRouter()
    let navigation = getNavigation(router.pathname)
    return (
        <nav {...props}>
            <ul role="list">
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
