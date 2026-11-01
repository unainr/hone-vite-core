import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Navbar from '../components/layouts/navbar'
import { ThemeProvider } from '../components/theme-provider'

const RootLayout = () => (
  <>
         <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
   <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">

        <Outlet />
      </main>
      {/* <Footer /> */}
      <TanStackRouterDevtools />
    </div>
         </ThemeProvider>
  </>
)

export const Route = createRootRoute({ component: RootLayout })