import path from 'path';

const config = {
  webpack: {
    alias: {
      '@cvt': path.resolve(__dirname, 'src/core'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@modules': path.resolve(__dirname, 'src/modules'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
};

export default config;
