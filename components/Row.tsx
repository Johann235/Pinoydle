"use client";
import Square from "./Square";
import './Row.css';
import { useEffect, useState } from "react";
import { Guess_Value } from '@/components/lib/types';
import { getLetterCount, getGreens, getYellows } from "./lib/wordutil";
type RowProps = {
    guessArray: Array<string>,
    submitted: boolean,
    secretWord: string,
    letterStates: {[key: string]: Guess_Value},
    setLetterStates: Function,
    setGameOver: Function,
    rowNum: number
}

export default function Row({guessArray, submitted, secretWord, letterStates, setLetterStates, setGameOver, rowNum}: RowProps) {
    let wordLength = secretWord.length
    let squares = [...Array(wordLength).keys()];
    const [guessStatus, setGeussStatus] = useState([...Array(wordLength).fill(Guess_Value.Grey)]);
    
    function checkGuess(){
        //Correct guess
        if (guessArray.join("") == secretWord.toUpperCase()){
            setGameOver(true);
            localStorage.setItem("gameOver", "true");
            setGeussStatus([...Array(wordLength)].fill(Guess_Value.Green));
            let newLetterStates = {...letterStates};
            for (let i = 0; i < guessArray.length; i ++){
                newLetterStates[guessArray[i]] = Guess_Value.Green;
            }
            setLetterStates(newLetterStates);
            return;
        };
        
        //TODO: UPDATE THIS TO MAKE IT WORK WHEN GETTING MULTIPLE LINES FROM LOCAL STORAGE 
        let newLetterStates = {...letterStates};

        //Count of each letter in secret word
        let currLetterCount = getLetterCount(secretWord);
        let newGuessState: Guess_Value[] = new Array(wordLength).fill(Guess_Value.Grey);

        //First pass through to check for greens
        getGreens(newGuessState,currLetterCount,newLetterStates, secretWord, guessArray);

        //Checks for yellows and sets other letters to grey
        getYellows(newGuessState,currLetterCount,newLetterStates, secretWord, guessArray);

        //Set local storage
        if (guessArray[0] != ""){
            localStorage.setItem(`guess_${rowNum+1}`, guessArray.join(""));
            //TODO: UPDATE THIS TO MAKE IT WORK WHEN GETTING MULTIPLE LINES FROM LOCAL STORAGE 
            setLetterStates(newLetterStates);
        }
        setGeussStatus(newGuessState);
    }

    useEffect(() => {checkGuess()},[submitted]);

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