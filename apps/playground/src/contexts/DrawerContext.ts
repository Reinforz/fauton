import React, { Dispatch, SetStateAction } from 'react';

interface IDrawerContext {
  isDrawerOpen: boolean
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>
}

export const DrawerContext = React.createContext<IDrawerContext>({} as IDrawerContext);
