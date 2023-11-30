import PropTypes from "prop-types";
import { sentenceCase } from "change-case";
// @mui
import {
  Card,
  Table,
  Divider,
  TableRow,
  TableBody,
  TableCell,
  CardHeader,
  Typography,
  TableContainer,
  Link,
} from "@mui/material";
// utils
// components
import { Link as RouterLink } from "react-router-dom";
import Label from "../../../../components/label";
import Scrollbar from "../../../../components/scrollbar";
import { TableHeadCustom, TableNoData } from "../../../../components/table";
import { formateCurrency, formateDate } from "src/utils";

// ----------------------------------------------------------------------

AppNewInvoice.propTypes = {
  title: PropTypes.string,
  tableData: PropTypes.array,
  subheader: PropTypes.string,
  tableLabels: PropTypes.array,
};

export default function AppNewInvoice({
  title,
  subheader,
  tableData,
  tableLabels,
  ...other
}) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: "unset" }}>
        <Scrollbar>
          <Table sx={{ minWidth: 720 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <AppNewInvoiceRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <Divider />
    </Card>
  );
}

// ----------------------------------------------------------------------

AppNewInvoiceRow.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    date: PropTypes.string,
    amount: PropTypes.any,
  }),
};

function AppNewInvoiceRow({ row }) {
  let pageLink = "#";
  switch (row.type) {
    case "purchase_request":
      pageLink = `/dashboard/purchase/request/${row.id}/approval`;
      break;

    case "purchase_order":
      pageLink = `/dashboard/purchase/order/${row.id}/approval`;
      break;

    case "purchase_invoice":
      pageLink = `/dashboard/purchase/invoice/${row.id}/approval`;
      break;

    default:
      pageLink = "#";
  }
  return (
    <>
      <TableRow>
        <TableCell align="left">
          <Link
            component={RouterLink}
            noWrap
            color="inherit"
            variant="subtitle2"
            sx={{
              cursor: "pointer",
              textDecoration: "none",
            }}
            to={pageLink}
          >
            {row.id}
          </Link>
        </TableCell>

        <TableCell align="left">
          <Label
            variant="soft"
            color={
              (row.type === "purchase_request" && "warning") ||
              (row.type === "purchase_order" && "error") ||
              (row.type === "purchase_invoice" && "success") ||
              "default"
            }
          >
            {sentenceCase(row.type)}
          </Label>
        </TableCell>

        <TableCell align="left">{formateCurrency(row.amount)}</TableCell>
        <TableCell align="left">{formateDate(row.date)}</TableCell>
      </TableRow>
    </>
  );
}
