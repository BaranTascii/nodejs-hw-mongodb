import multer from 'multer';

const storage = multer.memoryStorage();
export const uploadSingle = (fieldName = 'photo') => multer({ storage }).single(fieldName);
