import { toRefs } from '@vueuse/core'
import { useSelector } from '@xstate/vue'

import { useAuthInterpreter } from './useAuthInterpreter'

/**
 * Use `useAuthenticationStatus` to get the authentication status for the user.
 *
 * @example
 * ```tsx
 * const { isAuthenticated, isLoading } = useAuthenticationStatus();
 * ```
 */
export const useAuthenticationStatus = () => {
  const service = useAuthInterpreter()
  return toRefs(
    useSelector(
      service.value,
      (state) => ({
        isAuthenticated: state.matches({ authentication: 'signedIn' }),
        isLoading: state.hasTag('loading'),
        error: state.context.errors.authentication || null,
        isError: state.matches({ authentication: { signedOut: 'failed' } })
      }),
      (a, b) => a.isAuthenticated === b.isAuthenticated && a.isLoading === b.isLoading
    )
  )
}
