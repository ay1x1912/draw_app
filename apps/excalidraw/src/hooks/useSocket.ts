import { WEBSOCKET_URL } from "@/lib/config";
import { useEffect, useState } from "react"

export const useSocket=()=>{
    const [loading,setLoading]=useState(false);
    const [socket,setSocket]=useState<null| WebSocket>(null);

     useEffect(()=>{
        setLoading(true);
        const ws=new WebSocket(`${WEBSOCKET_URL}`);
        
        setSocket(ws);
        setLoading(false)
     },[])
     return {socket,loading};
}