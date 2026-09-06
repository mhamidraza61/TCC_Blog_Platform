const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

// multer gives us the uploaded file as a Buffer (req.file.buffer), but
// Cloudinary's SDK wants a readable stream, not a raw buffer. streamifier
// wraps the buffer into a stream so it can be piped into Cloudinary's
// upload_stream — this avoids ever writing the file to disk.
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const cloudStream = cloudinary.uploader.upload_stream(
      { folder: "tcc-blog-platform" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(cloudStream);
  });
};

module.exports = streamUpload;
