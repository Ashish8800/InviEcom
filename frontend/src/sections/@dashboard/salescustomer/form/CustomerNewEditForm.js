import PropTypes from "prop-types";
// form
// @mui
import { Card } from "@mui/material";
// routes
// mock
import { _purchaseAddressFrom } from "../../../../_mock/arrays";
// components
//
import CustomerNewEditDetails from "./CustomerNewEditDetails";

// ----------------------------------------------------------------------

CustomerNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentPurchase: PropTypes.object,
};

export default function CustomerNewEditForm({ isEdit, currentPurchase }) {
  return (
    <Card>
      <CustomerNewEditDetails />
    </Card>
  );
}
