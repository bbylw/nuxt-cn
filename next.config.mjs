/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // micromark 的 development 导出（dev 构建）在解析部分 MDC 文档时会触发
  // "could not find previous flow chunk" 断言；交给 Node 加载生产构建即可
  serverExternalPackages: ['micromark'],
}

export default nextConfig
