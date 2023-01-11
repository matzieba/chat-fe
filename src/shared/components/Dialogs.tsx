import React from 'react';

import { DialogContext } from '@cvt/contexts';

import { Authenticated } from '@modules/Auth/components';
import { InviteTeamMemberDialog } from '@modules/Users/dialogs/InviteTeamMember';

export const Dialogs = () => {
  const { openedDialogs, closeDialog } = React.useContext(DialogContext);
  return (
    <React.Fragment>
      <Authenticated>
        <InviteTeamMemberDialog open={!!openedDialogs['inviteTeamMember']} onClose={() => closeDialog('inviteTeamMember')} />
      </Authenticated>
    </React.Fragment>
  );
};
