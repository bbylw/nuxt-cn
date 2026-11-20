'use client'

import { useEffect } from 'react'

/**
 * 静态部署后，浏览器/CDN 缓存的旧 HTML 会引用已被新部署删除的旧 chunk，
 * 导致 ChunkLoadError / RSC 加载失败（页面显示 "Application error"）。
 * 检测到这类错误时自动刷新一次，重新拉取最新 HTML。
 */
export function ChunkErrorHandler() {
  useEffect(() => {
    const isStaleAssetError = (reason: unknown) => {
      const e = reason as { name?: string; message?: string } | string | null
      const text = typeof e === 'string' ? e : `${e?.name ?? ''} ${e?.message ?? ''}`
      return /ChunkLoadError|Loading chunk|Failed to fetch RSC payload|Client Manifest/i.test(text)
    }
    const reloadOnce = () => {
      if (sessionStorage.getItem('chunk-error-reloaded')) return
      sessionStorage.setItem('chunk-error-reloaded', '1')
      window.location.reload()
    }
    const onRejection = (e: PromiseRejectionEvent) => {
      if (isStaleAssetError(e.reason)) reloadOnce()
    }
    const onError = (e: ErrorEvent) => {
      if (isStaleAssetError(e.error ?? e.message)) reloadOnce()
    }
    window.addEventListener('unhandledrejection', onRejection)
    window.addEventListener('error', onError)
    return () => {
      window.removeEventListener('unhandledrejection', onRejection)
      window.removeEventListener('error', onError)
    }
  }, [])
  return null
}