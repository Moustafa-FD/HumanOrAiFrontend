"use client";
import { useState, useRef, useEffect } from "react";
import LoadingGame from "../loadingGame/page"
import { gameData } from "../_constants/gameData";
import { Send } from 'lucide-react';


interface chatMessages{
    message: string,
    isUser: boolean
}


export default function OneVsOne(){
    
    
    const [loading, setLoading] = useState(true);
    const [gameChat, setGameChat] = useState<chatMessages[]>([]);
    const gameData = useRef<gameData>({roomId: "", userId: ""});
    const [userInput, setUserInput] = useState("");
    const rendered = useRef(false);

    
    useEffect(() => {
        if (rendered.current)
            return;

        setGameChat(prev => [...prev, {message: "Hey there! Ready to start the game?", isUser: false}])
        setGameChat(prev => [...prev, {message: "Yeah, I’m ready! What do I do first?", isUser: true}])
        setGameChat(prev => [...prev, {message: "First, you need to choose your character.", isUser: false}])
        setGameChat(prev => [...prev, {message: "Okay, I’ll pick the warrior.", isUser: true}])
        setGameChat(prev => [...prev, {message: "Great choice! Warriors are strong and tough.", isUser: false}])
        setGameChat(prev => [...prev, {message: "Do I get any special abilities?", isUser: true}])
        setGameChat(prev => [...prev, {message: "Yes, you start with a powerful shield bash.", isUser: false}])
        setGameChat(prev => [...prev, {message: "Nice, how do I use it?", isUser: true}])
        setGameChat(prev => [...prev, {message: "Press the spacebar to activate it in battle.", isUser: false}])
        setGameChat(prev => [...prev, {message: "Cool, let’s try the first mission.", isUser: true}])
        setGameChat(prev => [...prev, {message: "Alright, your mission is to clear the goblin camp.", isUser: false}])
        setGameChat(prev => [...prev, {message: "Where is it located?", isUser: true}])
        setGameChat(prev => [...prev, {message: "Head north through the forest. You’ll see a wooden gate.", isUser: false}])
        setGameChat(prev => [...prev, {message: "Got it. Should I fight every goblin I see?", isUser: true}])
        setGameChat(prev => [...prev, {message: "Not necessarily. Sneaking past some of them can save your health.", isUser: false}])
        setGameChat(prev => [...prev, {message: "Alright, I’ll try to sneak around.", isUser: true}])
        setGameChat(prev => [...prev, {message: "Careful, one of them is a scout. If he sees you, he’ll call reinforcements.", isUser: false}])
        setGameChat(prev => [...prev, {message: "Oh no, I think he spotted me!", isUser: true}])
        setGameChat(prev => [...prev, {message: "Quick, use your shield bash to stun him!", isUser: false}])
        setGameChat(prev => [...prev, {message: "Boom! That worked perfectly!", isUser: true}])
        setGameChat(prev => [...prev, {message: "Nice hit! Now take out the others while they’re confused.", isUser: false}])
        setGameChat(prev => [...prev, {message: "Done! The camp is clear.", isUser: true}])
        setGameChat(prev => [...prev, {message: "Well done, warrior. You’ve completed your first mission.", isUser: false}])
        setGameChat(prev => [...prev, {message: "That was awesome. What’s next?", isUser: true}])
        setGameChat(prev => [...prev, {message: "Next, you’ll head to the village to speak with the elder.", isUser: false}])
        setGameChat(prev => [...prev, {message: "Okay, lead the way!Okay, lead the way!Okay, lead the way!Okay, lead the way!Okay, lead the way!Okay, lead the way!", isUser: true}])
        setGameChat(prev => [...prev, {message: "Follow the path east. Watch out for bandits on the road.", isUser: false}])
        setGameChat(prev => [...prev, {message: "I see them already... should I fight or run?", isUser: true}])
        setGameChat(prev => [...prev, {message: "This time, it’s your choice. Fight for loot, or avoid them to save time.", isUser: false}])
        setGameChat(prev => [...prev, {message: "Let’s fight. I want that loot!", isUser: true}])

        rendered.current = true;
    }, []);



    return(
        <>
         {loading ? 
            <LoadingGame loading={setLoading} gameData={gameData}/>
         : 
         <div className="h-screen w-screen gap-10 flex flex-col justify-between">

            <header className="w-full h-1/12 bg-zinc-900">
                <h1>header place holder</h1>
            </header>

            
            <div className="md:mx-40 lg:mx-60 overflow-auto scrollbar-hidden h-8/12 text-xl grid auto-rows-min gap-2">
                {gameChat.map((msg, index) => (
                    <h2 className={msg.isUser ? "bg-zinc-700 px-4 py-3 w-1/2 justify-self-end-safe h-fit rounded-xl": "px-4 py-2 w-1/2 h-fit"} 
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
                    />

                    <Send size={30} className="self-center"/>
                </div>
            </div>

                

         </div>
        }</>
    )
}