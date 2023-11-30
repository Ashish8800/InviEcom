import PropTypes from 'prop-types';
// @mui
import {
  Badge,
} from '@mui/material';
// utils
// _mock_
import { _notifications } from '../../../_mock/arrays';
// components
import Iconify from '../../../components/iconify';
import { IconButtonAnimate } from '../../../components/animate';
import { Link as RouterLink } from 'react-router-dom';
import { PATH_CUSTOMER } from '../../../routes/paths';
// ----------------------------------------------------------------------
CartWidgetPopover.propTypes = {
  totalItems: PropTypes.number,
};
export default function CartWidgetPopover({ totalItems }) {
  return (
    <>
    <RouterLink to={PATH_CUSTOMER.cart.root}>
      <IconButtonAnimate
      
        sx={{ width: 40, height: 40 }}
      >
        <Badge showZero badgeContent={totalItems} color="error" max={99}>
          <Iconify icon="eva:shopping-cart-fill" width={28} sx={{color: "#00AB55" }}/>
        </Badge>
      </IconButtonAnimate>

      </RouterLink>
    </>
  );
}

// ----------------------------------------------------------------------

