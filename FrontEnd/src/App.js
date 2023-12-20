import Login from "./Login";
import Reflections from "./Reflections";
import { BrowserRouter,Route,Routes,Link } from "react-router-dom";

export default function(){
  return(
    <BrowserRouter>
    <div>
        <Routes>
          <Route path="/" element = {<Login/>}/>
          <Route path="/dashboard" element = {<Reflections/>}/>
        </Routes>
    </div>
    </BrowserRouter>
  )
}


      