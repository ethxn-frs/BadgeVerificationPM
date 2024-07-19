import multer from 'multer';
import path from 'path';

// Configure storage settings for multer
const storage = multer.diskStorage({
    // Set the destination for uploaded files
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    // Set the filename for uploaded files
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Configure multer for file upload handling
const upload = multer({
    storage: storage,
    // Filter to allow only certain file types
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return cb(new Error('Only images are allowed') as unknown as null, false);
        }
        cb(null, true);
    }
});

export default upload;
