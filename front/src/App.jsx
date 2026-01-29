import React, { useRef, useEffect, useState } from 'react';
import Controls from './component/Controls';
import SchemaCanvas from './component/SchemaCanvas';
import Library from './component/Library';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Controls />
      <SchemaCanvas />
      <Library />
    </>
  )
}

export default App
