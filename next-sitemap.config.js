const assert = require('assert')

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_VERCEL_URL

assert(
  SITE_URL,
  "Can't generate sitemap without setting NEXT_PUBLIC_SITE_URL or NEXT_PUBLIC_VERCEL_URL"
)

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  exclude: [],
}
