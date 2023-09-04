import { Log, SubCommand } from "../Command";

export function getHeaders(headers : string) : Map<string,string> | undefined{
    const pairs : string[] = headers.split(",")
    if(pairs.length % 2 !== 0){
        return undefined
    }
    const header : Map<string,string> = new Map<string,string>()
    let currentFlag : string = ""
    for(let i=0; i < pairs.length; i++){
        const value : string = pairs[i]
        if(i % 2 === 0 || i === 0){
            currentFlag = value
        }else{
            header.set(currentFlag,value)
        }
    }
    return header
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function get(flags : Map<string,string | undefined>, _ : Map<string,string | undefined>) : Log{
    const url : string | undefined = flags.get("url")
    const headers : string | undefined = flags.get("headers")
    if(url === undefined || headers === undefined){
        return {
            message: "url and headers are required flags",
            error: true
        }
    }
    const headersMapped : Map<string,string> | undefined = getHeaders(headers)
    if(headersMapped === undefined){
        return {
            message: "every header needs a key and value",
            error: true
        }
    }
    const log : Log = {message : "", error : false}
    const options = {
        method : "GET",
        headers: Object.fromEntries(headersMapped)
    }
    fetch(url,options).then((res) => {
        if(res.ok){
            const message = `status ${res.status} ${res.json()}`
            log.message = message
            log.error = false
        }else{
            const message = `status ${res.status} ${res.statusText}`
            log.message = message
            log.error = true
        }
    }).catch(() => {
        log.message = "there was an error trying to send request"
        log.error = true
    })
    return log
}

export const getCmd : SubCommand = new SubCommand("get", get,["--url", "--headers"],[], "makes a GET http request")
