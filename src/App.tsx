import { FormEvent, useRef, useState } from 'react'
import { Log } from './cmd/Command'
import Execute from './cmd/Execute'
import './App.css'

function App() {
  const [logs, setLogs] = useState<Log[]>([])
  const [cmdArgs, setCmdArgs] = useState<string[]>([])
  const cmdRef = useRef<HTMLTextAreaElement>(null)
  const runCmd = (e : FormEvent) : void => {
    e.preventDefault()
    const args = cmdRef.current
    if(args){
      const result = Execute(args.value)
      setLogs((prev) => [...prev,result])
      setCmdArgs((prev) => [...prev, args.value])
    }
  }
  return (
    <div id="app">
      {logs.map((log,index) => {
        return (
          <div className='previous-command'>
            <span className='command'>devhttp/$ {cmdArgs[index]}</span>
            <log.executor flags={log.props.flags} optFlags={log.props.optFlags}/>
          </div>
        )
      })}
        <form className="command" onSubmit={runCmd}>
            <label htmlFor="command" className="name">devhttp/$</label>
            <textarea name="console" id="command"className="commands" ref={cmdRef}/>
        </form>
    </div>
  )
}

export default App
