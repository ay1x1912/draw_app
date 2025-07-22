import React from 'react'
import { BACKEND_URL } from '../../../config';
import axios from 'axios';
import ChaatRoom from '../../component/chatRoom';




const getRoomId=async(slug:string)=>{

  try {
    const res=await axios({
      method:"get",
      url:`${BACKEND_URL}/room/${slug}`,
      
    })
    console.log(res)
    return res.data.room
  } catch (error) {
    console.log(error);
    
  }

}
export default async function Page(
{params}:{params:Promise<{slug:string}>}

) {
    const {slug}=await params
  const room= await getRoomId(slug);


    return (
        <div>
            {slug}
            <div>
             {room.id}
            </div>
            <div>
              <ChaatRoom roomId={room.id} />
            </div>
        </div>
    )
}
