import { createMuiTheme } from '@material-ui/core/styles';
import { blue, deepOrange } from '@material-ui/core/colors';

const THEME = createMuiTheme({
  palette: {
    primary: blue,
    secondary: deepOrange,
  },
});

export default THEME;
