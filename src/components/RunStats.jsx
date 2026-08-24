import { useUserContext } from "../contexts/UserContext"
import '../css/RunStats.css'
import { Trash2, Pencil} from 'lucide-react';

function RunStats({run}){
    const {formatTimeString, sortRunsByDate} = useUserContext()
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
        const year = date.getFullYear()
        return `${day}${getOrdinal(day)} ${month}, ${year}`
    }

    function formatDateTime(date){
        let hour = date.getHours()
        const minute = date.getMinutes()
        let suffix = 'am'
        
        if(hour > 12){
            hour -= 12
            suffix = 'pm'
        }
        return `${hour}:${minute.toString().padStart(2, '0')}${suffix}`
    }
    return (
        <div className="run-stats">
            <div className="run-header">
                <div className="run-time">
                    <h3>{formatDate(new Date(run.date))}</h3>
                    <span style={{color: 'gray'}}>{formatDateTime(new Date(run.date))}</span>
                </div>

                <div className="run-option-buttons">
                    <button className="btn-green btn-run-option">
                        <Pencil/>
                    </button>

                    <button className="btn-cancel btn-run-option ">
                        <Trash2/>
                    </button>
                </div>
            </div>
            

            <div className="main-stats">

                <div className="stat-container-small">
                    <span>Dist</span>
                    <h4 className="text-green">{`${(run.distance).toFixed(2)}`}<span className="text-unit">km</span></h4>
                </div>

                <div className="stat-container-small">
                    <span>Time</span>
                    <h4 className="text-green">{formatTimeString(run.time)}</h4>
                </div>

                <div className="stat-container-small">
                    <span>Pace</span>
                    <h4 className="text-green">{formatTimeString(run.pace)}</h4>
                </div>
            </div>
        </div>
    )
}

export default RunStats