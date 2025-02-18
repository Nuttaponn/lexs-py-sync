export interface ActionBar {
  hasBack?: boolean;
  backText?: string;
  hasCancel: boolean;
  cancelText?: string;
  hasSave: boolean;
  saveText?: string;
  hasReject: boolean;
  rejectText?: string;
  rejectIcon?: string;
  rejectNormalBtnStyle?: boolean;
  hasPrimary: boolean;
  primaryText?: string;
  primaryTextString?: string; // no translation pipe
  primaryIcon?: string;
  displayPrimaryTextString?: boolean;
  disabledPrimaryButton?: boolean;
  disabledCancelButton?: boolean;
  hasEdit?: boolean;
  editText?: string;
  editIcon?: string;
}

export interface ActionBarMeta extends ActionBar {
  hasEditButton?: boolean;
  editButtonText?: string;
  editButtonIcon?: string;
  cancelButtonIcon?: string;
}
