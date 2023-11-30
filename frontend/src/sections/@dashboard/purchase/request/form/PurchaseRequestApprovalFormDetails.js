import sum from "lodash/sum";
import { useEffect, useState } from "react";
// form
import { useFieldArray, useFormContext } from "react-hook-form";
// @mui
import {
  Box,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
// utils
// components
import { RHFRadioGroup, RHFTextField } from "src/components/hook-form";

import { useCallback } from "react";
import { Upload } from "src/components/upload";
import Item from "src/controller/inventory/Item.controller";
import Warehouse from "src/controller/inventory/Warehouse.controller";
import Client from "src/controller/purchase/Client.controller";
import Project from "src/controller/purchase/Project.controller";
import PurchaseRequest from "src/controller/purchase/PurchaseRequest.controller";
import User from "src/controller/userManagement/User.controller";
import Comment from "src/sections/@dashboard/blog/comment/Comment";

// ----------------------------------------------------------------------
const SOURCE_OPTIONS = ["", "Email", "Phone"];

export default function PurchaseNewEditDetails() {
  const { control, setValue, watch } = useFormContext();
  const [warehouseList, setWarehouseList] = useState([]);
  const [inventryItemList, setInventryItemList] = useState([]);
  const [purchaseRequestList, setPurchaseRequestList] = useState([]);

  const [customerList, setCustomerList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [prApprover, setPRApprover] = useState([]);
  const [preview, setPreview] = useState(false);
  const [files, setFiles] = useState([]);
  const [systemUsersList, setSystemUsersList] = useState([]);
  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  const values = watch();

  const totalOnRow = values.items.map((item) => item.quantity * item.price);

  const totalPrice = sum(totalOnRow) - values.discount + values.taxes;

  useEffect(() => {
    setValue("totalPrice", totalPrice);
  }, [setValue, totalPrice]);

  useEffect(() => {
    Client.list()
      .then((res) => {
        setCustomerList(res);
      })
      .catch((err) => console.log(err));

    User.list().then((res) => setSystemUsersList(res));
    Warehouse.list().then((res) => setWarehouseList(res));
    PurchaseRequest.list().then((res) => setPurchaseRequestList(res));
  }, []);

  console.log(purchaseRequestList);

  useEffect(() => {
    Project.list(values.clientId ? `?clientId=${values.clientId}` : "")
      .then((res) => setProjectList(res))
      .catch((err) => setProjectList([]));

    customerList.forEach((item) => {
      if (item.id == values.clientId) setValue("clientName", item.name);
    });
  }, [values.clientId]);

  useEffect(() => {
    setFiles(values.files);
    setPreview(true);
  }, [values.files]);

  const handleDropFile = useCallback(
    (acceptedFiles) => {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      setPreview(true);
      setFiles([...files, ...newFiles]);
      setValue("files", [...files, ...newFiles]);
    },
    [files]
  );

  const handleRemoveFiles = (inputFile) => {
    const filtered = files.filter((file) => file !== inputFile);
    setFiles(filtered);
  };

  useEffect(() => {
    Item.list()
      .then((res) => setInventryItemList(res))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Stack>
        
          <Grid
          spacing={2}
            container
            direction="row"
            display="flex"
          >
            <Grid item xs={6} md={6} spacing={1}>
              <Stack
                direction="row"
                display="flex"
              >
                <Grid item xs={2} md={6}>
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    PR Number:
                  </Typography>
                </Grid>
                <Grid item xs={2} md={6}>
                  <Typography>{values.id}</Typography>
                </Grid>
              </Stack>

              <Stack
                direction="row"
                display="flex"
                justifyContent="space-between"
              >
                <Grid item xs={2} md={6}>
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Requested Sources:
                  </Typography>
                </Grid>
                <Grid item xs={2} md={6}>
                  <Typography>{values.requestSource}</Typography>
                </Grid>
              </Stack>
              <Stack
                direction="row"
                display="flex"
                justifyContent="space-between"
              >
                <Grid item xs={2} md={6}>
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Client Name:
                  </Typography>
                </Grid>
                <Grid item xs={2} md={6}>
                  <Typography>{values.clientName}</Typography>
                </Grid>
              </Stack>
              <Stack
                direction="row"
                display="flex"
                justifyContent="space-between"
              >
                <Grid item xs={2} md={6}>
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Deliver to Warehouse:
                  </Typography>
                </Grid>
                <Grid item xs={2} md={6}>
                  <Typography>{values.deliverTo}</Typography>
                </Grid>
              </Stack>
              <Stack
                direction="row"
                display="flex"
                justifyContent="space-between"
              >
                <Grid item xs={2} md={6}>
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Comment:
                  </Typography>
                </Grid>
                <Grid item xs={2} md={6}>
                  <Typography>{values.description}</Typography>
                </Grid>
              </Stack>
            </Grid>
            <Grid item xs={6} md={6}>
              <Stack
                direction="row"
                display="flex"
                justifyContent="space-between"
              >
                <Grid item xs={2} md={6}>
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Indentor:
                  </Typography>
                </Grid>
                <Grid item xs={2} md={6}>
                  <Typography>{values.indentor}</Typography>
                </Grid>
              </Stack>
              <Stack
                direction="row"
                display="flex"
                justifyContent="space-between"
              >
                <Grid item xs={2} md={6}>
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Expected Delivery Date:
                  </Typography>
                </Grid>
                <Grid item xs={2} md={6}>
                  <Typography>{values.deliveryDate}</Typography>
                </Grid>
              </Stack>
              <Stack
                direction="row"
                display="flex"
                justifyContent="space-between"
              >
                <Grid item xs={2} md={6}>
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    Project Name:
                  </Typography>
                </Grid>
                <Grid item xs={2} md={6}>
                  <Typography>{values.projectName}</Typography>
                </Grid>
              </Stack>
              <Stack
                direction="row"
                display="flex"
                justifyContent="space-between"
              >
                <Grid item xs={2} md={6}>
                  <Typography paragraph sx={{ color: "text.disabled", pr: 1 }}>
                    PR Approver:
                  </Typography>
                </Grid>
                <Grid item xs={2} md={6}>
                  <Typography>{values.prApproverName}</Typography>
                </Grid>
              </Stack>
            </Grid>
            
          </Grid>
        

        <Divider sx={{ my: 2, borderStyle: "dashed" }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Components
        </Typography>
        <Table size={"medium"} sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell align="left">IPN</TableCell>
              <TableCell align="left">Description</TableCell>
              <TableCell align="left">Manufacturer</TableCell>
              <TableCell align="left">MPN</TableCell>
              <TableCell align="left">Quantity</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {values.items.map((items, index) => {
              return (
                <TableRow key={index}>
                  <TableCell align="left">{items.ipn}</TableCell>
                  <TableCell align="left">{items.shortDescription}</TableCell>
                  <TableCell align="left">{items.manufacturer}</TableCell>
                  <TableCell align="left">{items.mpn}</TableCell>
                  <TableCell align="left">{items.quantity}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <Divider sx={{ my: 3, borderStyle: "dashed" }} />
        <Box
          rowGap={2}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
          }}
        >
          <Stack spacing={1}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Documents
            </Typography>
            <Upload
              disabled="true"
              multiple
              files={files}
              thumbnail={preview}
              onDrop={handleDropFile}
              onRemove={handleRemoveFiles}
            />
          </Stack>
        </Box>
      </Stack>

      <Stack mt={2}>
        {values?.messages?.map((item, index) => {
          return (
            <Comment
              key={index}
              name={item.userName}
              message={item.message}
              postedAt={item.postedAt}
            />
          );
        })}
        <Stack direction="row" sx={{ p: 1 }}>
          <Typography sx={{ pt: 1, pr: 1 }}>Action</Typography>
          <RHFRadioGroup
            row
            spacing={2}
            name="status"
            options={[
              { label: "Approve", value: "approved" },
              { label: "Reject", value: "rejected" },
              { label: "Correction", value: "correction" },
            ]}
          />
        </Stack>

        <RHFTextField name="comment" label="Comment" multiline rows={3} />
      </Stack>
    </Box>
  );
}
