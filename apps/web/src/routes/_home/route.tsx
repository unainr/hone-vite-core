import { MainHeader } from "@/components/layouts/navbar";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_home")({
    component: () => (
       <div className="flex min-h-screen flex-col">
                    <MainHeader />
                    <main className="flex-1">
                        <Outlet />
                    </main>
                    {/* <Footer /> */}
                </div>
    ),
});
