/** @type {import('next').NextConfig} */
const nextConfig = {

    async redirects() {
        return [
          {
            source: '/',
            destination: '/home',
            permanent: true, // 301 Redirect
          },
        ];
      },
};

export default nextConfig;
