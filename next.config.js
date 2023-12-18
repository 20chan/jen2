const {
  PHASE_PRODUCTION_BUILD,
  PHASE_PRODUCTION_SERVER,
} = require('next/dist/shared/lib/constants')

const nextConfig = (phase) => {
  /** @type {import('next').NextConfig} */

  const isProd = (
    process.env.NODE_ENV === 'production'
    || phase === PHASE_PRODUCTION_BUILD
    || phase === PHASE_PRODUCTION_SERVER
  );

  return {
    distDir: isProd ? '.next.prod' : '.next.dev',
    experimental: {
      serverActions: true,
    },
  }
}

module.exports = nextConfig
