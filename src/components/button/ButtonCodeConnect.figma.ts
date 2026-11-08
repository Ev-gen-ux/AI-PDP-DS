// url=https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=205-3332
// source=src/components/button/Button.tsx
// component=Button
import figma from 'figma';
const instance = figma.selectedInstance;

const appearance = instance.getEnum('apperance', {
  primary: 'primary',
  outline: 'outline',
  flat: 'flat',
});
const size = instance.getEnum('size', {
  'large (48px)': 'large',
  'medium (40px)': 'medium',
  'small (32px)': 'small',
});
const disabled = instance.getEnum('isDisabled', { false: false, true: true });
const loading = instance.getEnum('isLoading', { false: false, true: true });
// Hover, active and focus are native interactions, not public Button props.
const disabledState = instance.getEnum(':state', {
  enabled: false,
  hover: false,
  active: false,
  focus: false,
  disabled: true,
});
const text = instance.getString('✏️labelTextContent');
const before = instance.getBoolean('iconBefore') ? instance.getInstanceSwap('VALiconBefore') : null;
const after = instance.getBoolean('iconAfter') ? instance.getInstanceSwap('VALiconAfter') : null;
let beforeCode;
let afterCode;
if (before && before.type === 'INSTANCE') beforeCode = before.executeTemplate().example;
if (after && after.type === 'INSTANCE') afterCode = after.executeTemplate().example;

export default {
  id: 'ai-pdp-button',
  imports: ['import { Button } from "@ev-gen-ux/ai-pdp-ds"'],
  example: figma.code`<Button
  appearance="${appearance}"
  size="${size}"
  text="${text}"
  ${disabled || disabledState ? 'disabled' : ''}
  ${loading ? 'loading' : ''}
  ${beforeCode ? figma.code`iconBefore={${beforeCode}}` : ''}
  ${afterCode ? figma.code`iconAfter={${afterCode}}` : ''}
/>`,
  metadata: { nestable: true },
};
