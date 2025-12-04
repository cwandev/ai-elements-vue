<script setup>
import { Toaster } from '@repo/shadcn-vue/components/ui/sonner'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@repo/shadcn-vue/components/ui/tabs'
import 'vue-sonner/style.css'

const tabs = [
  {
    name: 'ChatGPT',
    alt: 'OpenAI',
    componentName: 'ChatGPTExample',
  },
  {
    name: 'Claude',
    alt: 'Anthropic',
    componentName: 'ClaudeExample',
  },
  {
    name: 'Grok',
    alt: 'X AI',
    componentName: 'GrokExample',
  },
]

const defaultTab = tabs[0].name
</script>

<template>
  <Toaster />

  <div class="my-4 w-full rounded-lg border">
    <Tabs :default-value="defaultTab">
      <TabsList class="w-full justify-start rounded-none border-b bg-muted/50 p-0">
        <TabsTrigger
          v-for="tab in tabs"
          :key="tab.name"
          :value="tab.name"
          class="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background"
        >
          {{ tab.name }}
        </TabsTrigger>
      </TabsList>

      <TabsContent
        v-for="tab in tabs"
        :key="tab.name"
        :value="tab.name"
        class="m-0 p-0"
      >
        <div class="">
          <ComponentViewer :component-name="tab.componentName" />
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
