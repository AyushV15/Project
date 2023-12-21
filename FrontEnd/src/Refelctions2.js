import { useEffect, useReducer, useState } from "react"
import Papa from "papaparse"
import { ToastContainer,toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "./axios"
import ReflectionForm from "./ReflectionForm"
import {Accordion,Modal,Button,ListGroup,Col, Row} from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import "./Reflections.css"

const reducer = (state,action) =>{
    switch(action.type){
        case "ADD" : {
            return [...state,action.payload]
        } 
        case "SETFORMS" : {
            return [...state,...action.payload]
        }
        case "UPDATE" : {
            return state.map(ele =>{
                if(ele._id == action.payload._id){
                    return {...ele,...action.payload}
                }
                else{
                    return {...ele}
                }
            })
            
        }
        case "DELETE" : {
            return state.filter(ele => ele._id !== action.payload)
        }
        default : {
            return [...state]
        }
    }
}


  
export default function Reflection2(){

    const navigate = useNavigate()
    const [allforms,dispatch] = useReducer(reducer,[])
    const [form,setForm] = useState(false)
    const [editForm,setEditForm] = useState(false)
    const [modal,setModal] = useState(false)
    const [selectedForm,setSelectedForm] = useState("")

    useEffect(()=>{
        (async ()=>{
            try{
                const response = await axios.get('api/radio')
                console.log(response,"all the forms")
                dispatch({type : "SETFORMS",payload : response.data})
            }catch(e){
                console.log(e)
            }
        })()
    },[])

    const handleShowForm = async (id) =>{
        try{
            const response = await axios.get(`api/form/${id}`)
            console.log(response,"one Form")
            setSelectedForm(response.data)
            setModal(true)
        }catch(e){
            console.log(e)
        }
    }

    const handleDelete = async (id) =>{
        const confirm = window.confirm("are you sure")
        if(confirm){
            try{
                axios.delete(`api/form/${id}`)
                dispatch({type : "DELETE",payload : id})
            }catch(e){
                console.log(e)
            }
        }
        setModal(false)
    }

    const closeForm = () =>{
        setForm(false)
    }
    const closeEditForm = () =>{
        setEditForm(false)
        setModal(false)
    }
   
    //getting form and maping the questions to answers
    const [radio,setRadio] = useState('')
    const [search,setSearch] = useState("")
    const [Arr,setArr] = useState([])
    const [data,setData] = useState(false)
    const [view,setView] = useState(false)
    const [file,setfile] = useState(null)
    const [results,setResults] = useState([])
    
    const answered = results.filter(ele =>{
        return ele.QA.A.length !== 0
    })
    console.log(answered)

    const notAnswered = results.filter(ele =>{
        return ele.QA.A.length == 0
    })
    
    const handleClick = () =>{
        console.log(file)
        Papa.parse(file,{
            header : true,
            complete: async (results)=>{
                const finalRes = []
                try{
                    const res = await axios.get(`api/form?type=${radio}`)
                    const res1 = res.data.Questions
                    res1.forEach(ele => {
                        finalRes.push(ele.title)
                    });
                    
                }catch(e){
                    console.log(e)
                }

                const test = results.data.map(obj =>{
                    const ans = []
                    for(const key in obj){
                        if(key.includes("Question")){
                            ans.push(obj[key])
                        }
                    }
                    return {name : obj.Name , QA : {A : ans}}
                })

                const test1 = test.map(ele =>{
                    ele.QA.Q = finalRes
                    return ele
                })
           
              setResults(test1)
              setArr(test1) 
              setView(true)
              toast.success("file parsed successfully",{
                position : "top-center",
                theme : "colored"
              })
            },
          })
    }


    
    return(

        <div>
            <div className="header">
                <h1>File Parser</h1>
            </div>
            <Button variant="primary form-button" onClick={()=>setForm(!form)}>{form ? "cancel" : "Form"}</Button>
            {form && (
                <div style={{border : "5px solid black"}}>
                    <ReflectionForm dispatch = {dispatch} closeForm = {closeForm}/>
                </div>
            )}
            <div style={{height : "20px"}}></div>

            <Row>
            <Col md = {4}>
            <ListGroup>
            {allforms.map(ele =>{
                return(
                    <div>
                        <ListGroup.Item>
                        <input type="radio" value={ele.Formtitle} name = "type" onChange={(e) => setRadio(e.target.value)}/>{ele.Formtitle}
                        <Button className="float-end show-button" variant="success" size="sm"  onClick={()=>handleShowForm(ele._id)}>Show</Button>
                        </ListGroup.Item>
                                            </div>
                )
            })}
            </ListGroup>
            </Col>
            </Row>
            <br/>
            <input type="file" onChange={(e)=>setfile(e.target.files[0])}/>
            <button onClick={handleClick}>Upload</button><br/><br/>
            <button onClick = {()=>navigate("/")}>Logout</button>
            {view  && <button onClick={()=> {
                setData(!data)
            }}>view Results</button>}
            {data && (
                <input value={search}  onChange={(e)=>{
                    setSearch(e.target.value)
                }}/>
            )}
            {data && answered.filter(ele => {
                if(ele.name){
                    return ele.name.includes(search)
                }
            }).map(ele =>{
                return(
                    <div>
                            <Accordion>
                            <Accordion.Item eventKey={0}>
                            <Accordion.Header>{ele.name}</Accordion.Header>
                            <Accordion.Body>
                            {ele.QA.Q.map((q,i) => {
                                return(
                                    <div>
                                        <h3>{`${i+1}) ${q}`}</h3>
                                        <p>{ele.QA.A[i]}</p>
                                    </div>
                                )
                            })}
                            </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                )  
            })}  

            <br/><br/>
            {data && <h3>Student who have not answered</h3>}
            {data && notAnswered.filter(ele => {
                if(ele.name){
                    return ele.name.includes(search)
                }
            }).map(ele =>{
                return(
                    <div>
                            <Accordion>
                            <Accordion.Item eventKey={0}>
                            <Accordion.Header>{ele.name}</Accordion.Header>
                            <Accordion.Body>
                            {ele.QA.Q.map((q,i) => {
                                return(
                                    <div>
                                        <h3>{`${i+1}) ${q}`}</h3>
                                        <p>{ele.QA.A[i]}</p>
                                    </div>
                                )
                            })}
                            </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                
                )  
            })}

    {selectedForm && (
        <Modal show = {modal} onHide={()=>{
            setEditForm(false)
            setModal(false)}}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedForm.Formtitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {editForm ? (
            <ReflectionForm form = {selectedForm} closeEditForm = {closeEditForm} dispatch = {dispatch}/>
        ) : (
            <ol>{selectedForm.Questions.map(ele =>{
                return(
                <li>{ele.title}</li>
                )
            })}</ol>
        )}
        
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={()=>handleDelete(selectedForm._id)}>delete form</Button>
          <Button variant="primary" onClick={()=>setEditForm(!editForm)}>
            {editForm ? "cancel" : "edit"}
          </Button>
        </Modal.Footer>
        </Modal>
    )}
        
        <ToastContainer/>  

        </div> 
    )
}