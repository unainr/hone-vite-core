import { createRootRoute, Outlet } from "@tanstack/react-router";

import { ThemeProvider } from "../components/theme-provider";

const RootLayout = () => (
	<>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			
			
					<Outlet />
			
			
		</ThemeProvider>
	</>
);

export const Route = createRootRoute({ component: RootLayout });
