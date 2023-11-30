import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Box } from '@mui/material';
// _mock
import { _mapContact } from 'src/_mock/arrays';
// sections
import {  ContactForm,  } from 'src/sections/contact';
import CustomBreadcrumbs from "../../../components/custom-breadcrumbs";
import { useSettingsContext } from "../../../components/settings";
import { PATH_CUSTOMER } from "../../../routes/paths";
// ----------------------------------------------------------------------

export default function ContactPage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Contact us </title>
      </Helmet>


      <Container sx={{ py: 10 }}  maxWidth={themeStretch ? false : "lg"}>

      <CustomBreadcrumbs
          heading="Contact Us"
          links={[
            { name: "Home", href: PATH_CUSTOMER.root },
            // { name: "Order", href: PATH_CUSTOMER.order.root },
            { name: "Contact Us" },
          ]}
         
        />

        <Box
          
        >
          <ContactForm />

        </Box>
      </Container>
    </>
  );
}
