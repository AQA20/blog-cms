export interface InputDialog {
  name: string;
  type: 'text' | 'textArea';
  placeholder: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
}
