"use client"
import React, { useEffect, useState } from 'react'
import { useSocket } from '../../hooks/socket'

export default function ChatRoomClient({chats,id}:{
  chats:{msg:string,roomId:number,userId:string,id:string}[]
    id:number
}) {
 const [oldChats,setOldChats]=useState(chats);
 const [currentChat,setCurrentChat]=useState("");

  const {loading,socekt}=useSocket();

  useEffect(()=>{
  
    if(socekt && !loading){

      socekt.send(JSON.stringify({
        type:"join_room",
        roomId:id
      }))
      socekt.onmessage=(event)=>{
        const parseData=JSON.parse(event.data);

       if(parseData.type==="chat"){
        setOldChats((c)=>[...c,parseData])
       }

      }

    }

  },[loading,socekt,id])
return <div>
  {
    oldChats.map((chat)=><div key={chat.id}>{chat.msg}</div>)
  }
<input value={currentChat} type="text" placeholder='Enter your msg' onChange={(e)=>setCurrentChat(e.target.value)} />
<button 
onClick={()=>{
 
  socekt?.send(JSON.stringify({type:"chat",roomId:id,msg:currentChat}))
  setCurrentChat("")
}}
>Send Message</button>
</div>
}
