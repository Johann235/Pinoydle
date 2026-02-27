"use client";
import Letter from "./Letter"
import { Guess_Value  } from "../app/page"
import './Keyboard.css'

type KeyboardProps ={
    letterStates: {[key:string]: Guess_Value}
}

export default function Keyboard({letterStates}:KeyboardProps){
    let row_one = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
    let row_two = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
    let row_three = ["Z", "X", "C", "V", "B", "N", "M"];
    return(
    <div className="Keyboard">
        <div className="KeyboardRow">
            {row_one.map( (e) => <Letter letter={e} guess_value={letterStates[e]} key={e}></Letter>)}
        </div>

        <div className="KeyboardRow">
            {row_two.map( (e) => <Letter letter={e} guess_value={letterStates[e]} key={e}></Letter>)}
        </div>

        <div className="KeyboardRow">
            {row_three.map( (e) => <Letter letter={e} guess_value={letterStates[e]} key={e}></Letter>)}
        </div>
    </div>
    )
}