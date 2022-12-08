import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
// @mui
import {
  Grid,
  TextField,
  TableRow,
  TableCell,
  Typography,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  Tooltip,
  IconButton,
} from '@mui/material';
// components
import Iconify from '../../../components/Iconify';
import { TableMoreMenu } from '../../../components/table';
import { api } from '../../../constants';
// ----------------------------------------------------------------------

EmployeeTableRow.propTypes = {
  row: PropTypes.object,

  onDeleteRow: PropTypes.func,

};

export default function EmployeeTableRow({ row, onDeleteRow }) {
  const token = localStorage.getItem('token');
  // const { id, name } = row;

  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const handleCloseDialogDelete = () => {
    setOpenDialogDelete(false);
    handleDeleteRow();
  };

  // console.log(row.id)
  const handleDeleteRow = () => {
    axios({
      url: `https://stg-api-itjob.unicode.edu.vn/api/v1/employees/${row.id}`,
      method: 'delete',
      headers: {
        Authorization: `Bearer ${token}`
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <TableRow hover >


      <TableCell align="left">{row.No}</TableCell>
      <TableCell align="left">{row.name}</TableCell>
      <TableCell align="left">{row.email}</TableCell>
      <TableCell align="left">{row.phone}</TableCell>

      <TableCell align="left">

        {/* <Tooltip title="Xoá">
          <IconButton
            onClick={() => {
              setOpenDialogDelete(true);
            }}
            color="error"
          >
            <Iconify icon={'mdi:trash-can-circle'} color="error" />
          </IconButton>
        </Tooltip> */}
        <Button variant='outlined' color='error' onClick={() => {
          setOpenDialogDelete(true);
        }}>Xoá</Button>
      </TableCell>

      <Dialog
        open={openDialogDelete}
        onClose={handleCloseDialogDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">Bạn có chắc chắn muốn xoá tài khoản  "{row.name}" ra khỏi công ty ?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialogDelete} variant="outlined">
            Huỷ
          </Button>
          <Button
            onClick={() => {
              onDeleteRow();
              handleCloseDialogDelete();
            }}
            variant="contained"
            color="primary"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}
