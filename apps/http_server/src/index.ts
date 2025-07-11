import { SignInSchema, SignUpSchema } from "@repo/schemas";
import express, { NextFunction, Request, Response } from "express";
import  {db }from "@repo/db"
import { usersTable } from "@repo/db/scheam";
import jwt from "jsonwebtoken";
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
    
    //store in db
  const [user]= await db.insert(usersTable).values({name,email,password}).returning()
    // jwt
    const token = jwt.sign({ userId: user?.id}, "12345678", {
      algorithm: "RS256",
    });
    res.json(token);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.post("signin", (req, res) => {
  try {
    //parse the body
    const result = SignInSchema.safeParse(req.body);
    if (!result.success) {
      res.status(422).json({ msg: "Invalid Body" });
    }
    //check db
    //create jwt token  and return
    const token = jwt.sign({ username: result.data?.email }, "12345678", {
      algorithm: "RS256",
    });
    res.json(token);
  } catch (error) {
    console.log(error);
  }
});



app.post("createroom", (req, res) => {
  try {
    //parse the body
    //store to db
    //create jwt token  and return
  } catch (error) {
    console.log(error);
  }
});
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});


const tokenmiddleware=(req:Request,res:Response,next:NextFunction)=>{
  const jwtToken=req.body.token;
  const userid= jwt.verify(jwtToken, '12345678');
  //query db 
  return userid 
}