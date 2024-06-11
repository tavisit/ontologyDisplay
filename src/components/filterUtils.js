export const filterGraphData = (nodes, edges, startNodeId) => {
  // Function to filter nodes and edges based on depth
  // Filter graph data up to depth 5
  const depthLimit = 5
  const filteredNodes = new Set()
  const filteredEdges = []

  const distances = {}

  const queue = [] // Use a queue for BFS

  // Initialize visited object to keep track of visited nodes
  const visited = {}
  nodes.forEach(node => (visited[node.id] = false))

  // Enqueue the start node and mark it as visited with distance 0
  queue.push({ id: startNodeId, distance: 0 })
  visited[startNodeId] = true
  distances[startNodeId] = 0

  while (queue.length > 0) {
    const { id: currentNodeId, distance: currentDepth } = queue.shift() // Dequeue the first node from the queue
    filteredNodes.add(currentNodeId) // Add the current node to the filtered nodes

    if (currentDepth >= depthLimit) continue // Check depth limit

    // Find edges connected to the current node
    const connectedEdges = edges.filter(
      edge => edge.from === currentNodeId || edge.to === currentNodeId
    )

    // Explore neighboring nodes
    connectedEdges.forEach(edge => {
      filteredEdges.push(edge) // Add edge to filtered edges
      const nextNodeId = edge.from === currentNodeId ? edge.to : edge.from
      if (!distances[nextNodeId]) {
        distances[nextNodeId] = currentDepth + 1 // Calculate distance from start node
      }
      if (!visited[nextNodeId]) {
        visited[nextNodeId] = true // Mark the neighboring node as visited
        queue.push({ id: nextNodeId, distance: currentDepth + 1 }) // Enqueue the neighboring node with updated distance
      }
    })
  }
  distances[startNodeId] = 0
  const sortedNodes = [...filteredNodes].sort(
    (a, b) => distances[a] - distances[b]
  )
  console.log(sortedNodes, distances)
  return {
    nodes: new Set(sortedNodes),
    edges: [...new Set(filteredEdges)],
    distances: distances
  }
}

export const assignGradientColor = (initial_node, node, distances) => {
  if (node == initial_node) return '#FF0000'
  // Define the start and end colors
  const startColor = [255, 100, 0] // Red
  const endColor = [0, 100, 255] // Blue

  // Calculate the distance of the node from the start node
  const distance = distances[node] ? distances[node] : 0

  // Calculate the ratio based on the maximum distance
  const maxDistance = Math.max(...Object.values(distances))
  const ratio = distance / maxDistance
  // Interpolate between start and end colors
  const color = startColor.map((channel, i) => {
    // Interpolate between start and end colors based on the ratio
    const interpolatedChannel =
      startColor[i] + (endColor[i] - startColor[i]) * ratio
    return Math.round(interpolatedChannel)
  })

  // Convert RGB to hexadecimal
  const hexValue = color.reduce((acc, val) => {
    const hex = val.toString(16).padStart(2, '0') // Convert each channel to hexadecimal and pad with 0 if needed
    return acc + hex
  }, '#')

  // Return the hexadecimal color value
  return hexValue
}
