import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/dashboard")({
	component: Dashboard,
});

function Dashboard() {
	return <div className="p-4">Dashboard</div>;
}
