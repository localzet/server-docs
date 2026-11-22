import Head from 'next/head'
import {Router, useRouter} from 'next/router'
import {MDXProvider} from '@mdx-js/react'
import Script from 'next/script'

import {Layout} from '@/components/Layout'
import * as mdxComponents from '@/components/mdx'
import {useMobileNavigationStore} from '@/components/MobileNavigation'

import '@/styles/tailwind.css'
import 'focus-visible'

const SITE_URL = 'https://server.localzet.com'
const DEFAULT_TITLE = 'Localzet Server 7.2.3 — документация'
const DEFAULT_DESCRIPTION = 'Техническая документация Localzet Server и связанных PHP-проектов Localzet и Triangle: установка, архитектура, примеры, безопасность и совместимость.'
const CLUSTER_TITLE = 'Localzet Cluster — документация'
const CLUSTER_DESCRIPTION = 'Документация Localzet Cluster: распределённая архитектура Gateway/Business Worker для приложений на PHP, регистрация узлов и маршрутизация клиентских соединений.'
const BILINGUAL_PROJECTS = new Set([
    'media',
    'triangle-console',
    'triangle-cron',
    'triangle-database',
    'triangle-events',
    'triangle-middleware',
    'triangle-oauth',
    'triangle-router',
    'triangle-session',
    'triangle-view',
    'triangle-web',
    'triangle-ws',
])

function onRouteChange() {
    useMobileNavigationStore.getState().close()
}

Router.events.on('routeChangeStart', onRouteChange)
Router.events.on('hashChangeStart', onRouteChange)

function isCurrentDocumentation(pathname) {
    return (
        pathname === '/' ||
        pathname.startsWith('/current/') ||
        pathname.startsWith('/api-ref/') ||
        pathname === '/research/benchmarks' ||
        pathname === '/research/comparison'
    )
}

function isClusterDocumentation(pathname) {
    return pathname.startsWith('/projects/cluster')
}

function getProjectLocalePaths(pathname, projectId) {
    if (!BILINGUAL_PROJECTS.has(projectId)) {
        return null
    }

    const russianRoot = `/projects/${projectId}`
    const englishRoot = `${russianRoot}/en`

    if (pathname === russianRoot || pathname === englishRoot) {
        return {ru: russianRoot, en: englishRoot}
    }

    if (pathname.startsWith(`${englishRoot}/`)) {
        return {ru: pathname.replace(englishRoot, russianRoot), en: pathname}
    }

    if (pathname.startsWith(`${russianRoot}/`)) {
        return {ru: pathname, en: pathname.replace(russianRoot, englishRoot)}
    }

    return null
}

const RELATED_PROJECTS = {
    console: [
        'Localzet Console',
        'PHP command-line application library based on Symfony Console, with an opt-in Laravel command bridge and Unicode-safe terminal interfaces.',
        'https://github.com/localzet/Console',
        'Stable release 2.3.0 requires PHP 8.4.1+.',
        [
            'Build CLI applications with Symfony Console APIs',
            'Register Laravel commands explicitly with an existing application container',
            'Render Unicode-aware ANSI tables and bounded terminal dashboards',
        ],
    ],
    'triangle-console': [
        'Triangle Console',
        'Console application integration for Triangle Engine with command discovery, application generators, and an explicit Laravel command bridge.',
        'https://github.com/Triangle-org/Console',
        'Stable release 2.0.0 targets PHP 8.4.1+ and Triangle Engine 9.',
        ['Discover Triangle application commands', 'Register framework and plugin commands', 'Bridge existing Illuminate commands when needed'],
    ],
    'triangle-database': [
        'Triangle Database',
        'Database integration for Triangle Engine applications, including connections, query builder, Eloquent models, events, and pagination.',
        'https://github.com/Triangle-org/Database',
        'Stable release 2.0.0 targets PHP 8.2+ and Triangle Engine 9.',
        ['Configure database connections and drivers', 'Use query builder and Eloquent integration', 'Handle process-local connection lifecycle'],
    ],
    'triangle-session': [
        'Triangle Session',
        'Session handlers for Triangle Engine applications, with file storage by default and optional Redis, cluster, and MongoDB backends.',
        'https://github.com/Triangle-org/Session',
        'Stable release 2.0.0 targets Triangle Engine 9 and Localzet Server 7.1+.',
        ['Configure session cookies and handlers', 'Share session storage across workers with a shared backend', 'Keep PHP object deserialization disabled by default'],
    ],
    'triangle-events': [
        'Triangle Events',
        'In-process event dispatch for Triangle Engine applications with exact and prefix listeners.',
        'https://github.com/Triangle-org/Events',
        'Stable release 2.0.1 targets PHP 8.1+ and Triangle Engine 9.',
        ['Register and remove event listeners', 'Dispatch events synchronously in the current process', 'Use prefix listeners for event families'],
    ],
    'triangle-view': [
        'Triangle View',
        'Template rendering integration for Triangle Engine applications, with PHP templates by default and optional template adapters.',
        'https://github.com/Triangle-org/View',
        'Stable release 2.1.0 supports Triangle Engine 8 and 9.',
        ['Render PHP templates with `.phtml` files', 'Pass request-scoped and explicit template variables', 'Add optional Blade, Twig, or Think adapters'],
    ],
    'triangle-router': [
        'Triangle Router',
        'HTTP routing for Triangle Engine with method, named, optional, grouped, resource, and middleware routes.',
        'https://github.com/Triangle-org/Router',
        'Stable release 2.0.7 supports Triangle Engine 8 and 9.',
        ['Define method and named routes', 'Compose groups, child routers, and resources', 'Apply route middleware and route caching'],
    ],
    'triangle-middleware': [
        'Triangle Middleware',
        'Middleware pipeline for Triangle Engine applications, with route integration and explicit execution order.',
        'https://github.com/Triangle-org/Middleware',
        'Stable release 2.0.3 targets Triangle Engine 9.',
        ['Register request and response middleware', 'Control middleware order and scope', 'Integrate middleware with routed requests'],
    ],
    'triangle-cron': [
        'Triangle Cron',
        'Scheduled job integration for Triangle applications. The published package remains on Engine 8; Engine 9 work is an untagged preview.',
        'https://github.com/Triangle-org/Cron',
        'Published release 1.0.3 targets Triangle Engine 8; Engine 9 preview is not released.',
        ['Review the published Engine 8 package contract', 'Distinguish tagged releases from preview source', 'Check current package constraints before migration'],
    ],
    'triangle-oauth': [
        'Triangle OAuth',
        'OAuth 1, OAuth 2, and OpenID provider integrations with callback handling and state storage for Triangle applications.',
        'https://github.com/Triangle-org/OAuth',
        'Published release 3.0.9 requires PHP 8.2+ and Localzet HTTP 2; current checkout has additional Engine requirements.',
        ['Configure OAuth and OpenID providers', 'Handle callback and state storage', 'Verify published and current-source dependency constraints'],
    ],
    'triangle-web': [
        'Triangle Web',
        'MVC application template for Triangle Engine, with HTTP routing, controllers, configuration, and project structure.',
        'https://github.com/Triangle-org/Web',
        'Published release 8.0.1 targets PHP 8.2+ and Triangle Engine 8.1.',
        ['Create an application from the project template', 'Configure server, routes, controllers, and views', 'Inspect the exact dependency lock before migrating to Engine 9'],
    ],
    'triangle-ws': [
        'Triangle WS',
        'WebSocket-first application template for Triangle Engine, with path-scoped local sends and a single-worker default.',
        'https://github.com/Triangle-org/WS',
        'Published release 1.0.4 targets Triangle Engine 8.1 and Engine WS 2; current checkout uses Engine WS 1.1.',
        ['Create a WebSocket application from the template', 'Register route callbacks and exchange payloads', 'Account for single-process state and version differences'],
    ],
    engine: [
        'Triangle Engine',
        'PHP application engine for Triangle with request handling, routing integration, service lifecycle, and runtime helpers.',
        'https://github.com/Triangle-org/Engine',
        'Stable release 9.0.0 for Localzet Server 7.1+.',
        [
            'PHP application engine for Triangle projects',
            'Request, response, context, bootstrap, and service-container integration',
            'Current stable package targets Localzet Server 7.1+',
        ],
    ],
    'engine-http': [
        'Triangle Engine HTTP',
        'HTTP adapter connecting Triangle applications, routes, middleware, controllers, and responses to Localzet Server.',
        'https://github.com/Triangle-org/Engine-HTTP',
        'Stable release 3.0.0 for Engine 9 and Localzet Server 7.1+.',
        [
            'Dispatch HTTP requests into Triangle routes and controllers',
            'Integrate route middleware and normalize HTTP responses',
            'Use Localzet Server as the listener and network runtime',
        ],
    ],
    'engine-ws': [
        'Triangle Engine WS',
        'WebSocket adapter for Triangle applications with handshake routing, message callbacks, and process-local connection groups.',
        'https://github.com/Triangle-org/Engine-WS',
        'Stable release 2.0.0 for Engine 9 and Localzet Server 7.1+.',
        [
            'Route HTTP upgrade handshakes through Triangle middleware',
            'Dispatch WebSocket messages to route callbacks',
            'Keep connection groups local to each worker process',
        ],
    ],
    cron: ['Localzet Cron', 'Timer based scheduling for Localzet Server.', 'https://github.com/localzet/Cron', 'Stable release 2.0.1.'],
    httpclient: ['Localzet HTTP Client', 'Asynchronous HTTP requests and connection pooling for Localzet Server.', 'https://github.com/localzet/HttpClient', 'Stable release 3.0.2 requires PHP 8.2+.'],
    mqtt: ['Localzet MQTT', 'MQTT 3.1.1 and MQTT 5 client for Localzet Server with TCP/TLS and QoS 0/1/2.', 'https://github.com/localzet/MQTT', 'Stable release 1.0.3.'],
    psr7: ['Localzet PSR-7', 'PSR-7 HTTP message objects, streams and URI utilities for Server 7.', 'https://github.com/localzet/PSR-7', 'Stable release 4.0.0.'],
    proxy: ['Localzet Proxy', 'HTTP forward proxy with Basic authentication, an exact literal-IP and port allowlist, bounded request headers, and a per-worker connection limit. TLS ingress and outbound ACLs remain deployment responsibilities.', 'https://github.com/localzet/Proxy', 'Stable release 1.0.3.'],
    socks5: ['Localzet SOCKS5', 'SOCKS5 TCP CONNECT proxy for Localzet Server with loopback-first configuration.', 'https://github.com/localzet/SOCKS5', 'Stable release 1.0.1.'],
    socketio: ['Localzet Socket.IO', 'Socket.IO server implementation for Server 7. Cross-process broadcast uses the optional Tunnel 4 adapter; authentication remains application-specific.', 'https://github.com/localzet/SocketIO', 'Stable release 2.0.3.'],
    storage: ['Localzet Storage', 'Client/server shared in-memory store for Localzet Server. Object deserialization is disabled by default.', 'https://github.com/localzet/Storage', 'Stable release 2.0.1.'],
    tunnel: ['Localzet Tunnel', 'Client/server messaging channel for Localzet Server processes.', 'https://github.com/localzet/Tunnel', 'Stable release 4.0.2.'],
    noter: ['Noter', 'Command-line utility for sending notes to an HTTP receiver; it uses Localzet HTTP Client transitively.', 'https://github.com/localzet/Noter', 'Stable release 0.1.14 requires PHP 8.4.1+.'],
    media: [
        'Triangle Media',
        'Image upload and processing plugin for Triangle Engine 9: validates local files and public HTTP(S) URLs, converts images, applies bounded transformations, and stores metadata through host adapters.',
        'https://github.com/Triangle-org/Media',
        'Engine 9 migration is under review; no stable Engine 9 package release has been verified.',
        [
            'Accept multipart uploads and remote HTTP(S) image URLs',
            'Validate MIME type, upload size, decoded pixels, and animated frame count',
            'Convert accepted images to PNG and store image metadata through the host database adapter',
            'Apply crop, resize, pixelize, and cover transformations with ImageMagick resource limits',
            'Pin remote DNS resolution and reject non-public destinations to reduce SSRF risk',
        ],
    ],
}

export default function App({Component, pageProps}) {
    const router = useRouter()
    const projectId = router.pathname.startsWith('/projects/') ? router.pathname.split('/')[2] : null
    const relatedProject = RELATED_PROJECTS[projectId]
    const language = router.pathname.split('/').includes('en') ? 'en' : 'ru'
    const cluster = isClusterDocumentation(router.pathname)
    const current = isCurrentDocumentation(router.pathname) || cluster || Boolean(relatedProject)
    const title = pageProps.pageTitle ?? pageProps.title ?? DEFAULT_TITLE
    const description = pageProps.description ?? (cluster ? CLUSTER_DESCRIPTION : relatedProject?.[1] ?? DEFAULT_DESCRIPTION)
    const canonicalPath = router.asPath.split(/[?#]/, 1)[0]
    const currentUrl = `${cluster ? 'https://server.localzet.com' : SITE_URL}${canonicalPath}`
    const projectLocalePaths = projectId ? getProjectLocalePaths(router.pathname, projectId) : null
    const softwareId = `${SITE_URL}/#software-${cluster ? 'cluster' : projectId ?? 'server'}`
    const semanticVersion = relatedProject?.[3]?.match(/\b\d+\.\d+\.\d+\b/)?.[0]
    const phpVersion = relatedProject?.[3]?.match(/PHP\s+(\d+(?:\.\d+){1,2})/i)?.[1]
    const robots = current ? 'index,follow' : 'noindex,follow'
    const graph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                name: 'Localzet Server documentation',
                url: SITE_URL,
                description: DEFAULT_DESCRIPTION,
                inLanguage: language,
                publisher: {'@id': `${SITE_URL}/#publisher`},
            },
            {
                '@type': 'Organization',
                '@id': `${SITE_URL}/#publisher`,
                name: 'Localzet Group',
                url: 'https://localzet.com/',
            },
            {
                '@type': 'SoftwareSourceCode',
                '@id': softwareId,
                name: cluster ? 'Localzet Cluster' : relatedProject?.[0] ?? 'Localzet Server',
                description,
                codeRepository: cluster ? 'https://github.com/localzet/Cluster' : relatedProject?.[2] ?? 'https://github.com/localzet/Server',
                programmingLanguage: 'PHP',
                runtimePlatform: phpVersion ? `PHP ${phpVersion} or newer` : 'PHP 8.1 or newer',
                version: cluster ? '1.1.0' : semanticVersion ?? (relatedProject ? 'current source' : '7.2.3'),
                license: 'https://spdx.org/licenses/AGPL-3.0-or-later.html',
                author: {
                    '@type': 'Person',
                    name: 'Ivan Zorin',
                    url: 'https://github.com/localzet',
                },
                featureList: relatedProject ? (relatedProject[4] ?? [relatedProject[1]]) : cluster ? [
                    'Gateway and Business Worker cluster topology',
                    'Register service for node discovery',
                    'Client and group message routing',
                    'Shared-secret node authentication',
                ] : [
                    'HTTP/1.x and TLS over PHP streams',
                    'WebSocket, TCP and UDP protocols',
                    'Pluggable event loop backends',
                    'Worker process lifecycle management',
                    'HTTP reverse proxy and raw TCP proxy',
                ],
            },
            {
                '@type': 'WebPage',
                '@id': `${currentUrl}#webpage`,
                name: title,
                description,
                url: currentUrl,
                inLanguage: language,
                isPartOf: {'@id': `${SITE_URL}/#website`},
                about: {'@id': softwareId},
                ...(router.pathname !== '/' && {
                    breadcrumb: {'@id': `${currentUrl}#breadcrumb`},
                }),
            },
            ...(router.pathname !== '/' ? [{
                '@type': 'BreadcrumbList',
                '@id': `${currentUrl}#breadcrumb`,
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Главная',
                        item: SITE_URL,
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: title,
                        item: currentUrl,
                    },
                ],
            }] : []),
        ],
    }

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="robots" content={robots} />
                <title>{router.pathname === '/' ? DEFAULT_TITLE : `${title} — ${cluster ? 'Localzet Cluster' : relatedProject?.[0] ?? 'Localzet Server'}`}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={currentUrl} />
                {projectLocalePaths && <>
                    <link rel="alternate" hrefLang="ru" href={`${SITE_URL}${projectLocalePaths.ru}`} />
                    <link rel="alternate" hrefLang="en" href={`${SITE_URL}${projectLocalePaths.en}`} />
                    <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${projectLocalePaths.ru}`} />
                </>}
                <link rel="alternate" type="text/plain" href={`${SITE_URL}/llms.txt`} title="AI-readable project guide" />
                <meta name="author" content="Ivan Zorin" />
                <meta name="publisher" content="Localzet Group" />
                <meta property="og:locale" content={language === 'en' ? 'en_US' : 'ru_RU'} />
                <meta property="og:type" content={router.pathname === '/' ? 'website' : 'article'} />
                <meta property="og:site_name" content={cluster ? CLUSTER_TITLE : relatedProject?.[0] ?? 'Localzet Server — документация'} />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={`${SITE_URL}/images/server-docs-social.png`} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content={cluster ? 'Localzet Cluster — Gateway и Business Worker для PHP' : relatedProject?.[0] ?? 'Localzet Server — асинхронный PHP runtime для HTTP, WebSocket, TCP и UDP'} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@localzet" />
                <meta name="twitter:creator" content="@localzet" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={`${SITE_URL}/images/server-docs-social.png`} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(graph)}}
                />
            </Head>

            <Script defer src="https://analytics.localzet.com/pixel/DtxwV7cnsD9ASWxB" data-ignore-dnt="true" />

            <MDXProvider components={mdxComponents}>
                <Layout {...pageProps} legacy={!current}>
                    <Component {...pageProps} />
                </Layout>
            </MDXProvider>
        </>
    )
}
