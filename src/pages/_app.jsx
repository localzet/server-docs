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

export default function App({Component, pageProps}) {
    const router = useRouter()
    const current = isCurrentDocumentation(router.pathname)
    const title = pageProps.pageTitle ?? pageProps.title ?? DEFAULT_TITLE
    const description = pageProps.description ?? DEFAULT_DESCRIPTION
    const canonicalPath = router.asPath.split(/[?#]/, 1)[0]
    const currentUrl = `${SITE_URL}${canonicalPath}`
    const robots = current ? 'index,follow' : 'noindex,follow'
    const graph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'WebSite',
                '@id': `${SITE_URL}/#website`,
                name: 'Localzet Server — документация',
                url: SITE_URL,
                description: DEFAULT_DESCRIPTION,
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
                name: 'Localzet Server',
                description: DEFAULT_DESCRIPTION,
                codeRepository: 'https://github.com/localzet/Server',
                programmingLanguage: 'PHP',
                runtimePlatform: 'PHP 8.1 or newer',
                version: '7.x development version',
                license: 'https://spdx.org/licenses/AGPL-3.0-or-later.html',
                author: {
                    '@type': 'Person',
                    name: 'Ivan Zorin',
                    url: 'https://github.com/localzet',
                },
                featureList: [
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
                <title>{router.pathname === '/' ? DEFAULT_TITLE : `${title} — Localzet Server`}</title>
                <meta name="description" content={description} />
                <link rel="canonical" href={currentUrl} />
                <link rel="alternate" type="text/plain" href={`${SITE_URL}/llms.txt`} title="AI-readable project guide" />
                <meta name="author" content="Ivan Zorin" />
                <meta name="publisher" content="Localzet Group" />
                <meta property="og:locale" content="ru_RU" />
                <meta property="og:type" content={router.pathname === '/' ? 'website' : 'article'} />
                <meta property="og:site_name" content="Localzet Server — документация" />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={`${SITE_URL}/images/server-docs-social.png`} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:image:alt" content="Localzet Server — асинхронный PHP runtime для HTTP, WebSocket, TCP и UDP" />
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
