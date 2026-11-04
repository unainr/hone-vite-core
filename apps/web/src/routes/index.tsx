import { createFileRoute } from "@tanstack/react-router";

import { HomeView } from "@/modules/home/views/home-view";

export const Route = createFileRoute("/")({
	component: Index,
});

function Index() {
	return (
		<>
			<HomeView />
		</>
	);
}
