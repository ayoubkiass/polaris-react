import * as React from 'react';
import {noop} from '@shopify/javascript-utilities/other';
import {shallowWithAppProvider, mountWithAppProvider} from 'test-utilities';
import {Key} from '../../../types';
import Checkbox from '../Checkbox';

describe('<Checkbox />', () => {
  it('sets pass through properties on the input', () => {
    const input = shallowWithAppProvider(
      <Checkbox label="Checkbox" checked name="Checkbox" value="Some value" />,
    ).find('input');

    expect(input.prop('checked')).toBe(true);
    expect(input.prop('name')).toBe('Checkbox');
    expect(input.prop('value')).toBe('Some value');
  });

  it('does not change checked states when onChange is not provided', () => {
    const element = mountWithAppProvider(
      <Checkbox id="MyCheckbox" label="Checkbox" checked />,
    );
    element.simulate('click');
    expect(element.find('input').prop('checked')).toBe(true);
  });

  it('does not propagate click events from input element', () => {
    const spy = jest.fn();
    const element = mountWithAppProvider(
      <Checkbox id="MyCheckbox" label="Checkbox" onChange={spy} />,
    );

    element.find('input').simulate('click');
    expect(spy).not.toHaveBeenCalled();
  });

  describe('onChange()', () => {
    it('is called with the updated checked value of the input on click', () => {
      const spy = jest.fn();
      const element = mountWithAppProvider(
        <Checkbox id="MyCheckbox" label="Checkbox" onChange={spy} />,
      );
      (element.find('input') as any).instance().checked = true;
      element.simulate('click');
      expect(spy).toHaveBeenCalledWith(false, 'MyCheckbox');
    });

    it('is called when space is pressed', () => {
      const spy = jest.fn();
      const element = mountWithAppProvider(
        <Checkbox id="MyCheckbox" label="Checkbox" onChange={spy} />,
      );

      element.find('input').simulate('keyup', {
        keyCode: Key.Space,
      });

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('is not from keys other than space', () => {
      const spy = jest.fn();
      const element = mountWithAppProvider(
        <Checkbox id="MyCheckbox" label="Checkbox" onChange={spy} />,
      );

      element.find('input').simulate('keyup', {
        keyCode: Key.Enter,
      });

      expect(spy).not.toHaveBeenCalled();
    });

    it('sets focus on the input when checkbox is toggled off', () => {
      const checkbox = mountWithAppProvider(
        <Checkbox checked id="checkboxId" label="Checkbox" onChange={noop} />,
      );
      (checkbox.find('input') as any).instance().checked = false;
      checkbox.simulate('click');
      expect(checkbox.find('input').instance()).toBe(document.activeElement);
    });
  });

  describe('onFocus()', () => {
    it('is called when the input is focused', () => {
      const spy = jest.fn();
      const element = mountWithAppProvider(
        <Checkbox label="Checkbox" onFocus={spy} />,
      );
      element.find('input').simulate('focus');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onBlur()', () => {
    it('is called when the input is focused', () => {
      const spy = jest.fn();
      const element = mountWithAppProvider(
        <Checkbox label="Checkbox" onBlur={spy} />,
      );
      element.find('input').simulate('blur');
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('id', () => {
    it('sets the id on the input', () => {
      const id = shallowWithAppProvider(
        <Checkbox id="MyCheckbox" label="Checkbox" />,
      )
        .find('input')
        .prop('id');
      expect(id).toBe('MyCheckbox');
    });

    it('sets a random id on the input when none is passed', () => {
      const id = shallowWithAppProvider(<Checkbox label="Checkbox" />)
        .find('input')
        .prop('id');
      expect(typeof id).toBe('string');
      expect(id).toBeTruthy();
    });
  });

  describe('disabled', () => {
    it('sets the disabled attribute on the input', () => {
      const button = shallowWithAppProvider(
        <Checkbox label="Checkbox" disabled />,
      );
      expect(button.find('input').prop('disabled')).toBe(true);
    });

    it('is only disabled when disabled is explicitly set to true', () => {
      let element = shallowWithAppProvider(<Checkbox label="Checkbox" />);
      expect(element.find('input').prop('disabled')).toBeFalsy();

      element = shallowWithAppProvider(
        <Checkbox label="Checkbox" disabled={false} />,
      );
      expect(element.find('input').prop('disabled')).toBeFalsy();
    });
  });

  describe('helpText', () => {
    it('connects the input to the help text', () => {
      const checkbox = mountWithAppProvider(
        <Checkbox label="Checkbox" helpText="Some help" />,
      );
      const helpTextID = checkbox
        .find('input')
        .prop<string>('aria-describedby');
      expect(typeof helpTextID).toBe('string');
      expect(checkbox.find(`#${helpTextID}`).text()).toBe('Some help');
    });
  });

  describe('error', () => {
    it('marks the input as invalid', () => {
      const checkbox = shallowWithAppProvider(
        <Checkbox error={<span>Error</span>} label="Checkbox" />,
      );
      expect(checkbox.find('input').prop<string>('aria-invalid')).toBe(true);

      checkbox.setProps({error: 'Some error'});
      expect(checkbox.find('input').prop<string>('aria-invalid')).toBe(true);
    });

    it('connects the input to the error', () => {
      const checkbox = mountWithAppProvider(
        <Checkbox label="Checkbox" error="Some error" />,
      );
      const errorID = checkbox.find('input').prop<string>('aria-describedby');
      expect(typeof errorID).toBe('string');
      expect(checkbox.find(`#${errorID}`).text()).toBe('Some error');
    });

    it('marks the input as invalid but avoids rendering an error message when provided a boolean', () => {
      const checkbox = mountWithAppProvider(
        <Checkbox error={Boolean(true)} label="Checkbox" />,
      );
      const errorID = checkbox.find('input').prop<string>('aria-describedby');

      expect(checkbox.find('input').prop<string>('aria-invalid')).toBe(true);
      expect(typeof errorID).toBe('string');
      expect(checkbox.find(`#${errorID}`)).toHaveLength(0);
    });

    it('connects the input to both an error and help text', () => {
      const checkbox = mountWithAppProvider(
        <Checkbox label="Checkbox" error="Some error" helpText="Some help" />,
      );
      const descriptions = checkbox
        .find('input')
        .prop<string>('aria-describedby')
        .split(' ');
      expect(descriptions).toHaveLength(2);
      expect(checkbox.find(`#${descriptions[0]}`).text()).toBe('Some error');
      expect(checkbox.find(`#${descriptions[1]}`).text()).toBe('Some help');
    });
  });

  describe('indeterminate', () => {
    it('sets the indeterminate attribute to be true on the input when checked is "indeterminate"', () => {
      const checkbox = shallowWithAppProvider(
        <Checkbox label="Checkbox" checked="indeterminate" />,
      );
      expect(checkbox.find('input').prop<string>('indeterminate')).toBe('true');
    });

    it('sets the aria-checked attribute on the input as mixed when checked is "indeterminate"', () => {
      const checkbox = shallowWithAppProvider(
        <Checkbox label="Checkbox" checked="indeterminate" />,
      );
      expect(checkbox.find('input').prop<string>('aria-checked')).toBe('mixed');
    });

    it('sets the checked attribute on the input to false when checked is "indeterminate"', () => {
      const checkbox = shallowWithAppProvider(
        <Checkbox label="Checkbox" checked="indeterminate" />,
      );
      expect(checkbox.find('input').prop<string>('checked')).toBe(false);
    });
  });
});
