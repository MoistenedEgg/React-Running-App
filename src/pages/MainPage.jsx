import { useState } from 'react'
import Home from './Home'
import ActivityPage from './ActivityPage'
import GoalsPage from './GoalsPage'
import ProfilePage from './ProfilePage'

// This page is the main part, responsible for display all other pages using a navbar at the bottom of the screen
function MainPage(){
    
    const [page, setPage] = useState("HOME");

    return (
        <>
        {GetPage(page)}
        <div className="navbar">
            <button onClick={() => {setPage("ACTIVITY")}}>Acivity</button>  
            <button onClick={() => {setPage("HOME")}}>Home</button>  
            <button onClick={() => {setPage("GOALS")}}>Goals</button>  
            <button onClick={() => {setPage("PROFILE")}}>Profile</button>  
        </div>
        </>
    )
}

function GetPage(pageType){
    switch (pageType){
        case "HOME":
            return <Home/>
        case "ACTIVITY":
            return <ActivityPage/>
        case "GOALS":
            return <GoalsPage/>
        case "PROFILE":
            return <ProfilePage/>
        default:
            return <div>Invalid Page</div>
    }
    
}
export default MainPage