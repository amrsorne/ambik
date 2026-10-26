import { describe, expect, it } from 'vitest'
import { resolvePathRedirect } from './links'

describe('resolvePathRedirect', () => {
  it('ignores non-apex hostnames', () => {
    expect(
      resolvePathRedirect('/mybajet', '', 'www.ambik.link'),
    ).toBeNull()
  })

  it('does not redirect root', () => {
    expect(resolvePathRedirect('/', '', 'ambik.link')).toBeNull()
    expect(resolvePathRedirect('', '', 'ambik.link')).toBeNull()
  })

  it('redirects known slug with 301 destination URL', () => {
    expect(resolvePathRedirect('/mybajet', '', 'ambik.link')).toBe(
      'https://mybajet.ambik.link',
    )
  })

  it('preserves nested path and query', () => {
    expect(
      resolvePathRedirect('/mybajet/foo/bar', '?x=1', 'ambik.link'),
    ).toBe('https://mybajet.ambik.link/foo/bar?x=1')
  })

  it('supports nakmasak and nakmasakapa aliases', () => {
    expect(resolvePathRedirect('/nakmasak', '', 'ambik.link')).toBe(
      'https://nakmasak.ambik.link',
    )
    expect(resolvePathRedirect('/nakmasakapa', '', 'ambik.link')).toBe(
      'https://nakmasak.ambik.link',
    )
  })

  it('skips asset paths', () => {
    expect(
      resolvePathRedirect('/assets/index-abc.js', '', 'ambik.link'),
    ).toBeNull()
    expect(resolvePathRedirect('/logo.svg', '', 'ambik.link')).toBeNull()
  })

  it('returns null for unknown slug', () => {
    expect(resolvePathRedirect('/not-a-project', '', 'ambik.link')).toBeNull()
  })
})
