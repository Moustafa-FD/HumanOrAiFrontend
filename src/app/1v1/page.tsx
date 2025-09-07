"use client";
import { useState } from "react";
import LoadingGame from "../loadingGame/page";

export default function OneVsOne(){
    
    
    const [loading, setLoading] = useState(true);
    const [roomId, setRoomId] = useState("");

    

    
    
    return(
        <>
         {loading ? 
            <LoadingGame loading={setLoading} setRoomId={setRoomId}/>
         : 
         <div>1v1 Page</div>
        }</>
    )
}