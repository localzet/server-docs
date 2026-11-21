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
        title: 'Текущая версия · 7.2.2',
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
    'engine-http': [
        {title: 'Triangle Engine HTTP · Русский', links: [
            {title: 'Обзор и совместимость', href: '/projects/engine-http'},
            {title: 'Установка и запуск', href: '/projects/engine-http/install'},
            {title: 'Обработка запросов и ответов', href: '/projects/engine-http/requests'},
            {title: 'Конфигурация и архитектура', href: '/projects/engine-http/architecture'},
            {title: 'Совместимость', href: '/projects/engine-http/compatibility'},
            {title: 'Безопасность и эксплуатация', href: '/projects/engine-http/security'},
            {title: 'Тесты и ограничения', href: '/projects/engine-http/testing'},
        ]},
        {title: 'Triangle Engine HTTP · English', links: [
            {title: 'Overview and compatibility', href: '/projects/engine-http/en'},
            {title: 'Installation and startup', href: '/projects/engine-http/en/install'},
            {title: 'Requests and responses', href: '/projects/engine-http/en/requests'},
            {title: 'Configuration and architecture', href: '/projects/engine-http/en/architecture'},
            {title: 'Compatibility', href: '/projects/engine-http/en/compatibility'},
            {title: 'Security and operations', href: '/projects/engine-http/en/security'},
            {title: 'Testing and limits', href: '/projects/engine-http/en/testing'},
        ]},
    ],
    'engine-ws': [
        {title: 'Triangle Engine WS · Русский', links: [
            {title: 'Обзор и совместимость', href: '/projects/engine-ws'},
            {title: 'Установка и запуск', href: '/projects/engine-ws/install'},
            {title: 'Handshake и сообщения', href: '/projects/engine-ws/messages'},
            {title: 'Конфигурация и архитектура', href: '/projects/engine-ws/architecture'},
            {title: 'Совместимость', href: '/projects/engine-ws/compatibility'},
            {title: 'Безопасность и эксплуатация', href: '/projects/engine-ws/security'},
            {title: 'Тесты и ограничения', href: '/projects/engine-ws/testing'},
        ]},
        {title: 'Triangle Engine WS · English', links: [
            {title: 'Overview and compatibility', href: '/projects/engine-ws/en'},
            {title: 'Installation and startup', href: '/projects/engine-ws/en/install'},
            {title: 'Handshake and messages', href: '/projects/engine-ws/en/messages'},
            {title: 'Configuration and architecture', href: '/projects/engine-ws/en/architecture'},
            {title: 'Compatibility', href: '/projects/engine-ws/en/compatibility'},
            {title: 'Security and operations', href: '/projects/engine-ws/en/security'},
            {title: 'Testing and limits', href: '/projects/engine-ws/en/testing'},
        ]},
    ],
    engine: [
        {title: 'Triangle Engine · Русский', links: [
            {title: 'Обзор и статус версии', href: '/projects/engine'},
            {title: 'Требования', href: '/projects/engine/requirements'},
            {title: 'Установка', href: '/projects/engine/install'},
            {title: 'Запуск и конфигурация', href: '/projects/engine/start'},
            {title: 'Архитектура и runtime', href: '/projects/engine/architecture'},
            {title: 'Помощники и API', href: '/projects/engine/helpers'},
            {title: 'Совместимость', href: '/projects/engine/compatibility'},
            {title: 'Тесты и ограничения', href: '/projects/engine/testing'},
        ]},
        {title: 'Triangle Engine · English', links: [
            {title: 'Overview and release status', href: '/projects/engine/en'},
            {title: 'Requirements', href: '/projects/engine/en/requirements'},
            {title: 'Installation', href: '/projects/engine/en/install'},
            {title: 'Startup and configuration', href: '/projects/engine/en/start'},
            {title: 'Architecture and runtime', href: '/projects/engine/en/architecture'},
            {title: 'Helpers and API', href: '/projects/engine/en/helpers'},
            {title: 'Compatibility and migration', href: '/projects/engine/en/compatibility'},
            {title: 'Tests and coverage limits', href: '/projects/engine/en/testing'},
        ]},
    ],
    console: [{title: 'Localzet Console', links: [{title: 'Обзор', href: '/projects/console'}, {title: 'Установка и команды', href: '/projects/console/start'}, {title: 'Laravel bridge и TUI', href: '/projects/console/reference'}]}],
    'triangle-console': [{title: 'Triangle Console', links: [{title: 'Обзор и установка', href: '/projects/triangle-console'}, {title: 'Overview and installation', href: '/projects/triangle-console/en'}]}],
    'triangle-database': [{title: 'Triangle Database', links: [{title: 'Обзор и установка', href: '/projects/triangle-database'}, {title: 'Overview and installation', href: '/projects/triangle-database/en'}]}],
    'triangle-session': [{title: 'Triangle Session', links: [{title: 'Обзор и установка', href: '/projects/triangle-session'}, {title: 'Overview and installation', href: '/projects/triangle-session/en'}]}],
    'triangle-cron': [{title: 'Triangle Cron', links: [{title: 'Обзор и статус релиза', href: '/projects/triangle-cron'}, {title: 'Overview and release status', href: '/projects/triangle-cron/en'}]}],
    'triangle-middleware': [{title: 'Triangle Middleware', links: [{title: 'Обзор и установка', href: '/projects/triangle-middleware'}, {title: 'Overview and installation', href: '/projects/triangle-middleware/en'}]}],
    'triangle-events': [
        {title: 'Triangle Events · Русский', links: [
            {title: 'Обзор и быстрый путь', href: '/projects/triangle-events'},
            {title: 'Установка', href: '/projects/triangle-events/install'},
            {title: 'Обработчики и вызов', href: '/projects/triangle-events/usage'},
            {title: 'Эксплуатация и ограничения', href: '/projects/triangle-events/operations'},
            {title: 'Совместимость и проверки', href: '/projects/triangle-events/compatibility'},
        ]},
        {title: 'Triangle Events · English', links: [
            {title: 'Overview and quick start', href: '/projects/triangle-events/en'},
            {title: 'Installation', href: '/projects/triangle-events/en/install'},
            {title: 'Listeners and dispatch', href: '/projects/triangle-events/en/usage'},
            {title: 'Operations and limits', href: '/projects/triangle-events/en/operations'},
            {title: 'Compatibility and checks', href: '/projects/triangle-events/en/compatibility'},
        ]},
    ],
    'triangle-view': [
        {title: 'Triangle View · Русский', links: [
            {title: 'Обзор', href: '/projects/triangle-view'},
            {title: 'Установка', href: '/projects/triangle-view/install'},
            {title: 'Рендеринг', href: '/projects/triangle-view/usage'},
            {title: 'Настройка и безопасность', href: '/projects/triangle-view/operations'},
            {title: 'Совместимость и тесты', href: '/projects/triangle-view/compatibility'},
        ]},
        {title: 'Triangle View · English', links: [
            {title: 'Overview', href: '/projects/triangle-view/en'},
            {title: 'Installation', href: '/projects/triangle-view/en/install'},
            {title: 'Rendering', href: '/projects/triangle-view/en/usage'},
            {title: 'Configuration and security', href: '/projects/triangle-view/en/operations'},
            {title: 'Compatibility and tests', href: '/projects/triangle-view/en/compatibility'},
        ]},
    ],
    'triangle-router': [
        {title: 'Triangle Router · Русский', links: [
            {title: 'Обзор', href: '/projects/triangle-router'},
            {title: 'Установка', href: '/projects/triangle-router/install'},
            {title: 'Маршруты и dispatch', href: '/projects/triangle-router/usage'},
            {title: 'Интеграция Engine', href: '/projects/triangle-router/operations'},
            {title: 'Совместимость и безопасность', href: '/projects/triangle-router/compatibility'},
        ]},
        {title: 'Triangle Router · English', links: [
            {title: 'Overview', href: '/projects/triangle-router/en'},
            {title: 'Installation', href: '/projects/triangle-router/en/install'},
            {title: 'Routes and dispatch', href: '/projects/triangle-router/en/usage'},
            {title: 'Engine integration', href: '/projects/triangle-router/en/operations'},
            {title: 'Compatibility and security', href: '/projects/triangle-router/en/compatibility'},
        ]},
    ],
    'triangle-oauth': [{title: 'Triangle OAuth', links: [{title: 'Обзор и опубликованный статус', href: '/projects/triangle-oauth'}, {title: 'Overview and published status', href: '/projects/triangle-oauth/en'}]}],
    'triangle-web': [{title: 'Triangle Web', links: [{title: 'Обзор и запуск шаблона', href: '/projects/triangle-web'}, {title: 'Overview and getting started', href: '/projects/triangle-web/en'}]}],
    'triangle-ws': [{title: 'Triangle WS', links: [{title: 'Обзор и ограничения', href: '/projects/triangle-ws'}, {title: 'Overview and limits', href: '/projects/triangle-ws/en'}]}],
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
    media: [
        {title: 'Triangle Media · Русский', links: [
            {title: 'Обзор', href: '/projects/media'},
            {title: 'Установка и первый запуск', href: '/projects/media/start'},
            {title: 'Совместимость и переход', href: '/projects/media/compatibility'},
            {title: 'Конфигурация и адаптеры', href: '/projects/media/configuration'},
            {title: 'Загрузка изображений', href: '/projects/media/upload'},
            {title: 'Обработка и выдача', href: '/projects/media/processing'},
            {title: 'Безопасность и эксплуатация', href: '/projects/media/security'},
            {title: 'Тесты и ограничения', href: '/projects/media/testing'},
        ]},
        {title: 'Triangle Media · English', links: [
            {title: 'Overview', href: '/projects/media/en'},
            {title: 'Installation and first run', href: '/projects/media/en/start'},
            {title: 'Compatibility and migration', href: '/projects/media/en/compatibility'},
            {title: 'Configuration and adapters', href: '/projects/media/en/configuration'},
            {title: 'Uploading images', href: '/projects/media/en/upload'},
            {title: 'Processing and delivery', href: '/projects/media/en/processing'},
            {title: 'Security and operations', href: '/projects/media/en/security'},
            {title: 'Tests and limits', href: '/projects/media/en/testing'},
        ]},
    ],
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
