import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  pnpm: true,
  ignores: [
    '**/.nitro/**',
    'apps/registry/server/assets/**',
  ],
})
