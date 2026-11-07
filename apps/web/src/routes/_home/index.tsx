import { createFileRoute } from "@tanstack/react-router";

import { TodoForm } from "@/components/todo-form";

export const Route = createFileRoute("/_home/")({
	component: Index,
});

function Index() {
	return (
		<>
			<TodoForm />
		</>
	);
}
