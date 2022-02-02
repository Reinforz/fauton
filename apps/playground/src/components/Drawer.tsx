import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import * as React from 'react';
import { DrawerContext } from '../contexts/Drawer';

interface DrawerProps {
  drawerItems: React.ReactNode[]
}

export default function Drawer(props: DrawerProps) {
  const {drawerItems} = props;
  
  const {isDrawerOpen, setIsDrawerOpen} = React.useContext(DrawerContext);
  
  const toggleDrawer = (open: boolean, event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsDrawerOpen(open);
  };

  return (
    <div>
      <MuiDrawer
        anchor={"right"}
        open={isDrawerOpen}
        onClose={event => toggleDrawer(false, event as any)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={(event) => toggleDrawer(false ,event as unknown as React.KeyboardEvent<HTMLDivElement>)}
          onKeyDown={(event) => toggleDrawer(false ,event)}
        >
          {drawerItems}
        </Box>
      </MuiDrawer>
    </div>
  );
}
