# TODO 2: Flesh Out Relationships Page Content

## Problem
`/docs/model/relationships` has practically no information — just a list of enum values. Needs comprehensive documentation of all 32 relationship types.

## Content Plan
The page should explain:

1. **Overview** — What relationships are in Glossarist, how they connect concepts, why they matter
2. **Relationship categories** — 6 categories with descriptions:
   - Hierarchical (generic): broader/narrower generic (BTG/NTG) from ISO 25964
   - Hierarchical (partitive): broader/narrower partitive (BTP/NTP) — whole/part relationships
   - Hierarchical (instantive): broader/narrower instantive (BTI/NTI) — instance/type
   - Associative: related, see also, derived from
   - Equivalence: exact match, close match, broad match, narrow match
   - Temporal/sequential: precedes, succeeds, has successor, has predecessor
   - Mapping: deprecates, supersedes, is format of, has format
3. **Full reference table** — All 32 types with: name, inverse, category, ISO standard, description
4. **YAML examples** — How relationships are authored in concept YAML files
5. **SKOS alignment** — How Glossarist relationships map to SKOS/ISO 25964 properties

## Files to Modify
- `docs/model/relationships.md` — Complete rewrite with comprehensive content

## Relationship Types (from ontology data)
Based on the generated taxonomies.json relationshipType taxonomy (30 concepts):
- broader, narrower, related, exactMatch, closeMatch, broadMatch, narrowMatch
- hasBroaderGeneric, hasNarrowerGeneric, hasBroaderPartitive, hasNarrowerPartitive
- hasBroaderInstantive, hasNarrowerInstantive
- hasPart, isPartOf, hasPartWhole
- deprecates, isDeprecatedBy, supersedes, isSupersededBy
- hasTranslation, isTranslationOf
- hasVariant, isVariantOf
- precedes, succeeds, hasPredecessor, hasSuccessor
- seeAlso, derivedFrom

## Verification
- Run `npm run dev` and navigate to /docs/model/relationships
- Verify all 32 relationship types are documented
- Verify categories are clearly organized
- Verify YAML examples render correctly
