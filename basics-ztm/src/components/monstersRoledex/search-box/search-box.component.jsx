import { Component } from "react";
import './search-box.styles.css'

class SearchBox extends Component {
  render() {
return(

    <input
    className={this.props.className}
    type='search'
    placeholder={this.props.placeholder}
    onChange={this.props.onSearchChange}
  />
)
  }
}

export default SearchBox;//NAMING OF COMPONENT SHOULD BE CAPITAL FROM START & A CAMEL CASE
