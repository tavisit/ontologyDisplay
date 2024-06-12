import React from 'react'
import OntologyGraph from './components/OntologyGraph'

const App = () => {
  return (
    <div>
      <div
        className='App'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <header>
          <img src='https://isg.utcluj.ro/images/logo_utcn.jpg' alt='ISG'></img>
        </header>
        <h1>Ontology Graph - By Octavian-Mihai Matei</h1>
        <OntologyGraph />
        <footer>
          <p>
            Author: MATEI Octavian-Mihai, Coordinator: Prof. dr. ing. GROZA
            Adrian
          </p>
          <p>
            Repository:{' '}
            <a
              href='https://github.com/tavisit/ontologyDisplay'
              target='_blank'
            >
              https://github.com/tavisit/ontologyDisplay
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
