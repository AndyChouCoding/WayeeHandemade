import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const value = process.env.STUDIO_ADMIN_URL;
    if (!value) return [];
    const admin = new URL(value);
    if (!['http:', 'https:'].includes(admin.protocol) || admin.pathname !== '/' || admin.search || admin.hash || admin.username || admin.password) {
      throw new Error('STUDIO_ADMIN_URL must be an HTTP(S) origin without credentials or a path.');
    }
    return {
      beforeFiles: [
        { source: '/assets/:path*', destination: `${admin.origin}/assets/:path*` },
        { source: '/logo.jpg', destination: `${admin.origin}/logo.jpg` },
      ],
      afterFiles: [],
      // Existing /api/booking/* handlers keep priority. Admin auth stays on /api,
      // matching the upstream refresh-cookie path; proxying preserves Set-Cookie.
      fallback: [{ source: '/api/:path*', destination: `${admin.origin}/api/:path*` }],
    };
  },
};

export default nextConfig;
