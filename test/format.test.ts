import { describe, it, expect } from 'vitest'
import { formatDate, formatMonthYear, formatLastUpdated, formatAuthors } from '../.vitepress/data/format'

describe('formatDate', () => {
  it('formats an ISO date string as "Month D, YYYY"', () => {
    expect(formatDate('2026-07-05')).toBe('July 5, 2026')
  })

  it('handles dates with time components', () => {
    expect(formatDate('2026-01-15T10:30:00Z')).toMatch(/January 15, 2026/)
  })

  it('handles single-digit days', () => {
    expect(formatDate('2026-03-07')).toBe('March 7, 2026')
  })

  it('handles year boundaries', () => {
    expect(formatDate('2025-12-31')).toBe('December 31, 2025')
    expect(formatDate('2026-01-01')).toBe('January 1, 2026')
  })
})

describe('formatMonthYear', () => {
  it('formats as "Month YYYY"', () => {
    expect(formatMonthYear('2026-07-05')).toBe('July 2026')
  })

  it('does not include day', () => {
    expect(formatMonthYear('2026-03-15')).toBe('March 2026')
  })
})

describe('formatLastUpdated', () => {
  it('returns empty string for undefined timestamp', () => {
    expect(formatLastUpdated(undefined)).toBe('')
  })

  it('returns empty string for zero timestamp (falsy)', () => {
    expect(formatLastUpdated(0)).toBe('')
  })

  it('formats a Unix timestamp as "Mon D, YYYY"', () => {
    const ts = Date.UTC(2026, 6, 5) // 2026-07-05
    const formatted = formatLastUpdated(ts)
    expect(formatted).toMatch(/Jul.*5.*2026/)
  })
})

describe('formatAuthors', () => {
  it('returns empty string for empty array', () => {
    expect(formatAuthors([])).toBe('')
  })

  it('returns empty string for null/undefined', () => {
    expect(formatAuthors(null as unknown as string[])).toBe('')
    expect(formatAuthors(undefined as unknown as string[])).toBe('')
  })

  it('returns single author unchanged', () => {
    expect(formatAuthors(['Ribose'])).toBe('Ribose')
  })

  it('joins two authors with "&"', () => {
    expect(formatAuthors(['Alice', 'Bob'])).toBe('Alice & Bob')
  })

  it('joins three authors with Oxford comma style', () => {
    expect(formatAuthors(['Alice', 'Bob', 'Carol'])).toBe('Alice, Bob & Carol')
  })

  it('joins many authors correctly', () => {
    expect(formatAuthors(['A', 'B', 'C', 'D'])).toBe('A, B, C & D')
  })
})
