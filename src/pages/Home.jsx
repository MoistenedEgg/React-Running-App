import {useState} from 'react'
import StatRecordingPage from './StatRecordingPage'
import '../css/Home.css'

function Home(){

    const [isRecording, setIsRecording] = useState(false)

    function handleSaveRun(){
        setIsRecording(false)
    }

    function handleCancelRun(){
        setIsRecording(false)
    }
    return (
        <>
        {isRecording === false ? (
        <div className="home">
            <h1>Welcome!</h1>
            <p>Ready for an intense workout today?</p>

            <button className="btn-add-run btn-green" onClick={() => {setIsRecording(true)}}>Record Run</button>
        </div>
        ) : (
        <StatRecordingPage
            onSave={handleSaveRun}
            onCancel={handleCancelRun}/>
        )}
        </>
    )
}
export default Home