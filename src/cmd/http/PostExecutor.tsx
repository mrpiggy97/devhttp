import { useEffect, useState } from "react";
import { ExecutorProps } from "../Executor";

export default function PostExecutor(props : ExecutorProps) : JSX.Element{
    const data = props.flags.get("--data") as string
    const token = props.flags.get("--token") as string
    const url = props.flags.get("--url") as string
    const options : RequestInit = {
        method: "POST",
        headers:{
            'Content-type': "application/json",
            'Accept': "application/json",
            'Authorization': token
        },
        body: data
    }
    const [loading, setLoading] = useState<boolean>(true)
    const [message, setMessage] = useState<string>("")
    const makeRequest = () : void => {
        fetch(url, options).then((res) => {
            return res.json()
        }).then((res) => {
            setMessage(res as string)
        }).catch((err) => {
            setMessage(err)
        })
        setLoading(false)
    }
    useEffect(() => {
        makeRequest()
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