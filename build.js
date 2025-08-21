import esbuild from 'esbuild';
import { aliasPath } from 'esbuild-plugin-alias-path';

esbuild
  .build({
    entryPoints: ['src/app.ts'],
    bundle: true,
    outfile: 'dist/app.js',
    platform: 'node',
    target: 'es2022',
    format: 'esm',
    sourcemap: true,
    external: [
      'node:*', 
      'got', 
      'keyv',
      'cacheable-request',
      '@hono/node-server', 
      'hono', 
      'zod',
    ],
    plugins: [
      aliasPath({
        alias: {
          '@': './src',
          '@/lib': './src/lib',
          '@/modules': './src/modules',
        },
      }),
    ],
  })
  .then(() => {
    console.log('Build completed');
  })
  .catch((error) => {
    console.error('Build failed:', error);
    process.exit(1);
  });