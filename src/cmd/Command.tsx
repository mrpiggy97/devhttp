import Error from "./Error"

import { Executor, ExecutorProps } from "./Executor"
import SubCommandComponent from "./SubCommandComponent"
import "./Command.css"

export type Log = {
    props : ExecutorProps
    executor : Executor
}

interface ICMD{
    Execute(args : string[]) : Log
}

export class SubCommand implements ICMD{
    name : string
    executor : Executor
    flags : Map<string,string | undefined> | null
    optFlags : Map<string,string | undefined> | null
    description: string

    constructor(n : string, exe : Executor, flags : string[], optFlags : string[], descrip : string){
        this.name = n
        this.executor = exe
        this.flags = null
        this.optFlags = null
        this.description = descrip
        if(flags.length > 0){
            this.flags = new Map<string, string | undefined>()
            flags.map((flag) => {
                this.flags?.set(flag, undefined)
            })
        }
        if(this.optFlags){
            this.optFlags = new Map<string,string | undefined>()
            optFlags.map((flag) => {
                this.optFlags?.set(flag,undefined)
            })
        }
    }
    public setFlagsAsDefault() : void{
        if(this.flags){
            this.flags.forEach((_,key) => {
                this.flags?.set(key,undefined)
            })
        }
        if(this.optFlags){
            this.optFlags.forEach((_,key) => {
                this.optFlags?.set(key,undefined)
            })
        }
    }
    public setAndVerifyFlags(flags : string[]) : boolean{
        // at this point we should have something like this
        // ['--name', 'fabian', 'rivas', '--link', 'https://www.thelink.com']
        // while not all flags are required, a key value pair is always required

        // now loop through the args and check if flags exists within
        // required flags or optional flags, if even a single value of
        // does not exist in either required or optional flags then return false
        // and set both flags and optFlags to their default values
        if(this.flags.size === 0 && this.optFlags.size === 0){
            return true
        }
        let currentFlag = ""
        let currentVal = ""
        for(let i=0; i < flags.length; i++){
            const val = flags[i]
            if(val[0] === "-" && val[1] === "-"){
                // if we already have a flag then set that flag's
                // value with currentVal
                if(currentFlag.length > 0){
                    if(currentVal.length > 0){
                        if(this.flags.has(currentFlag)){
                            this.flags.set(currentFlag,currentVal)
                            currentVal = ""
                        }else{
                            if(this.optFlags.has(currentFlag)){
                                this.optFlags.set(currentFlag,currentVal)
                                currentVal = ""
                            }else{
                                this.setFlagsAsDefault()
                                return false                                
                            }
                        }
                    }
                }
                currentFlag = val
            }else{
                // if now key value pair exists in order than return false
                if(currentFlag.length === 0){
                    this.setFlagsAsDefault()
                    return false
                }else{
                    if(currentVal.length === 0){
                        currentVal = val
                    }else{
                        currentVal = `${currentVal} ${val}`
                    }
                }
            }
        }
        if(currentFlag.length === 0 || currentVal.length === 0){
            this.setFlagsAsDefault()
            return false
        }
        if(this.flags.has(currentFlag)){
            this.flags.set(currentFlag,currentVal)
        }else{
            if(this.optFlags.has(currentFlag)){
                this.optFlags.set(currentFlag,currentVal)
            }else{
                this.setFlagsAsDefault()
                return false
            }
        }
        // flags are set, now verify that all required flags have been filled
        let finalResult = true
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.flags.forEach((val,_) => {
            if(val === undefined){
                finalResult = false
            }
        })
        return finalResult
    }
    public Execute(args : string[]) : Log{
        // at this point we should get something like [--name, fabian, --port, 3000]
        const flagsValid : boolean = this.setAndVerifyFlags(args)
        if(!flagsValid){
            this.flags.set("--message", "flags are not valid")
            return {
                props: {
                    flags : this.flags,
                    optFlags : this.optFlags
                },
                executor: Error
            }
        }
        const flagsCopy : Map<string,string | undefined> = structuredClone(this.flags)
        const optFlagsCopy : Map<string,string | undefined> = structuredClone(this.optFlags)
        this.setFlagsAsDefault()
        return {
            props: {
                flags: flagsCopy,
                optFlags: optFlagsCopy
            },
            executor: this.executor
        }
    }
}

export class Command implements ICMD{
    name : string
    subCommands : Map<string,SubCommand>
    helpExecutor : Executor
    help : SubCommand
    constructor(n : string, commands : SubCommand[]){
        this.name = n
        this.subCommands = new Map<string,SubCommand>()
        commands.map((cmd) => {
            this.subCommands.set(cmd.name,cmd)
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.helpExecutor = (_ : ExecutorProps) : JSX.Element => {
            const cmds = Array.from(this.subCommands.values())
            return(
                <div className="help">
                    {cmds.map((cmd) => <SubCommandComponent
                    name={cmd.name}
                    description={cmd.description}
                    flags={cmd.flags}
                    optFlags={cmd.optFlags} />)}
                </div>
            )
        }
        this.help = new SubCommand("help", this.helpExecutor,[],[],"run if you need help")
        this.subCommands.set("help", this.help)
    }
    public Execute(args : string[]) : Log{
        // at this stage args should look something similar to
        // [create, --name, hello, --link, https://www.thelink.com]
        // link will be an optional flag while name required
        // create is the subCommand, so the first step would be to verify
        // that a subCommand with the name create exists
        if(args.length < 1){
            const flags = new Map<string, string | undefined>()
            const optFlags = new Map<string, string | undefined>()
            flags.set("--message", "not enough flags were provided")
            return {
                props:{
                    flags: flags,
                    optFlags : optFlags
                },
                executor: Error
            }
        }
        // now we verify that we have that subCommand registered
        const subCmd : SubCommand | undefined = this.subCommands.get(args[0])
        if(!subCmd){
            const flags = new Map<string, string | undefined>()
            flags.set("--message", "no such sub command exists")
            const optFlags = new Map<string, string | undefined>()
            return {
                props:{
                    flags: flags,
                    optFlags: optFlags
                },
                executor : Error
            }
        }
        // now we delete the first string from argsSplit
        args = args.slice(1)
        // we should have the following string --name hello --link https://thelink.com
        // so we pass the rest of the execution to the subCommand
        return subCmd.Execute(args)
    }
}