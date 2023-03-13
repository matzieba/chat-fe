import React from 'react';
import {
  Avatar,
  Box,
  Chip,
  Grid,
} from '@mui/material';

export type Props = React.HTMLAttributes<HTMLLIElement> & {
  user: Users.User;
  showPosition?: boolean;
};

export const UserSelectOption: React.FC<Props> = ({ user: { displayName, jobTitle, profilePicture }, showPosition = true, ...props }) => (
  <Box component="li" {...props}>
    <Grid container spacing={1} wrap="nowrap" sx={{ overflow: 'hidden' }}>
      <Grid item>
        <Avatar alt={displayName} src={profilePicture} sx={{ width: 24, height: 24 }}/>
      </Grid>
      <Grid item>
        {displayName}
      </Grid>
      <Box ml="auto"/>
      {showPosition && jobTitle && (
        <Grid item>
          <Chip
            size="small"
            label={jobTitle}
          />
        </Grid>
      )}
    </Grid>
  </Box>
);
