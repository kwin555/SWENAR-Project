import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';

export class CustomerPage extends Component {
    static displayName = CustomerPage.name;
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
        };
    };

    componentDidMount = () => {
        const url = "https://localhost:44375/api/customer";
        fetch(url)
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                this.setState({ customers: data })

            })
            .catch(error => {
                console.log(error);
            })
        //console.log(this.state.customers);
    }

    columns = [
        { field: "id", name: "ID" },
        { field: "name", name: "Name" },
        { field: "number", name: "Number" },
    ];

    render = () => {
        console.log(this.state.customers)
        return (
            <div
                className="ag-theme-balham"
                style={{
                    height: '500px',
                    width: '600px'
                }}>

                <AgGridReact
                    columnDefs={this.columns}
                    rowData={this.state.customers}>
                </AgGridReact>
            </div>
        );
    }
};