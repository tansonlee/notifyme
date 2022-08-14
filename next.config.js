/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	async rewrites() {
		return [
			{
				source: '/api/*',
				destination: 'http://localhost:3000/*',
			},
			{
				source: '/api/*',
				destination: 'http://localhost:3001/*',
			},
		];
	},
};

module.exports = nextConfig;
