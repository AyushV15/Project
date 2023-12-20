
import { useState } from "react"
import axios from "./axios"
import { ToastContainer,toast } from "react-toastify"
export default function ReflectionForm({form,dispatch,closeForm,closeEditForm}){


    const [Formtitle,setFormTitle] = useState(form ? form.Formtitle : "")
    const [description,setDes] = useState('')
    const [quetions,setQuestions] = useState(form ? form.Questions : [{title : ""}])

    const handleAdd = () =>{
        let data = [...quetions,{title : ""}]
        setQuestions(data)
    }

    const handleRemove = (index,e) =>{
        e.preventDefault()
        let data = [...quetions]
        data.splice(index,1)
        setQuestions(data)
    }

    const handleChange = (index,e) =>{
        let data = [...quetions]
        data[index]["title"] = e.target.value
        setQuestions(data)
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        const formdata = {
            Formtitle,
            description,
            Questions : quetions
        }
        if(form){
            try{
                const response = await axios.put(`api/form/${form._id}`,formdata)
                console.log(response,"Edited")
                toast.success("form updated successfully")
                closeEditForm()
                dispatch({type : "UPDATE" , payload : response.data})
            }catch(e){
                console.log(e)
            }
        }
        else{
            try{
                const response = await axios.post("api/form",formdata)   
                console.log(response,"response")
                dispatch({type : "ADD", payload : response.data})
                toast.success("form created successfully")
                closeForm()
                
            }catch(e){
                console.log(e)
            }
        }
        
        console.log(formdata)
        setFormTitle("")
        setDes("")
        setQuestions([])
    }
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label>Title</label><br/>
                <input type="text" placeholder="Title" value={Formtitle} onChange={(e)=>setFormTitle(e.target.value)}/><br/>
                <label>Description</label><br/>
                <input type="text" placeholder="Description" value={description} onChange={(e)=>setDes(e.target.value)}/><br/>
                <label>Add Questions</label><br/>
                {quetions.map((ele,i) =>{
                    return(
                        <div>
                            <input type="text" name="title" value={ele.title}  placeholder = {`question - ${i+1}`} onChange={(e)=>handleChange(i,e)}/><button onClick={(e)=>handleRemove(i,e)}>Remove</button>
                            <br/>
                        </div>
                    )
                })}
                <button onClick={(e)=>{
                e.preventDefault()
                handleAdd()}}>
                Add Question</button><br/>
                <input type="submit"/>
            </form>  
        </div>
    )
}