import type { Theme, ThemeOptions, ThemeProviderProps } from '@mui/material';

import { useMemo } from 'react';

import { createTheme, CssBaseline } from '@mui/material';
import { ThemeProvider as ThemeVarsProvider } from '@mui/material/styles';

import { shape, shadows, typography, colorSchemes } from './theme-primitives';
import {
  defaultProps,
  inputsCustomizations,
  feedbackCustomizations,
  surfacesCustomizations,
  dataGridCustomizations,
  treeViewCustomizations,
  navigationCustomizations,
  dataDisplayCustomizations,
} from './overrides';

// -----------------------------------------------------------------------------

export type Props = Omit<ThemeProviderProps, 'theme'> & {
  theme?: Theme;
};

export function ThemeProvider({ children, ...other }: Props) {
  const memoizedValue = useMemo(
    () =>
      ({
        cssVariables: {
          colorSchemeSelector: 'data-bank-thing-theme',
          cssVarPrefix: 'bank-thing',
        },
        colorSchemes,
        typography,
        shadows,
        shape,
        components: {
          ...defaultProps,
          ...inputsCustomizations,
          ...dataDisplayCustomizations,
          ...feedbackCustomizations,
          ...navigationCustomizations,
          ...surfacesCustomizations,
          ...dataGridCustomizations,
          ...treeViewCustomizations,
        },
      }) as ThemeOptions,
    []
  );

  const themeObj = createTheme(memoizedValue);

  return (
    <ThemeVarsProvider disableTransitionOnChange theme={themeObj} defaultMode={'light'} {...other}>
      <CssBaseline />
      {children}
    </ThemeVarsProvider>
  );
}
