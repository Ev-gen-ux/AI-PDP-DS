// url=https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3628-364
// source=src/components/input-password/InputPassword.tsx
// component=InputPassword
import figma from 'figma';
const instance = figma.selectedInstance;

// Local template only; parsing does not publish a connection.
const state = instance.getEnum(':state', {
  enabled: 'enabled',
  hover: 'hover',
  focus: 'focus',
  value: 'value',
  invalid: 'invalid',
  disabled: 'disabled',
});
const invalid = instance.getEnum('inValid', { false: false, true: true });
const visible = instance.getEnum('Visibility', { hidden: false, visible: true });
const placeholder = instance.getString('Placeholder');
const value = instance.getString('Password value');
const labelText = instance.findText('labelTextContent');
const label = labelText.type === 'TEXT' ? labelText.textContent : 'Password';
const messageText = instance.findText('textMessage');
const message =
  instance.getBoolean('helpMessage') && messageText.type === 'TEXT' ? messageText.textContent : '';

export default {
  id: 'ai-pdp-input-password',
  imports: ['import { InputPassword } from "@evgeni_design_84/ai-pdp-ds"'],
  example: figma.code`<InputPassword
  label="${label}"
  placeholder="${placeholder}"
  defaultValue="${state === 'value' || state === 'invalid' ? value : ''}"
  ${visible ? 'defaultVisible' : ''}
  ${state === 'disabled' ? 'disabled' : ''}
  ${invalid ? 'invalid' : ''}
  ${state === 'value' ? 'success' : ''}
  helpMessage="${invalid ? '' : message}"
  errorMessage="${invalid ? message : ''}"
/>`,
  metadata: { nestable: true },
};
