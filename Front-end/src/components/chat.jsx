import React from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import "./chatbot.css"
const fetchApi = async (message) =>{
    const response = await axios.post("http://localhost:8000/ask", { message }) //submit data to the server //bước này là để susbmit data from server
    //trong khi bước ở trong app.js dùng để handle, nếu data được submit lên server thif làm gì
    //Sau khi data dược submit xong, nó sẽ generate ra câu trả lời
    return response.data
    //Khi mà make request bằng axios thì server sẽ nhả lại response, và response body được accessed qua data property
}
function Chat(){
    const [message, setMessage] = useState('');
    const [conversations, setConversationHistory] = useState([{role: "assistant", content: "Hello!. how can I assist you today"}])
    const mutation = useMutation({
        mutationFn: fetchApi,
        onSuccess: (data)=>{ //data: contains the data returned from the mutation function
            setConversationHistory(prev => [...prev, {role: "assistant", content: data.message}]); //cập nhật data mới được
            //trả lời
        }
    })

    const handleMessage = () => {
        const currentMessage = message.trim()
        if(!currentMessage){
            alert("Please enter a message")
            return
        }
        setConversationHistory(prev => [...prev, {role: "user", content: currentMessage}]);
        mutation.mutate(currentMessage) //this is the argument of the mutation function
        setMessage("")
        // mutation.mutate(currentMessage) is used to send currentMessage 
        //to the server or process it as defined in the mutation function provided to useMutation, in this case, send the message
        //to the server in the fetchAPi function
    }

    return (
        <div> Welcome to the ChatBot
            <div className="header">
                <h1 className="title">AI ChatBot</h1>
                <p className="description">Enter your mesage in the input below</p>
                <div className="chat-container">
                    <div className="conversation">
                        {conversations.map((conv, index) => (
                            <div className={`message ${conv.role}`} key={index}>
                                <strong>{conv.role === "assistant" ? 'AI' : 'You'}:</strong> {conv.content}
                            </div>
                        ))}
                        
                    </div>
                    <div className="input-area">
                        <input type="text" className="input-message" value={message} onChange={(e)=>{setMessage(e.target.value)}}/>
                        <button onClick={handleMessage}>Send Message</button>
                    </div>
                </div>
            </div>
        
        </div>
        
    )
}
export default Chat