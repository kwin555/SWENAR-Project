import React from 'react';
import { InvoicePage } from '../InvoicePage';
import { shallow } from 'enzyme';
import axios from 'axios';
import mockAxios from 'axios-mock-adapter';
import { URL } from '../InvoiceConstants';

describe('Invoice Page tests', () => {
  it('shows customer forms with things rendered', () => {
    const props = { invoice: [] };
    const wrapper = shallow(<InvoicePage {...props}></InvoicePage>);
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });

  it('should return response', async () => {
    const props = {
      customer: { Name: 'Kevin', number: '23423' },
      match: {
        params: 3,
      },
      id: 1,
    };

    const invoicePage = shallow(<InvoicePage {...props} />);
    var mock = new mockAxios(axios);

    mock.onGet(`${URL}/1`).reply(200, props.customer);

    jest.spyOn(axios, 'get');

    await invoicePage.instance().fetchInvoice();

    expect(axios.get).toHaveBeenCalledWith(
      'https://localhost:44375/api/Invoice/GetInvoiceByCustomerId/1'
    );
    expect(invoicePage.state()).toEqual({
      invoice: props.customer,
    });
    invoicePage.unmount();
  });

  it('should return error response', async () => {
    const props = {
      customer: { Name: 'Kevin', number: '23423' },
      match: {
        params: 3,
      },
      id: 1,
    };

    const invoicePage = shallow(<InvoicePage {...props} />);
    var mock = new mockAxios(axios);

    mock.onGet(`${URL}/1`).timeout();

    jest.spyOn(axios, 'get');

    await invoicePage.instance().fetchInvoice();

    expect(axios.get).toHaveBeenCalledWith(
      'https://localhost:44375/api/Invoice/GetInvoiceByCustomerId/1'
    );
    expect(invoicePage.state()).toEqual({
      invoice: props.customer,
      error: true,
    });
    invoicePage.unmount();
  });
});
