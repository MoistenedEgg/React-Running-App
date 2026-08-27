import {useState, useEffect, useRef} from "react";
import '../css/GoalsPage.css'
import { useUserContext } from "../contexts/UserContext";
import Goal from "../components/Goal";
import { CirclePlus } from "lucide-react";

function GoalsPage(){
    const {goals, addGoal, removeGoal, sortGoalsByDate} = useUserContext()
    const listRef = useRef(null)

    const[isAddingGoal, setIsAddingGoal] = useState(false)

    useEffect(() => {
        sortGoalsByDate()
    }, [isAddingGoal])

    function handleAddGoal(){
        setIsAddingGoal(true)
        listRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }
    
    return (
        <>
        <div className="goals">
            <h1>Goals</h1>

            <span className="title-gray">Current Goals</span>
            <div className="goal-content-container">
                <div className="goal-list" ref={listRef}>
                    {isAddingGoal && (
                        <Goal isEditing={true} onConfirm={() => setIsAddingGoal(false)} onCancel={() => setIsAddingGoal(false)} />
                    )}
                    {goals.length > 0 ? (
                        goals.map(goal => <Goal goal={goal} key={goal.id}/>)
                    ) : (
                        <p>No goals added yet.</p>
                    )}
                </div>
            
            </div>
            <div className="goal-form">
                <button className="btn-large-add" onClick={handleAddGoal}>
                    <CirclePlus></CirclePlus>
                    ADD NEW GOAL
                </button>
            </div>
            
        </div>
        </>
    )
}
export default GoalsPage