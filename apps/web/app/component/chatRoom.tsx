
import axios from 'axios'
import React from 'react'
import { BACKEND_URL } from '../../config'
import ChatRoomClient from './chatRoomClilent'

const getChats= async (roomId:number)=>{

    try {
    const res=await axios({
      method:"get",
      url:`${BACKEND_URL}/chats/${roomId}`,
      headers:{
        Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NDc3NTVjYS0wOGM3LTQwYzgtODRlNi0zYmMxYjk1NmUyYTEiLCJpYXQiOjE3NTI2NTAyNTJ9.it8TBbBOfFRmEEkYaDa8TZUBv76zaPg-l7c2-CHX0FI"
      }
    })
    console.log(res)
    return res.data.chats
  } catch (error) {
    console.log(error);
    
  }
    
}

export default  async function ChaatRoom({roomId}:{roomId:number}) {
    const chats=await getChats(roomId);
    
    return (
        <div>
          
            <ChatRoomClient id={roomId} chats={chats} />
        </div>
    )
}
