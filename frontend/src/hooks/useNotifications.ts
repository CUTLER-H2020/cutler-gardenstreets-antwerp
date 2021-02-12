import { useSnackbar, SharedProps } from 'notistack';
import { ReactNode } from 'react';

interface Notification {
  key?: string;
  type: SharedProps['variant'];
  message: ReactNode;
  persist?: boolean;
}

function useNotifications() {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const enqueueNotification = ({
    key,
    type,
    message,
    persist = false,
  }: Notification) =>
    enqueueSnackbar(message, {
      key,
      variant: type,
      anchorOrigin: { vertical: 'top', horizontal: 'center' },
      persist,
    });

  const removeNotification = (key: string) => closeSnackbar(key);

  return {
    enqueueNotification,
    removeNotification,
  };
}

export default useNotifications;
