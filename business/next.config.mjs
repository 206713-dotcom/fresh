/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow WebWorker and WebGPU modules for web-llm if loaded client-side
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        perf_hooks: false,
      };
    }
    return config;
  },
};

export default nextConfig;
