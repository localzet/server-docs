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
const DEFAULT_TITLE = 'Localzet Server — документация версии 7.x'
const DEFAULT_DESCRIPTION = 'Официальная документация Localzet Server: асинхронный PHP runtime для HTTP/1.x, WebSocket, TCP и UDP, с event loop и управлением worker-процессами.'
const CLUSTER_TITLE = 'Localzet Cluster — документация'
const CLUSTER_DESCRIPTION = 'Документация Localzet Cluster: распределённая архитектура Gateway/Business Worker для приложений на PHP, регистрация узлов и маршрутизация клиентских соединений.'

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

const RELATED_PROJECTS = {
    cron: ['Localzet Cron', 'Timer based scheduling for Localzet Server.', 'https://github.com/localzet/Cron'],
    httpclient: ['Localzet HTTP Client', 'Asynchronous HTTP requests and connection pooling for Localzet Server.', 'https://github.com/localzet/HttpClient'],
    mqtt: ['Localzet MQTT', 'Incomplete MQTT 3/5 client port. Runtime compatibility and broker integration are not established.', 'https://github.com/localzet/MQTT'],
    psr7: ['Localzet PSR-7', 'PSR-7 HTTP message objects, streams and URI utilities for Server 7.', 'https://github.com/localzet/PSR-7'],
    proxy: ['Localzet Proxy', 'Experimental HTTP forward proxy with an empty-by-default exact host and port allowlist. Client authentication and DNS/private-address policy remain deployment responsibilities.', 'https://github.com/localzet/Proxy'],
    socks5: ['Localzet SOCKS5', 'SOCKS5 TCP CONNECT proxy for Localzet Server with loopback-first configuration.', 'https://github.com/localzet/SOCKS5'],
    socketio: ['Localzet Socket.IO', 'Socket.IO server implementation with a Server 7 protocol adapter. Cross-process Tunnel delivery requires an unpublished Server 7-compatible Tunnel release.', 'https://github.com/localzet/SocketIO'],
    storage: ['Localzet Storage', 'Client/server shared in-memory store for Localzet Server. Object deserialization is disabled by default.', 'https://github.com/localzet/Storage'],
    tunnel: ['Localzet Tunnel', 'Client/server messaging channel for Localzet Server processes.', 'https://github.com/localzet/Tunnel'],
    noter: ['Noter', 'Command-line utility for creating and managing notes; it uses Localzet HTTP Client transitively.', 'https://github.com/localzet/Noter'],
}

export default function App({Component, pageProps}) {
    const router = useRouter()
    const projectId = router.pathname.startsWith('/projects/') ? router.pathname.split('/')[2] : null
    const relatedProject = RELATED_PROJECTS[projectId]
    const cluster = isClusterDocumentation(router.pathname)
    const current = isCurrentDocumentation(router.pathname) || cluster || Boolean(relatedProject)
    const title = pageProps.pageTitle ?? pageProps.title ?? DEFAULT_TITLE
    const description = pageProps.description ?? (cluster ? CLUSTER_DESCRIPTION : relatedProject?.[1] ?? DEFAULT_DESCRIPTION)
    const canonicalPath = router.asPath.split(/[?#]/, 1)[0]
    const currentUrl = `${cluster ? 'https://server.localzet.com' : SITE_URL}${canonicalPath}`
    const robots = current ? 'index,follow' : 'noindex,follow'
    const graph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                name: cluster ? CLUSTER_TITLE : 'Localzet Server — документация',
                url: SITE_URL,
                description,
                inLanguage: 'ru',
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
                '@id': `${SITE_URL}/#software`,
                name: cluster ? 'Localzet Cluster' : relatedProject?.[0] ?? 'Localzet Server',
                description,
                codeRepository: cluster ? 'https://github.com/localzet/Cluster' : relatedProject?.[2] ?? 'https://github.com/localzet/Server',
                programmingLanguage: 'PHP',
                runtimePlatform: 'PHP 8.1 or newer',
                version: cluster ? 'current Cluster source, requires Server ^4.2' : relatedProject ? 'current repository source' : '7.x development version',
                license: 'https://spdx.org/licenses/AGPL-3.0-or-later.html',
                author: {
                    '@type': 'Person',
                    name: 'Ivan Zorin',
                    url: 'https://github.com/localzet',
                },
                featureList: relatedProject ? [relatedProject[1]] : cluster ? [
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
                inLanguage: 'ru',
                isPartOf: {'@id': `${SITE_URL}/#website`},
                about: {'@id': `${SITE_URL}/#software`},
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
                <link rel="alternate" type="text/plain" href={`${SITE_URL}/llms.txt`} title="AI-readable project guide" />
                <meta name="author" content="Ivan Zorin" />
                <meta name="publisher" content="Localzet Group" />
                <meta property="og:locale" content="ru_RU" />
                <meta property="og:type" content={router.pathname === '/' ? 'website' : 'article'} />
                    <meta property="og:site_name" content={cluster ? CLUSTER_TITLE : relatedProject?.[0] ?? 'Localzet Server — документация'} />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={`${SITE_URL}/images/server-docs-social.png`} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                    <meta property="og:image:alt" content={cluster ? 'Localzet Cluster — Gateway и Business Worker для PHP' : 'Localzet Server — асинхронный PHP runtime для HTTP, WebSocket, TCP и UDP'} />
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
