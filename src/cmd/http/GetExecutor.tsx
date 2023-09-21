import { ExecutorProps } from "../Executor";
import Error from "../Error";
import { useEffect, useState } from "react";

function getHeaders(headers : string | undefined) : Map<string,string> | undefined{
    if(headers === undefined){
        return undefined
    }
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
export default function GetExecutor(props : ExecutorProps) : JSX.Element{
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const flags = new Map<string, string | undefined>()
    const optflags = new Map<string, string | undefined>()
    const url : string | undefined = props.flags.get("--url")
    let urlErr = ""
    let headersErr = ""
    let headersMappingErr = ""
    const [message, setMessage] = useState("")
    if(!url){
        urlErr = "url is a required flag"
        setMessage(urlErr)
        setError(true)
    }
    const headers : string | undefined = props.flags.get("--headers")
    if(!headers){
        headersErr = "headers is a required flag"
        if(!error){
            setError(true)
            setMessage(headersErr)
        }else{
            setMessage((prev) => `${prev} ${headersErr}`)
        }
    }
    const headersMapped = getHeaders(headers)
    if(!headersMapped){
        headersMappingErr = "failed to map headers, make sure each key has a value"
        if(!error){
            setError(true)
            setMessage(headersMappingErr)
        }else{
            setMessage((prev) => `${prev} ${headersMappingErr}`)
        }
    }
    if(error){
        flags.set("--message", message)
        setLoading(false)
    }
    useEffect(() => {
        if(url !== undefined && headersMapped !== undefined){
            const options = {
                method : "GET",
                headers: Object.fromEntries(headersMapped)
            }
            fetch(url,options).then((res) => {
                if(res.ok){
                    setMessage(`status ${res.status} ${res.json()}`)
                }else{
                    setMessage(`status ${res.status} ${res.statusText}`)
                }
            }).catch(() => {
                setMessage("there was an error trying to send request")
                setError(true)
            })
            setLoading(false)
        }
    },[])
    if(loading){
        return (
            <div>loading...</div>
        )
    }
    if(error && !loading){
        return(
            <Error flags={flags} optFlags={optflags}/>
        )
    }
    return (
        <div>
            <span>{message}</span>
        </div>
    )
}
