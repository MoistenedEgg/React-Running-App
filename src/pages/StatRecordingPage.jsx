import {useState} from 'react'

function StatRecordingPage({run, onSave, onCancel}){
    const [currentRun, setRun] = useState();
    const [time, setTime] = useState('000000');
    const [distance, setDistance] = useState(0);

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
    
    function getAverageSpeed(){
        let rawTime = formatTimeToSeconds(time)
    
        if(rawTime === 0) return 0
        return (distance * 1000) / rawTime * 3.6
    }

    function formatTimeToSeconds(rawDigits){
        // Formats a given integer into seconds value
        // Assumes raw digits is a 6 length string
        // Digits format: 000123 == 83s


        //console.log(`${parseInt(hh)} : ${parseInt(mm)} : ${parseInt(ss)}`)

        return parseInt(ss) + (parseInt(mm) * 60) + (parseInt(hh) * 3600)

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

            <h4>Average Speed (km/hr)</h4>
            <input disabled value={`${getAverageSpeed().toFixed(2)}`}/>

            <button onClick={() => {onSave()}}>Save</button>
            <button onClick={() => {onCancel()}}>Cancel</button>
        </div>
        </>
    )
}
export default StatRecordingPage