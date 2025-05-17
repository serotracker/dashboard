/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/en/Data',
        destination: 'https://sc2.serotracker.com/en/Data',
        permanent: true,
      },
      {
        source: '/fr/Data',
        destination: 'https://sc2.serotracker.com/fr/Data',
        permanent: true,
      },
      {
        source: '/de/Data',
        destination: 'https://sc2.serotracker.com/de/Data',
        permanent: true,
      },
      {
        source: '/en/Unity',
        destination: 'https://sc2.serotracker.com/en/Unity',
        permanent: true,
      },
      {
        source: '/fr/Unity',
        destination: 'https://sc2.serotracker.com/fr/Unity',
        permanent: true,
      },
      {
        source: '/de/Unity',
        destination: 'https://sc2.serotracker.com/de/Unity',
        permanent: true,
      },
      {
        source: '/en/Partnerships/Canada',
        destination: 'https://sc2.serotracker.com/en/Partnerships/Canada',
        permanent: true,
      },
      {
        source: '/fr/Partnerships/Canada',
        destination: 'https://sc2.serotracker.com/fr/Partnerships/Canada',
        permanent: true,
      },
      {
        source: '/de/Partnerships/Canada',
        destination: 'https://sc2.serotracker.com/de/Partnerships/Canada',
        permanent: true,
      },
    ];
  },

  devIndicators: {
    autoPrerender: false,
  },
};

module.exports = nextConfig
