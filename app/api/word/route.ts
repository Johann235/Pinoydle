import { WORDS_ARR } from '../../../components/WordsArr';

export async function GET(request: Request){
    const now: Date = new Date();
    let date: number = now.getDate();
    let month: number = now.getMonth();
    let year: number = now.getFullYear();
    let b: number = 42345234;
    let x: number = 986402376;
    let hash: number = Math.abs((month + year) * month - date * (year + month));
    let idx:number = (hash * x + b) % WORDS_ARR.length;
    return new Response(JSON.stringify(WORDS_ARR[idx]),{
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}