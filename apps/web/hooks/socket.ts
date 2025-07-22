import { useEffect, useState } from "react"
import { WEBSOCKET_URL } from "../config";

export const useSocket=()=>{
const [loading,setLoading]=useState(true);
const [socekt,setSocket]=useState<null| WebSocket>(null);
useEffect(()=>{

    const ws=new WebSocket(WEBSOCKET_URL);
  ws.onopen=()=>{
     setLoading(false);
    setSocket(ws);
  }

},[])

return {loading,socekt}

}