import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import {
  Button,
  IconButton,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
} from "@mui/material";
// routes
import { PATH_DASHBOARD } from "src/routes/paths";
// _mock_
// components
import ConfirmDialog from "src/components/confirm-dialog";
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useSettingsContext } from "src/components/settings";
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  getComparator,
  useTable,
} from "src/components/table";
// sections
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import PurchaseRequest from "src/controller/purchase/PurchaseRequest.controller";
import {
  PurchaseRequestGeneralTableRow,
  PurchaseRequestGeneralTableToolbar,
} from "src/sections/@dashboard/purchase/request/list";
// ----------------------------------------------------------------------

const STATUS_OPTIONS = {
  all: "All",
  pending: "In Approval",
  approved: "Approved",
  rejected: "Rejected",
  correction: "Under Correction",
  po_generated: "PO Generated",
  rfq_generated: "RFQ Generated",
  withdrawal: "Withdrawal",
};

let TABLE_HEAD = [
  { id: "id", label: "PR No.", align: "left" },
  { id: "clientName", label: "Client Name", align: "left" },
  { id: "projectName", label: "Project Name", align: "left" },
  { id: "indentor", label: "Indentor", align: "left" },
  {
    id: "expectedDeliveryDate",
    label: "Expected Delivery Date",
    align: "left",
  },
  { id: "ipn", label: "IPN", align: "left" },

  { id: "status", label: "Status", align: "left" },
];

if (
  window.checkPermission("purchase.purchase_request.update") ||
  window.checkPermission("purchase.purchase_request.delete") ||
  window.checkPermission("purchase.purchase_request.read")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}

// ----------------------------------------------------------------------

export default function PurchaseRequestGeneralList({ list, isLoading }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: "createdOn",
    defaultOrder: "desc",
  });

  const [disablePurchaseRequestTable, setDisablePurchaseRequestTable] =
    useState(false);
  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [filterName, setFilterName] = useState("");

  const [filterRole, setFilterRole] = useState("all");

  const [filterStatus, setFilterStatus] = useState("all");

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  });

  const dataInPage = dataFiltered.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const denseHeight = dense ? 52 : 72;

  const isFiltered =
    filterName !== "" || filterRole !== "all" || filterStatus !== "all";

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const handleFilterStatus = (event) => {
    setPage(0);
    setFilterStatus(event.target.value);
  };

  const handleFilterName = (event) => {
    setPage(0);
    console.log(event);
    setFilterName(event.target.value);
  };

  const handleFilterRole = (event) => {
    setPage(0);
    setFilterRole(event.target.value);
  };

  const handleDeleteRow = (id) => {
    if (id) {
      PurchaseRequest.withdraw(id)
        .then(() => {
          PurchaseRequest.list().then((res) => {
            window.Toast(
              // `INV-${invoiceNumber}`
              `Purchase Request ${(id)}  withdrawal successfully.`
            );
            setTableData(res);
            res = res.reverse();
          });
        })
        .catch((err) => console.log(err));
    }
  };

  const handleDeleteRows = (selectedRows) => {
    const deleteRows = tableData.filter(
      (row) => !selectedRows.includes(row.id)
    );
    setSelected([]);
    setTableData(deleteRows);

    if (page > 0) {
      if (selectedRows.length === dataInPage.length) {
        setPage(page - 1);
      } else if (selectedRows.length === dataFiltered.length) {
        setPage(0);
      } else if (selectedRows.length > dataInPage.length) {
        const newPage =
          Math.ceil((tableData.length - selectedRows.length) / rowsPerPage) - 1;
        setPage(newPage);
      }
    }
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.purchase.request.edit(id));
  };
  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.purchase.request.view(id));
  };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
  };

  useEffect(() => {
    setTableData(list);
  }, [list]);

  return (
    <>
      <PurchaseRequestGeneralTableToolbar
        isFiltered={isFiltered}
        filterName={filterName}
        filterStatus={filterStatus}
        optionsStatus={STATUS_OPTIONS}
        onFilterName={handleFilterName}
        onFilterStatus={handleFilterStatus}
        onResetFilter={handleResetFilter}
      />

      <TableContainer sx={{ position: "relative", overflow: "unset" }}>
        <TableSelectedAction
          dense={dense}
          numSelected={selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            onSelectAllRows(
              checked,
              tableData.map((row) => row.id)
            )
          }
          action={
            <Tooltip title="Delete">
              <IconButton color="primary" onClick={handleOpenConfirm}>
                <Iconify icon="eva:trash-2-outline" />
              </IconButton>
            </Tooltip>
          }
        />

        <Scrollbar>
          <Table size={dense ? "small" : "medium"} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
            />

            <TableBody>
              {!isLoading &&
                dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <PurchaseRequestGeneralTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                    />
                  ))}
                  
             <TableEmptyRows emptyRows={tableData.length} />

              {isLoading && (
                <TableBodySkeleton rows={10} columns={TABLE_HEAD.length} />
              )}

              <TableNoData isNotFound={!isLoading && isNotFound} />
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      <TablePaginationCustom
        count={dataFiltered.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        //
        dense={dense}
        onChangeDense={onChangeDense}
      />

      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {selected.length} </strong>{" "}
            items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows(selected);
              handleCloseConfirm();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter((user) => {
      return (
        user.title?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        user.status?.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
      );
    });
  }

  if (filterStatus !== "all") {
    inputData = inputData.filter((user) => user.status === filterStatus);
  }

  if (filterRole !== "all") {
    inputData = inputData.filter((user) => user.role === filterRole);
  }

  return inputData;
}
