// routes
import { PATH_CUSTOMER } from '../../../routes/paths';
// components
import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    // subheader: 'general',
    items: [
      { title: 'dashboard', path: PATH_CUSTOMER.general.app, icon: ICONS.dashboard },
      

      // { title: 'ecommerce', path: PATH_CUSTOMER.general.ecommerce, icon: ICONS.ecommerce },
      // { title: 'analytics', path: PATH_CUSTOMER.general.analytics, icon: ICONS.analytics },
      // { title: 'banking', path: PATH_CUSTOMER.general.banking, icon: ICONS.banking },
      // { title: 'booking', path: PATH_CUSTOMER.general.booking, icon: ICONS.booking },
      // { title: 'file', path: PATH_CUSTOMER.general.file, icon: ICONS.file },
    ],
  },

  // MANAGEMENT
  // ----------------------------------------------------------------------
  {
    // subheader: 'management',
    items: [
      // USER
      {
        title: 'user',
        path: PATH_CUSTOMER.user.root,
        icon: ICONS.user,
        // children: [
        //   { title: 'profile', path: PATH_CUSTOMER.user.profile },
        //   { title: 'cards', path: PATH_CUSTOMER.user.cards },
        //   { title: 'list', path: PATH_CUSTOMER.user.list },
        //   { title: 'create', path: PATH_CUSTOMER.user.new },
        //   { title: 'edit', path: PATH_CUSTOMER.user.demoEdit },
        //   { title: 'account', path: PATH_CUSTOMER.user.account },
        // ],
      },
      // { title: 'role', path: PATH_CUSTOMER.role.root, icon:  ICONS.user },

      // E-COMMERCE
      {
        title: 'products',
        path: PATH_CUSTOMER.eCommerce.root,
        icon: ICONS.cart,
        // children: [
        //   { title: 'shop', path: PATH_CUSTOMER.eCommerce.shop },
        //   { title: 'product', path: PATH_CUSTOMER.eCommerce.demoView },
        //   { title: 'list', path: PATH_CUSTOMER.eCommerce.list },
        //   { title: 'create', path: PATH_CUSTOMER.eCommerce.new },
        //   { title: 'edit', path: PATH_CUSTOMER.eCommerce.demoEdit },
        //   { title: 'checkout', path: PATH_CUSTOMER.eCommerce.checkout },
        // ],
      },

       // INVOICE//order
       {
        title: 'order',
        path: PATH_CUSTOMER.orders.root,
        icon: ICONS.cart,
        // children: [
        //   { title: 'list', path: PATH_CUSTOMER.invoice.list },
        //   { title: 'details', path: PATH_CUSTOMER.invoice.demoView },
        //   { title: 'create', path: PATH_CUSTOMER.invoice.new },
        //   { title: 'edit', path: PATH_CUSTOMER.invoice.demoEdit },
        // ],
      },
// Sales
      {
        title: 'sales',
        path: PATH_CUSTOMER.sales.root,
        icon: ICONS.ecommerce,
        // children: [
        //   { title: 'list', path: PATH_CUSTOMER.invoice.list },
        //   { title: 'details', path: PATH_CUSTOMER.invoice.demoView },
        //   { title: 'create', path: PATH_CUSTOMER.invoice.new },
        //   { title: 'edit', path: PATH_CUSTOMER.invoice.demoEdit },
        // ],
      },

      // Report
      {
        title: 'report',
        path: PATH_CUSTOMER.report.root,
        icon: ICONS.file,
        // children: [
        //   { title: 'list', path: PATH_CUSTOMER.invoice.list },
        //   { title: 'details', path: PATH_CUSTOMER.invoice.demoView },
        //   { title: 'create', path: PATH_CUSTOMER.invoice.new },
        //   { title: 'edit', path: PATH_CUSTOMER.invoice.demoEdit },
        // ],
      },
// Policies
      {
        title: 'policies',
        path: PATH_CUSTOMER.policies.root,
        icon: ICONS.label,
        // children: [
        //   { title: 'list', path: PATH_CUSTOMER.invoice.list },
        //   { title: 'details', path: PATH_CUSTOMER.invoice.demoView },
        //   { title: 'create', path: PATH_CUSTOMER.invoice.new },
        //   { title: 'edit', path: PATH_CUSTOMER.invoice.demoEdit },
        // ],
      },

      // INVOICE
      // {
      //   title: 'invoice',
      //   path: PATH_CUSTOMER.invoice.root,
      //   icon: ICONS.invoice,
      //   children: [
      //     { title: 'list', path: PATH_CUSTOMER.invoice.list },
      //     { title: 'details', path: PATH_CUSTOMER.invoice.demoView },
      //     { title: 'create', path: PATH_CUSTOMER.invoice.new },
      //     { title: 'edit', path: PATH_CUSTOMER.invoice.demoEdit },
      //   ],
      // },

      // BLOG
      // {
      //   title: 'blog',
      //   path: PATH_CUSTOMER.blog.root,
      //   icon: ICONS.blog,
      //   children: [
      //     { title: 'posts', path: PATH_CUSTOMER.blog.posts },
      //     { title: 'post', path: PATH_CUSTOMER.blog.demoView },
      //     { title: 'create', path: PATH_CUSTOMER.blog.new },
      //   ],
      // },
      // {
      //   title: 'File manager',
      //   path: PATH_CUSTOMER.fileManager,
      //   icon: ICONS.folder,
      // },
    ],
  },

  // APP
  // ----------------------------------------------------------------------
  // {
  //   subheader: 'app',
  //   items: [
  //     {
  //       title: 'mail',
  //       path: PATH_CUSTOMER.mail.root,
  //       icon: ICONS.mail,
  //       info: <Label color="error">+32</Label>,
  //     },
  //     {
  //       title: 'chat',
  //       path: PATH_CUSTOMER.chat.root,
  //       icon: ICONS.chat,
  //     },
  //     {
  //       title: 'calendar',
  //       path: PATH_CUSTOMER.calendar,
  //       icon: ICONS.calendar,
  //     },
  //     {
  //       title: 'kanban',
  //       path: PATH_CUSTOMER.kanban,
  //       icon: ICONS.kanban,
  //     },
  //   ],
  // },

  // DEMO MENU STATES
  // {
  //   subheader: 'Other cases',
  //   items: [
  //     {
  //       // default roles : All roles can see this entry.
  //       // roles: ['user'] Only users can see this item.
  //       // roles: ['admin'] Only admin can see this item.
  //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
  //       // Reference from 'src/guards/RoleBasedGuard'.
  //       title: 'item_by_roles',
  //       path: PATH_CUSTOMER.permissionDenied,
  //       icon: ICONS.lock,
  //       roles: ['admin'],
  //       caption: 'only_admin_can_see_this_item',
  //     },
  //     {
  //       title: 'menu_level',
  //       path: '#/dashboard/menu_level',
  //       icon: ICONS.menuItem,
  //       children: [
  //         {
  //           title: 'menu_level_2a',
  //           path: '#/dashboard/menu_level/menu_level_2a',
  //         },
  //         {
  //           title: 'menu_level_2b',
  //           path: '#/dashboard/menu_level/menu_level_2b',
  //           children: [
  //             {
  //               title: 'menu_level_3a',
  //               path: '#/dashboard/menu_level/menu_level_2b/menu_level_3a',
  //             },
  //             {
  //               title: 'menu_level_3b',
  //               path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b',
  //               children: [
  //                 {
  //                   title: 'menu_level_4a',
  //                   path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4a',
  //                 },
  //                 {
  //                   title: 'menu_level_4b',
  //                   path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4b',
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       title: 'item_disabled',
  //       path: '#disabled',
  //       icon: ICONS.disabled,
  //       disabled: true,
  //     },

  //     {
  //       title: 'item_label',
  //       path: '#label',
  //       icon: ICONS.label,
  //       info: (
  //         <Label color="info" startIcon={<Iconify icon="eva:email-fill" />}>
  //           NEW
  //         </Label>
  //       ),
  //     },
  //     {
  //       title: 'item_caption',
  //       path: '#caption',
  //       icon: ICONS.menuItem,
  //       caption:
  //         'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
  //     },
  //     {
  //       title: 'item_external_link',
  //       path: 'https://www.google.com/',
  //       icon: ICONS.external,
  //     },
  //     {
  //       title: 'blank',
  //       path: PATH_CUSTOMER.blank,
  //       icon: ICONS.blank,
  //     },
  //   ],
  // },
];

export default navConfig;
