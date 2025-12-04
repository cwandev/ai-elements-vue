<!-- eslint-disable no-console -->
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
import { Suggestion, Suggestions } from '@repo/elements/suggestion'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/shadcn-vue/components/ui/dropdown-menu'
import { cn } from '@repo/shadcn-vue/lib/utils'
import {
  AudioWaveformIcon,
  BarChartIcon,
  BoxIcon,
  CameraIcon,
  CodeSquareIcon,
  FileIcon,
  GlobeIcon,
  GraduationCapIcon,
  ImageIcon,
  NotepadTextIcon,
  PaperclipIcon,
  ScreenShareIcon,
} from 'lucide-vue-next'
import { nanoid } from 'nanoid'
import { onMounted, onUnmounted, ref } from 'vue'
import { toast } from 'vue-sonner'

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
        status: 'input-available',
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

Both hooks help with *performance optimization*, but they serve different purposes:

### useCallback

\`useCallback\` memoizes **functions** to prevent unnecessary re-renders of child components that receive functions as props.

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

\`useMemo\` memoizes **values** to avoid expensive recalculations on every render.

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

### ~~Deprecated Methods~~

Note that ~~class-based lifecycle methods~~ like \`componentDidMount\` are now replaced by the \`useEffect\` hook in modern React development.`,
      },
    ],
  },
]

const suggestions = [
  { icon: BarChartIcon, text: 'Analyze data', color: '#76d0eb' },
  { icon: BoxIcon, text: 'Surprise me', color: '#76d0eb' },
  { icon: NotepadTextIcon, text: 'Summarize text', color: '#ea8444' },
  { icon: CodeSquareIcon, text: 'Code', color: '#6c71ff' },
  { icon: GraduationCapIcon, text: 'Get advice', color: '#76d0eb' },
  { icon: null, text: 'More' },
]

const mockMessageResponses = [
  'That\'s a great question! Let me help you understand this concept better. The key thing to remember is that proper implementation requires careful consideration of the underlying principles and best practices in the field.',
  'I\'d be happy to explain this topic in detail. From my understanding, there are several important factors to consider when approaching this problem. Let me break it down step by step for you.',
  'This is an interesting topic that comes up frequently. The solution typically involves understanding the core concepts and applying them in the right context. Here\'s what I recommend...',
  'Great choice of topic! This is something that many developers encounter. The approach I\'d suggest is to start with the fundamentals and then build up to more complex scenarios.',
  'That\'s definitely worth exploring. From what I can see, the best way to handle this is to consider both the theoretical aspects and practical implementation details.',
]

const text = ref<string>('')
const useWebSearch = ref<boolean>(false)
const useMicrophone = ref<boolean>(false)
const status = ref<'submitted' | 'streaming' | 'ready' | 'error'>('ready')
const messages = ref<MessageType[]>([])
const streamingMessageId = ref<string | null>(null)

async function streamReasoning(messageKey: string, versionId: string, reasoningContent: string) {
  const words = reasoningContent.split(' ')
  let currentContent = ''

  for (let i = 0; i < words.length; i++) {
    currentContent += (i > 0 ? ' ' : '') + words[i]

    // Find and update the specific message directly
    const msg = messages.value.find(m => m.key === messageKey)
    if (msg && msg.reasoning) {
      msg.reasoning.content = currentContent
    }

    await new Promise(resolve =>
      setTimeout(resolve, Math.random() * 30 + 20),
    )
  }

  // Mark reasoning as complete
  const msg = messages.value.find(m => m.key === messageKey)
  if (msg) {
    msg.isReasoningComplete = true
    msg.isReasoningStreaming = false
  }
}

async function streamContent(messageKey: string, versionId: string, content: string) {
  const words = content.split(' ')
  let currentContent = ''

  for (let i = 0; i < words.length; i++) {
    currentContent += (i > 0 ? ' ' : '') + words[i]

    const msg = messages.value.find(m => m.key === messageKey)
    if (msg) {
      const version = msg.versions.find(v => v.id === versionId)
      if (version) {
        version.content = currentContent
      }
    }

    await new Promise(resolve =>
      setTimeout(resolve, Math.random() * 50 + 25),
    )
  }

  // Mark content as complete
  const msg = messages.value.find(m => m.key === messageKey)
  if (msg) {
    msg.isContentComplete = true
  }
}

async function streamMessageResponse(messageKey: string, versionId: string, content: string, reasoning?: { content: string, duration: number }) {
  status.value = 'streaming'
  streamingMessageId.value = versionId

  // First stream the reasoning if it exists
  if (reasoning) {
    await streamReasoning(messageKey, versionId, reasoning.content)
    await new Promise(resolve => setTimeout(resolve, 500)) // Pause between reasoning and content
  }

  // Then stream the content
  await streamContent(messageKey, versionId, content)

  status.value = 'ready'
  streamingMessageId.value = null
}

async function streamMessage(message: MessageType) {
  if (message.from === 'user') {
    messages.value.push(message)
    return
  }

  // Add empty assistant message with reasoning structure
  const newMessage: MessageType = {
    ...message,
    versions: message.versions.map(v => ({ ...v, content: '' })),
    reasoning: message.reasoning
      ? { ...message.reasoning, content: '' }
      : undefined,
    isReasoningComplete: false,
    isContentComplete: false,
    isReasoningStreaming: !!message.reasoning,
  }

  messages.value.push(newMessage)

  // Get the first version for streaming
  const firstVersion = message.versions[0]
  if (!firstVersion)
    return

  // Stream the response
  await streamMessageResponse(
    newMessage.key,
    firstVersion.id,
    firstVersion.content,
    message.reasoning,
  )
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

  messages.value.push(userMessage)

  setTimeout(() => {
    const assistantMessageKey = `assistant-${Date.now()}`
    const assistantMessageId = `version-${Date.now()}`
    const randomMessageResponse
      = mockMessageResponses[Math.floor(Math.random() * mockMessageResponses.length)]

    // Create reasoning for some responses
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

    messages.value.push(assistantMessage)
    streamMessageResponse(
      assistantMessageKey,
      assistantMessageId,
      randomMessageResponse,
      reasoning,
    )
  }, 500)
}

function handleSubmit(message: PromptInputMessage) {
  const hasText = Boolean(message.text)
  const hasAttachments = Boolean(message.files?.length)

  if (!(hasText || hasAttachments)) {
    return
  }

  status.value = 'submitted'
  addUserMessage(message.text || 'Sent with attachments')
  text.value = ''
}

function handleFileAction(action: string) {
  console.log('hello')
  toast.success('File action', {
    description: action,
  })
}

function handleSuggestionClick(suggestion: string) {
  status.value = 'submitted'
  addUserMessage(suggestion)
}

let initTimer: any

onMounted(() => {
  // Reset state on mount to ensure fresh component
  messages.value = []

  const processMessages = async () => {
    for (let i = 0; i < mockMessages.length; i++) {
      await streamMessage(mockMessages[i])

      if (i < mockMessages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
  }

  // Small delay to ensure state is reset before starting
  initTimer = setTimeout(() => {
    processMessages()
  }, 100)
})

onUnmounted(() => {
  clearTimeout(initTimer)
})
</script>

<template>
  <div class="relative flex size-full flex-col divide-y overflow-hidden">
    <div class="h-[498px] overflow-y-scroll">
      <Conversation>
        <ConversationContent>
          <template v-for="message in messages" :key="message.key">
            <MessageBranch :default-branch="0">
              <MessageBranchContent>
                <template v-for="version in message.versions" :key="`${message.key}-${version.id}`">
                  <Message :from="message.from">
                    <div>
                      <Sources v-if="message.sources?.length">
                        <SourcesTrigger :count="message.sources.length" />
                        <SourcesContent>
                          <Source
                            v-for="source in message.sources"
                            :key="source.href"
                            :href="source.href"
                            :title="source.title"
                          />
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
                          'group-[.is-user]:rounded-[24px] group-[.is-user]:bg-secondary group-[.is-user]:text-foreground',
                          'group-[.is-assistant]:bg-transparent group-[.is-assistant]:p-0 group-[.is-assistant]:text-foreground',
                        )"
                      >
                        <MessageResponse>{{ version.content }}</MessageResponse>
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
          placeholder="Ask anything"
        />

        <PromptInputFooter class="p-2.5">
          <PromptInputTools>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <PromptInputButton
                  class="!rounded-full border font-medium"
                  variant="outline"
                >
                  <PaperclipIcon :size="16" />
                  <span>Attach</span>
                </PromptInputButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem @click="handleFileAction('upload-file')">
                  <FileIcon class="mr-2" :size="16" />
                  Upload file
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleFileAction('upload-photo')">
                  <ImageIcon class="mr-2" :size="16" />
                  Upload photo
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleFileAction('take-screenshot')">
                  <ScreenShareIcon class="mr-2" :size="16" />
                  Take screenshot
                </DropdownMenuItem>
                <DropdownMenuItem @click="handleFileAction('take-photo')">
                  <CameraIcon class="mr-2" :size="16" />
                  Take photo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <PromptInputButton
              class="rounded-full border font-medium"
              variant="outline"
              @click="useWebSearch = !useWebSearch"
            >
              <GlobeIcon :size="16" />
              <span>Search</span>
            </PromptInputButton>
          </PromptInputTools>

          <PromptInputButton
            class="rounded-full font-medium text-foreground"
            variant="secondary"
            @click="useMicrophone = !useMicrophone"
          >
            <AudioWaveformIcon :size="16" />
            <span>Voice</span>
          </PromptInputButton>
        </PromptInputFooter>
      </PromptInput>

      <Suggestions class="px-4">
        <Suggestion
          v-for="item in suggestions"
          :key="item.text"
          class="font-normal"
          :suggestion="item.text"
          @click="handleSuggestionClick(item.text)"
        >
          <component
            :is="item.icon"
            v-if="item.icon"
            :size="16"
            :style="{ color: item.color }"
          />
          {{ item.text }}
        </Suggestion>
      </Suggestions>
    </div>
  </div>
</template>
