/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://webform.site",
  generateRobotsTxt: false,
  exclude: ["/instalatii", "/instalatii/*", "/admin", "/admin/*"],
  changefreq: "weekly",
  priority: 0.7,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: path === "/" ? 1 : config.priority,
      lastmod: new Date().toISOString(),
    };
  },
};
