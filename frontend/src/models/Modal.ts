export interface Modal {
  id: string;
  title: string;
  content: string;
  commit: {
    label: string;
    handler: () => void;
  };
  cancel: {
    label: string;
    handler: () => void;
  };
}
