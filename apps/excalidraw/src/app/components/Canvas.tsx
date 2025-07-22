"use client"
import { initDraw } from '@/lib/draw';
import React, { useEffect, useRef, useState } from 'react'
import IconButton from './IconButton';
import { CircleIcon, PenIcon, SquareIcon } from 'lucide-react';
import { Draw } from '@/lib/drawClass';

type Message={
    msg:string,
    id:string,
    userId:string,
    roomId:number
}
interface CanvasInterface{
    roomId:number,
    socket:WebSocket,
    chats:Message[]
}
type shapesType="react"| "circle"|"line"
export default function Canvas({roomId,socket,chats}:CanvasInterface) {
    const [shape,setShape]=useState<shapesType>("react");
    const canvasRef=useRef<HTMLCanvasElement |null>(null);
    const [draw,setDraw]=useState<Draw>()
    useEffect(()=>{
      console.log(shape)
     draw?.setShape(shape);
    },[draw,shape])
useEffect(() => {
  if(canvasRef.current){
   const canvas=canvasRef.current;
  //  const cleanup = initDraw(canvas, socket, roomId, chats ,shape);
 const d=new Draw(canvas,chats,socket,roomId,shape)
setDraw(d);
  return () => {
    d?.cleanUp() // Remove listeners on unmount
  };
  }
  
}, [canvasRef])
     
    return (
 <div className='h-screen w-screen overflow-hidden relative'>
      <canvas width={window.innerWidth} height={window.innerHeight} className='border' ref={canvasRef}/>
      <div className='flex justify-center items-center gap-4 absolute top-4 left-20 '>
      <IconButton activated={shape==="line"}  onclick={()=>{setShape("line") 
  
       
      }} icon={<PenIcon/>}/>
      <IconButton activated={shape=="circle"}  onclick={()=>{setShape("circle") 
       
      
      }} icon={<CircleIcon/>}/>
      <IconButton activated={shape=="react"}  onclick={()=>{setShape("react") 
   
      }} icon={<SquareIcon/>}/>
      </div>
    </div>
    )
}
