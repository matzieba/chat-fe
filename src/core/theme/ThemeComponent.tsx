import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';

import GlobalStyling from '@shared/theme/globalStyles';
import themeOptions from '@shared/theme/ThemeOptions';
import overrides from '@shared/theme/overrides';
import typography from '@shared/theme/typography';

type Props = React.PropsWithChildren<{
  settings: CVT.Theme.Settings;
}>;

export const ThemeComponent: React.FC<Props> = ({ settings, children }) => {

  // ** Merged ThemeOptions of Core and User
  const coreThemeConfig = themeOptions(settings);

  // ** Pass ThemeOptions to CreateTheme Function to create partial theme without component overrides
  let theme = createTheme(coreThemeConfig);

  // ** Continue theme creation and pass merged component overrides to CreateTheme function
  theme = createTheme(theme, {
    components: { ...overrides(theme) },
    typography: { ...typography(theme) },
  });

  // ** Set responsive font sizes
  theme = responsiveFontSizes(theme);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles styles={GlobalStyling(theme)} />
      {children}
    </ThemeProvider>
  );
};
