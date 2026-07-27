<script setup lang="ts"></script>

<template>
  <section class="relative py-24 sm:py-32 border-t border-white/5">
    <div class="mx-auto max-w-5xl px-6">
      <div class="reveal relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a0a2e] via-[#020420] to-[#0a0a2e] p-10 sm:p-16 text-center">
        <!-- 装饰 -->
        <div class="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-96 rounded-full bg-emerald-500/15 blur-[100px] pointer-events-none" />
        <div class="absolute -bottom-20 left-1/2 -translate-x-1/2 h-60 w-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

        <div class="relative">
          <h2 class="font-display text-3xl sm:text-5xl font-semibold tracking-tight text-white">
            准备好<span class="text-gradient">构建未来</span>了吗？
          </h2>
          <p class="mx-auto mt-5 max-w-xl text-gray-400 text-base sm:text-lg">
            从 nuxt.new 一键启动你的项目，几秒钟即可在 CodeSandbox、StackBlitz 或本地运行起来。
          </p>
          <div class="mt-9 flex flex-wrap items-center justify-center gap-3">
            <UButton
              to="https://nuxt.new"
              target="_blank"
              size="xl"
              class="bg-emerald-400 hover:bg-emerald-300 text-[#020420] font-semibold px-7"
              trailing-icon="i-lucide-external-link"
            >
              nuxt.new 在线体验
            </UButton>
            <UButton
              to="https://nuxt.com/modules"
              target="_blank"
              size="xl"
              variant="outline"
              color="neutral"
              class="border-white/15 hover:border-white/30"
              icon="i-lucide-puzzle"
            >
              浏览 300+ 模块
            </UButton>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
