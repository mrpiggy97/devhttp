import axios from "axios";
import { ExecutorProps } from "../Executor";
import { useEffect, useState } from "react";

type apiResponse = {
    ip : string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ShowIpExecutor(_props : ExecutorProps) : JSX.Element{
    const url = "https://api.ipify.org?format=json"
    const [requestFailed, setRequestFailed] = useState(false)
    const [errMessage, setErrMessage] = useState("")
    const [response, setResponse] = useState<apiResponse>({
        ip:""
    })
    const makeRequest = () : void => {
        axios.get(url).then((res) => {
            const newResponse = JSON.parse(res.data) as apiResponse
            setResponse(newResponse)
        }).catch((err : Error) => {
            setRequestFailed(true)
            setErrMessage(err.message)
        })        
    }
    useEffect(() => {
        makeRequest()
    },[])
    if(requestFailed){
        return(
            <div>
                <span>{errMessage}</span>
            </div>
        )
    }
    return(
        <div>
            <span>{response.ip}</span>
        </div>
    )
}