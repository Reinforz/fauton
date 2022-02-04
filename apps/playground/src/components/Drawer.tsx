import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import * as React from 'react';
import { DrawerContext } from '../contexts/Drawer';

interface DrawerProps {
  drawerContent: React.ReactNode
}

export default function Drawer(props: DrawerProps) {
  const {drawerContent} = props;
  const {isDrawerOpen, setIsDrawerOpen} = React.useContext(DrawerContext);
  
  const toggleDrawer = (open: boolean, event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsDrawerOpen(open);
  };

  return (
    <MuiDrawer
      anchor={"right"}
      open={isDrawerOpen}
      onClose={event => toggleDrawer(false, event as any)}
      sx={{
        p: 1
      }}
    >
      <Box
        sx={{
          width: 250,
        }}
        onClick={(event) => toggleDrawer(false ,event as unknown as React.KeyboardEvent<HTMLDivElement>)}
        onKeyDown={(event) => toggleDrawer(false ,event)}
      >
        {drawerContent}
      </Box>
    </MuiDrawer>
  );
}
