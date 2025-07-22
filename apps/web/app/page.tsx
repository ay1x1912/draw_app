"use client"
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { WEBSOCKET_URL } from '../config'


export default function Page() {
  const [slug,setSlug]=useState("")
  const router=useRouter()
 

  useEffect((
    
  )=>{},[])
  return (
    <div>
       <div >
        <input onChange={(e)=>setSlug(e.target.value)} type="text" placeholder='Enter room slug' />
        <button onClick={()=>router.push(`/room/${slug}`)}>Join room </button>
       </div>
    </div>
  )
}
