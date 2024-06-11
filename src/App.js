import React from 'react'
import OntologyGraph from './components/OntologyGraph'

const App = () => {
  return (
    <div
      className='App'
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <h1>Ontology Graph - By Matei Octavian-Mihai</h1>
      <OntologyGraph />
    </div>
  )
}

export default App
