import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import CustomerForm from './CustomerForm';
import { URL } from './CustomerConstants';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

const style = {
    height: '500px',
    width: '610px',
    justifyContent: 'center',
};

export class CustomersPage extends Component {
    static displayName = CustomersPage.name;
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
        };
    };

    fetchCustomers = () => {
        fetch(URL)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                this.setState({ customers: data })

            })
            .catch(error => {
                console.log(error);
            })
    }

    componentDidMount = () => {
        this.fetchCustomers();
        //console.log(this.state.customers);
    }

    componentDidUpdate = ({ customers: prevCustomers }) => {
        const { customers } = this.state;
        console.log(`prev customers ${prevCustomers}`, `current ${customers}`)
        // if(customers !== prevCustomers) {
        //   this.fetchCustomers();
        // }
    }

    handleNumName = (Num, Name) => {
        let customer = {
            id: this.state.customers[this.state.customers.length - 1].id + 1,
            name: Name,
            number: Num,
        }
        this.setState({
            customers: [...this.state.customers, customer]
        })
    }

    columns = [
        {
            field: "id",
            name: "ID",
            cellRenderer: (params) => {
                var link = document.createElement('a');
                link.href = '/customerpage/' + params.value;
                link.innerText = params.value;
                return link;
            }
        },
        { field: "name", name: "Name" },
        { field: "number", name: "Number" },
    ];

    render = () => {
        console.log(this.state.customers)
        return (
            <div>
                <div>
                    <h3>Customers</h3>
                    <CustomerForm handleNumName={this.handleNumName} />
                    <hr />
                </div>
                <div
                    className="ag-theme-balham"
                    style={style}>
                    <AgGridReact
                        columnDefs={this.columns}
                        rowData={this.state.customers}>
                    </AgGridReact>
                </div>
            </div>
        );
    }
};