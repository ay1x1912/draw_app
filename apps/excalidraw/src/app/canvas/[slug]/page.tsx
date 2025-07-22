import CanvasSocket from '@/app/components/CancasSocket'
import { BACKEND_URL } from '@/lib/config'
import axios from 'axios'
import React from 'react'


const getRoomId=async(slug:string)=>{
    try {
     const res=   await axios({
            method:"get",
            "url":`${BACKEND_URL}/room/${slug}`
        })

        return res.data;
    } catch (error) {
        console.log(error)
    }
}

const getChats=async(roomId:number)=>{
try {
     const res=   await axios({
            method:"get",
            "url":`${BACKEND_URL}/chats/${roomId}`,
            headers:{
                Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NDc3NTVjYS0wOGM3LTQwYzgtODRlNi0zYmMxYjk1NmUyYTEiLCJpYXQiOjE3NTI2NTAyNTJ9.it8TBbBOfFRmEEkYaDa8TZUBv76zaPg-l7c2-CHX0FI"
            }
        })
       
        return res.data;
    } catch (error) {
        console.log(error)
    }
}
export default async function CanvasMainPage({params}:{params:Promise<{slug:string}>}) {
    const {slug}=await params
    const {room}=await getRoomId(slug);
    const {chats}=await getChats(room.id)
    
   return (
    <div>
        <CanvasSocket chats={chats} roomId={room.id} />
    </div>
   )
}

