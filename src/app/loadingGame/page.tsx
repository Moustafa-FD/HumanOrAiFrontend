import { useEffect, useRef, useState, MutableRefObject } from "react";
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import { io } from "socket.io-client";
import { gameData } from "../_constants/gameData";


export default function LoadingGame({loading, gameData}: {loading: (value: boolean) => void; gameData: MutableRefObject<gameData>;}){

    const [loadingInfo, setLoadingInfo] = useState<string[]>([]);
    const [tryAgain, setTryAgain] = useState(false);
    const didInit = useRef(false);
    const ticketCheakerInterval = 2000; //Ms

    let tickedId: string;
    gameData.current.userId = Math.random().toString(36).substring(2, 10)

    useEffect(() => {

        if (didInit.current) return;
        didInit.current = true;

        gameSetup();
                
    }, []);

    const gameSetup = async() => {

        setLoadingInfo(prev => [ "Searching for game...", ...prev]);        

        await matchMaking();
        setTimeout(async () => {
            const gameConnection = await connectToChatRoom();

            if (gameConnection){
                setTimeout(() => {setLoadingInfo(prev => ["Starting Game", ...prev])}, 1000);
                setTimeout(() => {loading(false)}, 2000);
            }else{
                setLoadingInfo([]);
                setTryAgain(true);
            }
        }, 1000);
        
    }


    const matchMaking = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND}ticket/${gameData.current.userId}`;
        const data = await fetch(url).then(data => data.json()).then(data => data.response);
        console.log("First run worked????: ", data)

        async function ticketChecker () {
            const timeout = 60000;
            let gameReady = true;
            while (gameReady){
                const ticketStatus = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}ticketstat/${tickedId}`).then(data => data.json()).then(data => data.response);
                console.log("Loop is running, this is data: ", ticketStatus);
                if (ticketStatus.gameReady === true){
                    console.log("Game is ready")
                    setLoadingInfo(prev => ["Game Found...", ...prev]);
                    gameReady=false;
                    gameData.current.roomId = ticketStatus.roomId;
                }
               await new Promise(resolve => setTimeout(resolve, ticketCheakerInterval));
            }
        }

        if (data.gameReady === false){
            tickedId = data.ticketId;
            console.log("Current ticket: ", tickedId);
            await ticketChecker();
            return;
        }else{
            console.log("Game is ready")
            setLoadingInfo(prev => ["Game Found...", ...prev]);
            gameData.current.roomId = data.roomId;
        }
    }

    const connectToChatRoom = async (): Promise<boolean> => {
        setLoadingInfo(prev => ["Attempting to connect to game...", ...prev]);

        try{
            const socket = io(process.env.NEXT_PUBLIC_BACKEND2, {
                reconnectionAttempts: 2, 
                reconnectionDelay: 1000,
            });

            socket.on("connect", () => {
                console.log("Connected to server");
                setLoadingInfo(prev => ["final setup...", ...prev]);
            })

            await new Promise((resolve, reject) => {
                socket.emit(
                    "join room", 
                    {roomId: gameData.current.roomId, userId: gameData.current.userId},
                    (res: {status: string, message: string}) => {
                        if (res.status ==="Error"){
                            reject(new Error("Error occured joining room"));
                        }
                            
                        resolve(res);
                    });
            })
            return true;
        }catch(ex){
            console.log(ex);
        }

        return false;
    }

    


    return(
        <div className="flex flex-col h-screen items-center justify-center"> 
           {!tryAgain 
           ? <>
                <Image
                    src="/loading.gif"
                    width={130}
                    height={130}
                    alt="Picture of the author"
                />


                <motion.ul layout layoutId={"list"} className="list-container h-24  text-center mt-4 text-md text-gray-400 ">
                    <AnimatePresence>
                    {loadingInfo.map((item, index) => {
                        return (
                        <motion.li
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            key={item}
                            className={index === 0 ? "text-white font-semibold" : ""}
                        >
                        {item}
                        </motion.li>
                        );
                    })}
                    </AnimatePresence>
                </motion.ul>
           </>: <>
           
           <h1 className="text-3xl font:bold pb-8">
            Error Occured
           </h1>
           
           <button 
           className="bg-orange-600 hover:bg-orange-400 hover:scale-105 transition duration-250 py-2 px-6 text-2xl font-bold text-black rounded-2xl border shadow flex items-center" 
           onClick={() => {
            setTryAgain(false);
            didInit.current = false
            gameSetup();
           }}>
            Try Again
            </button>
           
           
           
           
           </>}
        </div> 
    )
}