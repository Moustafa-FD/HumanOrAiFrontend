"use client";
import { useState, useRef, useEffect } from "react";
import LoadingGame from "../loadingGame/page"
import { gameData } from "../_constants/gameData";
import { Send } from 'lucide-react';
import { io, Socket } from "socket.io-client";
import Link from "next/link";
import { ProgressBar } from "../components/progressBar";


interface chatMessages{
    message: string,
    isUser: boolean
}

interface endGameUsersInfo{
    socketId: string,
    isAi: boolean
}


export default function OneVsOne(){
    
    
    const [gameChat, setGameChat] = useState<chatMessages[]>([]);
    const gameData = useRef<gameData>({roomId: "", userId: "", endAt: 0, startingUser: false, offset: 0});
    const [userInput, setUserInput] = useState("");
    const [socket, setSocket] =  useState<Socket| null>(null);
    const [inputDisabled, setInputDisabled] = useState(true);
    const [pageViews, setPageViews] = useState({loading: true, vote: false, voteResult: false});
    const [gameResult, setgameResult] = useState({opponent: "", voteCorrect: false});
    const [childSetupInstance, setChildSetupInstance] = useState(1);
    const chatScrollRef = useRef<HTMLDivElement>(null);
    const pageScrollRef = useRef<HTMLDivElement>(null);

    
    useEffect(() => {
        
        socketConnect();

        return () => {
            socket?.disconnect();
        }
    }, []);

    useEffect(() => {
        if (socket){
            socket.on("msg", (data)=> {
                if (pageViews.vote === false){
                    setGameChat(prev => [...prev, {message: data, isUser: false}]);
                    setInputDisabled(false);
                }
            })
            pageScrollRef.current?.scrollIntoView({ behavior: "smooth" });
            return(() => {socket.off("msg")})
        }
    }, [socket, pageViews.vote])
    

    useEffect(() => {
            chatScrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [gameChat]); 


    const socketConnect = () => {
        socket?.disconnect();

        setSocket(io(process.env.NEXT_PUBLIC_BACKEND2, {
            reconnectionAttempts: 2, 
            reconnectionDelay: 1000,
        }));
    }
    
    const setLoadingState = (value: boolean) => {
        setPageViews(prev => ({...prev, loading: value}))
        socket?.on(`${gameData.current.roomId} end game`, (data) => {
            data.map((user: endGameUsersInfo) => {
                if (socket.id !== user.socketId)
                    gameData.current.opponentIsAi = user.isAi;
            })
            setInputDisabled(true);
            setPageViews(prev => ({...prev, vote: true}))
        });
    }

    const sendMsg = () => {
        if (userInput !== "" && !inputDisabled){
            socket?.emit("msg", {roomId: gameData.current.roomId, msg: userInput});
            setGameChat(prev => [...prev, {message: userInput, isUser: true}])
            setUserInput("");
            setInputDisabled(true);
        } 
    }

    const voteTrigger = (value: string) => {

        setPageViews(prev => ({...prev, voteResult: true}))

        if(gameData.current.opponentIsAi === false)
            setgameResult(prev => ({...prev, opponent: "Human"}));
        else
            setgameResult(prev => ({...prev, opponent: "AI"}));
        

        if( value === "AI" && gameData.current.opponentIsAi)
            setgameResult(prev => ({...prev, voteCorrect: true}))
        else if( value === "Human" && !gameData.current.opponentIsAi)
            setgameResult(prev => ({...prev, voteCorrect: true}))
    }

    const playAgainSequence = () => {
        setGameChat([]);
        console.log("Did this run??");
        gameData.current = ({roomId: "", userId: "", endAt: 0, startingUser: false, offset: 0});
        setUserInput("");
        setPageViews({loading: true, vote: false, voteResult: false});
        setgameResult({opponent: "", voteCorrect: false});
        setChildSetupInstance(prev => prev++);
    }


    return(
        <>
         {pageViews.loading ? 
            !socket ? 
            <h2>Connecting</h2>
            : <LoadingGame key={childSetupInstance} loading={setLoadingState} gameData={gameData} socket={socket} inputDisabled={setInputDisabled}/>
         : 
         <div className="flex justify-items-center flex-wrap flex-gap-25 scrollbar-hidden">
            <div className="h-screen w-full gap-10 flex flex-col justify-between">

                <header className="w-full h-1/12 bg-zinc-900 flex flex-col justify-between">
                    <div className="flex flex-row justify-between items-center text-center h-full">
                        <Link href={"/"} className="text-2xl font-bold text-zinc-400 pl-10 ">MO-FD</Link>
                        <h1 className="pr-20 text-xl">Human or AI</h1>
                    </div>
                    <ProgressBar durationMs={2 * 60000} runId={1}/>
                </header>

                
                <div className="md:mx-40 lg:mx-60 scrollbar-hidden overflow-y-auto h-9/12 text-xl grid auto-rows-min gap-5">
                    {gameChat.map((msg, index) => (
                        <h2 className={msg.isUser ? "bg-zinc-700 px-4 py-3 w-1/2 justify-self-end-safe h-fit rounded-xl": "px-4 py-2 w-1/2 h-fit bg-zinc-800 rounded-xl"} 
                        key={index}>
                            {msg.message}
                        </h2>
                    ))}
                    <div ref={chatScrollRef}/>
                </div>

                <div className="mx-40 mb-10 h-1/12">
                    <div className="flex  justify-end-safe gap-5">
                        <input type="text" 
                        value={userInput} 
                        onChange={e => setUserInput(e.target.value)} 
                        className={`border-b-1 ${inputDisabled ? "border-gray-600" : ""} focus:outline-none px-4 py-2 text-3xl w-1/2 focus:scale-105 transition focus:shadow-md focus:shadow-gray-500` }
                        disabled={inputDisabled}
                        onKeyDown={(e) => {
                            e.key === "Enter" && sendMsg();
                        }}
                        />

                        <Send size={30} onClick={sendMsg} color={inputDisabled ? "#787777" : "#FFFFFF"} className="self-center"/>
                    </div>
                </div> 
            </div>

            {pageViews.vote && (

             

                pageViews.voteResult ? 
                    <div className={`flex flex-col items-center w-full pt-15 pb-10 ${gameResult.voteCorrect && "celebration"}`}>
                        <h1 className="text-4xl font-bold">You where playing against</h1>
                        <h1 className="text-5xl text-orange-600 pb-20 pt-10 font-semibold">{gameResult.opponent}</h1>

                        <button onClick={() => playAgainSequence()} className="bg-zinc-600 px-10 py-4 text-3xl rounded-md w-3/16 hover:scale-110 hover:bg-zinc-500 transition duration-300">Play Again</button>
                    </div>
                :
                <div className="flex flex-col items-center w-full pt-15 pb-10">
                    <h1 className="text-4xl font-bold">Human or AI?</h1>

                    <div className="flex flex-row w-full justify-center gap-15 py-10">
                        <button onClick={() => voteTrigger("Human")} className="bg-zinc-600 px-10 py-4 text-3xl rounded-md w-3/16 hover:scale-110 hover:bg-zinc-500 transition duration-300">Human</button>
                        <button onClick={() => voteTrigger("AI")} className="bg-orange-700 px-10 py-4 text-3xl rounded-md w-3/16 hover:scale-110 hover:bg-orange-600 transition duration-300">AI</button>
                    </div>
                    <div ref={pageScrollRef}/>
                </div>
            )
            }
         </div>
        }</>
    )
}