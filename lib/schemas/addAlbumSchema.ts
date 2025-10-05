import * as yup from "yup";

export const addAlbumSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  artist: yup.string().required("Artist is required"),
  releaseYear: yup
    .number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required("Release year is required"),
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
    ), // 5MB
});

export type TAddAlbumFormData = yup.InferType<typeof addAlbumSchema>;
