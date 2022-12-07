import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell } from '@mui/material';
//
import EmptyContent from '../EmptyContent';
import CustomNoRowsOverlay from '../CustomNoRowsOverlay';

// ----------------------------------------------------------------------

TableNoData.propTypes = {
  isNotFound: PropTypes.bool,
};

export default function TableNoData({ isNotFound }) {
  return (
    <TableRow>
      {isNotFound ? (
        <TableCell colSpan={12}>
                      <CustomNoRowsOverlay />   
        </TableCell>
      ) : (
        <TableCell colSpan={12} sx={{ p: 0 }}/>
           
        
      )}
    </TableRow>
  );
}
