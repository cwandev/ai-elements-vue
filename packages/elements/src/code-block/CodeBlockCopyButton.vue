<script setup lang="ts">
import { Button } from '@repo/shadcn-vue/components/ui/button'
import { cn } from '@repo/shadcn-vue/lib/utils'
import { CheckIcon, CopyIcon } from 'lucide-vue-next'
import { computed, inject, ref } from 'vue'

interface Props {
  onCopy?: () => void
  onError?: (error: Error) => void
  timeout?: number
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  timeout: 2000,
})

const emit = defineEmits<{
  copy: []
  error: [error: Error]
}>()

const isCopied = ref(false)
const code = inject<string>('codeBlockCode', '')

async function copyToClipboard() {
  if (typeof window === 'undefined' || !navigator.clipboard?.writeText) {
    const error = new Error('Clipboard API not available')
    props.onError?.(error)
    emit('error', error)
    return
  }

  try {
    await navigator.clipboard.writeText(code)
    isCopied.value = true
    props.onCopy?.()
    emit('copy')
    setTimeout(() => {
      isCopied.value = false
    }, props.timeout)
  }
  catch (error) {
    const err = error as Error
    props.onError?.(err)
    emit('error', err)
  }
}

const Icon = computed(() => isCopied.value ? CheckIcon : CopyIcon)
</script>

<template>
  <Button
    :class="cn('shrink-0', props.class)"
    size="icon"
    variant="ghost"
    @click="copyToClipboard"
  >
    <Icon :size="14" />
  </Button>
</template>
