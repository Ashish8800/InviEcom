// routes
import { PATH_CUSTOMER } from "../../../routes/paths";
// components
import Label from "../../../components/label";
import Iconify from "../../../components/iconify";
import SvgColor from "../../../components/svg-color";
import ProductCategoryPage from "src/pages/customer/product/ProductCategoryPage.js";
import { Api, convertToSlug } from "src/utils";
import apiUrls from "src/routes/apiUrls";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const ICONS = {
  blog: icon("ic_blog"),
  cart: icon("ic_cart"),
  chat: icon("ic_chat"),
  mail: icon("ic_mail"),
  user: icon("ic_user"),
  file: icon("ic_file"),
  lock: icon("ic_lock"),
  label: icon("ic_label"),
  blank: icon("ic_blank"),
  kanban: icon("ic_kanban"),
  folder: icon("ic_folder"),
  banking: icon("ic_banking"),
  booking: icon("ic_booking"),
  invoice: icon("ic_invoice"),
  calendar: icon("ic_calendar"),
  disabled: icon("ic_disabled"),
  external: icon("ic_external"),
  menuItem: icon("ic_menu_item"),
  ecommerce: icon("ic_ecommerce"),
  analytics: icon("ic_analytics"),
  dashboard: icon("ic_dashboard"),
  manufacturer: icon("ic_manufacturing"),
  contact: icon("ic_contact"),
  home: icon("ic_home"),
};
let categoryList = [],
  manufacturerList = [];

try {
  let categories = Api.getSync(apiUrls.website.category);

  categories?.data?.forEach((item) => {
    let children = [];

    if (item?.subcategory?.length > 0) {
      item.subcategory.forEach((subItem) => {
        children.push({
          title: subItem.name,
          path: `product/${convertToSlug(item.name)}-${item.id}/${convertToSlug(
            subItem.name
          )}-${subItem.id}`,
        });
      });
    }

    let categoryItem = {
      title: item.name,
      path: `product/${convertToSlug(item.name)}-${item.id}`,
    };

    if (children.length > 0) {
      categoryItem.children = children;
    }

    categoryList.push(categoryItem);
  });

  let manufactures = Api.getSync(apiUrls.inventory.manufacture.index);
  manufactures?.data?.forEach((item) => {
    manufacturerList.push({
      title: item.name,
      path: `manufacturer/${convertToSlug(item.name)}-${item.id}`,
    });
  });
} catch (err) {}

let categoryChildren = {};

if (categoryList.length > 0) {
  categoryChildren.children = categoryList;
}

let manufacturerChildren = {};

if (manufacturerList.length > 0) {
  manufacturerChildren.children = manufacturerList;
}
const navConfig = [
  {
    items: [
      {
        title: "home",
        path: PATH_CUSTOMER.home.root,
        icon: ICONS.home,
      },

      {
        title: "product",
        path: "#",
        icon: ICONS.ecommerce,
        ...categoryChildren,
      },

      {
        title: "manufacturer",
        path: "#",
        icon: ICONS.manufacturer,
        ...manufacturerChildren,
      },
      {
        title: "Contact Us",
        path: PATH_CUSTOMER.contact.root,
        icon: ICONS.contact,
      },
    ],
  },
];

export default navConfig;
