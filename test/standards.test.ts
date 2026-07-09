import { describe, it, expect } from 'vitest'
import { standards } from '../src/data/standards'

describe('standards', () => {
  it('returns an array of Standard objects', () => {
    expect(Array.isArray(standards)).toBe(true)
    expect(standards.length).toBeGreaterThan(0)
  })

  it('every entry matches the Standard shape', () => {
    for (const s of standards) {
      expect(s).toStrictEqual({
        id: expect.stringMatching(/^[a-z0-9-]+$/),
        code: expect.any(String),
        shortTitle: expect.any(String),
        description: expect.any(String),
        url: expect.stringMatching(/^https?:\/\//),
        category: expect.stringMatching(/^(iso|w3c)$/),
      })
    }
  })

  it('includes the canonical ISO standards Glossarist aligns with', () => {
    const codes = standards.map(s => s.code)
    expect(codes).toContain('ISO 10241-1')
    expect(codes).toContain('ISO 704')
    expect(codes).toContain('ISO 30042')
    expect(codes).toContain('ISO 12620')
    expect(codes).toContain('ISO 25964')
  })

  it('includes the W3C semantic-web standards', () => {
    const codes = standards.map(s => s.code)
    expect(codes).toContain('OWL 2')
    expect(codes).toContain('SHACL')
    expect(codes).toContain('SKOS/XL')
  })

  it('every id is unique', () => {
    const ids = standards.map(s => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every code is unique', () => {
    const codes = standards.map(s => s.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('every URL is unique', () => {
    const urls = standards.map(s => s.url)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it('iso standards point to iso.org', () => {
    for (const s of standards) {
      if (s.category === 'iso') {
        expect(s.url).toMatch(/^https:\/\/www\.iso\.org\//)
      }
    }
  })

  it('w3c standards point to w3.org', () => {
    for (const s of standards) {
      if (s.category === 'w3c') {
        expect(s.url).toMatch(/^https:\/\/www\.w3\.org\//)
      }
    }
  })
})
