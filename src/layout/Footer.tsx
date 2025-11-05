import { Box, Typography } from "@mui/material";

const SIDEBAR_WIDTH = 280;

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        py: 2,
        px: 3,
        marginLeft: `${SIDEBAR_WIDTH}px`,
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Movie & TV Show Manager. All rights
        reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
