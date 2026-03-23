import { useState, useCallback} from 'react'
import { ReactFlow, Node, useNodesState } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './assets/main.css'


let idCounter = 0

export default function App() 
{
  //init react flow hook to manage nodes
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])

  //drag event for nodes
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  //only allows for audio clips to be dropped in
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()

    const files = Array.from(e.dataTransfer.files).filter(f => 
      f.type.startsWith('audio/')
    )

    if (files.length === 0) return

    //get location of audio clip drop
    const bounds = e.currentTarget.getBoundingClientRect()

    //initialize a new node with relevent data
    const newNodes: Node[] = files.map(file => ({
      id: `track-${idCounter++}`,
      position: {
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      },
      data: { label: file.name },
      type: 'trackNode',
    }))

    setNodes(prev => [...prev, ...newNodes])
  }, [])

  return (
    <div className='mainContent'>
      <ReactFlow
        nodes={nodes}
        edges={[]}
        onNodesChange={onNodesChange}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={{ trackNode: StarNode}}
        fitView
      >
      </ReactFlow>
    </div>
  )
}

function StarNode() {
  return (
    <div style={{
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: 'white',
      boxShadow: '0 0 6px 2px rgba(255,255,255,0.6)',
    }} />
  )
}