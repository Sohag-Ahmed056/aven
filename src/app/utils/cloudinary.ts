import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../../config/index.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

// Configure Multer Storage to store temporary files locally before uploading
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, and WEBP formats are allowed!'));
    }
  },
});

export const uploadToCloudinary = async (
  filePath: string,
  folder: string = 'e-commerce'
): Promise<{ url: string; publicId: string }> => {
  // If credentials are dummy, return a mock response to prevent throwing in dev
  if (!config.cloudinary.cloud_name || config.cloudinary.cloud_name === 'cloudinary_dev_cloud') {
    console.log(`☁️ [Cloudinary Mock Mode] Uploading ${filePath} to folder ${folder}`);
    // Simulate async upload
    await new Promise((resolve) => setTimeout(resolve, 300));
    // Clean up local file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return {
      url: `https://res.cloudinary.com/demo/image/upload/v12345678/${folder}/mock_image.png`,
      publicId: `mock_id_${Date.now()}`,
    };
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
    });
    // Remove the file from local storage after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    // Make sure we clean up the file even if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  if (!config.cloudinary.cloud_name || config.cloudinary.cloud_name === 'cloudinary_dev_cloud') {
    console.log(`☁️ [Cloudinary Mock Mode] Deleting image ${publicId}`);
    return;
  }
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error(`Failed to delete asset ${publicId} from Cloudinary`, error);
  }
};
