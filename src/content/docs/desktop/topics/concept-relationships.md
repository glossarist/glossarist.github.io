---
title: Concept Relationships
description: Relationships include domain relationships as well as sibling relations
---

# Concept Relationships

Relationships include domain relationships as well as sibling relations.

## Outgoing relationships

Outgoing relationships can be of two types:

- "Parent" relationship. Known as "domain" in ISO 704 and as "broader" relation in SKOS.
- Generic sibling relationship.

Changing **outgoing concept relationships** is possible via the Relationships panel.

::: info
Concept relationships are not currently part of Change Request flow. Currently, only register manager can edit concept relationships.
:::

## Incoming relationships

**Incoming concept relationships** are tracked by the software automatically.

For example, it is not necessary to specify "narrower" relationships: all concepts that specify given concept A as a parent are automatically considered as "narrower" concepts of concept A.

Same applies for generic sibling relationships: if concept B is linked as related to concept A, concept A will be shown as _linked by_ from concept B.

The Relationships panel shows incoming relationships in read-only mode. To edit an incoming relationship to A from B, go to the linked concept B and edit its outgoing relations to A.

## See also

- [Relationships panel](/docs/desktop/ui/panels/relationships)
- [Linking concepts tutorial](/docs/desktop/tutorials/linking-concepts)
