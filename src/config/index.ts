import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    node_env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
    jwt_secret: process.env.JWT_SECRET || 'supersecret',
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || 'superrefreshsecret',
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || '1d',
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '90d',
    ssl: {
        store_id: process.env.STORE_ID,
        store_pass: process.env.STORE_PASS,
        is_sandbox: process.env.IS_SANDBOX === 'true',
        app_url: process.env.APP_URL || 'http://localhost:5000'
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    },
    email: {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT) || 2525,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        from: process.env.EMAIL_FROM || 'no-reply@theshop.com'
    }
};