/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: false,
};

module.exports = {
  ...nextConfig,
  nonExplicitSupportedLngs: true,
  optimizeFonts: false,
  // async redirects() {
  // 	return [
  // 		{
  // 			source: '/?isMaintenance=true',
  // 			destination: '/maintenance',
  // 			permanent: true,
  // 		},
  //     {
  // 			source: '/login?isMaintenance=true',
  // 			destination: '/maintenance',`
  // 			permanent: true,
  // 		},
  //     {
  // 			source: '/register?isMaintenance=true',
  // 			destination: '/maintenance',
  // 			permanent: true,
  // 		},
  // 	];
  // },
  // distDir: process.env.BUILD_DIR || '.next',
  env: {
    ...this.env,
  },

  images: {
    domains: ["*"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'vn', 'fr', 'es'],
    localeDetection: false
  },
  // generateBuildId: async () => {
  // 	return 'debeers_v1.004_gE8hdJlbg5rGidBai3lSR'
  // },
};