import React, {useState} from 'react'

export default function TextArea(props) {

    const [childText, setChildText ] = useState("")

const textChanging = ()=>{
    
}
  return (
    <>
      <textArea
        className="rough-area form-control"
        rows="9"
        value={childText}
        onChange={textChanging}
      ></textArea>
    </>
  )
}
