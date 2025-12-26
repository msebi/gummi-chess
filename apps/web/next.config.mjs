import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig = {
  reactStrictMode: true,
  images: {
    // Allow images from the placeholder domain
    // TODO: change image placeholder
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },

  webpack: (config, { isServer }) => {
    // Tell Webpack to not try to bundle the 'fs' module
    // for the client-side build. 'isServer' is usde to 
    // target only the client bundle.
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, 
      };
    }

    return config;
  },
};

export default withFlowbiteReact(nextConfig);