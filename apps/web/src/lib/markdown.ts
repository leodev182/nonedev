import { codeToHtml } from 'shiki'
import { marked } from 'marked'

const PLACEHOLDER = 'CODEBLOCK_PH'

function wrapCodeBlock(lang: string, shikiHtml: string): string {
  const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`
  const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`

  return `<figure class="code-block" data-lang="${lang}">
  <div class="code-block__header">
    <span class="code-block__lang">${lang}</span>
    <button class="code-block__copy" data-copy-icon="${encodeURIComponent(copyIcon)}" data-check-icon="${encodeURIComponent(checkIcon)}" aria-label="Copiar código">${copyIcon}<span>Copy</span></button>
  </div>
  <div class="code-block__body">${shikiHtml}</div>
</figure>`
}

export async function renderMarkdown(input: string): Promise<string> {
  // 1. Extract fenced code blocks and replace with unique placeholders
  const blocks: { lang: string; code: string }[] = []

  const withPlaceholders = input.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const idx = blocks.length
    blocks.push({ lang: (lang || 'text').trim(), code: code.trimEnd() })
    return `\n\n${PLACEHOLDER}_${idx}\n\n`
  })

  // 2. Highlight all code blocks with Shiki in parallel
  const highlighted = await Promise.all(
    blocks.map(async ({ lang, code }) => {
      try {
        const shikiHtml = await codeToHtml(code, { lang, theme: 'github-dark' })
        return wrapCodeBlock(lang, shikiHtml)
      } catch {
        // Fallback: plain styled block for unsupported langs
        const escaped = code
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
        return wrapCodeBlock(lang, `<pre class="shiki"><code>${escaped}</code></pre>`)
      }
    })
  )

  // 3. Parse the rest with marked
  let html = marked(withPlaceholders) as string

  // 4. Restore code blocks (marked may wrap placeholders in <p> tags)
  highlighted.forEach((block, i) => {
    const ph = `${PLACEHOLDER}_${i}`
    html = html
      .replace(new RegExp(`<p>\\s*${ph}\\s*</p>`, 'g'), block)
      .replace(new RegExp(ph, 'g'), block)
  })

  return html
}
