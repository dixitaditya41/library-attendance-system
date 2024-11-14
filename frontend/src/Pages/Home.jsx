import Login from "../components/Login";
import SignUp from "../components/SignUp";


function Home({setIsLoggedIn}) {
   

    return(
      
          <div className="w-screen h-screen flex flex-col justify-center items-center m-3 p-4">
            
            {
             setIsLoggedIn ?  <SignUp setIsLoggedIn={setIsLoggedIn}/> : <Login setIsLoggedIn={setIsLoggedIn}/>
            }
           
          </div>
  
      )}
  
  export default Home;