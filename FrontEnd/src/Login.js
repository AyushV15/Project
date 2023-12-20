import { useState } from "react"
import axios from "./axios"
import{ useNavigate} from "react-router-dom"
import { ToastContainer,toast } from "react-toastify"

export default function Login(){

    const navigate = useNavigate()
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const formdata = {
            username,
            password
        }

        try{
            const response = await axios.post("api/login",formdata)
            console.log(response)
            navigate("/dashboard")
        }catch(e){
            console.log(e)
            toast.error(e.response.data.error)
        }
    }
    return(
        <div>
            <form onSubmit = {handleSubmit}>
                <input type = "text" placeholder = "username" value={username} onChange={(e)=>setUsername(e.target.value)}/><br/>
                <input type = "password" placeholder = "password" value={password} onChange={(e)=>setPassword(e.target.value)}/><br/>
                <input type = "submit"/>
            </form>
            <ToastContainer/>
        </div>
       
    )
}
