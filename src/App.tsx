import React, { FormEvent, useRef, useState } from 'react'
import { Executor, ExecutorProps } from './cmd/Executor'
import Execute from './cmd/Execute'
import './App.css'

type previousCmd = {
  executor : Executor,
  executorProps : ExecutorProps
  command : string
}

function CommandComponent(props : previousCmd) : JSX.Element{
  return(
    <React.Fragment>
      <span className='command'>devhttp/$ {props.command}</span>
      <props.executor flags={props.executorProps.flags} optFlags={props.executorProps.optFlags} />
    </React.Fragment>
  )
}

function App() {
  const [previousCommands, setPreviousCommands] = useState<previousCmd[]>([])
  const cmdRef = useRef<HTMLInputElement>(null)
  const runCmd = (e : FormEvent) : void => {
    e.preventDefault()
    const args = cmdRef.current
    if(args){
      const result = Execute(args.value)
      const newCmd : previousCmd = {
        executor: result.executor,
        executorProps : result.props,
        command: args.value
      }
      setPreviousCommands((prev) => [...prev,newCmd])
    }
  }
  return (
    <div id="app">
      {previousCommands.map((cmd) => <CommandComponent executor={cmd.executor} executorProps={cmd.executorProps} command={cmd.command} />)}
        <form id="command" onSubmit={runCmd}>
            <label htmlFor="command" className="name">devhttp/$</label>
            <input name="command" type='text' id="command" ref={cmdRef}/>
        </form>
    </div>
  )
}

export default App
