import { Guess_Value } from '@/components/lib/types';

//Returns a map with keys being letters in secret word, and value being number of occurences
export function getLetterCount(secretWord: String): {[key:string]: number}{
    let wordLength: number = secretWord.length;
    let letters: {[key:string]: number} = {};
    for (let i = 0; i < wordLength; i++) {
        if (!(secretWord[i].toUpperCase() in letters)){
            letters[secretWord[i].toUpperCase()] = 1;
        }
        else{
            letters[secretWord[i].toUpperCase()] += 1;
        }
    }
    return letters;
}

//From the guess, finds any matching characters and updates arrays/maps accordingly
export function getGreens(newGuessState: Guess_Value[], currLetterCount: {[key:string]: number}, 
                newLetterStates: {[key:string]: Guess_Value}, secretWord: string, guessArray: string[]){
    let wordLength = secretWord.length;
    for (let i = 0; i < wordLength; i++){
        //Correct letter
        if(guessArray[i] == secretWord[i].toUpperCase()){
            newGuessState[i] = Guess_Value.Green;
            //To prevent for detecting more of a letter than the secret word has
            currLetterCount[guessArray[i]] -= 1;
            newLetterStates[guessArray[i]] = Guess_Value.Green;
        };
    };
};

export function getYellows(newGuessState: Guess_Value[], currLetterCount: {[key:string]: number}, 
                newLetterStates: {[key:string]: Guess_Value}, secretWord: string, guessArray: string[]){
    let wordLength = secretWord.length
    for (let i = 0; i < wordLength; i++){
        if(newGuessState[i] == Guess_Value.Green){
            continue;
        }
        //In the word (yellow) 
        if ((guessArray[i] in currLetterCount) && (currLetterCount[guessArray[i]] > 0)){
            newGuessState[i] = Guess_Value.Yellow
            currLetterCount[guessArray[i]] -= 1;
            if (newLetterStates[guessArray[i]] === Guess_Value.Green){
                continue;
            }
            newLetterStates[guessArray[i]] = Guess_Value.Yellow;
        }

        //Not in word (grey)
        else{
            if (newLetterStates[guessArray[i]] === Guess_Value.Green || newLetterStates[guessArray[i]] === Guess_Value.Yellow){
                continue;
            }
            newLetterStates[guessArray[i]] = Guess_Value.Grey;
        };
    };
};

export function getLetterStates(secretWord: string, guessArray: string[]){
    let wordLength: number = secretWord.length;
    let currLetterCount: {[key:string]:number} = getLetterCount(secretWord);
    let newLetterStates: {[key:string]:Guess_Value} = {};
    let newGuessState: Guess_Value[] = [...Array(wordLength).fill(Guess_Value.Grey)];

    getGreens(newGuessState,currLetterCount,newLetterStates,secretWord,guessArray);
    getYellows(newGuessState,currLetterCount,newLetterStates,secretWord,guessArray);
    console.log(newLetterStates);
    return newLetterStates;
};


export function mergeLetterStates(letterStates: {[key: string]: Guess_Value}, updatedLetters: {[key: string]: Guess_Value}){
    for (let key in updatedLetters) {
    //console.log(key);
    if (letterStates[key] == Guess_Value.Green){
        continue;
    }
    if(letterStates[key] == Guess_Value.Yellow && updatedLetters[key] == Guess_Value.Grey){
        continue;
    }
    letterStates[key] = updatedLetters[key];
    }
};