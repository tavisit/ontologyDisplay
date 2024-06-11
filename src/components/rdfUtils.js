import { graph, parse } from 'rdflib'

/**
 * Parses an RDF file (TTL or OWL) and returns a promise that resolves to an RDF graph.
 * @param {string} content - The RDF content as a string.
 * @param {string} format - The format of the RDF content ('text/turtle' for TTL, 'application/rdf+xml' for OWL).
 * @returns {Promise<rdf.Store>} - A promise that resolves to an RDF graph.
 */
export const parseRDF = (content, format) => {
  return new Promise((resolve, reject) => {
    const store = graph()

    const searchString = /:([\w.]+)/g

    // Perform the replacement
    const modifiedContent = content.replace(searchString, match =>
      match.replace(/\./g, '_')
    )

    const baseURI = determineBaseURI(modifiedContent, format)
    parse(modifiedContent, store, baseURI, format, (error, graph) => {
      if (error) {
        reject(error)
      } else {
        resolve(graph)
      }
    })
  })
}

const determineBaseURI = (content, format) => {
  if (format === 'text/turtle') {
    // Look for @base directive in Turtle content
    const baseURIMatch = content.match(/@base\s+<([^>]*)>/)
    if (baseURIMatch && baseURIMatch.length > 1) {
      return baseURIMatch[1]
    }
  } else if (format === 'application/rdf+xml') {
    console.log(content)
    // Look for ontology IRI in OWL content
    const ontologyIRIMatch = content.match(
      /<rdf:RDF[^>]*\s+xmlns\s*=\s*['"]([^'"]*)['"]/
    )
    if (ontologyIRIMatch && ontologyIRIMatch.length > 1) {
      return ontologyIRIMatch[1]
    }
  }
  // Return a default base URI if not found
  return 'http://example.org/'
}
