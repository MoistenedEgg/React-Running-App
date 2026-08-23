import { useUserContext } from "../contexts/UserContext"

function RunStats({run}){
    const {formatTimeString} = useUserContext()
    return (
        <div className="run-stats">
            <h4>Jul 16, 2020</h4>
            <p>4:33pm</p>

            <div className="main stats">
                <p>Dist</p>
                <p>{`${run.distance}km`}</p>

                <p>Time</p>
                <p>{formatTimeString(run.time)}</p>

                <p>Pace</p>
                <p>{formatTimeString(run.pace)}</p>
            </div>
        </div>
    )
}

export default RunStats