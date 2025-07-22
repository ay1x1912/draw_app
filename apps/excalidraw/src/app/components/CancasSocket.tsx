"use client"
import { useSocket } from '@/hooks/useSocket'
import React, { useEffect } from 'react'
import Canvas from './Canvas';

type Message={
    msg:string,
    id:string,
    userId:string,
    roomId:number
}
interface CancasSocketInterface {
roomId:number,
chats:Message[]
}
export default function CanvasSocket({roomId,chats}:CancasSocketInterface) {
    const {socket,loading}=useSocket();

   
     useEffect(()=>{
        if(!socket) return ;
        socket.onopen=()=>{
socket.send(JSON.stringify({
            type:"join_room",
            roomId
        }))
        }
        
    },[socket,roomId])
    if(loading || !socket){
        return <div>
            Loading...
        </div>
    }

     
    return (
        <div> 
            <Canvas chats={chats} socket={socket} roomId={roomId}/>
        </div>
    )
}
