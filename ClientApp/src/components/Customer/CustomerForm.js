import React, { Component } from "react";
import { URL } from "./CustomerConstants";

class CustomerForm extends Component {
  //store default state of application
  constructor(props) {
    super(props);

    this.state = {
      Name: "",
      number: ""
    };
  }
  // call to handle the value in a text input
  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
    const { Name, number } = this.state;
    console.log(Name, number);
  };

  //call to create a new customer
  submitToPost = () => {
    let curr = this;
    const axios = require("axios");
    const { Name, number } = this.state;
    axios
      .post("/api/customer", {
        Name: Name,
        Number: number
      })
      .then(function(response) {
        console.log(response);
        curr.props.handleNumName(number, Name);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render = () => {
    return (
      <div>
        <form>
          <label htmlFor='Name'>Enter name: </label>
          <input id='Name' name='Name' type='text' onChange={this.onChange} />

          <label htmlFor='Number'>Enter customer number:</label>
          <input
            id='number'
            name='number'
            type='text'
            onChange={this.onChange}
          />
        </form>
        <div>
          <button onClick={this.submitToPost}>Add</button>
        </div>
      </div>
    );
  };
}

export default CustomerForm;
