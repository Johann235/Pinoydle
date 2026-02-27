"use client";
import { useState } from 'react';
import { useEffect } from 'react';
import Row from '../components/Row';
import Keyboard from '../components/Keyboard';
import { WORDS } from '../components/WordsSet';
import './page.css';

export enum Guess_Value{
    Green,
    Yellow,
    Grey,
    Black
}

function App() {
  const numGuesses = 6;
  const wordLength = 5;

  const [gameOver, setGameOver] = useState(false);
  const [rowNumber, setRowNumber] = useState(0);
  const [squareNumber, setSquareNumber] = useState(0);
  const [values, setValues] = useState(() => {return [...Array(numGuesses)].map(e => Array(wordLength).fill(''))});
  const [message, setMessage] = useState( () => {return ""});
  
  let guesses = [...Array(numGuesses).keys()].map(e => `guess_${e+1}`);
  let rows = [...Array(numGuesses).keys()];
  const [submitted, setSubmitted] =  useState(() => {return [...Array(numGuesses).fill(false)]});


  //const secretWord = "steel";
  const [secretWord, setSecretWord] = useState("");

  //Lazy init dictionary for the states of all letters
  const [letterStates, setLetterStates] = useState(() => {
    let alphabet = [...Array(26).keys()].map(e=>String.fromCharCode(e+65));
    let initSet: {[key:string]: Guess_Value} = {};
    for (let i = 0; i < alphabet.length; i++){
      initSet[alphabet[i]] = Guess_Value.Black;
    }
    return initSet;
  }); 
  
  function keyDownHandler(e: globalThis.KeyboardEvent) {
    if(gameOver){
      return;
    }
    //Try to submit
    if(e.key == "Enter"){
      if (squareNumber < wordLength){
        setMessage("Not enough letters");
        return;
      }
      else if(!(WORDS.has(values[rowNumber].join("")))){
        setMessage("Word not in word list");
        return
      }
      else{
        let newSubmitted = submitted.slice();
        newSubmitted[rowNumber] = true;
        setSubmitted(newSubmitted);
        setRowNumber(rowNumber => rowNumber + 1);
        setSquareNumber(0);
        setMessage("");
        localStorage.setItem("rowNum", `${rowNumber + 1}`);
        if (rowNumber == numGuesses - 1){
          setMessage("Game over </3");
          localStorage.setItem("gameOver", "true")
          setGameOver(true);
        }
        return;
      }
    }

    //Delete
    else if( (e.key == "Backspace") && (squareNumber > 0)){
      let newValues = values.slice();
      let newRow = values[rowNumber].slice();
      newRow[squareNumber-1] = "";
      newValues[rowNumber] = newRow;
      setValues(newValues);
      setSquareNumber(squareNumber => squareNumber - 1);
      return;
    }

    //Check for invalid letter
    else if( !(/^[a-z]$/i.test(e.key))){
      return;
    }

    //Insert
    else if(squareNumber < wordLength){
      let newValues = values.slice();
      let newRow = values[rowNumber].slice();
      newRow[squareNumber] = e.key.toUpperCase();
      newValues[rowNumber] = newRow;
      setValues(newValues);
      setSquareNumber(squareNumber => squareNumber + 1);
    }
  }
  
  //Change messages
  useEffect(() => {
    const element: HTMLElement|null = document.getElementById("Message");

    function removeStyle(element: HTMLElement){
      element.className = "msg_hidden";
      setMessage("");
    };

    function changeStyle(element: HTMLElement){
    element.style.width = `${message.length + 2}pc`;
    element.className = "msg_show"
    setTimeout(removeStyle,3000,element);
    };

    if (message != ""){
    element ? changeStyle(element): null;
    };
  }, [message]);

  //Persisting guesses
  useEffect(() => {
    let i = 0;
    let guess = localStorage.getItem("guess_1");
    console.log("hi", guess);
    let rowNum = localStorage.getItem("rowNum");
    let isGameOver = localStorage.getItem("gameOver");
    gameOver? setGameOver(Boolean(isGameOver)) : null;
    rowNum? setRowNumber(Number(rowNum)): null;
    let newValues: string[][] = [];
    let newSubmitted: boolean[] = [];
    while(guess){
      newValues.push(guess.split(""));
      newSubmitted.push(true);
      i += 1;
      guess = localStorage.getItem(`guess_${i+1}`);
    }
    while(i <= wordLength){
      newValues.push([...Array(5).fill("")]);
      newSubmitted.push(false);
      i += 1;
    }
    setValues(newValues);
    setSubmitted(newSubmitted);
    console.log(newValues, newSubmitted);
    },[]);
  
  //Get word
  useEffect(() => {
    const getData = async () => {
      try{
      const res = await fetch("api/word/");
      const  data = await res.json();
      setSecretWord(data);
      console.log(data);
      return data;
    }
      catch (error){
        console.log(error);
        return;
      }
    }
    getData();
  }
  , []);

  //For keyboard input
  useEffect(() => {
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    }
  }, [squareNumber, rowNumber, values,gameOver]);

  if (secretWord === ""){
    return <>Loading</>;
  }

  return (
  <>
    <div className="Game"> 
      { 
        rows.map( (elem) =>
          <Row guessArray={values[elem]} wordLength={wordLength} submitted={submitted[elem]} setGameOver={setGameOver} 
               secretWord={secretWord} key={elem} letterStates={letterStates} setLetterStates={setLetterStates} rowNum={elem}/>
        )
      }
      
    </div>

    <div className='MessageBox'>
      <input className="msg_hidden" id="Message" value={message} disabled /> 
    </div>
    <Keyboard letterStates={letterStates}></Keyboard>
  </>
  
  )
}

export default App
