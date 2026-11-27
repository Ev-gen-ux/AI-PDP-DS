import { resolve, relative, dirname, isAbsolute, sep } from 'node:path';
import { readFileSync } from 'node:fs';
import { safePath } from './project.js';

// Local Markdown subset: inline links, reference definitions and @ imports.
// Examples in fenced or inline code are not live links.
export function links(content) {
  const prose = content
    .replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, '')
    .replace(/`[^`\n]+`/g, '');
  return [
    ...prose.matchAll(
      /\[[^\]\n]*\]\((<[^>\n]+>|[^\s)]+)(?:\s+"[^"\n]*")?\)|^\s*\[[^\]\n]+\]:\s*(\S+)|^@([^\s]+\.md)\s*$/gm,
    ),
  ].map((m) => (m[1] ?? m[2] ?? m[3]).replace(/^<|>$/g, ''));
}
export function localLink(root, source, href) {
  if (/^(?:https?:|mailto:)/i.test(href) || href.startsWith('#')) return null;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || isAbsolute(href) || href.startsWith('//'))
    throw Error('Unsupported link: ' + href);
  const path = decodeURIComponent(href.split(/[?#]/)[0]);
  const destination = relative(root, resolve(root, dirname(source), path))
    .split(sep)
    .join('/');
  safePath(root, destination);
  return destination;
}
export function linked(root, source) {
  return links(readFileSync(safePath(root, source), 'utf8'))
    .map((href) => localLink(root, source, href))
    .filter(Boolean);
}
