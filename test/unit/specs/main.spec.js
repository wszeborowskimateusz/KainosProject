import { mount } from '@vue/test-utils';
import Main from './../../../src/components/Main';

describe('Main', () => {
  it('should render the title correctly', () => {
    const wrapper = mount(Main);
    expect(wrapper.find('.display-4.text-center.p-2').text()).toEqual(
      'Select echange currencies'
    );
  });

  it('should render the title correctly', () => {
    const wrapper = mount(Main);
    wrapper.setData({
        areTrendLinesShown: false,
    });
    let checkbox = wrapper.find('input[type="checkbox"]');
    console.log(checkbox);
    expect(checkbox).not.toHaveProperty('checked');
  });
});