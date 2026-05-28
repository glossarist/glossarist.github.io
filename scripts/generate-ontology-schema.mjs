#!/usr/bin/env node
/**
 * Parse the glossarist OWL ontology (TTL) into a structured JSON schema
 * for the Ontospy-style browser view.
 *
 * Reads:  concept-model/ontologies/glossarist.ttl
 *         concept-model/ontologies/shapes/glossarist.shacl.ttl
 * Writes: public/data/ontology-schema.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CONCEPT_MODEL = resolve(ROOT, 'concept-model', 'ontologies');
const ONTOLOGY_TTL = resolve(CONCEPT_MODEL, 'glossarist.ttl');
const SHACL_TTL = resolve(CONCEPT_MODEL, 'shapes', 'glossarist.shacl.ttl');
const OUTPUT = resolve(ROOT, 'public', 'data', 'ontology-schema.json');

const KNOWN_PREFIXES = {
  gloss: 'https://www.glossarist.org/ontologies/',
  owl: 'http://www.w3.org/2002/07/owl#',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  xl: 'http://www.w3.org/2008/05/skos-xl#',
  'iso-thes': 'http://purl.org/iso25964/skos-thes#',
  dcterms: 'http://purl.org/dc/terms/',
  prov: 'http://www.w3.org/ns/prov#',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  sh: 'http://www.w3.org/ns/shacl#',
  vann: 'http://purl.org/vocab/vann/',
};

function expandPrefixed(term) {
  for (const [prefix, uri] of Object.entries(KNOWN_PREFIXES)) {
    if (term.startsWith(prefix + ':')) {
      return uri + term.slice(prefix.length + 1);
    }
  }
  return term;
}

function compactIri(iri) {
  for (const [prefix, uri] of Object.entries(KNOWN_PREFIXES)) {
    if (iri.startsWith(uri)) {
      return prefix + ':' + iri.slice(uri.length);
    }
  }
  return iri;
}

function splitSubjectBlocks(text) {
  const blocks = [];
  let depth = 0;
  let start = -1;
  let inTripleQuote = false;
  let inUri = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inTripleQuote) {
      if (ch === '"' && text.slice(i, i + 3) === '"""') {
        inTripleQuote = false;
        i += 2;
      }
      continue;
    }

    if (ch === '"' && text.slice(i, i + 3) === '"""') {
      inTripleQuote = true;
      i += 2;
      continue;
    }

    if (ch === '"') {
      i++;
      while (i < text.length && text[i] !== '"') {
        if (text[i] === '\\') i++;
        i++;
      }
      continue;
    }

    if (inUri) {
      if (ch === '>') inUri = false;
      continue;
    }
    if (ch === '<') {
      inUri = true;
      if (start < 0) start = i;
      continue;
    }

    if (ch === '[' || ch === '(') depth++;
    if (ch === ']' || ch === ')') depth--;

    if (!inUri && depth === 0 && ch === '.') {
      if (start >= 0) {
        blocks.push(text.slice(start, i));
        start = -1;
      }
    } else if (start < 0 && /\S/.test(ch)) {
      start = i;
    }
  }

  return blocks;
}

function extractLiteral(block, predicate) {
  const tripleQuoted = new RegExp(predicate + '\\s+"""([^]*?)"""@en');
  let m = block.match(tripleQuoted);
  if (m) return m[1].replace(/\s+/g, ' ').trim();

  const singleQuoted = new RegExp(predicate + '\\s+"([^"]*?)"@en');
  m = block.match(singleQuoted);
  if (m) return m[1];

  const plain = new RegExp(predicate + '\\s+"""([^]*?)"""');
  m = block.match(plain);
  if (m) return m[1].replace(/\s+/g, ' ').trim();

  const plainSingle = new RegExp(predicate + '\\s+"([^"]*?)"');
  m = block.match(plainSingle);
  return m ? m[1] : null;
}

function extractResource(block, predicate) {
  const re = new RegExp(predicate + '\\s+([^\\s,;]+)');
  const m = block.match(re);
  if (!m) return null;
  let val = m[1].replace(/[;.]+$/, '');
  if (val === 'a') return null;
  return val;
}

function preprocessTtl(ttlText) {
  const lines = ttlText.split('\n');
  const filtered = lines.filter(l => !l.trimStart().startsWith('@prefix') && !l.trimStart().startsWith('@base'));
  const text = filtered.join('\n');

  let result = '';
  let inTriple = false;
  let inSingle = false;
  let inUri = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inTriple) {
      result += ch;
      if (ch === '"' && text.slice(i, i + 3) === '"""') {
        result += text.slice(i + 1, i + 3);
        i += 2;
        inTriple = false;
      }
      continue;
    }

    if (inSingle) {
      result += ch;
      if (ch === '\\') { result += text[i + 1]; i++; continue; }
      if (ch === '"') inSingle = false;
      continue;
    }

    if (inUri) {
      result += ch;
      if (ch === '>') inUri = false;
      continue;
    }

    if (ch === '"' && text.slice(i, i + 3) === '"""') {
      result += '"""';
      inTriple = true;
      i += 2;
      continue;
    }

    if (ch === '"') {
      result += ch;
      inSingle = true;
      continue;
    }

    if (ch === '<') {
      result += ch;
      inUri = true;
      continue;
    }

    if (ch === '#') {
      while (i < text.length && text[i] !== '\n') i++;
      if (i < text.length) result += '\n';
      continue;
    }

    result += ch;
  }

  return result;
}

function parseOntology(ttlText) {
  const cleaned = preprocessTtl(ttlText);
  const blocks = splitSubjectBlocks(cleaned);

  const classes = [];
  const properties = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const subjectMatch = trimmed.match(/^([^\s]+)/);
    if (!subjectMatch) continue;
    const subject = subjectMatch[1];

    if (subject.includes('glossarist>') && !subject.startsWith('gloss:')) continue;

    const typeMatch = trimmed.match(/\ba\s+(.+?)(?:\s*[;.\n]|$)/);
    if (!typeMatch) continue;
    const typeStr = typeMatch[1];

    const isClass = /\bowl:Class\b/.test(typeStr);
    const isObjectProperty = /\bowl:ObjectProperty\b/.test(typeStr);
    const isDatatypeProperty = /\bowl:DatatypeProperty\b/.test(typeStr);

    if (!isClass && !isObjectProperty && !isDatatypeProperty) continue;

    const label = extractLiteral(trimmed, 'rdfs:label');
    const comment = extractLiteral(trimmed, 'rdfs:comment');
    const iri = expandPrefixed(subject);
    const compact = compactIri(iri);

    if (isClass) {
      const subClassOf = extractResource(trimmed, 'rdfs:subClassOf');
      const disjointWith = extractResource(trimmed, 'owl:disjointWith');

      classes.push({
        iri,
        compact,
        label: label || subject.replace('gloss:', ''),
        comment,
        subClassOf: subClassOf ? compactIri(expandPrefixed(subClassOf)) : null,
        disjointWith: disjointWith ? compactIri(expandPrefixed(disjointWith)) : null,
      });
    } else {
      const domain = extractResource(trimmed, 'rdfs:domain');
      const range = extractResource(trimmed, 'rdfs:range');
      const inverseOf = extractResource(trimmed, 'owl:inverseOf');

      let domainUnion = null;
      let rangeUnion = null;

      const unionDomainMatch = trimmed.match(/rdfs:domain\s+\[\s*a\s+owl:Class\s*;\s*owl:unionOf\s*\(([^)]+)\)\s*\]/);
      if (unionDomainMatch) {
        domainUnion = unionDomainMatch[1].trim().split(/\s+/).map(t => compactIri(expandPrefixed(t)));
      }

      const unionRangeMatch = trimmed.match(/rdfs:range\s+\[\s*a\s+owl:Class\s*;\s*owl:unionOf\s*\(([^)]+)\)\s*\]/);
      if (unionRangeMatch) {
        rangeUnion = unionRangeMatch[1].trim().split(/\s+/).map(t => compactIri(expandPrefixed(t)));
      }

      properties.push({
        iri,
        compact,
        label: label || subject.replace('gloss:', ''),
        comment,
        type: isObjectProperty ? 'object' : 'datatype',
        domain: domain ? compactIri(expandPrefixed(domain)) : null,
        domainUnion: domainUnion,
        range: range ? compactIri(expandPrefixed(range)) : null,
        rangeUnion: rangeUnion,
        inverseOf: inverseOf ? compactIri(expandPrefixed(inverseOf)) : null,
      });
    }
  }

  return { classes, properties };
}

function buildClassHierarchy(classes) {
  const map = new Map();
  for (const c of classes) {
    map.set(c.compact, c);
    c.children = [];
    c.ancestors = [];
  }

  for (const c of classes) {
    if (c.subClassOf && map.has(c.subClassOf)) {
      map.get(c.subClassOf).children.push(c.compact);
    }
  }

  for (const c of classes) {
    const chain = [];
    let current = c.subClassOf;
    while (current && map.has(current)) {
      chain.push(current);
      current = map.get(current).subClassOf;
    }
    if (current) chain.push(current);
    c.ancestors = chain;
  }

  const roots = classes
    .filter(c => !c.subClassOf || !map.has(c.subClassOf))
    .map(c => c.compact);

  return { roots, map: Object.fromEntries(map) };
}

function groupPropertiesByDomain(properties) {
  const groups = {};
  for (const p of properties) {
    const domains = p.domainUnion || (p.domain ? [p.domain] : ['(unspecified)']);
    for (const d of domains) {
      if (!groups[d]) groups[d] = { object: [], datatype: [] };
      groups[d][p.type].push(p.compact);
    }
  }
  return groups;
}

function extractPropertyBlocks(shapeBlock) {
  const blocks = [];
  const re = /sh:property\s+\[/g;
  let match;
  while ((match = re.exec(shapeBlock)) !== null) {
    const start = match.index + match[0].length - 1;
    let depth = 1;
    let i = start + 1;
    while (i < shapeBlock.length && depth > 0) {
      if (shapeBlock[i] === '[') depth++;
      else if (shapeBlock[i] === ']') depth--;
      i++;
    }
    blocks.push(shapeBlock.slice(start + 1, i - 1));
  }
  return blocks;
}

function parseConstraint(propBlock) {
  const c = {};
  const path = extractResource(propBlock, 'sh:path');
  c.path = path ? compactIri(expandPrefixed(path)) : null;

  const dt = extractResource(propBlock, 'sh:datatype');
  c.datatype = dt ? compactIri(expandPrefixed(dt)) : null;

  const cls = extractResource(propBlock, 'sh:class');
  c.class = cls ? compactIri(expandPrefixed(cls)) : null;

  const vf = extractResource(propBlock, 'sh:valuesFrom');
  c.valuesFrom = vf ? compactIri(expandPrefixed(vf)) : null;

  const nk = extractResource(propBlock, 'sh:nodeKind');
  c.nodeKind = nk ? compactIri(expandPrefixed(nk)) : null;

  const minMatch = propBlock.match(/sh:minCount\s+(\d+)/);
  c.minCount = minMatch ? parseInt(minMatch[1], 10) : null;

  const maxMatch = propBlock.match(/sh:maxCount\s+(\d+)/);
  c.maxCount = maxMatch ? parseInt(maxMatch[1], 10) : null;

  const inMatch = propBlock.match(/sh:in\s*\(([^)]+)\)/);
  if (inMatch) {
    c.in = inMatch[1].match(/"([^"]+)"/g)?.map(s => s.replace(/"/g, '')) || null;
  } else {
    c.in = null;
  }

  return c;
}

function parseShaclShapes(ttlText) {
  const cleaned = preprocessTtl(ttlText);
  const blocks = splitSubjectBlocks(cleaned);

  const shapes = [];
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const subjectMatch = trimmed.match(/^([^\s]+)/);
    if (!subjectMatch) continue;
    const subject = subjectMatch[1];

    if (!/\ba\s+sh:NodeShape\b/.test(trimmed)) continue;

    const iri = expandPrefixed(subject);
    const compact = compactIri(iri);
    const label = extractLiteral(trimmed, 'rdfs:label');
    const comment = extractLiteral(trimmed, 'rdfs:comment');
    const targetClass = extractResource(trimmed, 'sh:targetClass');

    const propBlocks = extractPropertyBlocks(trimmed);
    const constraints = propBlocks.map(parseConstraint).filter(c => c.path);

    const shapeClassMatch = trimmed.match(/^\s*[^[]*?\ba\s+sh:NodeShape\s[^[]*?sh:class\s+([^\s,;]+)/);
    const shapeClass = shapeClassMatch ? shapeClassMatch[1].replace(/[;.]+$/, '') : null;

    shapes.push({
      iri,
      compact,
      label: label || subject.replace('gloss:', '').replace('Shape', ''),
      comment,
      targetClass: targetClass ? compactIri(expandPrefixed(targetClass)) : null,
      shapeClass: shapeClass ? compactIri(expandPrefixed(shapeClass)) : null,
      constraints,
    });
  }

  return shapes;
}

const IMPORT_LABELS = {
  'http://www.w3.org/2004/02/skos/core': 'SKOS',
  'http://www.w3.org/2004/02/skos/core#': 'SKOS',
  'http://www.w3.org/2008/05/skos-xl': 'SKOS-XL',
  'http://www.w3.org/2008/05/skos-xl#': 'SKOS-XL',
  'http://purl.org/iso25964/skos-thes': 'ISO 25964',
  'http://purl.org/iso25964/skos-thes#': 'ISO 25964',
  'http://www.w3.org/ns/prov#': 'PROV-O',
  'http://purl.org/dc/terms/': 'Dublin Core Terms',
};

function parseOntologyDeclaration(ttlText) {
  const cleaned = preprocessTtl(ttlText);
  const blocks = splitSubjectBlocks(cleaned);

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (!/\ba\s+owl:Ontology\b/.test(trimmed)) continue;

    const subjectMatch = trimmed.match(/^<([^>]+)>/);
    const iri = subjectMatch ? subjectMatch[1] : null;
    const label = extractLiteral(trimmed, 'rdfs:label') || extractLiteral(trimmed, 'dcterms:title');
    const comment = extractLiteral(trimmed, 'rdfs:comment') || extractLiteral(trimmed, 'dcterms:description');
    const prefix = extractLiteral(trimmed, 'vann:preferredNamespacePrefix');
    const nsUri = extractLiteral(trimmed, 'vann:preferredNamespaceUri');
    const license = extractResource(trimmed, 'dcterms:license')?.replace(/[<>]/g, '') || null;
    const created = extractLiteral(trimmed, 'dcterms:created');

    const imports = [];
    const importRe = /owl:imports\s+<([^>]+)>/g;
    let im;
    while ((im = importRe.exec(trimmed)) !== null) {
      const iri = im[1];
      imports.push({
        iri,
        label: IMPORT_LABELS[iri] || IMPORT_LABELS[iri.replace(/#?$/, '#')] || compactIri(iri),
      });
    }

    return { iri, label, comment, prefix, namespaceUri: nsUri, imports, license, created };
  }
  return null;
}

function parseAnnotationProperties(ttlText) {
  const cleaned = preprocessTtl(ttlText);
  const blocks = splitSubjectBlocks(cleaned);

  const props = [];
  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    if (!/\ba\s+owl:AnnotationProperty\b/.test(trimmed)) continue;

    const subjectMatch = trimmed.match(/^([^\s]+)/);
    if (!subjectMatch) continue;
    const subject = subjectMatch[1];
    const iri = expandPrefixed(subject);
    const compact = compactIri(iri);
    const label = extractLiteral(trimmed, 'rdfs:label');

    props.push({ iri, compact, label: label || compact });
  }

  return props;
}

function main() {
  if (!existsSync(ONTOLOGY_TTL)) {
    console.error(`Ontology file not found: ${ONTOLOGY_TTL}`);
    console.error('Ensure concept-model is available. Run: git clone https://github.com/glossarist/concept-model.git concept-model');
    process.exit(1);
  }

  const ttlText = readFileSync(ONTOLOGY_TTL, 'utf-8');
  const { classes, properties } = parseOntology(ttlText);

  const hierarchy = buildClassHierarchy(classes);
  const propsByDomain = groupPropertiesByDomain(properties);

  let shapes = [];
  if (existsSync(SHACL_TTL)) {
    const shaclText = readFileSync(SHACL_TTL, 'utf-8');
    shapes = parseShaclShapes(shaclText);
  } else {
    console.warn(`SHACL shapes file not found: ${SHACL_TTL}`);
  }

  const ontologyDecl = parseOntologyDeclaration(ttlText);
  let annotationProps = parseAnnotationProperties(ttlText);

  if (annotationProps.length === 0) {
    annotationProps = [
      { iri: 'http://www.w3.org/2000/01/rdf-schema#label', compact: 'rdfs:label', label: 'label' },
      { iri: 'http://www.w3.org/2000/01/rdf-schema#comment', compact: 'rdfs:comment', label: 'comment' },
      { iri: 'http://www.w3.org/2000/01/rdf-schema#seeAlso', compact: 'rdfs:seeAlso', label: 'seeAlso' },
      { iri: 'http://www.w3.org/2000/01/rdf-schema#isDefinedBy', compact: 'rdfs:isDefinedBy', label: 'isDefinedBy' },
      { iri: 'http://purl.org/dc/terms/title', compact: 'dcterms:title', label: 'title' },
      { iri: 'http://purl.org/dc/terms/description', compact: 'dcterms:description', label: 'description' },
      { iri: 'http://purl.org/dc/terms/source', compact: 'dcterms:source', label: 'source' },
      { iri: 'http://purl.org/dc/terms/license', compact: 'dcterms:license', label: 'license' },
      { iri: 'http://purl.org/dc/terms/created', compact: 'dcterms:created', label: 'created' },
      { iri: 'http://purl.org/vocab/vann/preferredNamespacePrefix', compact: 'vann:preferredNamespacePrefix', label: 'preferredNamespacePrefix' },
      { iri: 'http://purl.org/vocab/vann/preferredNamespaceUri', compact: 'vann:preferredNamespaceUri', label: 'preferredNamespaceUri' },
    ];
  }

  const shapesByTargetClass = {};
  for (const s of shapes) {
    const tc = s.targetClass || '(unspecified)';
    if (!shapesByTargetClass[tc]) shapesByTargetClass[tc] = [];
    shapesByTargetClass[tc].push(s.compact);
  }

  const output = {
    ontology: ontologyDecl,
    ontologyIri: ontologyDecl?.iri || 'https://www.glossarist.org/ontologies/glossarist',
    ontologyLabel: ontologyDecl?.label || 'Glossarist Ontology',
    classes: hierarchy.map,
    classHierarchyRoots: hierarchy.roots,
    properties: Object.fromEntries(properties.map(p => [p.compact, p])),
    propertiesByDomain: propsByDomain,
    shapes: Object.fromEntries(shapes.map(s => [s.compact, s])),
    shapesByTargetClass,
    annotationProperties: annotationProps,
    stats: {
      classCount: classes.length,
      objectPropertyCount: properties.filter(p => p.type === 'object').length,
      datatypePropertyCount: properties.filter(p => p.type === 'datatype').length,
      shapeCount: shapes.length,
      annotationPropertyCount: annotationProps.length,
    },
  };

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n');

  console.log(`Parsed ${output.stats.classCount} classes, ${output.stats.objectPropertyCount} object properties, ${output.stats.datatypePropertyCount} datatype properties, ${output.stats.shapeCount} SHACL shapes, ${output.stats.annotationPropertyCount} annotation properties`);
  if (ontologyDecl) {
    console.log(`Ontology: ${ontologyDecl.iri}`);
    console.log(`  imports: ${ontologyDecl.imports.map(i => i.label).join(', ')}`);
  }
  console.log(`Wrote ${OUTPUT}`);
}

main();
