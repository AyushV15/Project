import Login from "./Login";
import { BrowserRouter,Route,Routes,Link } from "react-router-dom";
import Reflection2 from "./Refelctions2";

export default function(){
  return(
    <BrowserRouter>
    <div>
        <Routes>
          <Route path="/" element = {<Login/>}/>
          <Route path="/dashboard" element = {<Reflection2/>}/>
        </Routes>
    </div>
    </BrowserRouter>
  )
}


      