import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts'
import {useState, useEffect} from 'react'
import { useUserContext } from '../contexts/UserContext';
import RunStats from '../components/RunStats';
import '../css/ActivityPage.css'
import { Clock, Footprints, Timer} from 'lucide-react';

function ActivityPage(){
    const {runs, filterRunsByDate, formatTimeString} = useUserContext()
    const [graphRange, setGraphRange] = useState("CURRENT_WEEK")
    const [graphMetric, setGraphMetric] = useState("Distance")
    const [graphData, setGraphData] = useState([
        { name: 'Sun', distance: 2600 },
        { name: 'Mon', distance: 400 },
        { name: 'Tue', distance: 300 },
        { name: 'Wed', distance: 600 },
        { name: 'Thur', distance: 600 },
        { name: 'Fri', distance: 600 },
        { name: 'Sat', distance: 600 },
    ]);
    const [graphStart, setGraphStart] = useState(0)
    const [graphEnd, setGraphEnd] = useState(new Date())

    const [animate, setAnimate] = useState(true)

    useEffect(() => {
        setGraphData(getGraphRange(graphRange));
    }, [runs, graphRange])

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

    function getGraphRange(type){
        let graphSize = 7
        const now = new Date()
        const today = now.getDay() //returns 0-6 (Sun-Sat)
        const startDate = new Date()
        switch(type){
            case "CURRENT_WEEK":
                // Get the start of the week (Sunday)
                startDate.setDate(now.getDate() - today)
                startDate.setHours(0, 0, 0, 0)
                graphSize = 7
                break;
            case "LAST_WEEK":
                startDate.setDate(now.getDate() - (today + 7))
                startDate.setHours(0, 0, 0, 0)
                graphSize = 7
                break;
            case "MONTH":
                startDate.setDate(1)
                startDate.setHours(0, 0, 0, 0)
                graphSize = 30;
                break;
            default:
                graphSize = 7
                break;
        }

        console.log("========== Graph Range: " + type + " ==========")
        const endDate = new Date(startDate)
        endDate.setDate(startDate.getDate() + graphSize - 1)
        setGraphStart(startDate)
        setGraphEnd(endDate)

        const filtered = filterRunsByDate(startDate, endDate)
                
        console.log("Filtered:")
        console.log(filtered)
        
        // Sum up stats for each day
        const daySummed = Array(graphSize).fill({distance: 0, time: 0, pace: Infinity});
        filtered.forEach(run => {
            const runDate = new Date(run.date);
            const prev = daySummed[runDate.getDay()]
            daySummed[runDate.getDay()] = {
                distance: prev.distance + run.distance,
                time: prev.time + run.time,
                pace: run.pace < prev.pace ? run.pace : prev.pace
            };
        }, [])

        console.log("Day Summed:")
        console.log(daySummed)
        const data = Array(graphSize).fill(0)
        for(let i = 0; i < graphSize; i++){
            let val = daySummed[i];
            const day = new Date(startDate)
            day.setDate(startDate.getDate() + i)

            data[i] = ({name: day.toLocaleString('en-US', {weekday: 'short'}), distance: val.distance, time: val.time, pace: val.pace, date: day})
            console.log({name: day.toLocaleString('en-US', {weekday: 'short'}), distance: val.distance, time: val.time, pace: val.pace, date: day})
        }
        console.log(`Data: ${data}`)
        return data
    }

    function formatGraphMetricLabel(metric){
        switch(metric){
            case "Distance":
                return "Distance (km)"
            case "Time":
                return "Time (min)"
            case "Pace":
                return "Pace (min/km)"
            default:
                return ""
        }
    }

    return (
        <>
        <div className="activity">
            <h1>Activity</h1>
        
            <div className="activity-graph-container">
                <h3>{`Current Range: ${formatDate(new Date(graphStart))} - ${formatDate(new Date(graphEnd))}`}</h3>

                <div className="metric-selector">
                    <button className={`btn-tab btn-metric ${graphMetric === "Distance" ? "active" : ""}`} onClick={() => setGraphMetric("Distance")}>
                        Distance
                        <Footprints className="inline-logo"/>
                    </button>
                    <button className={`btn-tab btn-metric ${graphMetric === "Time" ? "active" : ""}`} onClick={() => setGraphMetric("Time")}>
                        Time
                        <Clock className="inline-logo"/>
                    </button>
                    <button className={`btn-tab btn-metric ${graphMetric === "Pace" ? "active" : ""}`} onClick={() => setGraphMetric("Pace")}>
                        Best Pace
                        <Timer className="inline-logo"/>
                    </button>
                </div>

                <ResponsiveContainer width="100%" height={300} className="activity-graph">
                <BarChart data={graphData}>
                    <XAxis dataKey="name"/>
                    <YAxis 
                    label={{value: formatGraphMetricLabel(graphMetric), angle: -90, position: "insideLeft"}}
                    tickFormatter={(value) => graphMetric === 'Time' || graphMetric === 'Pace' ? formatTimeString(value) : value}/>
                    <Tooltip 
                        isAnimationActive={false}
                        cursor={{ fill: "rgba(0,0,0,0.25)"}}
                        formatter={(value) => graphMetric === 'Time' || graphMetric === 'Pace' ? formatTimeString(value) : value}
                        contentStyle={{ borderRadius: 8, 
                                        border: "none", 
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)", 
                                        background: "var(--color-background-lighter)",
                                        transition: "all 0.3s ease-in-out" }}
                    />
                    <Bar dataKey={graphMetric.toLowerCase()} fill="var(--color-primary)" 
                    isAnimationActive={animate}
                    OnAnimationEnd = {() => {
                        hasAnimated.current = true
                        setAnimate(false)
                    }}/>
                </BarChart>
                </ResponsiveContainer>

                <div className="time-selector">
                    <button className={`btn-tab ${graphRange === "CURRENT_WEEK" ? "active" : ""}`} onClick={() => setGraphRange("CURRENT_WEEK")}>
                        This Week
                    </button>
                    <button className={`btn-tab ${graphRange === "LAST_WEEK" ? "active" : ""}`} onClick={() => setGraphRange("LAST_WEEK")}>
                        Last Week
                    </button>
                    <button className={`btn-tab ${graphRange === "MONTH" ? "active" : ""}`} onClick={() => setGraphRange("MONTH")}>
                        This Month
                    </button>
                </div>
                
            </div>

            <div className="run-log">
                <h3>Recent Runs</h3>
                {runs.map(run => <RunStats run={run} key={run.id}/>)}
            </div>
        </div>
        </>
    )
}
export default ActivityPage