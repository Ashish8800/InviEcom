import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
// @mui
import {
  Card,
  Grid,
  Typography,
  Container,
  List,
  ListItem,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
// routes
import { PATH_CUSTOMER } from "../../../routes/paths";
// _mock_
import { _userList } from "../../../_mock/arrays";
// components
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../components/settings";
import Item from "src/controller/inventory/Item.controller";
import { useParams } from "react-router";
import { convertToSlug, extractIdFromSlug } from "src/utils";
import Manufacture from "src/controller/inventory/Manufacture.controller";
import EmptyContent from "src/components/empty-content/EmptyContent";
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function UserListPage() {
  const { themeStretch } = useSettingsContext();
  const [manufacturerCategoryList, setManufacturerCategoryList] = useState([]);
  const [manufacturer, setManufacturer] = useState({});
  const { slug } = useParams();
  const manufacturerId = extractIdFromSlug(slug);

  useEffect(() => {
    Item.list(`?manufacturer=${manufacturerId}`)
      .then((res) => {
        console.log();
        setManufacturerCategoryList(extractData(res));
      })
      .catch((err) => [setManufacturerCategoryList([])]);

    Manufacture.get(manufacturerId).then((res) => setManufacturer(res));
  }, [manufacturerId]);

  function extractData(inputArray) {
    const result = [];

    for (const obj of inputArray) {
      const categoryId = obj.category[0].id;
      const categoryName = obj.category[0].name;

      const subcategory = obj.subcategory[0];
      const subcategoryId = subcategory ? subcategory.id : null;
      const subcategoryName = subcategory ? subcategory.name : null;

      let categoryObj = result.find((item) => item.id === categoryId);

      if (!categoryObj) {
        categoryObj = {
          id: categoryId,
          name: categoryName,
          subcategory: [],
        };
        result.push(categoryObj);
      }

      if (subcategoryId && subcategoryName) {
        let subcategoryObj = categoryObj.subcategory.find(
          (item) => item.id === subcategoryId
        );

        if (!subcategoryObj) {
          subcategoryObj = {
            id: subcategoryId,
            name: subcategoryName,
          };
          categoryObj.subcategory.push(subcategoryObj);
        }
      }
    }

    return result;
  }

  return (
    <>
      <Helmet>
        <title> Manufacturer: {manufacturer?.name ?? ""} </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : "lg"}>
        <CustomBreadcrumbs
          heading={manufacturer?.name ?? ""}
          links={[
            { name: "Dashboard", href: PATH_CUSTOMER.home.root },
            { name: "Manufacturer" },
            { name: manufacturer?.name },
          ]}
        ></CustomBreadcrumbs>

        <Card sx={{ p: 2 }}>
          {manufacturerCategoryList.length > 0 ? (
            <Grid container spacing={3}>
              {manufacturerCategoryList.map((item) => {
                return (
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ p: 2 }}>
                      <Typography
                        component={RouterLink}
                        to={`/product/${convertToSlug(item.name)}-${item.id}`}
                        variant="h6"
                        alignItems="center"
                        sx={{
                          cursor: "pointer",
                          color: "#212B36",
                          textDecoration: "none",
                        }}
                      >
                        {item.name}
                      </Typography>

                      {item.subcategory.length > 0 && (
                        <List
                          sx={{
                            listStyleType: "disc",
                            listStylePosition: "inside",
                          }}
                        >
                          {item.subcategory.map((subItem) => {
                            return (
                              <ListItem sx={{ display: "list-item" }}>
                                <RouterLink
                                  sx={{
                                    cursor: "pointer",
                                    textDecoration: "none",
                                  }}
                                  to={`/product/${convertToSlug(item.name)}-${
                                    item.id
                                  }/${convertToSlug(subItem.name)}-${
                                    subItem.id
                                  }`}
                                >
                                  {subItem.name}
                                </RouterLink>
                              </ListItem>
                            );
                          })}
                        </List>
                      )}
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          ) : (
            <EmptyContent
              title={`Manufacturer "${manufacturer?.name}" doesn't have any category`}
              sx={{
                "& span.MuiBox-root": { height: 160 },
              }}
            />
          )}
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
