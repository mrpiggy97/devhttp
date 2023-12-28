import { useEffect, useState } from "react";
import { ExecutorProps } from "../Executor";

export default function PutExecutor(props : ExecutorProps) : JSX.Element{
    let url = props.flags.get("--url") as string
    // check if url is an alias for an actual url
    if(localStorage.getItem(url)){
        url = localStorage.getItem(url) as string
    }
    const data = props.flags.get("--data") as string
    const token = props.flags.get("--token") as string

    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(true)
    const makeRequest = () : void => {
        const options : RequestInit = {
            method: "PUT",
            headers:{
                'Content-type':'application/json',
                'Accept':'application/json',
                'Authorization':token
            },
            body: data
        }
        fetch(url,options).then((res) => {
            return res.json()
        }).then((res) => setMessage(res)).catch((err) => setMessage(err))
    }
    useEffect(() => {
        makeRequest()
        setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    if(loading){
        return(
            <div>
                <span>loading...</span>
            </div>
        )
    }
    return(
        <div>
            <span>{message}</span>
        </div>
    )
}