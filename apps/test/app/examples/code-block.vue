<script setup lang="ts">
import { CodeBlock, CodeBlockCopyButton } from '@repo/elements/code-block'

const code = `<template>
  <div>
    <h1>Hello, {{ name }}!</h1>
    <p>This is an example Vue component.</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
}

defineProps<Props>()
<\/script>`
</script>

<template>
  <CodeBlock :code="code" lang="vue">
    <CodeBlockCopyButton
      @copy="() => console.log('Copied code to clipboard')"
      @error="() => console.error('Failed to copy code to clipboard')"
    />
  </CodeBlock>
</template>
