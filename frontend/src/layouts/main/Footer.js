import { Link as RouterLink, useLocation } from "react-router-dom";
// @mui
import {
  Box,
  Grid,
  Link,
  Stack,
  Divider,
  Container,
  Typography,
  IconButton,
} from "@mui/material";
// routes
import { PATH_PAGE } from "../../routes/paths";
// _mock
import { _socials } from "../../_mock/arrays";
// components
import Logo from "../../components/logo";
import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: "About Us",
    children: [
      { name: "Organization", href: PATH_PAGE.about },
      { name: "Contact us", href: PATH_PAGE.contact },
      // { name: "FAQs", href: PATH_PAGE.faqs },
    ],
  },
  {
    headline: "Support",
    children: [
      // { name: "Terms and Condition", href: "#" },
      { name: "Policy", href: "#" },
    ],
  },
  {
    headline: "Contact",
    children: [
      { name: "UGF-VI ,Vaishali Arcade" },
      { name: "Hazratganj,Lucknow",},
      { name: "Uttar Pradesh",},
      { name: "987654321",},
    ],
  },
];

// ----------------------------------------------------------------------

export default function Footer() {
  const { pathname } = useLocation();

  const isHome = pathname === "/";

  const simpleFooter = (
    <Box
      component="footer"
      sx={{
        py: 5,
        textAlign: "center",
        position: "relative",
        bgcolor: "background.default",
      }}
    >
      <Container>
        <Typography variant="caption" component="div">
          © All rights reserved
          <br /> made by &nbsp;
          <Link href="https://minimals.cc/"> minimals.cc </Link>
        </Typography>
      </Container>
    </Box>
  );

  const mainFooter = (
    <Box
      component="footer"
      sx={{
        mt: 10,
        position: "relative",
        bgcolor: "background.default",
      }}
    >
      <Divider />

      <Container sx={{ pt: 5 }}>
        <Grid
          container
          justifyContent={{
            xs: "center",
            md: "space-between",
          }}
          sx={{
            textAlign: {
              xs: "center",
              md: "left",
            },
          }}
        >
          <Grid item xs={8} md={3}>
            {/* <Typography variant="body2" sx={{ pr: { md: 5 } }}>
              The starting point for your next project with Minimal UI Kit, built on the newest
              version of Material-UI ©, ready to be customized to your style.
            </Typography> */}
            <Grid item xs={12}>
              <Logo sx={{ mx: { xs: "auto", md: "inherit" } }} />
            </Grid>
            <Stack
              spacing={1}
              direction="row"
              justifyContent={{ xs: "center", md: "flex-start" }}
              sx={{
                mt: 1,
                mb: { xs: 5, md: 0 },
              }}
            >
              {_socials.map((social) => (
                <IconButton key={social.name}>
                  <Iconify icon={social.icon} />
                </IconButton>
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack
              spacing={5}
              justifyContent="space-between"
              direction={{ xs: "column", md: "row" }}
            >
              {LINKS.map((list) => (
                <Stack
                  key={list.headline}
                  spacing={2}
                  alignItems={{ xs: "center", md: "flex-start" }}
                >
                  <Typography component="div" variant="overline">
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      to={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Stack>
              ))}
            </Stack>
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          component="div"
          sx={{
            mt: 10,
            pb: 5,
            textAlign: { xs: "center", md: "left" },
          }}
        >
          <Divider />© Copyright 2023- Inevitable Infotech - All rights reserved
        </Typography>
      </Container>
    </Box>
  );

  return isHome ? simpleFooter : mainFooter;
}
