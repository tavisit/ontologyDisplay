import React, { useEffect, useState } from 'react'
import { DataSet, Network } from 'vis-network/standalone'
import { parseRDF } from './rdfUtils'
import { filterGraphData, assignGradientColor } from './filterUtils'
import { handleKeyDown } from './textUtils'
import GradientBarChart from './GradientBarChart'
const OntologyGraph = () => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredNodes, setFilteredNodes] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [maxNodes, setMaxNodes] = useState(15)
  const [current_node_id, setCurrentNodeId] = useState('')
  const [fileName, _] = useState('')
  const [selectedNodeName, setSelectedNodeName] = useState('')

  const selectFile = () => {
    const fileInput = document.getElementById('fileInput')
    fileInput.click()
  }

  const loadOntology = async event => {
    const file = event.target.files[0]
    if (!file) {
      console.error('No file selected.')
      // Reset loading state
      return
    }
    const reader = new FileReader()

    reader.onload = async event => {
      try {
        console.log(event)
        const fileContent = event.target.result

        if (!fileContent) {
          console.error('File content is empty or undefined.')
          // Reset loading state
          return
        }

        let mimeType = file.name.endsWith('.owl')
          ? 'application/rdf+xml'
          : 'text/turtle'

        try {
          const rdfGraph = await parseRDF(fileContent, mimeType)

          const nodeSet = new Set()
          const edgeSet = new Set()

          rdfGraph.statements.forEach(statement => {
            nodeSet.add(statement.subject.value)
            nodeSet.add(statement.object.value)

            edgeSet.add({
              from: statement.subject.value,
              to: statement.object.value,
              label: statement.predicate.value
            })
          })

          const nodes = Array.from(nodeSet).map(node => ({
            id: node,
            label: node
          }))
          const edges = Array.from(edgeSet)

          setNodes(nodes)
          setEdges(edges)
        } catch (err) {
          console.error('Error while parsing:', err)
        }
      } catch (error) {
        // Reset loading state
        console.error('Error parsing file content:', error)
      }
    }

    reader.readAsText(file)
  }

  const handleRefocus = nodeID => {
    setCurrentNodeId(nodeID)
  }

  const handleChange = event => {
    const newValue =
      event.target.value.trim() !== '' ? parseInt(event.target.value) : 1
    setMaxNodes(newValue)
  }

  useEffect(() => {
    // Filter nodes based on search query
    const filtered = nodes.filter(node => node.id.includes(searchQuery))
    setFilteredNodes(filtered)
  }, [nodes, searchQuery])

  useEffect(() => {
    const fileInput = document.getElementById('fileInput')
    fileInput.addEventListener('change', loadOntology)

    return () => {
      fileInput.removeEventListener('change', loadOntology)
    }
  }, [])

  const handleSearch = node_id => {
    // Filter nodes based on search query when search button is clicked
    const filtered = nodes.filter(node => node.id.includes(node_id))
    if (nodes.length && edges.length && filtered.length) {
      let filteredGraph = filterGraphData(nodes, edges, filtered[0].id)

      if (filteredGraph.nodes.size > maxNodes) {
        // Convert the Set to an array, slice it, and then convert it back to a Set
        filteredGraph.nodes = new Set(
          [...filteredGraph.nodes].slice(0, maxNodes)
        )
      }
      const connectedEdges = filteredGraph.edges.filter(edge => {
        return (
          filteredGraph.nodes.has(edge.from) || filteredGraph.nodes.has(edge.to)
        )
      })

      // Update the edges property of filteredGraph with the connected edges
      filteredGraph.edges = connectedEdges

      setFilteredData(filteredGraph)
    }
    setCurrentNodeId(node_id)
  }

  useEffect(() => {
    handleSearch(current_node_id)
  }, [maxNodes, current_node_id])

  useEffect(() => {
    const container = document.getElementById('ontologyGraph')
    if (filteredData && filteredData.nodes && filteredData.edges) {
      const nodes = Array.from(filteredData.nodes).map(node => ({
        id: node,
        label: node,
        color: {
          color: 'black',
          background: assignGradientColor(
            current_node_id,
            node,
            filteredData.distances
          )
        }
      }))
      const data = {
        nodes: new DataSet(nodes),
        edges: new DataSet(filteredData.edges)
      }
      const options = {} // Adjust options as needed
      try {
        const network = new Network(container, data, options)

        // Add event listener for node clicks
        network.on('click', function (params) {
          if (params.nodes.length > 0) {
            const nodeId = params.nodes[0]
            console.log('Node clicked:', nodeId)

            setSelectedNodeName(nodeId)
            // Add your logic here for what happens when a node is clicked
          }
        })
      } catch (error) {
        console.error('Error while creating network graph:', error)
      }
    }
  }, [filteredData])

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <div
        className='settings-container'
        style={{ width: '60%', margin: '0 auto' }}
      >
        <h1>Settings</h1>
        <h3>File input</h3>
        <input
          id='fileInput'
          type='file'
          accept='.ttl,.owl'
          style={{ display: 'none' }}
        />
        <button onClick={selectFile}>Select File</button>
        <p>Loaded: {fileName}</p>

        <h3>Seach nodes</h3>
        <p>
          Seach for node:{' '}
          <input
            type='text'
            placeholder='Search for Node'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </p>
        <div
          style={{
            height: '200px',
            border: '2px solid black',
            overflowY: 'auto'
          }}
        >
          <ul>
            {filteredNodes.map(node => {
              const slicedId = node.id.split('/').slice(6).join('/')
              const displayId = slicedId || node.id // Use full id if slicedId is empty
              return (
                <li key={node.id} onClick={() => handleSearch(node.id)}>
                  {displayId}
                </li>
              )
            })}
          </ul>
        </div>
        <h3>Max Nodes</h3>
        <div>
          <p>
            Max Nodes:{' '}
            <input
              type='input'
              min={1}
              step={1}
              value={maxNodes}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </p>
        </div>
        <h1>Graph</h1>
      </div>
      <div style={{ width: '100%', margin: '0 auto', position: 'relative' }}>
        <div
          id='ontologyGraph'
          style={{
            height: '800px',
            border: '2px solid black',
            margin: '0 auto'
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'white',
            padding: '5px',
            border: '1px solid black'
          }}
        >
          <p>Distance to root</p>
          <GradientBarChart />
        </div>
        {selectedNodeName && (
          <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              backgroundColor: 'white',
              padding: '5px',
              border: '1px solid black'
            }}
          >
            Selected Node: {selectedNodeName}
            <br></br>
            <button onClick={() => handleRefocus(selectedNodeName)}>
              Focus on this Node
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OntologyGraph
