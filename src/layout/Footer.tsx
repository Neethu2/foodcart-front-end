import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <>
      <Box>
        <Typography variant="body2">
          © {new Date().getFullYear()} FoodCart. All rights reserved.
        </Typography>
      </Box>
    </>
  );
};

export default Footer;
