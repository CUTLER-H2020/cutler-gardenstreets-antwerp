import { useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';

import { Modal } from '../models/Modal';

function useModalsHook() {
  const [modals, setModals] = useState<Modal[]>([]);

  const openModal = useCallback(
    (modal: Modal) => setModals((modals) => [...modals, modal]),
    [],
  );

  const removeModal = useCallback(
    (id: string) =>
      setModals((modals) => modals.filter((modal) => modal.id !== id)),
    [],
  );

  return {
    modals,
    openModal,
    removeModal,
  };
}

const container = createContainer(useModalsHook);
export const ModalsProvider = container.Provider;
export const useModals = container.useContainer;
