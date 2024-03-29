import { Command, Log } from "./Command";
import { Cmd } from "./cmd";
import Error from "./Error";
import ls from "./ls";

export default function Execute(args : string) : Log{
    // at this point we should get something like
    // app create --name extension app --port 3000
    let argsArray : string[] = args.split(" ")
    if(argsArray.length < 2){
        const flags = new Map<string, string | undefined>()
        const optFlags = new Map<string, string | undefined>()
        if(argsArray.length === 1 && argsArray[0] === "ls"){
            return{
                props:{
                    flags: flags,
                    optFlags: optFlags
                },
                executor: ls
            }
        }
        flags.set("--message", "not enough arguments were provided")
        return {
            props: {
                flags: flags,
                optFlags : optFlags
            },
            executor: Error
        }
    }
    const selectedCmd : Command | undefined = Cmd.get(argsArray[0])
    if(!selectedCmd){
        const flags = new Map<string, string | undefined>()
        flags.set("--message", "no such command exists")
        const optFlags = new Map<string, string | undefined>()
        return {
            props: {
                flags: flags,
                optFlags: optFlags
            },
            executor: Error
        }
    }
    argsArray = argsArray.splice(1)
    return selectedCmd.Execute(argsArray)
}