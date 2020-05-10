import React from 'react';
import CustomerForm from '../CustomerForm';
import { shallow } from 'enzyme';
import axios from 'axios';
import mockAxios from 'axios-mock-adapter';

describe('CustomerForm tests', () => {
  it('shows customer forms with things rendered', () => {
    const props = {
      Name: '',
      number: '',
    };
    const wrapper = shallow(<CustomerForm {...props}></CustomerForm>);
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
      error: false,
    };

    const props = {
      Name: '',
      number: '',
    };

    const wrapper = shallow(<CustomerForm {...props} />);

    wrapper.instance().onChange(mockChange);

    expect(wrapper.state()).toEqual(expected);
  });

  it('should return post response', async () => {
    const props = {
      customer: { Name: 'Kevin', number: '23423' },
      match: {
        params: 1,
      },
      id: 1,
      handleNumName: jest.fn(),
    };

    const customersPage = shallow(
      <CustomerForm {...props} match={{ params: { id: 1 } }} />
    );
    customersPage.setState({ Name: 'Kevin', number: '23423' });
    const mock = new mockAxios(axios);

    mock.onPost('/api/customer').reply(200, { Name: 'Kevin', Number: '23423' });

    jest.spyOn(axios, 'post');

    await customersPage.instance().submitToPost();

    expect(axios.post).toHaveBeenCalledWith('/api/customer', {
      Name: 'Kevin',
      Number: '23423',
    });
    expect(props.handleNumName).toHaveBeenCalled();
    customersPage.unmount();
  });

  it('should return error post response', async () => {
    const props = {
      customer: { Name: 'Kevin', number: '23423' },
      match: {
        params: 1,
      },
      id: 1,
      handleNumName: jest.fn(),
    };

    const customersPage = shallow(
      <CustomerForm {...props} match={{ params: { id: 1 } }} />
    );
    customersPage.setState({ Name: 'Kevin', number: '23423' });
    const mock = new mockAxios(axios);

    mock.onPost('/api/customer').timeout();

    jest.spyOn(axios, 'post');

    await customersPage.instance().submitToPost();

    expect(axios.post).toHaveBeenCalledWith('/api/customer', {
      Name: 'Kevin',
      Number: '23423',
    });
    expect(customersPage.state()).toEqual({
      error: true,
      Name: 'Kevin',
      number: '23423',
    });
    customersPage.unmount();
  });
});
