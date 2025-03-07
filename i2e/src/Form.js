import React, { useState, useEffect } from "react";
import TextArea from "./TextArea";


export default function Form() {
  const [text, setText] = useState("");



//   useEffect(()=>{
//     first

//     return()=>{
//         secound
//     }
//   }, [third])

  const onPressing = () => {
    setText(text.toUpperCase());
  };
  return (
    <section>
      <label>Add Data</label>
      {/* <textArea
        className="rough-area form-control"
        rows="9"
        value={text}
        onChange={textChanging}
      ></textArea> */}
      {/* <TextArea text={text} textChanging={textChanging}/> */}
      {/* the above line of code is also working */}
      <TextArea text={text}/>
      <button onClick={onPressing}>Trigger the event</button>
      <label>UpperCased Text {text}</label>

      <label>Words   {text.split(" ").length}</label>
      
      <label>Characters {text.length}</label>
    </section>
  );
}

/**
 text field(all fields) was initally in the same file only 
 but for explanation purpose 
 text field is made as a child component 

 - yes we can modify the prop by passing the chaning functing from the parent

 dependency value (there 3 arguments to the use-effect)
 if you put the state value in as 3rd argument 
it will keep on going in infinite loop
as the useEffect is executed if there is any change

  useEffect(()=>{
//     first

//     return()=>{
//         secound
//     }
//   }, [third])

so the secound will be executed when component is dismouting/disconnecting

routing explained how it is done by simply importing the browerRouter

 */
