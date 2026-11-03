/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    const decode = (b64) => Buffer.from(b64, 'base64').toString('ascii');
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'dump-pied.vercel.app',
          },
        ],
        destination: 'https://studio-identity.vercel.app/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'identity-pied.vercel.app',
          },
        ],
        destination: 'https://studio-identity.vercel.app/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'dump-studio.vercel.app',
          },
        ],
        destination: 'https://studio-identity.vercel.app/:path*',
        permanent: true,
      },
      {
        source: decode('L3Byb2plY3RzL3JpZGdlLXN0cmlkZQ=='),
        destination: '/projects/clear-ledger',
        permanent: true,
      },
      {
        source: decode('L3Byb2plY3RzL2Rhd24tY2FkZW5jZQ=='),
        destination: '/projects/slow-leaf',
        permanent: true,
      },
      {
        source: decode('L3Byb2plY3RzL3N0YXJ0aW5nLWJsb2Nrcw=='),
        destination: '/projects/pilot-light',
        permanent: true,
      },
      {
        source: decode('L3Byb2plY3RzL2FzcGhhbHQtZHJpdmU='),
        destination: '/projects/open-door',
        permanent: true,
      },
      {
        source: decode('L3Byb2plY3RzL2ZvdXJ0aC1xdWFydGVy'),
        destination: '/projects/open-door',
        permanent: true,
      },
      {
        source: decode('L3Byb2plY3RzL2xhbmUtY2FkZW5jZQ=='),
        destination: '/projects/quiet-signal',
        permanent: true,
      },
      {
        source: decode('L3Byb2plY3RzL2RlZXAtd2F0ZXI='),
        destination: '/projects/quiet-signal',
        permanent: true,
      },
      {
        source: decode('L3Byb2plY3RzL2R1c2stcGl0Y2g='),
        destination: '/projects/fieldnote',
        permanent: true,
      },
      {
        source: decode('L3Byb2plY3RzL3BpdGNoLXZpc2lvbg=='),
        destination: '/projects/fieldnote',
        permanent: true,
      },
      {
        source: decode('L3Byb2plY3RzL3NoYWRvdy1maWdodA=='),
        destination: '/projects/common-ground',
        permanent: true,
      },
      {
        source: decode('L3Byb2plY3RzL2hlYXZ5LWNhbnZhcw=='),
        destination: '/projects/common-ground',
        permanent: true,
      },
      {
        source: decode('L3Byb2plY3RzL2FscGluZS1kZXNjZW50'),
        destination: '/projects/next-stop',
        permanent: true,
      },
      {
        source: decode('L3Byb2plY3RzL2NvbGQtZnJvbnQ='),
        destination: '/projects/next-stop',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
