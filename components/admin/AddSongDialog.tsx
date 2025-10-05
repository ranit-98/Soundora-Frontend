"use client";

import { useState, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  addSongSchema,
  TAddSongFormData,
} from "../../lib/schemas/addSongSchema";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { Add, Upload } from "@mui/icons-material";
import { Toaster } from "react-hot-toast";
import { useAddSong, useAlbums } from "@/api/hooks/useMusic";

export default function AddSongDialog() {
  const [open, setOpen] = useState(false);
  const { mutate: addSong, isPending: isLoading } = useAddSong();
  const { data: albums = [] } = useAlbums();
  const audioInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addSongSchema),
    defaultValues: {
      title: "",
      artist: "",
      duration: 0,
      albumId: null,
      audioFile: undefined as unknown as File,
      imageFile: undefined as unknown as File,
    },
  });

  const onSubmit: SubmitHandler<TAddSongFormData> = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("artist", data.artist);
    formData.append("duration", data.duration.toString());
    if (data.albumId && data.albumId !== "none")
      formData.append("albumId", data.albumId);
    formData.append("audioFile", data.audioFile);
    formData.append("imageFile", data.imageFile);

    addSong(formData, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };
  return (
    <>
      <Toaster position="top-right" />
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#09090b",
            border: "1px solid #27272a",
            maxHeight: "80vh",
            width: "50rem",
          },
        }}
        scroll="paper"
      >
        <DialogTitle>Add New Song</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a new song to your music library
          </DialogContentText>
          <Box
            component="form"
            sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Image Upload */}
            <Box
              sx={{
                p: 3,
                border: "2px dashed #27272a",
                borderRadius: 1,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => imageInputRef.current?.click()}
            >
              {imageInputRef.current?.files?.[0] ? (
                <Box>
                  <Typography variant="body2" color="primary">
                    Image selected:
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {imageInputRef.current.files[0].name}
                  </Typography>
                </Box>
              ) : (
                <>
                  <Upload
                    sx={{ fontSize: 24, color: "text.secondary", mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Upload artwork
                  </Typography>
                  <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                    Choose File
                  </Button>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                hidden
                ref={imageInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file)
                    setValue("imageFile", file, { shouldValidate: true });
                }}
              />
              {errors.imageFile && (
                <Typography color="error" variant="caption">
                  {errors.imageFile.message}
                </Typography>
              )}
            </Box>

            {/* Audio Upload */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={() => audioInputRef.current?.click()}
                fullWidth
              >
                {audioInputRef.current?.files?.[0]?.name || "Choose Audio File"}
              </Button>
              <input
                type="file"
                accept="audio/*"
                hidden
                ref={audioInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file)
                    setValue("audioFile", file, { shouldValidate: true });
                }}
              />
              {errors.audioFile && (
                <Typography color="error" variant="caption">
                  {errors.audioFile.message}
                </Typography>
              )}
            </Box>

            {/* Text Inputs */}
            <TextField
              label="Title"
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
              label="Duration (seconds)"
              type="number"
              {...register("duration")}
              error={!!errors.duration}
              helperText={errors.duration?.message}
              fullWidth
              sx={{ bgcolor: "#18181b", borderRadius: 1 }}
            />

            {/* Album Select */}
            <FormControl fullWidth sx={{ bgcolor: "#18181b", borderRadius: 1 }}>
              <InputLabel>Album (Optional)</InputLabel>
              <Select
                {...register("albumId")}
                defaultValue="none"
                label="Album (Optional)"
              >
                <MenuItem value="none">No Album (Single)</MenuItem>
                {albums.map((album) => (
                  <MenuItem key={album._id} value={album._id}>
                    {album.title}
                  </MenuItem>
                ))}
              </Select>
              {errors.albumId && (
                <Typography color="error" variant="caption">
                  {errors.albumId.message}
                </Typography>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            variant="contained"
            sx={{ bgcolor: "#22c55e", "&:hover": { bgcolor: "#16a34a" } }}
          >
            {isLoading ? "Uploading..." : "Add Song"}
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => setOpen(true)}
        sx={{
          bgcolor: "#22c55e",
          "&:hover": { bgcolor: "#16a34a" },
          color: "black",
        }}
      >
        Add Song
      </Button>
    </>
  );
}
