// ** MUI Imports
import { Theme } from '@mui/material';

// ** Overrides Imports
import MuiAccordion from './accordion';
import MuiAlerts from './alerts';
import MuiAppBar from './appBar';
import MuiAvatar from './avatars';
import MuiBackdrop from './backdrop';
import MuiButton from './button';
import MuiCard from './card';
import MuiChip from './chip';
import MuiDateTimePicker from './dateTimePicker';
import MuiDialog from './dialog';
import MuiDivider from './divider';
import MuiForm from './form';
import MuiInput from './input';
import MuiLink from './link';
import MuiList from './list';
import MuiMenu from './menu';
import MuiPagination from './pagination';
import MuiPaper from './paper';
import MuiPopover from './popover';
import MuiRating from './rating';
import MuiSelect from './select';
import MuiSnackbar from './snackbar';
import MuiSwitches from './switch';
import MuiTable from './table';
import MuiTabs from './tabs';
import MuiTextField from './textField';
import MuiTimeline from './timeline';
import MuiToggleButton from './toggleButton';
import MuiTooltip from './tooltip';
import MuiTypography from './typography';

const Overrides = (theme: Theme) => {
  const accordion = MuiAccordion(theme);
  const alerts = MuiAlerts(theme);
  const appBar = MuiAppBar(theme);
  const avatars = MuiAvatar(theme);
  const backdrop = MuiBackdrop(theme);
  const button = MuiButton(theme);
  const cards = MuiCard(theme);
  const chip = MuiChip(theme);
  const dateTimePicker = MuiDateTimePicker(theme);
  const dialog = MuiDialog(theme);
  const divider = MuiDivider(theme);
  const form = MuiForm(theme);
  const input = MuiInput(theme);
  const link = MuiLink(theme);
  const list = MuiList(theme);
  const menu = MuiMenu(theme);
  const pagination = MuiPagination(theme);
  const paper = MuiPaper(theme);
  const popover = MuiPopover(theme);
  const rating = MuiRating(theme);
  const select = MuiSelect(theme);
  const snackbar = MuiSnackbar(theme);
  const switches = MuiSwitches(theme);
  const tables = MuiTable(theme);
  const tabs = MuiTabs(theme);
  const textField = MuiTextField(theme);
  const timeline = MuiTimeline(theme);
  const toggleButton = MuiToggleButton(theme);
  const tooltip = MuiTooltip(theme);
  const typography = MuiTypography(theme);

  return {
    ...accordion,
    ...alerts,
    ...appBar,
    ...avatars,
    ...backdrop,
    ...button,
    ...cards,
    ...chip,
    ...dateTimePicker,
    ...dialog,
    ...divider,
    ...form,
    ...input,
    ...link,
    ...list,
    ...menu,
    ...pagination,
    ...paper,
    ...popover,
    ...rating,
    ...select,
    ...snackbar,
    ...switches,
    ...tables,
    ...tabs,
    ...textField,
    ...toggleButton,
    ...tooltip,
    ...timeline,
    ...typography,
  };
};

export default Overrides;
