import { ExecutorProps } from "../Executor";
import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

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
    const url : string = props.flags.get("--url") as string
    const [message, setMessage] = useState("")
    const headers : string | undefined = props.optFlags.get("--headers")
    let headersMapped : Map<string,string> | undefined = undefined
    if(headers){
        headersMapped = getHeaders(headers)
        if(!headersMapped){
            setMessage("failed to map headers, make sure each key has a value")
            setError(true)
        }        
    }
    const makeRequest = () : void => {
        let options : AxiosRequestConfig
        if(headersMapped){
            options = {
                method : "GET",
                headers: Object.fromEntries(headersMapped)
            }
        }else{
            options = {
                method: "GET"
            }
        }
        axios.get(url,options).then((res) => {
            const decodedRes = JSON.stringify(res.data)
            setMessage(`${decodedRes}`)
        }).catch((err : Error) => {
            setError(true)
            setMessage(err.message)
        })
    }

    useEffect(() => {
        if(!error){
            makeRequest()
        }
        setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    if(loading){
        return (
            <div>loading...</div>
        )
    }
    if(error){
        return(
            <div>
                <span>{message}</span>
            </div>
        )
    }
    return (
        <div>
            <span>{message}</span>
        </div>
    )
}
