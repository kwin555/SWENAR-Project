import React, {Component} from 'react';

class CustomerFormEdit extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            Name: '',
            number: '',
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
        const {Name, number} = this.state
        console.log(Name, number);
    }

    submitToPUT = () => {  
        let {id} = this.props;
        id = parseInt(id);
        const axios = require('axios');
        const {Name, number} = this.state;
        this.props.handleNameNumberchange(Name, number);
        console.log(Name, number)
        axios.put(`/api/customer/${id}`, {
            id,
            Name,
            Number: number,
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
    }

    render = () => {
        return (
            <div>
                <form >
                    <label htmlFor="Name">Enter new name: </label>
                    <input id="Name" name="Name" type="text" onChange={this.onChange} />

                    <label htmlFor="Number">Enter new number:</label>
                    <input id="number" name="number" type="text" onChange={this.onChange} />
                </form>
                <div>
                    <button onClick={this.submitToPUT}>Submit</button>
                </div>
            </div>
            
        );
    }
}

export default CustomerFormEdit;