import React, { FormEvent, useEffect, useRef, useState } from 'react'
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
  const scrollContainerToBottom = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };
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
  // this effect will scroll user to the bottom after previousCommands changes
  useEffect(() => {
    if(previousCommands.length > 0){
      scrollContainerToBottom()
    }
  },[previousCommands])
  return (
    <div id="app">
      {previousCommands.map((cmd) => <CommandComponent executor={cmd.executor} executorProps={cmd.executorProps} command={cmd.command} />)}
        <form id="command" onSubmit={runCmd} spellCheck={false}>
            <label htmlFor="command" className="name">devhttp:~$</label>
            <input name="command" type='text' id="command-input" ref={cmdRef} autoFocus={true}/>
        </form>
    </div>
  )
}

export default App
