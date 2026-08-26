import {useState, useEffect} from "react";
import {useUserContext} from "../contexts/UserContext";
import '../css/Goal.css'

function Goal({goal, isEditing, onConfirm, onCancel}){
    const {goals, addGoal, removeGoal, sortGoalsByDate, setGoalProgress} = useUserContext()
    const [targetMetric, setTargetMetric] = useState(goal ? goal.targetMetric : "Distance")
    const [targetValue, setTargetValue] = useState(goal ? goal.targetValue : 0)
    const [targetDate, setTargetDate] = useState(goal ? goal.targetDate : "")
    
    const [isValidForm, setIsValidForm] = useState(true)

    useEffect(() => {
        // ============== Init ================
        if(!goal){return}
        setGoalProgress(goal.id)
    }, [])
        
    useEffect(() => {
        if(!isValidForm && (targetValue <= 0 || !targetDate || new Date(targetDate) < new Date())){
            setIsValidForm(false)
        } else {
            setIsValidForm(true)
        }
    }, [targetValue, targetDate])
    const onTimeChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '');
        setTargetValue(raw.slice(-6))  
    }

    let formatted = "000000"
    if(targetMetric === "Time" || targetMetric === "Pace"){

        formatted = targetValue.toString().padStart(6, '0')
        
    }

    const hh = formatted.slice(0, 2);
    const mm = formatted.slice(2, 4);
    const ss = formatted.slice(4, 6);


    function handleConfirm(){
        let formattedTimeVal = targetValue
        if(targetMetric === "Time" || targetMetric === "Pace"){
            formattedTimeVal = parseInt(ss) + (parseInt(mm) * 60) + (parseInt(hh) * 3600)
        }
        
        // Data validate
        if(formattedTimeVal <= 0 || !targetDate || new Date(targetDate) < new Date()){
            setIsValidForm(false)
            return;
        }
        console.log(`Goal: ${targetMetric} ${formattedTimeVal} by ${new Date(targetDate)}`)
        const newGoal = {
            id: crypto.randomUUID(),
            startDate: new Date(),
            endDate: new Date(targetDate),
            targetMetric: targetMetric,
            targetValue: formattedTimeVal,
            currentValue: 0,
            isCompleted: false
        }
        addGoal(newGoal)
        onConfirm();
    }
    return (
        <>
            <div className={`goal ${isEditing ? "goal-editing" : ""}`}>
                
                {isEditing ? (
                    <div className="goal-edit-form">
                        <h2>Add new Goal</h2>
                        <h4>Goal Type</h4>
                        <div className="metric-select">
                            <button className={`btn-tab ${targetMetric === "Distance" ? "active" : ""}`} onClick={() => setTargetMetric("Distance")}>
                                Total Distance
                            </button>
                            <button className={`btn-tab ${targetMetric === "Time" ? "active" : ""}`} onClick={() => setTargetMetric("Time")}>
                                Total Time
                            </button>
                            <button className={`btn-tab ${targetMetric === "Pace" ? "active" : ""}`} onClick={() => setTargetMetric("Pace")}>
                                Best Pace
                            </button>
                        </div>

                        <div className="stat-container goal-stat">
                            <h4>Target Value</h4>
                           
                                
                                {targetMetric === "Distance" ? (
                                     <div className="input-group">
                                        <input className={`wide-input ${isValidForm === false && targetValue === 0 ? 'input-alert' : ''}`} 
                                        type="number" 
                                        value={targetValue} 
                                        onChange={(e) => setTargetValue(e.target.value)} 
                                        defaultValue=""/>
                                        <span className="unit">Km</span>
                                    </div>
                                ) : (
                                    <div className="input-group">
                                        <input value={`${hh}:${mm}:${ss}`} 
                                        type="text" 
                                        inputMode="numeric" 
                                        placeholder="00:00:00"
                                        onChange={onTimeChange}
                                        className={`wide-input ${isValidForm === false && targetValue === 0 ? 'input-alert' : ''}`} 
                                        />
                                    </div>
                                )}
                        </div>

                        <div className="stat-container goal-stat">
                            <h4>Target Date</h4>
                            <input 
                            type="date" 
                            value={targetDate} 
                            onChange={(e) => setTargetDate(e.target.value)} 
                            defaultValue=""
                            className={`wide-input ${isValidForm === false && (!targetDate || new Date(targetDate) < new Date()) ? 'input-alert' : ''}`} />
                        </div>

                        <div className="stat-button-container">
                            <button className="btn-green btn-cancel btn-confirm" onClick={onCancel}>Cancel</button>
                            <button className="btn-green btn-confirm" onClick={handleConfirm}>Save</button>
                        </div>
                    </div>
                ) : (
                    // Displaying the actual goal info here
                    <div className="goal-display">
                        <h3>{`Goal: ${goal.targetMetric}`}</h3>

                        <div className="goal-stat-container">
                            <span className="big-num">{goal.currentValue}</span>
                            <span className="unit">{`/${goal.targetValue}`}</span>
                        </div>
                        <div className="progress">
                            <div className="progress-bar" style={{width: `${(goal.currentValue / goal.targetValue) * 100}%`}}></div>
                            <span>{`Progress: ${goal.currentValue} / ${goal.targetValue}`}</span>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default Goal