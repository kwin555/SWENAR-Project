import React from "react";
import CustomersPage from "../CustomersPage";
import { shallow, mount } from "enzyme";
import axios from "axios";
import fetchMock from "fetch-mock";

import {URL} from '../CustomerConstants'

describe("CustomerPage tests", () => {
  it("shows customer page with things rendered", () => {
    const props = {
      customers: [{ Name: "Kevin", number: "23423" }],
    };

    const customersPage = shallow(<CustomersPage {...props} />);
    expect(customersPage).toMatchSnapshot();
  });

  it("should handleNumName", () => {
    const props = {
      customers: [{ id: 1, Name: "Kevin", number: "23423" }],
    };

    const customersPage = shallow(<CustomersPage {...props} />);

    customersPage.setState({
      customers: [{ id: 1, Name: "Kevin", number: "23423" }],
    });
    customersPage.instance().handleNumName("1234", "Zach");

    expect(customersPage.state().customers).toEqual([
      { id: 1, Name: "Kevin", number: "23423" },
      { id: 2, name: "Zach", number: "1234" },
    ]);
  });

  it("should return columns", () => {
    const props = {
      customers: [{ id: 1, Name: "Kevin", number: "23423" }],
      match: {
        params: 3,
      },
    };

    const customersPage = shallow(<CustomersPage {...props} />);

    const columns = customersPage.instance().columns();

    expect(columns[0].cellRenderer({ value: 3 }).toString()).toEqual(
        'http://localhost/customerpage/3'
    );
  });

  it("should return response", async () => {
    const props = {
      customers: [{ id: 1, Name: "Kevin", number: "23423" }],
      match: {
        params: 3,
      },
    };

    const customersPage = shallow(<CustomersPage {...props} />);

    fetchMock.get(URL, props.customers)


    jest.spyOn(axios, 'get');

    await customersPage.instance().fetchCustomers();

    expect(axios.get).toHaveBeenCalledWith(URL);
    expect(customersPage.state()).toEqual({customers: []});

  });
});
