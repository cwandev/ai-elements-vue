import type { InjectionKey, Ref } from 'vue'
import type { ExtendedToolState } from '../types'
import { inject } from 'vue'

export type ToolUIPartApproval
  = | {
    id: string
    approved?: never
    reason?: never
  }
  | {
    id: string
    approved: boolean
    reason?: string
  }
  | undefined

export interface ConfirmationContextValue {
  approval: Ref<ToolUIPartApproval>
  state: Ref<ExtendedToolState>
}

export const ConfirmationKey: InjectionKey<ConfirmationContextValue>
  = Symbol('ConfirmationContext')

export function useConfirmationContext() {
  const context = inject(ConfirmationKey)
  if (!context)
    throw new Error('Confirmation components must be used within <Confirmation>')
  return context
}
