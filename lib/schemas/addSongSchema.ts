import * as yup from "yup";

export const addSongSchema = yup.object({
  title: yup.string().required("Title is required"),
  artist: yup.string().required("Artist is required"),
  duration: yup.number().min(0).required("Duration is required"),
  albumId: yup.string().nullable().notRequired(), 
  audioFile: yup
    .mixed<File>()
    .required("Audio file is required")
    .test(
      "fileType",
      "Only audio files are allowed",
      (value) => value && value.type.startsWith("audio/")
    )
    .test(
      "fileSize",
      "File too large",
      (value) => value && value.size <= 10 * 1024 * 1024
    ),
  imageFile: yup
    .mixed<File>()
    .required("Image is required")
    .test(
      "fileType",
      "Only images are allowed",
      (value) => value && value.type.startsWith("image/")
    )
    .test(
      "fileSize",
      "File too large",
      (value) => value && value.size <= 5 * 1024 * 1024
    ),
});

export type TAddSongFormData = yup.InferType<typeof addSongSchema>;
