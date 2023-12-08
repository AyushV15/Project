import { useEffect, useState } from "react"
import Papa from "papaparse"
import { ToastContainer,toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "./axios"
import ReflectionForm from "./ReflectionForm"
import {Accordion} from "react-bootstrap"



export default function Reflections(){

    const[form,setForm] = useState(false)

    const [RADIOS,setRADIOS] = useState([])
    useEffect(()=>{
        (async ()=>{
            try{
                const response = await axios.get('api/radio')
                console.log(response)
                const res = []
                response.data.forEach(ele =>{
                    res.push(ele.Formtitle)
                })
                setRADIOS(res)
            }catch(e){
                console.log(e)
            }
        })()
    },[])

    const [radio,setRadio] = useState('')

    const [Arr,setArr] = useState([])
    const [data,setData] = useState(false)
    const [view,setView] = useState(false)
    const [file,setfile] = useState(null)
    const [results,setResults] = useState([])

    const answered = results.filter(ele =>{
        return ele.QA.A.length !== 0
    })

    const notAnswered = results.filter(ele =>{
        return ele.QA.A.length == 0
    })

    const handleSearch = (value) =>{
        const f = Arr.filter(ele =>{
            if(ele.name){
                return ele.name.includes(value)
            }
        })
        setResults(f)
    }

    console.log(results)
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
                    console.log(finalRes,"final")
                    
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
              console.log(results.data)  
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


    console.log(radio)
    console.log(results)
    return(

        <div>
            <button onClick={()=>setForm(!form)}>Form</button>
            {form && (
                <div style={{border : "5px solid black"}}>
                    <ReflectionForm/>
                </div>
            )}
            <div style={{height : "20px"}}></div>
            {RADIOS.map(ele =>{
                return(
                    <div>
                        <input type="radio" value={ele} name = "type" onChange={(e) => setRadio(e.target.value)}/>{ele}
                    </div>
                    
                )
            })}

            <br/>
            <input type="file" onChange={(e)=>setfile(e.target.files[0])}/>
            <button onClick={handleClick}>Upload</button><br/><br/>
            {view  && <button onClick={()=> {
                setData(!data)
            }}>view Results</button>}
            {data && (
                <input  onChange={(e)=>{
                    handleSearch(e.target.value)
                }}/>
            )}
            {data && answered.map(ele =>{
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
            {data && notAnswered.map(ele =>{
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
        <ToastContainer/>  
        
        </div> 
    )
}