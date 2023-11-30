import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import {
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
import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";
import { useSettingsContext } from "src/components/settings";
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
  emptyRows,
  getComparator,
  useTable,
} from "src/components/table";
// sections
import { adminEmail } from "src/auth/utils";
import TableBodySkeleton from "src/components/table/TableBodySkeleton";
import {
  RFQTableRow,
  RFQTableToolbar,
} from "src/sections/@dashboard/purchase/rfq/list";
import RFQMailDialog from "./dialog/RFQMailDialog";
import UpdateStatusDialog from "./dialog/UpdateStatusDialog";
// ----------------------------------------------------------------------

const ROLE_OPTIONS = [
  "all",
  "ux designer",
  "full stack designer",
  "backend developer",
  "project manager",
  "leader",
  "ui designer",
  "ui/ux designer",
  "front end developer",
  "full stack developer",
];

let TABLE_HEAD = [
  { id: "id", label: "RFQ No.", align: "left" },
  { id: "pr.no", label: "PR No.", align: "left" },
  { id: "vendorName", label: "Vendor Name", align: "left" },
  { id: "components", label: "Components", align: "left" },
  { id: "createdBy", label: "CreatedBy", align: "left" },

  { id: "status", label: "Status", align: "left" },
];

if (
  window.checkPermission("purchase.rfq.update") ||
  window.checkPermission("purchase.rfq.delete") ||
  window.checkPermission("purchase.rfq.read")
) {
  TABLE_HEAD.push({ id: "action", label: "Action", align: "left" });
}

// ----------------------------------------------------------------------

export default function RFQGeneralList({ list, isLoading }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
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

  const { themeStretch } = useSettingsContext();

  const navigate = useNavigate();

  const [tableData, setTableData] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [updateStatusState, setUpdateStatusState] = useState(false);
  const [updateStatusDialogData, setUpdateStatusDialogData] = useState({});
  const [rfqMailDialogState, setRFQMailDialogState] = useState(false);
  const [rfqMailDialogPayload, setRFQMailDialogPayload] = useState({});

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

  const isFiltered =
    filterName !== "" || filterRole !== "all" || filterStatus !== "all";

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
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

  const handleEditRow = (rfqId) => {
    navigate(PATH_DASHBOARD.purchase.rfq.edit(rfqId));
    console.log(rfqId);
  };

  const handleResetFilter = () => {
    setFilterName("");
    setFilterRole("all");
    setFilterStatus("all");
  };
  const handleRFQMailDialogOpen = (data) => {
    setRFQMailDialogState(true);
    setRFQMailDialogPayload(data);
  };

  useEffect(() => {
    setTableData(list);
  }, [list]);

  return (
    <>
      <RFQTableToolbar
        isFiltered={isFiltered}
        filterName={filterName}
        filterRole={filterRole}
        optionsRole={ROLE_OPTIONS}
        onFilterName={handleFilterName}
        onFilterRole={handleFilterRole}
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
                  .map((row, index) => (
                    <RFQTableRow
                      key={`${row.id}_${index}`}
                      row={row}
                      onEditRow={() => handleEditRow(row.id)}
                      onUpdateStatus={() => {
                        setUpdateStatusState(true);
                        setUpdateStatusDialogData(row);
                      }}
                      onSendPDF={() => {
                        setRFQMailDialogState(true);
                        setRFQMailDialogPayload(row);
                        console.log(row, "262");
                        handleRFQMailDialogOpen({
                          pdfUrl: row.pdfUrl,
                          sendTo: row.vendor.vendorEmail,
                          replyTo: adminEmail(),
                          id: row.id,
                          pdf: row.pdf,
                        });
                      }}
                    />
                  ))}

              {isLoading && (
                <TableBodySkeleton rows={10} columns={TABLE_HEAD.length} />
              )}

              <TableEmptyRows
                emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
              />

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

      <UpdateStatusDialog
        open={updateStatusState}
        data={updateStatusDialogData}
        onClose={() => {
          setUpdateStatusState(false);
          setUpdateStatusDialogData({});
          // fetchRFQ();
        }}
      />
      <RFQMailDialog
        open={rfqMailDialogState}
        data={rfqMailDialogPayload}
        onClose={() => {
          setRFQMailDialogState(false);
          setRFQMailDialogPayload({});
          // fetchRFQ();
        }}
        // onClose={handleRFQMailDialogClose}
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
