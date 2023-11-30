// @mui
import { Skeleton, TableCell, TableRow } from "@mui/material";

// ----------------------------------------------------------------------

export default function TableBodySkeleton({ rows, columns, ...other }) {
  return [...Array(rows)].map(() => (
    <TableRow {...other}>
      {[...Array(columns)].map(() => (
        <TableCell>
          <Skeleton variant="text" animation="wave" height={30} />
        </TableCell>
      ))}
    </TableRow>
  ));
}
