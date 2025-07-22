import { createRoomSchema, SignInSchema, SignUpSchema } from "@repo/schemas";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import{ JWT_SECRET }from "@repo/bc"
import{ prisma} from "@repo/db"
import { middleware } from "./middleWare";
import bcrypt from "bcrypt"
const app = express();
const PORT = 8000;
app.use(express.json());

app.post("/signup", async(req: Request, res: Response) => {
  try {
    //parse body
    const result = SignUpSchema.safeParse(req.body);
    if (!result.success) {
      res.status(422).json({ msg: "Invalid Body" });
      return 
    }

    const {name,email,password}=result.data
    const user=await prisma.user.findUnique({where:{email}})
    if(user){
      res.json({msg:"user already exist"})
      return
    }
    const hasedPassword=await bcrypt.hash(password,10);
    const newUser=await prisma.user.create({
      data:{
        name,
        password:hasedPassword,
        email
      }
    })

    res.json({userid:newUser.id});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.post("/signin", async(req, res) => {
  try {
    //parse the body
    const result = SignInSchema.safeParse(req.body);
    if (!result.success) {
      res.status(422).json({ msg: "Invalid Body" });
      return
    }
    const {email,password}=result.data
    //check db
    const user=await prisma.user.findUnique({where:{email}})
    console.log(user)
    if(!user){
      
      res.json({msg:"user or pasword did not match"});
      return
    }
   const passwordMatched= await bcrypt.compare(password,user.password);
   console.log(password);
   console.log(passwordMatched)
   if(!passwordMatched){
    res.json({msg:"user or password did not matacb"});
      return
   }
    //create jwt token  and return
    const token = jwt.sign({ userId:user.id }, JWT_SECRET);
    res.json(token);
  } catch (error) {
    console.log(error);
     res.status(500).json({
      message: "Internal Server Error",
    });
  }
});



app.post("/room",middleware, async(req, res) => {
  try {
    const userId=req.userId ;
     const parsedData=createRoomSchema.safeParse(req.body);
    if(!userId){
    res.status(403).json({
            msg: "Unauthorized"
        })
        return
    }
    if(!parsedData.success){
      res.json({msg:"slug not provided"})
      return 
    }
    const {slug}=parsedData.data
   const room = await prisma.room.create({
    data: {
      slug,
      adminId:userId
    }
  })

   res.json({msg:{roomId:room.id}});
  } catch (error) {
    console.log(error);
     res.status(500).json({
      message: "Internal Server Error",
    });
  }
});


app.get("/chats/:roomId", middleware,async(req,res)=>{
 try {
  const userId=req.userId as string
  const roomId=Number(req.params.roomId)
  const skip=req.query.skip ?? "0" ;
  const take=req.query.take ?? "50" ;
  if(!userId){
    res.status(403).json({
            msg: "Unauthorized"
        })
        return
    }
  const chats=await prisma.chat.findMany({
    skip :parseInt(skip as string),
    take:parseInt(take as string),
    orderBy:{
      id:"asc"
    },
    where:{
      roomId
    }
  })
  res.json({
    chats
  })
 } catch (error) {
  console.log(error);
     res.status(500).json({
      message: "Internal Server Error",
    });
 }
})


app.get("/room/:slug",async(req,res)=>{
  try {
    const slug=req.params.slug;
    console.log(slug);
   const room= await prisma.room.findUnique({
      where:{
        slug
      }
    })
    res.json({room})
  } catch (error) {
    console.log(error);
     res.status(500).json({
      message: "Internal Server Error",
    });
  }
})

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

