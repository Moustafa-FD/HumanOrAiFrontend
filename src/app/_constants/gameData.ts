export interface gameData {
    roomId: string,
    userId: string,
    endAt: number,
    startingUser: boolean,
    offset?: number;
    opponentIsAi?: boolean
}