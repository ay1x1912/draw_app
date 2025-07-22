


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
type shapesType="react"| "circle"|"line"|null
export class Draw {
    private canvas:HTMLCanvasElement
    private ctx:CanvasRenderingContext2D
    private existingShapes:Shapes[];
    private chats:Message[]
    private socket:WebSocket
    private startX:number;
    private startY:number;
    private clicked:boolean;
    private shape:shapesType
    private roomId:number
    
    constructor(canvas:HTMLCanvasElement,chats:Message[], socket:WebSocket,roomId:number ,shape:shapesType) {
        this.canvas=canvas
        this.ctx=canvas.getContext("2d")!
        this.existingShapes=[]
       this.chats=chats
       this.socket=socket
       this.startX=0;
       this.startY=0;
       this.clicked=false
       this.shape=shape
       this.roomId=roomId
       this.init()
       this.initHandlers()
    }

    init=()=>{
        
this.existinChats()
this.recivedMsg();
    }
    clear=()=>{
       
    if(!this.ctx) return ;
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.ctx.fillStyle="rgba(0,0,0)"
    this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
    this.ctx.strokeStyle="rgba(256,256,256)"
       this.existingShapes.map((shape)=>{
        if(shape.type=="react"){
          const {startX,startY,height,width}=shape
          this.ctx.strokeRect(startX,startY,width,height);
        }
        if(shape.type=="circle"){
          const {startX,startY,radius}=shape
        this.ctx.beginPath()
      this.ctx.arc(startX,startY,radius,0,Math.PI*2);
      this.ctx.stroke()
        }
        if(shape.type=="line"){
          const {startX,startY,endX,endY}=shape
          this.ctx.beginPath(); // Start a new path
    this.ctx.moveTo(startX,startY); // Move the pen to (30, 50)
   this.ctx.lineTo(endX,endY); // Draw a line to (150, 100)
   this.ctx.stroke(); // Render the path
        }
    })
    }
existinChats=()=>{
 this.chats.map((chat)=>{
  const data=JSON.parse(chat.msg);
  this.existingShapes.push(data.shape);
  
 })
   this.clear()

}
 recivedMsg=()=>{
  
this.socket.onmessage=(msg)=>{
 const data=JSON.parse(msg.data  as unknown as string);
 if(data.type==="chat"){
  this.existingShapes.push(data.msg.shape);
 }
this.clear()

}
}

   handleMouseDown=(e:MouseEvent)=>{
    this.startX=e.clientX;
    this.startY=e.clientY;
    this.clicked=true
  }
 handleMouseUp=(e:MouseEvent)=>{
    this.clicked=false;
    let height=e.clientY-this.startY;
    let width=e.clientX-this.startX;
    let centerx=(this.startX+e.clientX)/2
    let centery=(this.startY+e.clientY)/2
    let radius=(Math.max(height,width))/2;
    if(radius<0)  {radius=(-1*radius)}
    let shapeObj:Shapes={
      type:"react",
      startX:this.startX,
      startY:this.startY,
      height,
      width
    }
    if(this.shape=="react"){
       shapeObj={
      type:"react",
      startX:this.startX,
      startY:this.startY,
      height,
      width
    }
    }
   if(this.shape=="circle"){
    shapeObj={
      type:"circle",
      radius,
      startX:centerx,
      startY:centery
    }
   }
   if(this.shape=="line"){
    shapeObj={
      type:"line",
      endX:e.clientX,
      endY:e.clientY,
      startX:this.startX,
      startY:this.startY
    }
   }
   
   this.existingShapes.push(shapeObj);
    
    this.socket.send(JSON.stringify({
      type:"chat",
      roomId:this.roomId,
      msg:{
        shape:shapeObj
      }
    }))
  

    
  }
 handleMouseMove=(e:MouseEvent)=>{ 
    if(this.clicked){
    let height=e.clientY-this.startY;
    let width=e.clientX-this.startX
    if(this.shape=="react"){
      
     
      this.clear();
      this.ctx.strokeRect(this.startX,this.startY,width,height);
    }
   else if(this.shape=="circle"){
        
    let centerx=(this.startX+e.clientX)/2
    let centery=(this.startY+e.clientY)/2
    let radius=(Math.max(height,width))/2;
    if(radius<0) {radius=(-1*radius)}
   this.clear();
    this.ctx.beginPath()
    this.ctx.arc(centerx,centery,radius,0,Math.PI*2);
    this.ctx.stroke()
    }
    else if(this.shape=="line"){
      

       this.clear();
    this.ctx.beginPath(); // Start a new path
    this.ctx.moveTo(this.startX,this.startY); // Move the pen to (30, 50)
   this.ctx.lineTo(e.clientX,e.clientY); // Draw a line to (150, 100)
   this.ctx.stroke(); // Render the path

    }
    }}
initHandlers=()=>{
  this.canvas.addEventListener("mousedown",this.handleMouseDown)
  this.canvas.addEventListener("mouseup",this.handleMouseUp)
  this.canvas.addEventListener("mousemove",this.handleMouseMove)


    
  
}
cleanUp=()=>{
this.canvas.removeEventListener("mousedown", this.handleMouseDown);
this.canvas.removeEventListener("mouseup", this.handleMouseUp);
this.canvas.removeEventListener("mousemove", this.handleMouseMove);
}

setShape=(shape:shapesType)=>{
    console.log
    this.shape=shape
}
}