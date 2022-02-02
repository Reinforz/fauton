import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import * as React from 'react';

interface DrawerProps {
  drawerItems: React.ReactNode[]
}

export default function Drawer(props: DrawerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const {drawerItems} = props;
  
  const toggleDrawer = (open: boolean, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsOpen(open);
  };

  return (
    <div>
      <MuiDrawer
        anchor={"right"}
        open={isOpen}
        onClose={event => toggleDrawer(false, event as any)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={(event) => toggleDrawer(false ,event)}
          onKeyDown={(event) => toggleDrawer(false ,event)}
        >
          {drawerItems}
        </Box>
      </MuiDrawer>
    </div>
  );
}
