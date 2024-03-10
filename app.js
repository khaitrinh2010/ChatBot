import OpenAI from "openai";
import dotenv from "dotenv"
import express from "express";
const application = express()
import cors from "cors"
dotenv.config()

//server side
const corOption = {origin: ["http://localhost:5173/", "http://localhost:5174" ]}
application.use(cors(corOption))

const openai = new OpenAI(process.env.API_KEY);
application.use(express.json())

let conversationHistory = [{role: "system", content: "You are a helpful assistant"}]
//The messages parameter: This parameter is an array of message objects, each with a role ("system", "user", or "assistant") and content (the text of the message). 
//This structured input tells the model the context of the conversation and how it should respond.
application.post("/ask", async (req, res)=>{
    const userMessage = req.body.message
    conversationHistory.push({role: "user", content: userMessage}) //push the question of the user, cái này là qua cái http request
    try{
        const response = await openai.chat.completions.create({messages: conversationHistory, model: "gpt-3.5-turbo"}) //generate the answer bassed on the context of the conversation
        const resp = response.choices[0].message.content;
        res.json({message: resp}) //send the response back
    }
    catch(error){
        res.status(500).json({message: "An error occurred"});
    }
    
    
})
//call openAI functions to generate a response based on the series of messages

application.listen(8000, ()=> {console.log("Server is running")})