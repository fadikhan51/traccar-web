import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import useStyles from "../common/theme/useGlobalStyles";
import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const colors = [
  {
    primary: "#FF6B6B",
    secondary: "#FF8C8C",
    tertiary: "#FF7F7F",
    accent: "#FFEDED",
    highlight: "#FFA5A5",
    muted: "#FFBFBF",
    shadow: "rgba(255, 107, 107, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#4ECDC4",
    secondary: "#7DE1D8",
    tertiary: "#66D6CD",
    accent: "#E5FAF8",
    highlight: "#99E5DA",
    muted: "#C2F1EC",
    shadow: "rgba(78, 205, 196, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#45B7D1",
    secondary: "#6CCDE1",
    tertiary: "#5AC6D8",
    accent: "#E3F7FC",
    highlight: "#8FD8E7",
    muted: "#BDEAF3",
    shadow: "rgba(69, 183, 209, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#96CEB4",
    secondary: "#AEDBC7",
    tertiary: "#A2D4BE",
    accent: "#EFF8F4",
    highlight: "#B4E3CC",
    muted: "#D2EDDF",
    shadow: "rgba(150, 206, 180, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#FFEEAD",
    secondary: "#FFF2C6",
    tertiary: "#FFF0B8",
    accent: "#FFFAE7",
    highlight: "#FFF5D4",
    muted: "#FFF9E3",
    shadow: "rgba(255, 238, 173, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#D4A5A5",
    secondary: "#E3BFBF",
    tertiary: "#DBB2B2",
    accent: "#F9EFEF",
    highlight: "#E9C7C7",
    muted: "#F2DADA",
    shadow: "rgba(212, 165, 165, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#9B59B6",
    secondary: "#B179C9",
    tertiary: "#A66DBC",
    accent: "#F1E9F7",
    highlight: "#BE94D2",
    muted: "#D3B6DF",
    shadow: "rgba(155, 89, 182, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#3498DB",
    secondary: "#5EB3E6",
    tertiary: "#4BA9E0",
    accent: "#E7F4FB",
    highlight: "#84C4EF",
    muted: "#B8DCF5",
    shadow: "rgba(52, 152, 219, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#E74C3C",
    secondary: "#F27A6C",
    tertiary: "#EB6053",
    accent: "#FDEDEC",
    highlight: "#F4998D",
    muted: "#F7C4BB",
    shadow: "rgba(231, 76, 60, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#2ECC71",
    secondary: "#5ED98F",
    tertiary: "#45D382",
    accent: "#EAF9EF",
    highlight: "#88E2B1",
    muted: "#B7ECD2",
    shadow: "rgba(46, 204, 113, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#F1C40F",
    secondary: "#F5D041",
    tertiary: "#F3C92A",
    accent: "#FCF7E4",
    highlight: "#F9E191",
    muted: "#FAEBB7",
    shadow: "rgba(241, 196, 15, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#1ABC9C",
    secondary: "#4DD3B7",
    tertiary: "#35C7A9",
    accent: "#E4F7F3",
    highlight: "#85DFC3",
    muted: "#B3EADB",
    shadow: "rgba(26, 188, 156, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#34495E",
    secondary: "#556A7D",
    tertiary: "#445970",
    accent: "#E7EBEE",
    highlight: "#7E93A4",
    muted: "#ABB8C4",
    shadow: "rgba(52, 73, 94, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#16A085",
    secondary: "#4EC5A3",
    tertiary: "#2EB89A",
    accent: "#E3F5F1",
    highlight: "#78DBC1",
    muted: "#A9E6D6",
    shadow: "rgba(22, 160, 133, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#27AE60",
    secondary: "#55C17D",
    tertiary: "#3DB96F",
    accent: "#E5F6EB",
    highlight: "#8FDCAB",
    muted: "#BDE8CB",
    shadow: "rgba(39, 174, 96, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#2980B9",
    secondary: "#529DCC",
    tertiary: "#3E8AC1",
    accent: "#E3F2FA",
    highlight: "#87B8DB",
    muted: "#B3D5EB",
    shadow: "rgba(41, 128, 185, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#8E44AD",
    secondary: "#A467C2",
    tertiary: "#9A57B7",
    accent: "#F0E6F5",
    highlight: "#B78ECF",
    muted: "#D4B5DF",
    shadow: "rgba(142, 68, 173, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#2C3E50",
    secondary: "#4D6171",
    tertiary: "#3B5062",
    accent: "#E8ECF1",
    highlight: "#8092A3",
    muted: "#ADB9C3",
    shadow: "rgba(44, 62, 80, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#F39C12",
    secondary: "#F6B246",
    tertiary: "#F4A62C",
    accent: "#FCF3E4",
    highlight: "#F8CD8F",
    muted: "#FBE3B7",
    shadow: "rgba(243, 156, 18, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  },
  {
    primary: "#D35400",
    secondary: "#E07838",
    tertiary: "#D9671C",
    accent: "#F9EFE6",
    highlight: "#E89D71",
    muted: "#F0C7AB",
    shadow: "rgba(211, 84, 0, 0.08)",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  }
];  

const BrandingOptions = () => {
  const navigate = useNavigate();

  const [doc_colors, setDoc_Colors] = useRecoilState(colorsAtom);
  const setGlobalColor =  useSetRecoilState(colorsAtom);
  const classes = useStyles(doc_colors)();
  
  const [selectedColor, setSelectedColor] = useState(null);
  const styles = useStyles();

  useEffect(() => {
    if (selectedColor) {
      setDoc_Colors(selectedColor);
      setGlobalColor(selectedColor);
    //   window.location.reload();
    }
  }, [selectedColor, setDoc_Colors]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    console.log(color);
  };

  return (
    <Box sx={{ height: "100%", backgroundColor: `${doc_colors.accent} !important` }}>
      <AppBar position="static" >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Branding Options
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '60%' }}>
          <Grid container direction="column" spacing={3}>
            <Grid item xs={12}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Theme Colors
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, color: 'gray' }}>
                    Choose a primary color to define your brand's visual identity. This color will be used across your application to maintain consistency.
                  </Typography>
                  <Box sx={{ backgroundColor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                    <Grid container spacing={1}>
                      {colors.map((color) => (
                        <Grid item key={color.primary}>
                          <Box
                            onClick={() => handleColorSelect(color)}
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: color.primary,
                              cursor: "pointer",
                              border: selectedColor === color ? "3px solid darkgray" : "none",
                              borderRadius: 1,
                              transition: 'all 0.3s ease',
                              "&:hover": {
                                opacity: 0.8,
                                transform: 'scale(1.1)',
                              },
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Upload Logo
                  </Typography>
                  <Button
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    sx={{ mt: 2 }}
                  >
                    Upload Image
                    <VisuallyHiddenInput type="file" accept="image/*" />
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default BrandingOptions;