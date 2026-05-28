---
title: Relationships
description: 32 typed semantic relationship types between concepts, spanning four ISO standards
---

# Relationships

32 typed semantic links between concepts, spanning four standards:

| Category | Standard | Types |
|----------|----------|-------|
| Lifecycle | ISO 10241-1 | `deprecates`, `supersedes`, `superseded_by` |
| Hierarchical | ISO 10241-1 / ISO 25964 | `broader`, `narrower` |
| Generic hierarchy | ISO 25964 (BTG/NTG) | `broader_generic`, `narrower_generic` |
| Partitive hierarchy | ISO 25964 (BTP/NTP) | `broader_partitive`, `narrower_partitive` |
| Instantial hierarchy | ISO 25964 (BTI/NTI) | `broader_instantial`, `narrower_instantial` |
| Equivalence | ISO 10241-1 / ISO 25964 / SKOS | `equivalent`, `exact_match` |
| SKOS mapping | SKOS | `close_match`, `broad_match`, `narrow_match`, `related_match` |
| Comparative | ISO 10241-1 | `compare`, `contrast` |
| Associative | ISO 10241-1 / ISO 25964 | `see`, `related_concept`, `related_concept_broader`, `related_concept_narrower` |
| Spatiotemporal | ISO 25964 / TBX | `sequentially_related_concept`, `spatially_related_concept`, `temporally_related_concept` |
| Lexical | ISO 12620 / TBX | `homograph`, `false_friend` |
| Designation-level | ISO 10241-1 | `abbreviated_form_for`, `short_form_for` |
