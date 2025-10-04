// components/AddAlbumDialog.tsx
"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addAlbumSchema, TAddAlbumFormData } from "../../lib/schemas/addAlbumSchema";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Typography } from "@mui/material";
import { Add, Upload } from "@mui/icons-material";
import { Toaster } from "react-hot-toast";
import { useAddAlbum } from "@/api/hooks/useMusic";


export default function AddAlbumDialog() {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null); 
  const { mutate: addAlbum, isPending: isLoading } = useAddAlbum();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<TAddAlbumFormData>({
    resolver: yupResolver(addAlbumSchema),
  });

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("imageFile", file, { shouldValidate: true });
      setFileName(file.name);
    } else {
      // setValue("imageFile", undefined , { shouldValidate: true });
      setFileName(null);
    }
  };

  const onSubmit = (data: TAddAlbumFormData) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("artist", data.artist);
    formData.append("releaseYear", data.releaseYear.toString());
    formData.append("imageFile", data.imageFile);

    addAlbum(formData, {
      onSuccess: () => {
        reset();
        setFileName(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = ""; // Clear file input
        }
        setOpen(false);
      },
      onError: (error) => {
        console.error("Error adding album:", error);
      },
    });
  };

  return (
    <>
      <Toaster position="top-right" />
      <Dialog open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { bgcolor: "#09090b", border: "1px solid #27272a" } }}>
        <DialogTitle>Add New Album</DialogTitle>
        <DialogContent>
          <DialogContentText>Add a new album to your collection</DialogContentText>
          <Box component="form" sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }} onSubmit={handleSubmit(onSubmit)}>
            <Box
              sx={{
                p: 3,
                border: "2px dashed #27272a",
                borderRadius: 1,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload sx={{ fontSize: 24, color: "text.secondary", mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {fileName || "Upload album artwork"}
              </Typography>
              <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                Choose File
              </Button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                hidden
              />
              {errors.imageFile && <Typography color="error" variant="caption">{errors.imageFile.message}</Typography>}
            </Box>
            <TextField
              label="Album Title"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
              sx={{ bgcolor: "#18181b", borderRadius: 1 }}
            />
            <TextField
              label="Artist"
              {...register("artist")}
              error={!!errors.artist}
              helperText={errors.artist?.message}
              fullWidth
              sx={{ bgcolor: "#18181b", borderRadius: 1 }}
            />
            <TextField
              label="Release Year"
              type="number"
              {...register("releaseYear")}
              error={!!errors.releaseYear}
              helperText={errors.releaseYear?.message}
              fullWidth
              inputProps={{ min: 1900, max: new Date().getFullYear() }}
              sx={{ bgcolor: "#18181b", borderRadius: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            variant="contained"
            sx={{ bgcolor: "#a855f7", "&:hover": { bgcolor: "#9333ea" } }}
          >
            {isLoading ? "Creating..." : "Add Album"}
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
        sx={{ bgcolor: "#a855f7", "&:hover": { bgcolor: "#9333ea" } }}
      >
        Add Album
      </Button>
    </>
  );
}