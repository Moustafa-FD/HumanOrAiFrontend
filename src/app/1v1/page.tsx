"use client";
import { useState, useRef, useEffect } from "react";
import LoadingGame from "../loadingGame/page"
import { gameData } from "../_constants/gameData";
import { Send } from 'lucide-react';
import { io, Socket } from "socket.io-client";


interface chatMessages{
    message: string,
    isUser: boolean
}


export default function OneVsOne(){
    
    
    const [loading, setLoading] = useState(true);
    const [gameChat, setGameChat] = useState<chatMessages[]>([]);
    const gameData = useRef<gameData>({roomId: "", userId: "", endAt: 0, startAt: 0});
    const [userInput, setUserInput] = useState("");
    const [socket, setSocket] =  useState<Socket| null>(null);

    
    useEffect(() => {
        
        socketConnect();

        return () => {
            socket?.disconnect();
        }
    }, []);

    useEffect(() => {
        if (socket){
            socket.on("msg", (data)=> {
                setGameChat(prev => [...prev, {message: data, isUser: false}])
            })
        }

    }, [socket])


    const socketConnect = () => {
        socket?.disconnect();

        setSocket(io(process.env.NEXT_PUBLIC_BACKEND2, {
            reconnectionAttempts: 2, 
            reconnectionDelay: 1000,
        }));


    }

    const sendMsg = () => {
        if (userInput !== ""){
            socket?.emit("msg", {roomId: gameData.current.roomId, msg: userInput});
            setGameChat(prev => [...prev, {message: userInput, isUser: true}])
            setUserInput("");
        } 
    }



    return(
        <>
         {loading ? 
            !socket ? 
            <h2>Connecting</h2>
            : <LoadingGame loading={setLoading} gameData={gameData} socket={socket}/>
         : 
         <div className="h-screen w-screen gap-10 flex flex-col justify-between">

            <header className="w-full h-1/12 bg-zinc-900">
                <h1>header place holder</h1>
            </header>

            
            <div className="md:mx-40 lg:mx-60 overflow-auto scrollbar-hidden h-8/12 text-xl grid auto-rows-min gap-5">
                {gameChat.map((msg, index) => (
                    <h2 className={msg.isUser ? "bg-zinc-700 px-4 py-3 w-1/2 justify-self-end-safe h-fit rounded-xl": "px-4 py-2 w-1/2 h-fit bg-zinc-800 rounded-xl"} 
                    key={index}>
                        {msg.message}
                    </h2>
                ))}
            </div>

            <div className="mx-40 mb-10 h-1/12">
                <div className="flex  justify-end-safe gap-5">
                    <input type="text" 
                    value={userInput} 
                    onChange={e => setUserInput(e.target.value)} 
                    className="border-b-1 focus:outline-none px-4 py-2 text-3xl w-1/2" 
                    onKeyDown={(e) => {
                        e.key === "Enter" && sendMsg();
                    }}
                    />

                    <Send size={30} onClick={sendMsg} className="self-center"/>
                </div>
            </div> 

         </div>
        }</>
    )
}