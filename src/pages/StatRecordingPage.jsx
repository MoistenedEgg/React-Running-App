import {useState, useEffect} from 'react'
import { useUserContext } from '../contexts/UserContext';

function StatRecordingPage({run, onSave, onCancel}){
    const {addRun, formatTimeString} = useUserContext();
    const [currentRun, setCurrentRun] = useState({})
    const [time, setTime] = useState('000000');
    const [distance, setDistance] = useState(0);
    const [pace, setPace] = useState(0); // in seconds

    const onTimeChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '');
        setTime(raw.slice(-6))        
    }
    const onDistanceChange = (e) => {
        let raw = e.target.value
        if(raw < 0) raw = 0
        setDistance(raw)
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
        const now = new Date();
        const newRun = {
            id: crypto.randomUUID(),
            date: now, 
            time: time, 
            distance: distance,
            pace: pace,
        }
        addRun(newRun)
        onSave();
    }

    
    return (
        <>
        <div className="stat-recording">
            <h2>Record your Run</h2>
            <h4>Distance(km)</h4>
            <input type="number" min="0" step="0.01" value={distance} onChange={onDistanceChange} inputMode="numeric" placeholder="Distance in km"/>
            
            <h4>Time</h4>
            <input value={`${hh}:${mm}:${ss}`} 
            type="text" 
            inputMode="numeric" 
            placeholder="00:00:00"
            onChange={onTimeChange}
            />
            
            <h4>Calories burnt (kcal)</h4>
            <input type="number" min="0" max="10000" step="1" placeholder="0"/>

            <h4>Elevation Gain (°)</h4>
            <input type="number" min="0" max="90" step="1" placeholder="0"/>

            <h4>Pace (min/km)</h4>
            <input 
            disabled
            value={`${getPaceString()}`}
            />

            <button onClick={handleSave}>Save</button>
            <button onClick={() => {onCancel()}}>Cancel</button>
        </div>
        </>
    )
}
export default StatRecordingPage