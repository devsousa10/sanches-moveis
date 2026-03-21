import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
    // Mudamos maxFileCount para 5
    imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload realizado:", file.url);
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
