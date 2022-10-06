import React ,{useState ,useEffect}from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
const SearchData = () => {
    let [data,setData]=useState({})
    let {keyword}=useParams()
    console.log(keyword)
    useEffect(()=>{
        axios.get('http://localhost:5000/api/search',{params:{keyword}})
       .then(res=>{
          console.log(res.data)
       })

    },[])
  return (
    <div>searchData</div>
  )
}

export default SearchData