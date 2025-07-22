

import { createClient } from "redis";
import{ prisma} from "@repo/db"
const client = createClient();

const processChat=async(chat:string)=>{
 const {roomId,userId,msg}=JSON.parse(chat);
 console.log(roomId);
 console.log(userId);
 console.log(msg);
 const msgForDb=JSON.stringify(msg);
 console.log(msgForDb)
const storedChat=await prisma.chat.create({
   data:{
      userId,
      roomId,
      msg:msgForDb
   }
})
 console.log(storedChat);
}
const startWorker=async()=>{
    try {
       await client.connect();
       console.log("Connected to redis");
       
       while(true){
          try {
             const chat = await client.brPop("chat", 0);
             console.log(chat)
                  // @ts-ignore
       await processChat(chat.element);
          } catch (error) {
            console.log("Error while proceesing the chat")
          }
       }
    } catch (error) {
     console.error("Failed to connect to Redis", error);
    }
}

startWorker()