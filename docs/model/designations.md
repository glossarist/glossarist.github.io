---
title: Designations
description: 7 designation types forming a MECE hierarchy — expression, abbreviation, symbol, letter_symbol, graphical_symbol, prefix, suffix
---

# Designations

![Designations UML](/images/model/Designations.png)

A **designation** is a name under which a managed term is known. Designations follow an inheritance hierarchy based on ISO 10241-1 and the Glossarist concept model.

Designations form a **MECE** (Mutually Exclusive, Collectively Exhaustive) hierarchy:

| Type | Extends | Description |
|------|---------|-------------|
| `expression` | Base | A word or phrase used as a designation |
| `abbreviation` | Expression | A shortened form (acronym, initialism, or truncation) |
| `symbol` | Base | A non-letter symbol representing a concept |
| `letter_symbol` | Symbol | A single letter used as a symbol |
| `graphical_symbol` | Symbol | An iconic or graphical symbol |
| `prefix` | Base | A prefix that attaches before a designation |
| `suffix` | Base | A suffix that attaches after a designation |

## Base properties (common to all types)

| Property | Standard | Description |
|----------|----------|-------------|
| `designation` | — | The term text or symbol |
| `normative_status` | — | `preferred`, `admitted`, `deprecated`, or `superseded` |
| `geographical_area` | ISO 3166-1 | Geographic usage region |
| `language` | ISO 639 | Language of this designation |
| `script` | ISO 15924 | Script of the designation text (e.g. `Latn`, `Cyrl`) |
| `system` | ISO 24229 | Conversion system code |
| `international` | — | Whether used internationally |
| `absent` | — | Whether intentionally absent in this language |
| `pronunciation` | — | Collection of Pronunciation entries |
| `sources` | ISO 10241-1 §6.8 | Collection of ConceptSource entries |
| `term_type` | ISO 12620 | Optional classification of the designation's term type |
| `related` | — | Collection of RelatedConcept for designation-level relationships |
| `register` | — | Register information |

## Pronunciation

Each Pronunciation entry has:

| Attribute | Standard | Description |
|-----------|----------|-------------|
| `content` | — | The pronunciation text |
| `language` | ISO 639 | Language/dialect being pronounced (3-letter code) |
| `script` | ISO 15924 | Script of the pronunciation text (4-letter code) |
| `country` | ISO 3166-1 | Country variant (2-letter code, optional) |
| `system` | ISO 24229 | Conversion system code (e.g. `IPA`, `Var:jpn-Hrkt:Latn:Hepburn-1886`) |
