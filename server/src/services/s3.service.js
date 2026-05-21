const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Initialize S3 Client pointing to Supabase Storage
const s3Client = new S3Client({
  forcePathStyle: true,
  region: process.env.SUPABASE_S3_REGION || "ap-northeast-1",
  endpoint: process.env.SUPABASE_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.SUPABASE_S3_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.SUPABASE_S3_BUCKET_NAME || "resumes";

/**
 * Upload a file buffer to Supabase S3
 * @param {Buffer} fileBuffer - The file buffer
 * @param {String} mimeType - The file MIME type (e.g. application/pdf)
 * @param {String} originalName - The original file name
 * @returns {Promise<String>} - Returns the unique S3 object key
 */
async function uploadFileToS3(fileBuffer, mimeType, originalName) {
  try {
    // Generate a unique object key (filename)
    const timestamp = Date.now();
    const safeName = originalName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const objectKey = `user_resumes/${timestamp}-${safeName}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await s3Client.send(command);
    return objectKey;
  } catch (error) {
    console.error("Error uploading to Supabase S3:", error);
    throw new Error("Failed to upload file to protected storage");
  }
}

/**
 * Generate a short-lived Signed URL for accessing a private file
 * @param {String} objectKey - The S3 object key
 * @returns {Promise<String>} - The signed URL (expires in 60s)
 */
async function getSignedResumeUrl(objectKey) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
    });
    
    // URL expires in 60 seconds
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    return signedUrl;
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw new Error("Failed to generate secure file link");
  }
}

/**
 * Delete a file from Supabase S3
 * @param {String} objectKey - The S3 object key to delete
 */
async function deleteFileFromS3(objectKey) {
  if (!objectKey) return;
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file from Supabase S3:", error);
    // Non-blocking error
  }
}

module.exports = {
  uploadFileToS3,
  getSignedResumeUrl,
  deleteFileFromS3,
};
