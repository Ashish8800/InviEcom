import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSettingsContext } from '../../../components/settings';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
// sections
import OrderNewEditForm from '../../../sections/@dashboard/salesorder/form/OrderNewEditForm';

// ----------------------------------------------------------------------

export default function SalesOrderCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Order </title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Order View"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Orders',
              href: PATH_DASHBOARD.sales.order.list,
            },
            {
              name: 'Order View',
            },
          ]}
        />

        <OrderNewEditForm />
      </Container>
    </>
  );
}
