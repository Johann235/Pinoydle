import './Square.css';
import {Guess_Value} from '../app/page'
type SquareProps = {
    value: string,
    submitted: boolean,
    guessStatus: Guess_Value,
    index: number
}


export default function Square({value, submitted, guessStatus, index}: SquareProps){
    
    function renderSwitch(guessStatus: Guess_Value) {
        switch(guessStatus) {
            case Guess_Value.Green:
                return <input type="text" pattern="[A-Z]*" maxLength={1} value={value} 
                        style = {{animation: `spin 0.6s ${index*0.35}s, green 0.6s forwards ${index*0.35}s`}} disabled/>;
            case Guess_Value.Grey:
                return <input type="text" pattern="[A-Z]*" maxLength={1} value={value} 
                        style = {{animation: `spin 0.6s ${index*0.35}s, grey 0.6s forwards ${index*0.35}s`}} disabled/>;
            case Guess_Value.Yellow:
                return <input type="text" pattern="[A-Z]*" maxLength={1} value={value} 
                        style = {{animation: `spin 0.6s ${index*0.35}s, yellow 0.6s forwards ${index*0.35}s`}} disabled/>;
        }
    }
    
    return (
    <div className='Square'>
    {
        submitted ? renderSwitch(guessStatus)
                  : (<input type="text" pattern="[A-Z]*" maxLength={1} value={value} disabled/>)
    }
    </div>
    )

}