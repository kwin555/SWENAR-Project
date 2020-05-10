import React from 'react';
import CustomerFormEdit from '../CustomerFormEdit';
import { shallow } from 'enzyme';
import axios from 'axios';
import mockAxios from 'axios-mock-adapter';

describe('CustomerForm tests', () => {
  it('shows customer forms with things rendered', () => {
    const props = {
      Name: '',
      number: '',
    };
    const wrapper = shallow(<CustomerFormEdit {...props}></CustomerFormEdit>);
    expect(wrapper).toMatchSnapshot();
  });

  it('Should call setState on input', () => {
    const mockChange = {
      target: {
        name: 'input',
        value: 'test 123',
      },
    };

    const expected = {
      Name: '',
      number: '',
      input: 'test 123',
      error: undefined,
    };

    const props = {
      Name: '',
      number: '',
    };

    const wrapper = shallow(<CustomerFormEdit {...props} />);

    wrapper.instance().onChange(mockChange);

    expect(wrapper.state()).toEqual(expected);
  });

  it('should return put response', async () => {
    const props = {
      customer: { Name: 'Kevin', number: '23423' },
      match: {
        params: 1,
      },
      id: 1,
      handleNameNumberchange: jest.fn(),
    };

    const customersPage = shallow(
      <CustomerFormEdit {...props} match={{ params: { id: 1 } }} />
    );
    customersPage.setState({ Name: 'Kevin', number: '23423' });
    const mock = new mockAxios(axios);

    mock
      .onPut('/api/customer/1')
      .reply(200, { id: 1, Name: 'Kevin', Number: '23423' });

    jest.spyOn(axios, 'put');

    await customersPage.instance().submitToPUT();

    expect(axios.put).toHaveBeenCalledWith('/api/customer/1', {
      Name: 'Kevin',
      Number: '23423',
      id: 1,
    });
    expect(props.handleNameNumberchange).toHaveBeenCalled();
    customersPage.unmount();
  });

  it('should return error put response', async () => {
    const props = {
      customer: { Name: 'Kevin', number: '23423' },
      match: {
        params: 1,
      },
      id: 1,
      handleNameNumberchange: jest.fn(),
    };

    const customersPage = shallow(
      <CustomerFormEdit {...props} match={{ params: { id: 1 } }} />
    );
    customersPage.setState({ Name: 'Kevin', number: '23423' });
    const mock = new mockAxios(axios);

    mock.onPut('/api/customer/1').timeout();

    jest.spyOn(axios, 'put');

    await customersPage.instance().submitToPUT();

    expect(axios.put).toHaveBeenCalledWith('/api/customer/1', {
      Name: 'Kevin',
      Number: '23423',
      id: 1,
    });
    expect(customersPage.state()).toEqual({
      error: true,
      Name: 'Kevin',
      number: '23423',
    });
    expect(props.handleNameNumberchange).toHaveBeenCalled();
    customersPage.unmount();
  });
});
