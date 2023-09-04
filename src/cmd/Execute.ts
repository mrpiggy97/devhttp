import { Command, Log, Cmd } from "./Command";

export default function Execute(args : string) : Log{
    // at this point we should get something like
    // app create --name extension --port 3000
    let argsArray : string[] = args.split(" ")
    if(argsArray.length < 2){
        return {
            message: "not enough arguments were provided",
            error : true
        }
    }
    const selectedCmd : Command | undefined = Cmd.get(argsArray[0])
    if(!selectedCmd){
        return {
            message : "no such command exists",
            error : true
        }
    }
    argsArray = argsArray.splice(1)
    return selectedCmd.Execute(argsArray)
}