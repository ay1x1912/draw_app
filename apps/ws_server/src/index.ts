import WebSocket, { WebSocketServer } from "ws";
import{ JWT_SECRET }from "@repo/bc"
import jwt from "jsonwebtoken";
import { createClient } from "redis";


type User={
  rooms:string[],
  userId:string;
  ws:WebSocket
}
const users:User[]=[]
const checkUser=(token:string)=>{
try {
   const decoded=jwt.verify(token,JWT_SECRET);
   if(typeof decoded =="string"){
    return null
   }
   if(!decoded || !decoded.userId){
    return null
   }
   return decoded.userId;
} catch (error) {
  console.log(error)
  return null
}
}

const connectToRedis=async()=>{
   try {
        await client.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

const wss = new WebSocketServer({ port: 8080 });


const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));
( async function () {
await connectToRedis()
})();

wss.on("connection",  async function connection(ws,req) {
  ws.on("error", console.error);
const url=req.url;
if(!url){
  ws.close()
  return 
}
const queryParams= new URLSearchParams(url.split("?")[1]);
const token=queryParams.get("token") ?? " ";
  const userId=checkUser(token);
  if(!userId){
    ws.close()
    return  
  }


  users.push({
    userId,
    rooms:[],
    ws
    
  })


  ws.on("message", function message(data) {
    const parsedData=JSON.parse(data as unknown as string);

    if(parsedData.type=="join_room"){
      console.log("join_room",parsedData.roomId)
      const user=users.find(x=>x.ws===ws);
      user?.rooms.push(parsedData.roomId)
    }

    if(parsedData.type=="leave_room"){
      const user=users.find(x=>x.ws===ws);
      if(!user){
        return 
      }
      user.rooms=user.rooms.filter((roomId)=>roomId!==parsedData.roomId);

    }
    if(parsedData.type=="chat"){
      const roomId=parsedData.roomId
      const msg=parsedData.msg
      const msgData=JSON.stringify({
        roomId,
        userId,
        msg
      })
      client.lPush("chat",msgData )
      console.log("added to db")
      users.forEach((user)=>{
        

          if(user.rooms.includes(roomId)  ){
          user.ws.send(JSON.stringify({
            type:"chat",
            roomId,
            msg
          }))
        }
        
       
      })

    }
  });


  ws.send(JSON.stringify({msg:"from ws"}));
});
