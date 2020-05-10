import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import CustomerFormEdit from './CustomerFormEdit';
import { InvoicePage } from '../Invoice/InvoicePage';
import axios from 'axios';

//default style of the page
const style = {
  display: 'flex',
  flexDirection: 'column',
  fontSize: '12px',
};

export default class CustomerPage extends Component {
  static displayName = CustomerPage.name;
  //the default state of the app being no customer name, number and redirect being false
  constructor(props) {
    super(props);
    this.state = {
      Name: '',
      Number: '',
      redirect: false,
    };
  }

  //if a page refresh or load takes place fetch a customer by id
  componentDidMount = () => {
    const id = this.props.match.params.id;
    this.fetchCustomer(id);
  };

  //if a customer property updateds update the field
  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevState.Name !== this.state.Name ||
      prevState.Number !== this.state.Number
    ) {
      const id = this.props.match.params.id;
      this.fetchCustomer(id);
    }
  };

  setCustomerData({ name, number }) {
    this.setState({
      Name: name,
      Number: number,
    });
  }

  //network fetch to the single customer end point
  fetchCustomer = async (id) => {
    try {
      const response = await axios.get(`/api/customer/${id}`);
      this.setCustomerData(response.data);
    } catch (error) {
      this.setState({ error: true });
    }
  };

  //updates the state of name and number
  handleNameNumberchange = (Name, Number) => {
    this.setState({
      Name,
      Number,
    });
  };

  //makes a network call to delete customer information
  handleDelete = async () => {
    let curr = this;
    const id = this.props.match.params.id;

    try {
      await axios.delete(`/api/customer/${id}`);
      curr.setState({ redirect: true });
    } catch (error) {
      this.setState({ error: true });
    }
  };

  render = () => {
    //if you delete a customer send you back to the customers page
    if (this.state.redirect) {
      return <Redirect push to="/customerspage" />;
    }
    const { id } = this.props.match.params;

    // render out the customer page
    return (
      <div>
        <hr />
        <h1>Customer Page</h1>
        <div>
          <p>Customer Name: {this.state.Name}</p>
          <p>Customer Number: {this.state.Number}</p>

          <div style={style}>
            <CustomerFormEdit
              id={id}
              handleNameNumberchange={this.handleNameNumberchange}
            />
            <button onClick={this.handleDelete}>Delete</button>
          </div>
          <InvoicePage id={id} />
        </div>
      </div>
    );
  };
}

withRouter(CustomerPage);
