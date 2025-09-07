import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';


export default function LoadingGame({loading, setRoomId}: {loading: (value: boolean) => void; setRoomId: (value: string) => void}){

    const [loadingInfo, setLoadingInfo] = useState<string[]>([]);
    const didInit = useRef(false);

    let tickedId: string;
    let roomId;
    const userId = Math.random().toString(36).substring(2, 10);

    useEffect(() => {

        if (didInit.current) return;
        didInit.current = true;


        
        matchMaking();

        setTimeout(() => {
            setLoadingInfo(prev => [ "Searching for game...", ...prev]);
        }, 0);

        // setTimeout(() => {
        //     setLoadingInfo(prev => ["Generating the game...", ...prev]);
        // }, 2000);

        // setTimeout(() => {
        //     setLoadingInfo(prev => ["Getting things ready...", ...prev]);
        // }, 4000);

        // setTimeout(() => {
        //     setLoadingInfo(prev => ["Loading assets...", ...prev]);
        // }, 6000);

        // setTimeout(() => {
        //     setLoadingInfo(prev => ["Starting game...", ...prev]);
        // }, 8000);
        
        // setTimeout(() => {
        //     loading(false);
        // }, 10000);
        
    }, []);



    const matchMaking = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND}ticket/${userId}`;
        const data = await fetch(url).then(data => data.json()).then(data => data.response);
        console.log("First run worked????: ", data)

        if (data.gameReady === false){
            tickedId = data.ticketId;
            console.log("Current ticket: ", tickedId);
           const matchmakingLoop = setInterval(async () => {
                const ticketStatus = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}ticketstat/${tickedId}`).then(data => data.json()).then(data => data.response);
                console.log("Loop is running, this is data: ", ticketStatus);
                if (ticketStatus.gameReady === true){
                    console.log("Game is ready")
                    clearInterval(matchmakingLoop);
                    setLoadingInfo(prev => ["Game Found...", ...prev]);
                }
           }, 2000)
        }
    }

    const joinRoom = async () => {
        const url = `${process.env.NEXT_PUBLIC_BACKEND}ticket/${userId}`;
    }

    


    return(
    <div className="flex flex-col h-screen items-center justify-center"> 
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
                </div> 
            )
}