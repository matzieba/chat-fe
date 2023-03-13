export const imageMimes = ['image/png', 'image/jpeg', 'image/svg+xml'];
export const videoMimes = ['video/mp4', 'video/mpeg', 'video/ogg', 'video/webm', 'youtube', 'vimeo'];
export const documentMimes = ['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text', 'application/rtf',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.spreadsheet', 'text/csv', 'application/vnd.ms-powerpoint' ,
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.oasis.opendocument.presentation', 'text/plain'];


export const getFileType = (mime: string): CVT.MaybeNull<CVT.File.FileType> => {
  if (imageMimes.indexOf(mime) > -1) {
    return 'image';
  }
  if (videoMimes.indexOf(mime) > -1) {
    return 'video';
  }
  if (documentMimes.indexOf(mime) > -1) {
    return 'file';
  }

  return 'file';
};

export const bytesToMb = (bytes: number) => bytes / (1024*1024);

export const ExtMimeMap = {
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'pdf': 'application/pdf',
  'doc': 'application/msword',
  'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'odt': 'application/vnd.oasis.opendocument.text',
  'rtf': 'application/rtf',
  'xls': 'application/vnd.ms-excel',
  'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'ods': 'application/vnd.oasis.opendocument.spreadsheet',
  'csv': 'text/csv',
  'ppt': 'application/vnd.ms-powerpoint',
  'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'odp': 'application/vnd.oasis.opendocument.presentation',
  'txt': 'text/plain',
  'mp4': 'video/mp4',
  'mpeg': 'video/mpeg',
  'ogg': 'video/ogg',
  'webm': 'video/webm',
} as const;

export type ExtType = keyof typeof ExtMimeMap;
export type MimeType = typeof ExtMimeMap[ExtType];


function isValidExt(value: string): value is ExtType {
  return value in ExtMimeMap;
}

export const extToMime = (ext: string): CVT.MaybeNull<MimeType> => {
  if (isValidExt(ext)) {
    return ExtMimeMap[ext];
  }
  return null;
};
