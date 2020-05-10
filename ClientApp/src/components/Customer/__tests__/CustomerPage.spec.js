import React from 'react';
import CustomerPage from '../CustomerPage';
import { shallow } from 'enzyme';
import axios from 'axios';
import fetchMock from 'fetch-mock';
import mockAxios from 'axios-mock-adapter';

describe('CustomerPage tests', () => {
  it('shows customer page with things rendered', () => {
    const props = {
      Name: '',
      number: '',
      redirect: false,
      match: {
        params: 3,
      },
    };

    const wrapper = shallow(<CustomerPage {...props} />);
    expect(wrapper.instance()).not.toEqual(null);
  });

  it('should set customer state', () => {
    const props = {
      Name: '',
      number: '',
      redirect: false,
      match: {
        params: 3,
      },
    };

    const wrapper = shallow(<CustomerPage {...props} redirect={true} />);

    wrapper.instance().setCustomerData({ name: 'kevin', number: '1234' });

    expect(wrapper.state()).toEqual({
      Name: 'kevin',
      Number: '1234',
      redirect: false,
    });
  });

  it('should handle num and name  change', () => {
    const props = {
      Name: '',
      number: '',
      redirect: true,
      match: {
        params: 3,
      },
    };

    const wrapper = shallow(<CustomerPage {...props} redirect={true} />);

    wrapper.instance().handleNameNumberchange('kevin', '3234');

    expect(wrapper.state()).toEqual({
      Name: 'kevin',
      Number: '3234',
      redirect: false,
    });
  });

  it('should handle num and name  change', () => {
    const props = {
      Name: '',
      number: '',
      redirect: false,
      match: {
        params: 3,
      },
    };

    const wrapper = shallow(<CustomerPage {...props} />);
    fetchMock.delete('/api/customer/3', () => {
      return 200;
    });

    wrapper.instance().handleDelete();
    wrapper.setState({ redirect: true });

    expect(wrapper.state()).toEqual({
      Name: '',
      Number: '',
      redirect: true,
    });
  });

  it('should return response', async () => {
    const props = {
      customer: { Name: 'Kevin', number: '23423' },
      match: {
        params: 3,
      },
    };

    const customersPage = shallow(<CustomerPage {...props} />);
    var mock = new mockAxios(axios);

    mock.onGet('/api/customer/1').reply(200, {
      customers: props.customers,
    });

    jest.spyOn(axios, 'get');

    await customersPage.instance().fetchCustomer(1);
    customersPage
      .instance()
      .setCustomerData({ name: 'Kevin', number: '23423' });

    expect(axios.get).toHaveBeenCalledWith('/api/customer/1');
    expect(customersPage.state()).toEqual({
      Name: 'Kevin',
      Number: '23423',
      redirect: false,
    });
    customersPage.unmount();
  });

  it('should return delete response', async () => {
    const props = {
      customer: { Name: 'Kevin', number: '23423' },
      match: {
        params: 1,
      },
    };

    const customersPage = shallow(
      <CustomerPage {...props} match={{ params: { id: 1 } }} />
    );
    const mock = new mockAxios(axios);

    mock.onDelete('/api/customer/1').reply(200);

    jest.spyOn(axios, 'delete');

    await customersPage.instance().handleDelete();

    expect(axios.delete).toHaveBeenCalledWith('/api/customer/1');
    expect(customersPage.state()).toEqual({
      Name: undefined,
      Number: undefined,
      redirect: true,
    });
    customersPage.unmount();
  });

  it('should return error delete response', async () => {
    const props = {
      customer: { Name: 'Kevin', number: '23423' },
      match: {
        params: 1,
      },
    };

    const customersPage = shallow(
      <CustomerPage {...props} match={{ params: { id: 1 } }} />
    );
    const mock = new mockAxios(axios);

    mock.onDelete('/api/customer/1').timeout();

    jest.spyOn(axios, 'delete');

    await customersPage.instance().handleDelete();

    expect(axios.delete).toHaveBeenCalledWith('/api/customer/1');
    expect(customersPage.state()).toEqual({
      Name: '',
      Number: '',
      redirect: false,
      error: true,
    });
    customersPage.unmount();
  });
});
