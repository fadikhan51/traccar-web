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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import useStyles from "../common/theme/useGlobalStyles";
import { colorsAtom } from "/src/recoil/atoms/colorsAtom";
import { useRecoilState, useSetRecoilState, useRecoilValue } from "recoil";
import { collection, query, where, getDocs, setDoc, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import db from "/src/firebase_config/firebase";

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
  const setGlobalColor = useSetRecoilState(colorsAtom);
  const classes = useStyles(doc_colors)();
  const [selectedColor, setSelectedColor] = useState(null);
  const styles = useStyles();
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [newTheme, setNewTheme] = useState({
    primary: "#FFFFFF",
    secondary: "#FFFFFF",
    tertiary: "#FFFFFF",
    accent: "#FFFFFF",
    highlight: "#FFFFFF",
    muted: "#FFFFFF",
    shadow: "#FFFFFF",
    white: "#FFFFFF",
    gray: "#E8E8E8",
    darkgray: "#4A4A4A",
    red: "#FF4444",
  });

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const [error, setError] = useState("");

  const handleImageUpload = async (event) => {
    const VALID_FILE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    const CHUNK_SIZE = 800000; // 0.8MB in bytes
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    try {
      const file = event.target.files[0];
      if (!file) return;

      if (!VALID_FILE_TYPES.includes(file.type)) {
        setError("Invalid file type. Please upload a PNG, JPG, or JPEG.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds 5MB. Please select a smaller file.");
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      // Simulate progress for base64 conversion
      setUploadProgress(30);
      const base64String = await convertToBase64(file);
      
      setUploadProgress(60);

      try {
        const settingsRef = collection(db, "settings");
        
        // Delete all existing documents in settings collection
        const existingDocs = await getDocs(settingsRef);
        const deletePromises = existingDocs.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        // Split base64String into chunks
        const chunks = [];
        for (let i = 0; i < base64String.length; i += CHUNK_SIZE) {
          chunks.push(base64String.slice(i, i + CHUNK_SIZE));
        }

        // Upload chunks
        const uploadPromises = chunks.map((chunk, index) => 
          addDoc(settingsRef, {
            logoChunk: chunk,
            chunkNumber: index,
            totalChunks: chunks.length,
            timestamp: new Date()
          })
        );

        await Promise.all(uploadPromises);

        setError("");
        alert("Logo uploaded successfully!");
      } catch (err) {
        console.error("Error uploading logo:", err);
        setError("Failed to upload the logo. Please try again.");
      }

      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);

    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  
  const isAllColorsFilled = () => {
    return newTheme.primary && newTheme.secondary && newTheme.tertiary && 
           newTheme.accent && newTheme.highlight && newTheme.muted && newTheme.shadow;
  };

  const saveRecommendedColor = async () => {
    try {
      const themesRef = collection(db, "themes");
      
      // Check if the color exists
      const q = query(themesRef, where("primary", "==", selectedColor.primary));
      const querySnapshot = await getDocs(q);
      
      // Find currently active theme
      const activeThemeQuery = query(themesRef, where("active", "==", true));
      const activeThemeSnapshot = await getDocs(activeThemeQuery);
      
      if (!querySnapshot.empty) {
        // Color exists, update its active status
        const themeDoc = querySnapshot.docs[0];
        await updateDoc(themeDoc.ref, {
          active: true
        });
        
        // Update previously active theme
        activeThemeSnapshot.forEach(async (doc) => {
          if (doc.id !== themeDoc.id) {
            await updateDoc(doc.ref, {
              active: false
            });
          }
        });
      } else {
        // Color doesn't exist, add new theme
        await addDoc(themesRef, {
          ...selectedColor,
          active: true
        });
        
        // Update previously active theme
        activeThemeSnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            active: false
          });
        });
      }
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    console.log(color);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSaveTheme = async () => {
    try {
      const themesRef = collection(db, "themes");
      
      // Check if the theme exists
      const q = query(themesRef, where("primary", "==", newTheme.primary));
      const querySnapshot = await getDocs(q);
      
      // Find currently active theme
      const activeThemeQuery = query(themesRef, where("active", "==", true));
      const activeThemeSnapshot = await getDocs(activeThemeQuery);
      
      if (!querySnapshot.empty) {
        // Theme exists, update its active status
        const themeDoc = querySnapshot.docs[0];
        await updateDoc(themeDoc.ref, {
          active: true
        });
        
        // Update previously active theme
        activeThemeSnapshot.forEach(async (doc) => {
          if (doc.id !== themeDoc.id) {
            await updateDoc(doc.ref, {
              active: false
            });
          }
        });
      } else {
        // Theme doesn't exist, add new theme
        await addDoc(themesRef, {
          ...newTheme,
          active: true
        });
        
        // Update previously active theme
        activeThemeSnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, {
            active: false
          });
        });
      }
      handleDialogClose();
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  return (
    <Box sx={{ height: "100%"}}>
      <AppBar position="static">
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
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'center' }}>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                      <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={handleDialogOpen}
                        fullWidth
                      >
                        Create theme
                      </Button>
                    </Box>
                    <Box sx={{ flex: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Recommended Themes
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
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button 
                      variant="contained" 
                      disabled={!selectedColor}
                      onClick={saveRecommendedColor}
                    >
                      Save Color
                    </Button>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mt: 2 }}
                      disabled={isUploading}
                    >
                      Upload Image
                      <VisuallyHiddenInput 
                        type="file" 
                        accept="image/png, image/jpg, image/jpeg" 
                        onChange={handleImageUpload}
                      />
                    </Button>
                    {isUploading && (
                      <Box sx={{ position: 'relative', display: 'inline-flex', mt: 2 }}>
                        <CircularProgress variant="determinate" value={uploadProgress} />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography variant="caption" component="div" color="text.secondary">
                            {`${Math.round(uploadProgress)}%`}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create Custom Theme</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Primary Color"
                value={newTheme.primary}
                onChange={(e) => setNewTheme({ ...newTheme, primary: e.target.value })}
                sx={{ flex: 1 }}
              />
              <input
                type="color"
                value={newTheme.primary}
                onChange={(e) => setNewTheme({ ...newTheme, primary: e.target.value })}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Secondary Color"
                value={newTheme.secondary}
                onChange={(e) => setNewTheme({ ...newTheme, secondary: e.target.value })}
                sx={{ flex: 1 }}
              />
              <input
                type="color"
                value={newTheme.secondary}
                onChange={(e) => setNewTheme({ ...newTheme, secondary: e.target.value })}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Tertiary Color"
                value={newTheme.tertiary}
                onChange={(e) => setNewTheme({ ...newTheme, tertiary: e.target.value })}
                sx={{ flex: 1 }}
              />
              <input
                type="color"
                value={newTheme.tertiary}
                onChange={(e) => setNewTheme({ ...newTheme, tertiary: e.target.value })}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Accent Color"
                value={newTheme.accent}
                onChange={(e) => setNewTheme({ ...newTheme, accent: e.target.value })}
                sx={{ flex: 1 }}
              />
              <input
                type="color"
                value={newTheme.accent}
                onChange={(e) => setNewTheme({ ...newTheme, accent: e.target.value })}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Highlight Color"
                value={newTheme.highlight}
                onChange={(e) => setNewTheme({ ...newTheme, highlight: e.target.value })}
                sx={{ flex: 1 }}
              />
              <input
                type="color"
                value={newTheme.highlight}
                onChange={(e) => setNewTheme({ ...newTheme, highlight: e.target.value })}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Muted Color"
                value={newTheme.muted}
                onChange={(e) => setNewTheme({ ...newTheme, muted: e.target.value })}
                sx={{ flex: 1 }}
              />
              <input
                type="color"
                value={newTheme.muted}
                onChange={(e) => setNewTheme({ ...newTheme, muted: e.target.value })}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Shadow Color"
                value={newTheme.shadow}
                onChange={(e) => setNewTheme({ ...newTheme, shadow: e.target.value })}
                sx={{ flex: 1 }}
              />
              <input
                type="color"
                value={newTheme.shadow}
                onChange={(e) => setNewTheme({ ...newTheme, shadow: e.target.value })}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSaveTheme} variant="contained" disabled={!isAllColorsFilled()}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BrandingOptions;