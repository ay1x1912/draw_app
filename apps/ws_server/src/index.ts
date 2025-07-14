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
  console.log( "userid",userId);

  users.push({
    userId,
    rooms:[],
    ws
    
  })

await connectToRedis()

  ws.on("message", function message(data) {
    const parsedData=JSON.parse(data as unknown as string);
    console.log(parsedData);
    if(parsedData.type=="join_room"){
      const user=users.find(x=>x.ws===ws);
      user?.rooms.push(parsedData.roomId)
      console.log(users)
    }

    if(parsedData.type=="leave_room"){
      const user=users.find(x=>x.ws===ws);
      console.log(user);
      if(!user){
        return 
      }
      user.rooms=user.rooms.filter((roomId)=>roomId!==parsedData.roomId);
      console.log(users)

    }
    if(parsedData.type=="chat"){
      const roomId=parsedData.roomId
      const msg=parsedData.message
      const msgData=JSON.stringify({
        roomId,
        userId,
        msg
      })
      client.lPush("chat",msgData )
      users.forEach((user)=>{
        if(user.rooms.includes(roomId)){
          user.ws.send(JSON.stringify({
            type:"chat",
            roomId,
            msg
          }))
        }
      })
      console.log(users)

    }
    console.log("received: %s", data);
  });


  ws.send("something");
});
