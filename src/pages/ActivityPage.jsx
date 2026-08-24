import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts'
import {useState, useEffect} from 'react'
import { useUserContext } from '../contexts/UserContext';
import RunStats from '../components/RunStats';
import '../css/ActivityPage.css'

function graphReducer(action){
    switch(action.type){
        case "CURRENT_WEEK":
            // Determine what day we are right now
            const now = new Date()
            const today = now.getDay()
        case "LAST_WEEK":

    }
}

function ActivityPage(){
    const {runs, filterRunsByDate} = useUserContext()
    const [graphData, setGraphData] = useState([
        { name: 'Sun', value: 2600 },
        { name: 'Mon', value: 400 },
        { name: 'Tue', value: 300 },
        { name: 'Wed', value: 600 },
        { name: 'Thur', value: 600 },
        { name: 'Fri', value: 600 },
        { name: 'Sat', value: 600 },
    ]);
    const [graphStart, setGraphStart] = useState(0)
    const [graphEnd, setGraphEnd] = useState(new Date())

    // Init
    useEffect(() => {
        // Determine what day we are right now
        // Temp system: Update later to account for different date ranges
        const now = new Date()
        const today = now.getDay()
        const startOfWeek = new Date()
        startOfWeek.setDate(now.getDate() - today)
        startOfWeek.setHours(0, 0, 0, 0)

        setGraphStart(startOfWeek)
        setGraphEnd(new Date().setDate(startOfWeek.getDate() + 6))
       
        const filtered = filterRunsByDate(startOfWeek, now)
        
        console.log("Filtered:")
        console.log(filtered)
        
        // Sum up stats for each day
        const daySummed = Array(7).fill(0);
        filtered.forEach(run => {
            const runDate = new Date(run.date);
            daySummed[runDate.getDay()] += run.distance;
        }, [])

        console.log("Day Summed:")
        console.log(daySummed)
        const data = Array(7).fill(0)
        for(let i = 0; i < 7; i++){
            let val = daySummed[i];
            const day = new Date(startOfWeek)
            day.setDate(startOfWeek.getDate() + i)

            data[i] = ({name: day.toLocaleString('en-US', {weekday: 'short'}), value: val})
            console.log({name: day.toLocaleString('en-US', {weekday: 'short'}), value: val})
        }
        console.log(`Data: ${data}`)
        setGraphData(data);

    }, [])

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
    return (
        <>
        <div className="activity">
            <h1>Stats and trends</h1>

            <div className="activity-graph">
                <h3>{`This week: ${formatDate(new Date(graphStart))} - ${formatDate(new Date(graphEnd))}`}</h3>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={graphData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip isAnimationActive={false}/>
                    <Bar dataKey="value" fill="#b0e45c" />
                </BarChart>
                </ResponsiveContainer>

                <div className="size-selector">
                    <button className="btn-green">Week</button>
                    <button className="btn-green">Month</button>
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