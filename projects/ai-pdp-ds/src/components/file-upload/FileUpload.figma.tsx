import type { FileUploadProps } from './FileUpload';

/**
 * Code Connect placeholder. Master: fileUpload variants в AI-PDP-DS.
 * @see https://www.figma.com/design/i7T3ru2M0SyXgJeTda8f43/AI-PDP-DS?node-id=3392-28854
 */
export const figma = {
  nodeId: '3392:28854',
  props: {
    status: ['success', 'uploading', 'error'],
  } satisfies Record<keyof Pick<FileUploadProps, 'status'>, unknown>,
};
