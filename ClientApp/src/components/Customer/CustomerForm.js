import React, { Component } from 'react';
import axios from 'axios';

class CustomerForm extends Component {
  //store default state of application
  constructor(props) {
    super(props);

    this.state = {
      Name: '',
      number: '',
      error: false,
    };
  }
  // call to handle the value in a text input
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  //call to create a new customer
  submitToPost = async () => {
    let curr = this;

    const { Name, number } = this.state;
    try {
      await axios.post(`/api/customer`, {
        Name: Name,
        Number: number,
      });
      curr.props.handleNumName(number, Name);
    } catch (error) {
      this.setState({ error: true });
    }
  };

  render = () => {
    return (
      <div>
        <form>
          <label htmlFor="Name">Enter name: </label>
          <input id="Name" name="Name" type="text" onChange={this.onChange} />

          <label htmlFor="Number">Enter customer number:</label>
          <input
            id="number"
            name="number"
            type="text"
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
