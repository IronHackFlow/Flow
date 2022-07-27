import { createReactQueryHooks } from '@trpc/react'
import { AppRouter } from '../../../backend/src/routes/app.router'

export const trpc = createReactQueryHooks<AppRouter>()
