"use client";
import Square from "./Square";
import './Row.css';
import { useEffect, useState } from "react";
import {Guess_Value} from '../app/page';

type RowProps = {
    guessArray: Array<string>,
    wordLength: number,
    submitted: boolean,
    secretWord: string,
    letterStates: {[key: string]: Guess_Value},
    setLetterStates: Function
    setGameOver: Function
}

export default function Row({guessArray, wordLength, submitted, secretWord, letterStates, setLetterStates, setGameOver}: RowProps) {
    let squares = [...Array(wordLength).keys()];
    const [guessStatus, setGeussStatus] = useState([...Array(wordLength).fill(Guess_Value.Grey)])

    useEffect(() => {
        //Correct guess
        if (guessArray.join("") == secretWord.toUpperCase()){
            setGameOver(true);
            localStorage.setItem("gameOver", "true")
        }
        
        let new_letterStates = {...letterStates};

        //Count of each letter in secret word
        let letters: {[key:string]: number} = {};
        for (let i = 0; i < wordLength; i++) {
            if (!(secretWord[i].toUpperCase() in letters)){
                letters[secretWord[i].toUpperCase()] = 1;
            }
            else{
                letters[secretWord[i].toUpperCase()] += 1;
            }
        }

        //First pass through guessed word to check for correct guess
        let newGuessState = [...Array(5)];
        for (let i = 0; i < wordLength; i++){
            //Correct letter
            if(guessArray[i] == secretWord[i].toUpperCase()){
                newGuessState[i] = Guess_Value.Green;
                letters[guessArray[i]] -= 1;
                new_letterStates[guessArray[i]] = Guess_Value.Green;
            }
        }

        //Second pass to check for yellow and grey
        for (let i = 0; i < wordLength; i++){
            if(newGuessState[i] == Guess_Value.Green){
                continue;
            }
            //In the word (yellow) 
            if ((guessArray[i] in letters ) && (letters[guessArray[i]] > 0)){
                newGuessState[i] = Guess_Value.Yellow
                letters[guessArray[i]] -= 1;
                if (new_letterStates[guessArray[i]] === Guess_Value.Green){
                    continue;
                }
                new_letterStates[guessArray[i]] = Guess_Value.Yellow;
            }
            //Not in word (grey)
            else{
                newGuessState[i] = Guess_Value.Grey
                if (new_letterStates[guessArray[i]] === Guess_Value.Green || new_letterStates[guessArray[i]] === Guess_Value.Yellow){
                    continue;
                }
                new_letterStates[guessArray[i]] = Guess_Value.Grey;
            }
        }

        //Set local storage
        if (guessArray[0] != ""){
            console.log('hii', guessArray[0]);
            let currGuesses = localStorage.getItem("guesses");
            localStorage.setItem("guesses", "");
            currGuesses ? localStorage.setItem("guesses", currGuesses + "," + guessArray.join("")) : localStorage.setItem("guesses", guessArray.join(""));
        }
        setGeussStatus(newGuessState);
        setLetterStates(new_letterStates);
    },[submitted]);

    return(
    <>
        <div className="Row">
            {squares.map((elem) =>
                <Square index={elem} value={guessArray[elem]} submitted={submitted} guessStatus={guessStatus[elem]} key={elem} />
            )}
        </div>
   
    </>
    )

}