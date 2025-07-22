
interface react{
  type:"react",
  width:number,
  height:number,
  startX:number,
  startY:number
}
interface circle{
   type:"circle",
   startX:number,
  startY:number,
  radius:number
}
interface line{
   type:"line",
   startX:number,
  startY:number,
  endX:number,
  endY:number
}
type Message={
    msg:string,
    id:string,
    userId:string,
    roomId:number
}
type Shapes=react | circle |line
    const existingShapes:Shapes[]=[];
type shapesType="react"| "circle"|"line"|null

export function initDraw(canvas:HTMLCanvasElement, socket:WebSocket ,roomId:number ,chats:Message[],shapeType:shapesType) {
  
   existinChats(chats,canvas)
  const ctx=canvas.getContext("2d");
   if(!ctx) return ;
recivedMsg(socket,canvas);

  let startX=0;
  let startY=0;
  let cliked=false
  const handleMouseDown=(e:MouseEvent)=>{
    startX=e.clientX;
    startY=e.clientY;
    cliked=true
  }
  const handleMouseUp=(e:MouseEvent)=>{
    cliked=false;
    let height=e.clientY-startY;
    let width=e.clientX-startX;
    let centerx=(startX+e.clientX)/2
    let centery=(startY+e.clientY)/2
    let radius=(Math.max(height,width))/2;
    if(radius<0)  {radius=(-1*radius)}
    let shapeObj:Shapes={
      type:"react",
      startX,
      startY,
      height,
      width
    }
    if(shapeType=="react"){
       shapeObj={
      type:"react",
      startX,
      startY,
      height,
      width
    }
    }
   if(shapeType=="circle"){
    shapeObj={
      type:"circle",
      radius,
      startX:centerx,
      startY:centery
    }
   }
   if(shapeType=="line"){
    shapeObj={
      type:"line",
      endX:e.clientX,
      endY:e.clientY,
      startX,
      startY
    }
   }
   
   existingShapes.push(shapeObj);
    console.log(existingShapes);
    socket.send(JSON.stringify({
      type:"chat",
      roomId,
      msg:{
        shape:shapeObj
      }
    }))
  

    
  }
  const handleMouseMove=(e:MouseEvent)=>{ 
    if(cliked){
    let height=e.clientY-startY;
    let width=e.clientX-startX
    if(shapeType=="react"){
     
      clear(canvas);
      ctx.strokeRect(startX,startY,width,height);
    }
    if(shapeType=="circle"){
    let centerx=(startX+e.clientX)/2
    let centery=(startY+e.clientY)/2
    let radius=(Math.max(height,width))/2;
    if(radius<0) {radius=(-1*radius)}
   clear(canvas);
    ctx.beginPath()
    ctx.arc(centerx,centery,radius,0,Math.PI*2);
    ctx.stroke()
    }
    if(shapeType=="line"){
       clear(canvas);
    ctx.beginPath(); // Start a new path
    ctx.moveTo(startX,startY); // Move the pen to (30, 50)
   ctx.lineTo(e.clientX,e.clientY); // Draw a line to (150, 100)
   ctx.stroke(); // Render the path

    }
    }}
  canvas.addEventListener("mousedown",handleMouseDown)
  canvas.addEventListener("mouseup",handleMouseUp)
  canvas.addEventListener("mousemove",handleMouseMove)

  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseup", handleMouseUp);
    canvas.removeEventListener("mousemove", handleMouseMove);
  };
}

const clear=(canvas:HTMLCanvasElement )=>{
    const ctx=canvas.getContext("2d");
    if(!ctx) return ;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="rgba(0,0,0)"
    ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.strokeStyle="rgba(256,256,256)"
       existingShapes.map((shape)=>{
        if(shape.type=="react"){
          const {startX,startY,height,width}=shape
          ctx.strokeRect(startX,startY,width,height);
        }
        if(shape.type=="circle"){
          const {startX,startY,radius}=shape
        ctx.beginPath()
      ctx.arc(startX,startY,radius,0,Math.PI*2);
      ctx.stroke()
        }
        if(shape.type=="line"){
          const {startX,startY,endX,endY}=shape
          ctx.beginPath(); // Start a new path
    ctx.moveTo(startX,startY); // Move the pen to (30, 50)
   ctx.lineTo(endX,endY); // Draw a line to (150, 100)
   ctx.stroke(); // Render the path
        }
    })
}


const recivedMsg=(socket:WebSocket ,canvas:HTMLCanvasElement)=>{
  
socket.onmessage=(msg)=>{
 const data=JSON.parse(msg.data  as unknown as string);
 if(data.type==="chat"){
  existingShapes.push(data.msg.shape);
 }
clear(canvas)

}
}

const existinChats=(chats:Message[] ,canvas:HTMLCanvasElement)=>{
 chats.map((chat)=>{
  const data=JSON.parse(chat.msg);
  existingShapes.push(data.shape);
  
 })
   clear(canvas)

}





