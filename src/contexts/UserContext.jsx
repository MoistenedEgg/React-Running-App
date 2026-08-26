import {createContext, useState, useContext, useEffect} from 'react';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);
export const UserProvider = ({children}) => {
    const [runs, setRuns] = useState(() => {
        try {
            const stored = localStorage.getItem("runs");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return []
        }
    })
    // Run Properties: id, date, time, distance, calories, elevation gain, average speed, notes

    const [goals, setGoals] = useState(() => {
        try {
            const stored = localStorage.getItem("goals");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return []
        }
    })
    // Goal properties: id, startDate, endDate, targetMetric, targetVal, currentVal, isCompleted

    useEffect(() => {
        localStorage.setItem("runs", JSON.stringify(runs))
        localStorage.setItem("goals", JSON.stringify(goals))
    }, [runs, goals])

    const addRun = (run) => {
        setRuns(prev => [...prev, run])
    }
    const removeRun = (runId) => {
        setRuns(prev => prev.filter(run => run.id !== runId))
    }

    const sortRunsByDate = () => {
        setRuns(prev => 
            [...prev].sort((r1, r2) => new Date(r2.date).getTime() - new Date(r1.date).getTime())
        )
    }

    // Compile a list of all runs from within a date range
    const filterRunsByDate = (startDate, endDate = new Date()) => {
        return runs.filter(run => {
            const date = new Date(run.date);
            return date >= startDate && date <= endDate
        })
    }
    const formatTimeString = (seconds) => {
        if(isNaN(seconds) || !Number.isFinite(seconds)){
            return "0:00"
        }
        let mins = 0;
        let hrs = 0;

        if (seconds >= 3600) {
            hrs = Math.floor(seconds / 3600);
            seconds -= 3600 * hrs;
        }
        if (seconds >= 60) {
            mins = Math.floor(seconds / 60);
            seconds -= 60 * mins;
        }

        seconds = Math.round(seconds); // was calculated but never used

        // handle case where rounding pushes seconds to 60
        if (seconds === 60) {
            seconds = 0;
            mins += 1;
        }
        if (mins === 60) {
            mins = 0;
            hrs += 1;
        }
        const pad = (n) => String(n).padStart(2, '0');
        
        return hrs > 0
            ? `${hrs}:${pad(mins)}:${pad(seconds)}`
            : `${mins}:${pad(seconds)}`;
    }

    const addGoal = (goal) => {
        setGoals(prev => [...prev, goal])
    }
    const removeGoal = (goalId) => {
        setGoals(prev => prev.filter(goal => goal.id !== goalId))
    }

    const sortGoalsByDate = () => {
        setGoals(prev => 
            [...prev].sort((g1, g2) => new Date(g2.startDate).getTime() - new Date(g1.startDate).getTime())
        )
    }

    const isGoalCompleted = (goalID) => {
        return(goals.find(g => g.id === goalID))
    }

    const setGoalProgress = (goalID) => {
        const goal = goals.find(g => g.id === goalID)
        const filtered = filterRunsByDate(new Date(goal.startDate), new Date())
        console.log("filtered runs for goal progress:", filtered)
        let goalVal = 0
        filtered.forEach(run => {
            if(goal.targetMetric === "Distance"){
                goalVal += run.distance
            } else if(goal.targetMetric === "Time"){
                goalVal += run.time
            } else if(goal.targetMetric === "Pace"){
                goalVal += run.pace
            }
        })

        goals.map((g) => g.id === goalID ? {...g, currentValue: goalVal} : g)
    }


    const value = {
        runs,
        addRun,
        removeRun,
        formatTimeString,
        sortRunsByDate,
        filterRunsByDate,

        goals,
        addGoal,
        removeGoal,
        sortGoalsByDate,
        isGoalCompleted,
        setGoalProgress
    }
    return <UserContext.Provider value = {value}>{children}</UserContext.Provider>
}