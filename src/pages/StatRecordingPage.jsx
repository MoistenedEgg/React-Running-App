import {useState, useEffect, useRef} from 'react'
import { useUserContext } from '../contexts/UserContext';
import '../css/StatRecordingPage.css'

function StatRecordingPage({run, onSave, onCancel}){
    const {addRun, formatTimeString, sortRunsByDate} = useUserContext();
    const [currentRun, setCurrentRun] = useState({})
    const [time, setTime] = useState('000000');
    const [distance, setDistance] = useState(0);
    const [pace, setPace] = useState(0); // in seconds

    const [isValidForm, setIsValidForm] = useState(true)

    const onTimeChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '');
        setTime(raw.slice(-6))
        validityCheck()    
    }
    const onDistanceChange = (e) => {
        let raw = e.target.value
        raw = raw.replace(/^0+(?=\d)/, '');
        
        let parsed = parseFloat(raw)
        if(isNaN(parsed)) {
            setDistance('') 
            return
        }
        setDistance(Math.max(parsed, 0))
        validityCheck()
    }

    const onDistanceBlur = (e) => {
        let raw = e.target.value
        if(raw === ''){
            setDistance(0)
            validityCheck()
            return;
        }
    }

    function validityCheck(){
        if(distance != 0 && formatTimeToSeconds(time) != 0){
            setIsValidForm(true)
        }
    }
    const formatted = time.padStart(6, '0')
    const hh = formatted.slice(0, 2);
    const mm = formatted.slice(2, 4);
    const ss = formatted.slice(4, 6);

    function getPace(){
        let rawTime = formatTimeToSeconds(time);
        if(rawTime === 0 || distance === 0) return 0
        return Math.floor(rawTime / distance);
    }
    function getPaceString() {
        
        const p = getPace()
        // if (rawTime === 0 || distance === 0) return '0:00:00';
        return formatTimeString(p)
    }

    useEffect(() => {
        console.log(getPace())
        setPace(getPace())
    }, [time, distance])

    function formatTimeToSeconds(rawDigits){
        // Formats a given integer into seconds value
        // Assumes raw digits is a 6 length string
        // Digits format: 000123 == 83s


        //console.log(`${parseInt(hh)} : ${parseInt(mm)} : ${parseInt(ss)}`)

        return parseInt(ss) + (parseInt(mm) * 60) + (parseInt(hh) * 3600)

    }

    function handleSave(){

        // Data validation
        if(distance === 0){
            setIsValidForm(false)
            return
        }

        if(formatTimeToSeconds(time) === 0){
            setIsValidForm(false)
            return
        }
        const now = new Date();
        const newRun = {
            id: crypto.randomUUID(),
            date: now, 
            time: formatTimeToSeconds(time), 
            distance: distance,
            pace: pace,
        }
        addRun(newRun)

        //Temporary
        console.log("TEMP: ALWAYS SORTING BY DATE, REMOVE THIS LATER")
        sortRunsByDate();
        onSave();
    }

    
    return (
        <>
        <div className="stat-recording">
            <h2>Record your Run</h2>
            <div className="main-stats-container">
                <div className="stat-container">
                    <h4>Distance(km)*</h4>
                    <input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={distance}
                    onChange={onDistanceChange} 
                    onBlur={onDistanceBlur}
                    inputMode="numeric" 
                    placeholder="Distance in km"
                    className={`${isValidForm === false && distance === 0 ? 'input-alert' : ''}`}/>
                </div>
                
                <div className="stat-container">
                    <h4>Time*</h4>
                    <input value={`${hh}:${mm}:${ss}`} 
                    type="text" 
                    inputMode="numeric" 
                    placeholder="00:00:00"
                    onChange={onTimeChange}
                    className={`${isValidForm === false && formatTimeToSeconds(time) === 0 ? 'input-alert' : ''}`}
                    />
                </div>
            </div>

            <div className="stat-container">
                <h4>Pace (min/km)</h4>
                <input 
                disabled
                className = "input-readonly"
                value={`${getPaceString()}`}
                />
            </div>
            
            <div className="stat-container">
                <h4>Calories burnt (kcal)</h4>
                <input type="number" min="0" max="10000" step="1" placeholder="0"/>
            </div>

            <div className="stat-container">
                <h4>Elevation Gain (°)</h4>
                <input type="number" min="0" max="90" step="1" placeholder="0"/>
            </div>

            {isValidForm ? <></> : (<p className="text-red">Fill all required fields</p>)}
            <div className="stat-button-container">
                <button className="btn-green btn-confirm btn-cancel" onClick={() => {onCancel()}}>Cancel</button>
                <button className="btn-green btn-confirm" onClick={handleSave}>Save</button>
            </div>
        </div>
        </>
    )
}
export default StatRecordingPage