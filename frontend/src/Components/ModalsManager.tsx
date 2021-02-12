import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';

import { Modal as IModal } from '../models/Modal';
import { useModals } from '../stateContainers/modals';

function Modal(props: IModal) {
  const { removeModal } = useModals();
  const handleCommit = async () => {
    await props.commit.handler();
    removeModal(props.id);
  };
  const handleCancel = async () => {
    await props.cancel.handler();
    removeModal(props.id);
  };
  return (
    <Dialog open={true} fullWidth maxWidth="xs" onClose={handleCancel}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>{props.content}</DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          {props.cancel.label}
        </Button>
        <Button onClick={handleCommit} color="secondary">
          {props.commit.label}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ModalsManager() {
  const { modals } = useModals();
  return (
    <div id="modals-manager">
      {modals.map((modal) => (
        <Modal key={modal.id} {...modal} />
      ))}
    </div>
  );
}
