<script setup lang="ts">
import type { BuiltinTheme, BundledLanguage } from 'shiki'
import { cn } from '@repo/shadcn-vue/lib/utils'
import CodeBlock from 'shiki-block-vue'
import { computed, provide, useAttrs } from 'vue'

interface Props {
  code: string
  lang: BundledLanguage
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})

const theme: { light: BuiltinTheme, dark: BuiltinTheme } = {
  light: 'vitesse-light',
  dark: 'vitesse-dark',
}

const attrs = useAttrs()

provide('codeBlockCode', props.code)

const classes = computed(() => cn(
  'relative w-full overflow-hidden rounded-md border bg-background text-foreground',
  props.class,
))
</script>

<template>
  <div :class="classes" v-bind="attrs">
    <div class="relative">
      <CodeBlock
        :lang="props.lang"
        :code="props.code"
        :theme="theme"
        class="overflow-hidden"
      />
      <div v-if="$slots.default" class="absolute top-2 right-2 flex items-center gap-2 z-10 text-muted-foreground dark:text-white/80">
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .shiki,
  .shiki span {
    color: var(--shiki-dark) !important;
    background-color: var(--shiki-dark-bg) !important;
    /* Optional, if you also want font styles */
    font-style: var(--shiki-dark-font-style) !important;
    font-weight: var(--shiki-dark-font-weight) !important;
    text-decoration: var(--shiki-dark-text-decoration) !important;
  }
}

html.dark .shiki,
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style) !important;
  font-weight: var(--shiki-dark-font-weight) !important;
  text-decoration: var(--shiki-dark-text-decoration) !important;
}

.shiki--code--block {
  width: 100%;
}

pre {
  z-index: 1;
  padding: 24px;
  border-radius: 10px;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  position: relative;
  background-color: #F9F9F9 !important;
}

code {
  display: block;
  line-height: 1.7;
  font-size: 15px;
}
</style>
