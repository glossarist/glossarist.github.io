---
title: 3. Migrating Existing Data
description: Convert your existing terms into Glossarist format
---

# 3. Migrating Existing Data

Convert your existing terms into Glossarist format. Intended for registry managers with some technical knowledge.

If you don't have any concepts to migrate, you can skip this step.

The complexity of this stage depends on how many pre-existing terms and concepts you have.

## Migration overview

Below is a diagram that gives a general overview of data migration steps. For blocks in blue, further explanation is given below.

![Concept data migration overview diagram](/images/desktop/migration-overview.svg)

## Automating migration

If your existing terminology data is already stored in a structured machine-readable format, it can be possible to write a software utility (an _import adapter_) to convert that data to Glossarist's supported import format.

Viable source formats for conversion include, for example, Excel spreadsheets and CSV files. Depending on how you keep track of your concepts, it may be possible to preserve revision history and change requests.

### Existing terminology migration scripts

You can take a look at [ISO/TC 211 termbase migration utility](https://github.com/geolexica/tc211-termbase), written in Ruby.

::: info
Since the latest update of that script, Glossarist data format has somewhat evolved, but it can give you a general idea.
:::

### Getting help with your import adapter

If you can make your original terminology database public, you can file a ticket against the [Migration adapters](https://github.com/glossarist/migration-adapters/) repository on GitHub.

### Glossarist import format specification

We are bringing import specification details here.

### Getting in touch with Ribose

Glossarist is a project developed and maintained by Ribose Open. If your original terminology database cannot be made public, you're welcome to reach out privately and we'll do our best to help.

## Manual migration

If it's not possible to convert your existing terminology data automatically, or there's not that many concepts to migrate, the alternative is to simply use Glossarist Desktop app to enter concept & term data by hand.

## Next

- You and/or concept system change submitters might want to read [Getting started with the desktop app](/docs/desktop/getting-started/installation)
