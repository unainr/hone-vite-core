import { createRootRoute, Outlet } from "@tanstack/react-router";


import { ThemeProvider } from "../components/theme-provider";
import { MainHeader } from "../components/layouts/navbar";

const RootLayout = () => (
	<>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<div className="flex min-h-screen flex-col">
				<MainHeader />
				<main className="flex-1">
					<Outlet />
				</main>
				{/* <Footer /> */}
			</div>
		</ThemeProvider>
	</>
);

export const Route = createRootRoute({ component: RootLayout });
