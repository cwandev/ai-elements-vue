<script setup lang="ts">
import type { PromptInputMessage } from '@repo/elements/prompt-input'
import type { ToolUIPart } from 'ai'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@repo/elements/conversation'

import {
  Message,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
} from '@repo/elements/message'
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from '@repo/elements/model-selector'
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputTextarea,
  PromptInputTools,
} from '@repo/elements/prompt-input'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@repo/elements/reasoning'
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@repo/elements/sources'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/shadcn-vue/components/ui/dropdown-menu'
import { cn } from '@repo/shadcn-vue/lib/utils'
import {
  AudioWaveformIcon,
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  FileIcon,
  ImageIcon,
  LightbulbIcon,
  PaperclipIcon,
  ScreenShareIcon,
  SearchIcon,
} from 'lucide-vue-next'
import { nanoid } from 'nanoid'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { toast } from 'vue-sonner'

// ------------------ Types ------------------
interface MessageType {
  key: string
  from: 'user' | 'assistant'
  sources?: { href: string, title: string }[]
  versions: {
    id: string
    content: string
  }[]
  reasoning?: {
    content: string
    duration: number
  }
  tools?: {
    name: string
    description: string
    status: ToolUIPart['state']
    parameters: Record<string, unknown>
    result: string | undefined
    error: string | undefined
  }[]
  isReasoningComplete?: boolean
  isContentComplete?: boolean
  isReasoningStreaming?: boolean
}

// ------------------ Mock data ------------------
const models = [
  {
    id: 'grok-3',
    name: 'Grok-3',
    chef: 'xAI',
    chefSlug: 'xai',
    providers: ['xai'],
  },
  {
    id: 'grok-2-1212',
    name: 'Grok-2-1212',
    chef: 'xAI',
    chefSlug: 'xai',
    providers: ['xai'],
  },
]

const mockMessages: MessageType[] = [
  {
    key: nanoid(),
    from: 'user',
    versions: [
      {
        id: nanoid(),
        content: 'Can you explain how to use React hooks effectively?',
      },
    ],
  },
  {
    key: nanoid(),
    from: 'assistant',
    sources: [
      {
        href: 'https://react.dev/reference/react',
        title: 'React Documentation',
      },
      {
        href: 'https://react.dev/reference/react-dom',
        title: 'React DOM Documentation',
      },
    ],
    tools: [
      {
        name: 'mcp',
        description: 'Searching React documentation',
        status: 'input-available' as ToolUIPart['state'],
        parameters: {
          query: 'React hooks best practices',
          source: 'react.dev',
        },
        result: `{
  "query": "React hooks best practices",
  "results": [
    {
      "title": "Rules of Hooks",
      "url": "https://react.dev/warnings/invalid-hook-call-warning",
      "snippet": "Hooks must be called at the top level of your React function components or custom hooks. Don't call hooks inside loops, conditions, or nested functions."
    },
    {
      "title": "useState Hook",
      "url": "https://react.dev/reference/react/useState",
      "snippet": "useState is a React Hook that lets you add state to your function components. It returns an array with two values: the current state and a function to update it."
    },
    {
      "title": "useEffect Hook",
      "url": "https://react.dev/reference/react/useEffect",
      "snippet": "useEffect lets you synchronize a component with external systems. It runs after render and can be used to perform side effects like data fetching."
    }
  ]
}`,
        error: undefined,
      },
    ],
    versions: [
      {
        id: nanoid(),
        content: `# React Hooks Best Practices

React hooks are a powerful feature that let you use state and other React features without writing classes. Here are some tips for using them effectively:

## Rules of Hooks

1. **Only call hooks at the top level** of your component or custom hooks
2. **Don't call hooks inside loops, conditions, or nested functions**

## Common Hooks

- **useState**: For local component state
- **useEffect**: For side effects like data fetching
- **useContext**: For consuming context
- **useReducer**: For complex state logic
- **useCallback**: For memoizing functions
- **useMemo**: For memoizing values

## Example of useState and useEffect

\`\`\`jsx
function ProfilePage({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // This runs after render and when userId changes
    fetchUser(userId).then(userData => {
      setUser(userData);
    });
  }, [userId]);
  
  return user ? <Profile user={user} /> : <Loading />;
}
\`\`\`

Would you like me to explain any specific hook in more detail?`,
      },
    ],
  },
  {
    key: nanoid(),
    from: 'user',
    versions: [
      {
        id: nanoid(),
        content:
          'Yes, could you explain useCallback and useMemo in more detail? When should I use one over the other?',
      },
      {
        id: nanoid(),
        content:
          'I\'m particularly interested in understanding the performance implications of useCallback and useMemo. Could you break down when each is most appropriate?',
      },
      {
        id: nanoid(),
        content:
          'Thanks for the overview! Could you dive deeper into the specific use cases where useCallback and useMemo make the biggest difference in React applications?',
      },
    ],
  },
  {
    key: nanoid(),
    from: 'assistant',
    reasoning: {
      content: `The user is asking for a detailed explanation of useCallback and useMemo. I should provide a clear and concise explanation of each hook's purpose and how they differ.
      
The useCallback hook is used to memoize functions to prevent unnecessary re-renders of child components that receive functions as props.

The useMemo hook is used to memoize values to avoid expensive recalculations on every render.

Both hooks help with performance optimization, but they serve different purposes.`,
      duration: 10,
    },
    versions: [
      {
        id: nanoid(),
        content: `## useCallback vs useMemo

Both hooks help with **performance optimization**, but they serve _different purposes_:

### useCallback

\`useCallback\` memoizes __functions__ to prevent unnecessary re-renders of child components that receive functions as props.

\`\`\`jsx
// Without useCallback - a new function is created on every render
const handleClick = () => {
  console.log(count);
};

// With useCallback - the function is only recreated when dependencies change
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
\`\`\`

### useMemo

\`useMemo\` memoizes *values* to avoid expensive recalculations on every render.

\`\`\`jsx
// Without useMemo - expensive calculation runs on every render
const sortedList = expensiveSort(items);

// With useMemo - calculation only runs when items change
const sortedList = useMemo(() => expensiveSort(items), [items]);
\`\`\`

### When to use which?

- Use **useCallback** when:
  - Passing callbacks to optimized child components that rely on reference equality
  - Working with event handlers that you pass to child components

- Use **useMemo** when:
  - You have computationally expensive calculations
  - You want to avoid recreating objects that are used as dependencies for other hooks

### Performance Note

Don't overuse these hooks! They come with their own overhead. Only use them when you have identified a genuine performance issue.

### ~~Legacy Patterns~~

Remember that these ~~outdated approaches~~ should be avoided:
- ~~Class components for simple state~~ - Use \`useState\` instead
- ~~Manual event listener cleanup~~ - Let \`useEffect\` handle it`,
      },
    ],
  },
]

const mockMessageResponses = [
  'That\'s a great question! Let me help you understand this concept better. The key thing to remember is that proper implementation requires careful consideration of the underlying principles and best practices in the field.',
  'I\'d be happy to explain this topic in detail. From my understanding, there are several important factors to consider when approaching this problem. Let me break it down step by step for you.',
  'This is an interesting topic that comes up frequently. The solution typically involves understanding the core concepts and applying them in the right context. Here\'s what I recommend...',
  'Great choice of topic! This is something that many developers encounter. The approach I\'d suggest is to start with the fundamentals and then build up to more complex scenarios.',
  'That\'s definitely worth exploring. From what I can see, the best way to handle this is to consider both the theoretical aspects and practical implementation details.',
]

// ------------------ Reactive state ------------------
const model = ref<string>(models[0].id)
const modelSelectorOpen = ref(false)
const text = ref<string>('')
const useWebSearch = ref<boolean>(false)
const useMicrophone = ref<boolean>(false)
const status = ref<'submitted' | 'streaming' | 'ready' | 'error'>('ready')
const messages = ref<MessageType[]>([])
const streamingMessageId = ref<string | null>(null)

const selectedModelData = computed(() => models.find(m => m.id === model.value))

const timers: (number | NodeJS.Timeout)[] = []

// ------------------ Streaming helpers ------------------
function sleep(ms: number) {
  return new Promise((resolve) => {
    const t = window.setTimeout(resolve, ms)
    timers.push(t)
  })
}

async function streamReasoning(messageKey: string, versionId: string, reasoningContent: string) {
  const words = reasoningContent.split(' ')
  let currentContent = ''

  for (let i = 0; i < words.length; i++) {
    currentContent += (i > 0 ? ' ' : '') + words[i]

    messages.value = messages.value.map((msg) => {
      if (msg.key === messageKey) {
        return {
          ...msg,
          reasoning: msg.reasoning ? { ...msg.reasoning, content: currentContent } : undefined,
        }
      }
      return msg
    })

    await sleep(Math.random() * 30 + 20)
  }

  messages.value = messages.value.map((msg) => {
    if (msg.key === messageKey) {
      return {
        ...msg,
        isReasoningComplete: true,
        isReasoningStreaming: false,
      }
    }
    return msg
  })
}

async function streamContent(messageKey: string, versionId: string, content: string) {
  const words = content.split(' ')
  let currentContent = ''

  for (let i = 0; i < words.length; i++) {
    currentContent += (i > 0 ? ' ' : '') + words[i]

    messages.value = messages.value.map((msg) => {
      if (msg.key === messageKey) {
        return {
          ...msg,
          versions: msg.versions.map(v => (v.id === versionId ? { ...v, content: currentContent } : v)),
        }
      }
      return msg
    })

    await sleep(Math.random() * 50 + 25)
  }

  messages.value = messages.value.map((msg) => {
    if (msg.key === messageKey) {
      return { ...msg, isContentComplete: true }
    }
    return msg
  })
}

async function streamMessageResponse(
  messageKey: string,
  versionId: string,
  content: string,
  reasoning?: { content: string, duration: number },
) {
  status.value = 'streaming'
  streamingMessageId.value = versionId

  if (reasoning) {
    await streamReasoning(messageKey, versionId, reasoning.content)
    await sleep(500)
  }

  await streamContent(messageKey, versionId, content)

  status.value = 'ready'
  streamingMessageId.value = null
}

async function streamMessage(message: MessageType) {
  if (message.from === 'user') {
    messages.value = [...messages.value, message]
    return
  }

  const newMessage: MessageType = {
    ...message,
    versions: message.versions.map(v => ({ ...v, content: '' })),
    reasoning: message.reasoning ? { ...message.reasoning, content: '' } : undefined,
    isReasoningComplete: false,
    isContentComplete: false,
    isReasoningStreaming: !!message.reasoning,
  }

  messages.value = [...messages.value, newMessage]

  const firstVersion = message.versions[0]
  if (!firstVersion)
    return

  await streamMessageResponse(newMessage.key, firstVersion.id, firstVersion.content, message.reasoning)
}

function addUserMessage(content: string) {
  const userMessage: MessageType = {
    key: `user-${Date.now()}`,
    from: 'user',
    versions: [
      {
        id: `user-${Date.now()}`,
        content,
      },
    ],
  }

  messages.value = [...messages.value, userMessage]

  const timer = setTimeout(() => {
    const assistantMessageKey = `assistant-${Date.now()}`
    const assistantMessageId = `version-${Date.now()}`
    const randomMessageResponse = mockMessageResponses[Math.floor(Math.random() * mockMessageResponses.length)]

    const shouldHaveReasoning = Math.random() > 0.5
    const reasoning = shouldHaveReasoning
      ? {
          content:
            'Let me think about this question carefully. I need to provide a comprehensive and helpful response that addresses the user\'s needs while being clear and concise.',
          duration: 3,
        }
      : undefined

    const assistantMessage: MessageType = {
      key: assistantMessageKey,
      from: 'assistant',
      versions: [
        {
          id: assistantMessageId,
          content: '',
        },
      ],
      reasoning: reasoning ? { ...reasoning, content: '' } : undefined,
      isReasoningComplete: false,
      isContentComplete: false,
      isReasoningStreaming: !!reasoning,
    }

    messages.value = [...messages.value, assistantMessage]
    streamMessageResponse(
      assistantMessageKey,
      assistantMessageId,
      randomMessageResponse,
      reasoning,
    )
  }, 500)
  timers.push(timer)
}

onMounted(() => {
  messages.value = []

  const processMessages = async () => {
    for (let i = 0; i < mockMessages.length; i++) {
      await streamMessage(mockMessages[i])

      if (i < mockMessages.length - 1) {
        await sleep(1000)
      }
    }
  }

  const timer = setTimeout(() => {
    processMessages()
  }, 100)
  timers.push(timer)
})

onBeforeUnmount(() => {
  timers.forEach(t => clearTimeout(t))
  messages.value = []
})

function handleSubmit(message: PromptInputMessage) {
  const hasText = !!message.text
  const hasAttachments = !!message.files?.length

  if (!hasText && !hasAttachments) {
    return
  }

  status.value = 'submitted'
  addUserMessage(message.text || 'Sent with attachments')
  text.value = ''
}

function handleFileAction(action: string) {
  toast.success('File action', {
    description: action,
  })
}
</script>

<template>
  <div class="relative flex size-full flex-col divide-y overflow-hidden bg-secondary">
    <div class="h-[498px] overflow-y-scroll">
      <Conversation>
        <ConversationContent>
          <template
            v-for="message in messages"
            :key="message.key"
          >
            <MessageBranch :default-branch="0">
              <MessageBranchContent>
                <template
                  v-for="version in message.versions"
                  :key="`${message.key}-${version.id}`"
                >
                  <Message :from="message.from">
                    <div>
                      <Sources v-if="message.sources?.length">
                        <SourcesTrigger :count="message.sources.length" />
                        <SourcesContent>
                          <template
                            v-for="source in message.sources"
                            :key="source.href"
                          >
                            <Source
                              :href="source.href"
                              :title="source.title"
                            />
                          </template>
                        </SourcesContent>
                      </Sources>
                      <Reasoning
                        v-if="message.reasoning"
                        :duration="message.reasoning.duration"
                        :is-streaming="message.isReasoningStreaming"
                      >
                        <ReasoningTrigger />
                        <ReasoningContent :content="message.reasoning.content" />
                      </Reasoning>
                      <MessageContent
                        v-if="message.from === 'user' || message.isReasoningComplete || !message.reasoning"
                        :class="cn(
                          'group-[.is-user]:rounded-[24px] group-[.is-user]:rounded-br-sm group-[.is-user]:border group-[.is-user]:bg-background group-[.is-user]:text-foreground',
                          'group-[.is-assistant]:bg-transparent group-[.is-assistant]:p-0 group-[.is-assistant]:text-foreground',
                        )"
                      >
                        <MessageResponse :content="version.content" />
                      </MessageContent>
                    </div>
                  </Message>
                </template>
              </MessageBranchContent>
              <MessageBranchSelector
                v-if="message.versions.length > 1"
                class="px-0"
                :from="message.from"
              >
                <MessageBranchPrevious />
                <MessageBranchPage />
                <MessageBranchNext />
              </MessageBranchSelector>
            </MessageBranch>
          </template>
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
    </div>
    <div class="grid shrink-0 gap-4 p-4">
      <PromptInput
        class="divide-y-0 rounded-[28px]"
        @submit="handleSubmit"
      >
        <PromptInputTextarea
          v-model="text"
          class="px-5 md:text-base"
          placeholder="How can Grok help?"
        />
        <PromptInputFooter class="p-2.5">
          <PromptInputTools>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <PromptInputButton
                  class="!rounded-full border text-foreground"
                  variant="outline"
                >
                  <PaperclipIcon :size="16" />
                  <span class="sr-only">Attach</span>
                </PromptInputButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem @click="handleFileAction('upload-file')">
                  <FileIcon
                    class="mr-2"
                    :size="16"
                  />
                  Upload file
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleFileAction('upload-photo')">
                  <ImageIcon
                    class="mr-2"
                    :size="16"
                  />
                  Upload photo
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleFileAction('take-screenshot')">
                  <ScreenShareIcon
                    class="mr-2"
                    :size="16"
                  />
                  Take screenshot
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleFileAction('take-photo')">
                  <CameraIcon
                    class="mr-2"
                    :size="16"
                  />
                  Take photo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div class="flex items-center rounded-full border">
              <PromptInputButton
                class="!rounded-l-full text-foreground"
                variant="ghost"
                @click="useWebSearch = !useWebSearch"
              >
                <SearchIcon :size="16" />
                <span>DeepSearch</span>
              </PromptInputButton>
              <div class="h-full w-px bg-border" />
              <PromptInputButton
                class="rounded-r-full"
                size="icon-sm"
                variant="ghost"
              >
                <ChevronDownIcon :size="16" />
              </PromptInputButton>
            </div>
            <PromptInputButton
              class="!rounded-full text-foreground"
              variant="outline"
            >
              <LightbulbIcon :size="16" />
              <span>Think</span>
            </PromptInputButton>
          </PromptInputTools>
          <div class="flex items-center gap-2">
            <ModelSelector v-model:open="modelSelectorOpen">
              <ModelSelectorTrigger as-child>
                <PromptInputButton>
                  <ModelSelectorLogo
                    v-if="selectedModelData?.chefSlug"
                    :provider="selectedModelData.chefSlug"
                  />
                  <ModelSelectorName v-if="selectedModelData?.name">
                    {{ selectedModelData.name }}
                  </ModelSelectorName>
                </PromptInputButton>
              </ModelSelectorTrigger>
              <ModelSelectorContent>
                <ModelSelectorInput placeholder="Search models..." />
                <ModelSelectorList>
                  <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                  <ModelSelectorGroup heading="xAI">
                    <template
                      v-for="m in models"
                      :key="m.id"
                    >
                      <ModelSelectorItem
                        :value="m.id"
                        @select="() => { model = m.id; modelSelectorOpen = false; }"
                      >
                        <ModelSelectorLogo :provider="m.chefSlug" />
                        <ModelSelectorName>{{ m.name }}</ModelSelectorName>
                        <ModelSelectorLogoGroup>
                          <template
                            v-for="provider in m.providers"
                            :key="provider"
                          >
                            <ModelSelectorLogo :provider="provider" />
                          </template>
                        </ModelSelectorLogoGroup>
                        <CheckIcon
                          v-if="model === m.id"
                          class="ml-auto size-4"
                        />
                        <div
                          v-else
                          class="ml-auto size-4"
                        />
                      </ModelSelectorItem>
                    </template>
                  </ModelSelectorGroup>
                </ModelSelectorList>
              </ModelSelectorContent>
            </ModelSelector>
            <PromptInputButton
              class="rounded-full bg-foreground font-medium text-background"
              variant="default"
              @click="useMicrophone = !useMicrophone"
            >
              <AudioWaveformIcon :size="16" />
              <span class="sr-only">Voice</span>
            </PromptInputButton>
          </div>
        </PromptInputFooter>
      </PromptInput>
    </div>
  </div>
</template>
