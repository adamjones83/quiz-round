import { Lineup } from '../types'

export function swapLineup(lineup:Lineup, seatA:number, seatB:number):Lineup {
    console.log('Swapping lineup', lineup);
    if(lineup && lineup.quizzerIds && lineup.quizzerIds[seatA] && lineup.quizzerIds[seatB]) {
        return {
            ...lineup,
            quizzerIds: swap(lineup.quizzerIds, seatA, seatB)
        };
    }
    return lineup;
}
export function swap<T>(items:T[], indexA:number, indexB:number):T[] {
    const result = [...items];
    [result[indexA],result[indexB]] = [result[indexB],result[indexA]];
    return result;
}
export function shuffle<T>(items:T[]):T[] {
    const shuffled = [...items];
    let swapIndex = -1;
    for(let i=shuffled.length;i>0;i--) {
        swapIndex = Math.floor(Math.random() * i);
        [shuffled[swapIndex],shuffled[i-1]] = [shuffled[i-1],shuffled[swapIndex]];
    }
    return shuffled;
}
export function toLookup<T>(items:T[], keySelector:(item:T)=>string) : Record<string,T> {
    const result = { };
    for(const item of items) result[keySelector(item)] = item;
    return result;
}
export function getDateStr():string { 
    return new Date().toISOString().substr(0,10); 
}
export function getDateTimeStr():string { 
    return new Date().toISOString().substr(0,19); 
}
