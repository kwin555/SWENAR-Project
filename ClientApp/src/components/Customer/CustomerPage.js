import React, { Component }from 'react';
import {withRouter, Redirect} from "react-router";
import {URL} from './CustomerConstants';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import CustomerFormEdit from './CustomerFormEdit';

const style = {
  display: 'flex',
  flexDirection: 'column',
  fontSize: '12px',
};

export class CustomerPage extends Component {
    static displayName = CustomerPage.name;
    constructor(props) {
        super(props);
        this.state = {
            Name: '',
            Number: '',
            redirect: false,
        };
    };
 
    componentDidMount = () => {
        const id = this.props.match.params.id;
        this.fetchCustomer(id);
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(prevState.Name !== this.state.Name || prevState.Number !== this.state.Number) {
            const id = this.props.match.params.id;
            this.fetchCustomer(id);
            console.log('hello');
        }
    }

    fetchCustomer = (id) => {
        console.log(id);
        fetch(`${URL}/${id}`)
          .then(res => res.json())
          .then((data) => {
              console.log(data);
              this.setState({
                Name: data.name,
                Number: data.number
            })
  
          })
          .catch(error => {
              console.log(error);
          })
      }
      handleNameNumberchange = (Name, Number) => {
          this.setState({
              Name,
              Number, 
          });
      }

      handleDelete = () => {
        let curr = this;
        const id = this.props.match.params.id;
        const axios = require('axios');
        axios.delete(`/api/customer/${id}`)
          .then(function (response) {
            console.log(response);
            curr.setState({redirect: true});
            console.log(this.state.redirect)
          })
          .catch(function (error) {
            console.log(error);
          });
      }
        
    render = () => {
        if(this.state.redirect) {
            return <Redirect push to='/customerspage' />;
        }
    
        return (
            <div  >
            <hr />
            <h1>Customer Page</h1>
            <div>
                <p>Customer Name: {this.state.Name}</p>
                <p>Customer Number: {this.state.Number}</p>
                
                <div style={style}>
                    <CustomerFormEdit id={this.props.match.params.id} handleNameNumberchange={this.handleNameNumberchange} />
                    <button onClick={this.handleDelete}>Delete</button>
                </div>
            </div>
            
          </div>
        );
    }
};

export default withRouter(CustomerPage)