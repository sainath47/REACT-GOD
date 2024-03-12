import React, { Component } from 'react'
import logo from "../logo.svg";
import "../App.css";

class StateBasics extends Component{
    constructor() {
        super();
    
        this.state = {
          name: {firstname: "Godly" ,lastname:"Sai"}
        };
      }
      render() {
        return (
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>Hi {this.state.name.firstname} {this.state.name.lastname}</p>
              <button
                style={{ padding: "40px", fontSize: "40px" }}
                onClick={() => {
                  // this.state.name = "simple Sainath";
                  // this.state ={ name: "simple Sainath"};
                  // console.log(this.state)
                  // the above methods do change the state as you console log you can see but the render doesnt happen, since the state object is still the same & re-render didnt happen
                  // this.setState({name:'simple Sainath'})
                  //the set state is a shallow merge
                  // this.setState((state, props)=>{
                  //   return {
                  //     name: {
                  //       firstname: 'godly',
                  //       lastname:'sainath'
                  //     }
                  //   }
                  // })
                  // the above method setstate is passed with function cause like this we can use 'props' & 'state' both
                  // this.setState(() => {
                  //   return {
                  //     name: {
                  //       firstname: "godly",
                  //       lastname: "sainath",
                  //     }
                  //   };
                  // },
                  // ()=> {
                  //   console.log(this.state)
                  // }
                  // //the console callback above will be only executed when state is fully updated
                  // );
                  // <button
                  // style={{ padding: "40px", fontSize: "40px" }}
                  // onClick={() => {
                    // this.state.name = "simple Sainath";
                    // this.state ={ name: "simple Sainath"};
                    // console.log(this.state)
                    // the above methods do change the state as you console log you can see but the render doesnt happen, since the state object is still the same & re-render didnt happen
                    // this.setState({name:'simple Sainath'})
                    //the set state is a shallow merge
                    // this.setState((state, props)=>{
                    //   return {
                    //     name: {
                    //       firstname: 'godly',
                    //       lastname:'sainath'
                    //     }
                    //   }
                    // })
                    // the above method setstate is passed with function cause like this we can use 'props' & 'state' both
                    this.setState(() => {
                      return {
                        name: {
                          firstname: "godly",
                          lastname: "sainath",
                        }
                      };
                    },
                    ()=> {
                      console.log(this.state)
                    }
                    //the console callback above will be only executed when state is fully updated
                    );
                  }}
                >
                  Change Name
                </button>
                
       
            </header>
          </div>
        );
      }
}

export default StateBasics