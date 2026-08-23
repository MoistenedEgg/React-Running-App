import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts'
import { useUserContext } from '../contexts/UserContext';
import RunStats from '../components/RunStats';

function ActivityPage(){
    const {runs} = useUserContext()
    const data = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 600 },
    { name: 'Thur', sales: 600 },
    { name: 'Fri', sales: 600 },
    { name: 'Sat', sales: 600 },
    { name: 'Sun', sales: 2600 },
    ];

    return (
        <>
        <div className="home">
            <h1>Stats and trends</h1>

            <div className="activity-graph">
                <div className="size-selector">
                    <button>Week</button>
                    <button>Month</button>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip isAnimationActive={false}/>
                    <Bar dataKey="sales" fill="#8884d8" isAnimationActive={false}/>
                </BarChart>
                </ResponsiveContainer>
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