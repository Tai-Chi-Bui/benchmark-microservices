/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    // This options allow hot reload on docker window destop for this app 
    webpack: config => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        }
        return config
    },
    async redirects() {
        return [
          {
            source: '/', // The root path to match
            destination: '/home', // The target path to redirect to
            permanent: false, // Use a 302 redirect, which is temporary
          },
            // You can add more redirects here if needed
        ];
      },
};

export default nextConfig;
