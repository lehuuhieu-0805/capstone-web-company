import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField } from '@mui/material';
// components
import Iconify from './Iconify';

// ----------------------------------------------------------------------

TableToolbar.propTypes = {
  filterName: PropTypes.string,
  placeholder: PropTypes.string,
  onFilterName: PropTypes.func,

};

export default function TableToolbar({ filterName, onFilterName, placeholder }) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
