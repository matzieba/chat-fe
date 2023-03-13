import { describe, it, expect } from 'vitest'
import { getFileType, bytesToMb, ExtMimeMap, extToMime, imageMimes, videoMimes, documentMimes } from './file';

describe('getFileType', () => {
  it('returns "image" for image mime types', () => {
    imageMimes.forEach((mime) => {
      expect(getFileType(mime)).toBe('image');
    });
  });

  it('returns "video" for video mime types', () => {
    videoMimes.forEach((mime) => {
      expect(getFileType(mime)).toBe('video');
    });
  });

  it('returns "file" for document mime types', () => {
    documentMimes.forEach((mime) => {
      expect(getFileType(mime)).toBe('file');
    });
  });

  it('returns "file" for an unknown mime type', () => {
    expect(getFileType('unknown/mime')).toBe('file');
  });
});

describe('bytesToMb', () => {
  it('converts bytes to megabytes', () => {
    expect(bytesToMb(1024 * 1024)).toBe(1);
  });
});

describe('extToMime', () => {
  it('returns the correct mime type for a valid file extension', () => {
    Object.keys(ExtMimeMap).forEach((ext) => {
    // @ts-ignore
      expect(extToMime(ext)).toBe(ExtMimeMap[ext]);
    });
  });

  it('returns null for an invalid file extension', () => {
    expect(extToMime('invalid')).toBe(null);
  });
});