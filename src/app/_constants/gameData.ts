export interface gameData {
    roomId: string,
    userId: string,
    startAt: number,
    endAt: number,
    serverTime: number;
    offset?: number;
}