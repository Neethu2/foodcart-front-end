import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#f5f5f5",
        padding: "16px",
        borderTop: "1px solid #e0e0e0",
        marginTop: "auto",
        marginLeft: "200px", // Same as sidebar width
      }}
    >
      <Typography variant="body2" color="text.secondary" align="center">
        © {new Date().getFullYear()} MovieHub. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
