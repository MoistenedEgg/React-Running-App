import { useState } from 'react'
import Home from './Home'
import ActivityPage from './ActivityPage'
import GoalsPage from './GoalsPage'
import ProfilePage from './ProfilePage'
import '../css/MainPage.css'
import { ChartColumn, House, UserPen, Goal} from 'lucide-react'

// This page is the main part, responsible for display all other pages using a navbar at the bottom of the screen
function MainPage(){
    
    const [page, setPage] = useState("HOME");
    console.log(page);
    return (
        <main>
            <div className="page-container">

                {GetPage(page)}
            </div>
        <div className="navbar">
            <button className={`page-button ${page === "ACTIVITY" ? "active" : ""}`} onClick={() => {setPage("ACTIVITY")}}>
                <ChartColumn className="page-button-symbol"/>    
                <span className={`page-button-caption ${page === "ACTIVITY" ? "active" : ""}`}>Activity</span>    
            </button>  
            <button className={`page-button ${page === "HOME" ? "active" : ""}`} onClick={() => {setPage("HOME")}}>
                <House className="page-button-symbol"/>    
                <span className={`page-button-caption ${page === "HOME" ? "active" : ""}`}>Home</span>  
            </button>  
            <button className={`page-button ${page === "GOALS" ? "active" : ""}`} onClick={() => {setPage("GOALS")}}>
                <Goal className="page-button-symbol"/>    
                <span className={`page-button-caption ${page === "GOALS" ? "active" : ""}`}>Goals</span>  
            </button>  
            <button className={`page-button ${page === "PROFILE" ? "active" : ""}`} onClick={() => {setPage("PROFILE")}}>
                <UserPen className="page-button-symbol"/>    
                <span className={`page-button-caption ${page === "PROFILE" ? "active" : ""}`}>Profile</span>  
            </button>  
        </div>
        </main>
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