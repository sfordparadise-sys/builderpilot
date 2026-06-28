/** @type {import('next').NextConfig} */
// basePath/assetPrefix are only needed for GitHub Pages project-repo hosting
// (username.github.io/builderpilot). For root-domain hosts like Netlify, leave
// them unset so assets resolve from "/". Toggle with GITHUB_PAGES=true.
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  output: 'export',
  ...(isGitHubPages
    ? { basePath: '/builderpilot', assetPrefix: '/builderpilot/' }
    : {}),
};

module.exports = nextConfig;
