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
const DEFAULT_TITLE = 'Localzet Server — документация линии 7.x'
const DEFAULT_DESCRIPTION = 'Руководство по текущей ветке Localzet Server 7.x: установка, процессы, event loop, HTTP, TCP, UDP, WebSocket и gateway.'

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
        '@type': 'WebPage',
        name: title,
        description,
        url: currentUrl,
        inLanguage: 'ru',
        isPartOf: {
            '@type': 'WebSite',
            name: 'Localzet Server — документация',
            url: SITE_URL,
        },
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
                <meta property="og:locale" content="ru_RU" />
                <meta property="og:type" content={router.pathname === '/' ? 'website' : 'article'} />
                <meta property="og:site_name" content="Localzet Server — документация" />
                <meta property="og:url" content={currentUrl} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={`${SITE_URL}/logo-dark.png`} />
                <meta property="og:image:alt" content="Localzet Server" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={`${SITE_URL}/logo-dark.png`} />
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
