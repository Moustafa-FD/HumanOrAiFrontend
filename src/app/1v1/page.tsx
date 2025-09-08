"use client";
import { useState, useRef } from "react";
import LoadingGame from "../loadingGame/page"
import { gameData } from "../_constants/gameData";

export default function OneVsOne(){
    
    
    const [loading, setLoading] = useState(true);
    const gameData = useRef<gameData>({roomId: "", userId: ""})

    
    
    return(
        <>
         {loading ? 
            <LoadingGame loading={setLoading} gameData={gameData}/>
         : 
         <div>1v1 Page</div>
        }</>
    )
}