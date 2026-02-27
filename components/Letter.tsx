import {Guess_Value} from '../app/page'
import './Letter.css';

type LetterProps = {
    letter: string,
    guess_value : Guess_Value
}

export default function Letter({letter, guess_value}: LetterProps){
    let color;
    switch(guess_value) {
        case Guess_Value.Green:
            color = "green"
            break;
        case Guess_Value.Grey:
            color = "grey"
            break;
        case Guess_Value.Yellow:
            color = "yellow"
            break;
        case Guess_Value.Black:
            color = "black"
            break;
    }

    return(
        <div className="Letter">
            <input className={color} type="text" value={letter.toUpperCase()} disabled/>
        </div>
    )
}