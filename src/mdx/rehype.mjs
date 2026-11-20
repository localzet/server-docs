import {mdxAnnotations} from 'mdx-annotations'
import {visit} from 'unist-util-visit'
import rehypeMdxTitle from 'rehype-mdx-title'
import {createHighlighter} from 'shiki'
import {toString} from 'mdast-util-to-string'
import * as acorn from 'acorn'
import {slugifyWithCounter} from '@sindresorhus/slugify'

function rehypeParseCodeBlocks() {
    return (tree) => {
        visit(tree, 'element', (node, _nodeIndex, parentNode) => {
            if (node.tagName === 'code' && node.properties.className) {
                parentNode.properties.language = node.properties.className[0]?.replace(
                    /^language-/,
                    ''
                )
            }
        })
    }
}

let highlighterPromise
let highlighter
let languageLoads = new Map()

const codeTheme = {
    name: 'localzet-css-variables',
    type: 'dark',
    colors: {
        'editor.foreground': 'var(--shiki-color-text)',
        'editor.background': 'transparent',
    },
    tokenColors: [
        {
            scope: ['constant', 'constant.numeric', 'constant.language', 'constant.character'],
            settings: {foreground: 'var(--shiki-token-constant)'},
        },
        {scope: ['string'], settings: {foreground: 'var(--shiki-token-string)'}},
        {scope: ['comment'], settings: {foreground: 'var(--shiki-token-comment)'}},
        {
            scope: ['keyword', 'storage.type', 'storage.modifier'],
            settings: {foreground: 'var(--shiki-token-keyword)'},
        },
        {scope: ['variable.parameter'], settings: {foreground: 'var(--shiki-token-parameter)'}},
        {
            scope: ['entity.name.function', 'support.function'],
            settings: {foreground: 'var(--shiki-token-function)'},
        },
        {scope: ['punctuation'], settings: {foreground: 'var(--shiki-token-punctuation)'}},
    ],
}

async function getHighlighter() {
    highlighterPromise ??= createHighlighter({themes: [codeTheme], langs: []})
    highlighter = await highlighterPromise

    return highlighter
}

async function loadLanguage(language) {
    let loaded = await getHighlighter()

    if (!languageLoads.has(language)) {
        languageLoads.set(language, loaded.loadLanguage(language))
    }

    await languageLoads.get(language)

    return loaded
}

function rehypeShiki() {
    return async (tree) => {
        let codeBlocks = []

        visit(tree, 'element', (node) => {
            if (node.tagName === 'pre' && node.children[0]?.tagName === 'code') {
                let codeNode = node.children[0]
                let textNode = codeNode.children[0]

                node.properties.code = textNode.value

                if (node.properties.language) {
                    codeBlocks.push({
                        textNode,
                        code: textNode.value,
                        language: node.properties.language,
                    })
                }
            }
        })

        for (let block of codeBlocks) {
            let loaded = await loadLanguage(block.language)
            let html = loaded.codeToHtml(block.code, {
                lang: block.language,
                theme: codeTheme.name,
            })
            let match = html.match(/^<pre[^>]*><code[^>]*>([\s\S]*)<\/code><\/pre>$/)

            if (!match) {
                throw new Error(`Shiki returned unexpected HTML for ${block.language}`)
            }

            block.textNode.value = match[1]
        }
    }
}

function rehypeSlugify() {
    return (tree) => {
        let slugify = slugifyWithCounter()
        visit(tree, 'element', (node) => {
            if (node.tagName === 'h2' && !node.properties.id) {
                node.properties.id = slugify(toString(node))
            }
        })
    }
}

function rehypeAddMDXExports(getExports) {
    return (tree) => {
        let exports = Object.entries(getExports(tree))

        for (let [name, value] of exports) {
            for (let node of tree.children) {
                if (
                    node.type === 'mdxjsEsm' &&
                    new RegExp(`export\\s+const\\s+${name}\\s*=`).test(node.value)
                ) {
                    return
                }
            }

            let exportStr = `export const ${name} = ${value}`

            tree.children.push({
                type: 'mdxjsEsm',
                value: exportStr,
                data: {
                    estree: acorn.parse(exportStr, {
                        sourceType: 'module',
                        ecmaVersion: 'latest',
                    }),
                },
            })
        }
    }
}

function getSections(node) {
    let sections = []

    for (let child of node.children ?? []) {
        if (child.type === 'element' && child.tagName === 'h2') {
            sections.push(`{
        title: ${JSON.stringify(toString(child))},
        id: ${JSON.stringify(child.properties.id)},
        ...${child.properties.annotation}
      }`)
        } else if (child.children) {
            sections.push(...getSections(child))
        }
    }

    return sections
}

export const rehypePlugins = [
    mdxAnnotations.rehype,
    rehypeParseCodeBlocks,
    rehypeShiki,
    rehypeSlugify,
    rehypeMdxTitle,
    [
        rehypeAddMDXExports,
        (tree) => ({
            sections: `[${getSections(tree).join()}]`,
        }),
    ],
]
