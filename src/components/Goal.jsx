import {useState, useEffect} from "react";
import {useUserContext} from "../contexts/UserContext";
import '../css/Goal.css'

import {MountainSnow, Timer, Clock, Sparkle} from 'lucide-react';

function Goal({goal, isEditing, onConfirm, onCancel}){
    const {runs, goals, addGoal, removeGoal, sortGoalsByDate, setGoalProgress, formatTimeString} = useUserContext()
    const [targetMetric, setTargetMetric] = useState(goal ? goal.targetMetric : "Distance")
    const [targetValue, setTargetValue] = useState(goal ? goal.targetValue : 0)
    const [targetDate, setTargetDate] = useState(goal ? goal.targetDate : "")
    
    const [isValidForm, setIsValidForm] = useState(true)

    const [currentVal, setCurrentVal] = useState(goal ? goal.currentValue : 0)
    useEffect(() => {
        // ============== Init ================
        if(!goal){return}
        setCurrentVal(setGoalProgress(goal.id))
    }, [runs])
        
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
        sortGoalsByDate();
        onConfirm();
    }

    function formatValue(value){
        if(targetMetric === "Distance"){
            return parseFloat(value).toFixed(2)
        } else if(targetMetric === "Time" || targetMetric === "Pace"){
            return formatTimeString(value)
        }
    }


    function getOrdinal(day) {
        if (day > 3 && day < 21) return 'th'; // 11th-13th are all "th"
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    }

    function formatDate(date){
        const day = date.getDate();
        const month = date.toLocaleDateString('en-GB', {month: 'long'})
        return `${day}${getOrdinal(day)} ${month}`
    }

    let progress = 0;
    let completed = false
    if(goal != null){
        progress = Math.min((currentVal / goal.targetValue) * 100, 100)
        if(progress >= 100){
            completed = true;
        }
    }

    function handleCompleteGoal(){
        if(completed){
            removeGoal(goal.id);
        }
    }
    return (
        <>
            <div 
            className={`goal ${isEditing ? "goal-editing" : ""} ${completed ? "goal-completed" : ""}`} 
            onClick={handleCompleteGoal}>
                {completed && 
                <div className="goal-complete-overlay">
                    <span>Click anywhere to remove</span>
                </div>}
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
                        <div className="goal-header">
                            <div className="goal-title">
                                <h3 className="goal-text">{getGoalIcon(goal.targetMetric)}{`Goal: ${goal.targetMetric}`}</h3>
                                {completed && <h3 className="goal-complete-text"><Sparkle/>Goal Complete</h3>}
                            </div>

                            <div className="goal-dates">
                                <h4 className="goal-target-date">{`Target Date: ${formatDate(new Date(goal.endDate))}`}</h4>
                                <span className="goal-start-date">{`Started on: ${formatDate(new Date(goal.startDate))}`}</span>
                            </div>
                        </div>
                        <div className="goal-stat-container">
                            <span className="big-num">{formatValue(currentVal)}</span>
                            <span className="unit">{`/${formatValue(goal.targetValue)} ${targetMetric === 'Distance' ? "km" : ''}`}</span>
                        </div>
                        <div className="progress">
                            <div className={`progress-bar ${progress >= 100 ? 'completed' : ''}`} style={{width: `${progress}%`}}></div>
                        </div>
                        <span className="progress-text">{`Progress: ${Math.round(progress)}%`}</span>
                    </div>
                )}
            </div>
        </>
    )
}

function getGoalIcon(metric){
    switch(metric){
        case "Distance":
            return <MountainSnow/>
        case "Time":
            return <Clock/>
        case "Pace":
            return <Timer/>
    }
}

export default Goal