import { useState } from "react";

import { MenuIcon, XIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { Link } from "@tanstack/react-router";
import { ModeToggle } from "../mode-toggle";
import Logo from "./logo";
import { AppHeader } from "@/modules/auth/components/app-header";

const menuItems = [
	{ name: "Home", href: "/" },
	{ name: "About", href: "/about" },
];

export function MainHeader() {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<>
			{/* Floating dock — detached pill, centered, not full-width */}
			<header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
				<div
					className={cn(
						"flex h-14 items-center gap-1 rounded-full",
						"bg-background/70 px-2 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl",
						"supports-backdrop-filter:bg-background/60",
					)}>
					{/* Logo */}
					<div className="mx-1.5 flex items-center justify-center">
						<Logo />
					</div>

					<div className="mx-1 h-6 w-px bg-border/70" />

					{/* Desktop links */}
					<ul className="hidden items-center gap-1 lg:flex">
						{menuItems.map((item) => {
							return (
								<li key={item.href}>
									<Link
										to={item.href}
										className={cn(
											"relative flex h-10 items-center rounded-full px-4 text-sm font-medium transition-colors duration-150 active:bg-amber-400/10",
										)}>
										{item.name}
									</Link>
								</li>
							);
						})}
					</ul>

					<div className="mx-1 hidden h-6 w-px bg-border/70 sm:block" />

					{/* Theme switcher */}
					<div className="flex items-center justify-center">
						<ModeToggle />
					</div>

					<div className="mx-1 hidden h-6 w-px bg-border/70 lg:block" />

					{/* Sign in */}
					<div className="hidden items-center justify-center lg:flex">
						<AppHeader />
					</div>

					{/* Mobile toggle */}
					<div className="flex items-center justify-center lg:hidden">
						<button
							onClick={() => setMenuOpen((v) => !v)}
							className={cn(
								"flex h-9.5 w-9.5 items-center justify-center rounded-full text-muted-foreground transition-colors",
								"hover:text-foreground",
							)}
							aria-label={menuOpen ? "Close menu" : "Open menu"}
							aria-expanded={menuOpen}>
							{menuOpen ? (
								<XIcon className="size-4.5" />
							) : (
								<MenuIcon className="size-4.5" />
							)}
						</button>
					</div>
				</div>
			</header>

			{/* Spacer so page content isn't hidden under the floating dock */}
			<div className="h-20" />

			{/* Mobile drawer */}
			<div
				className={cn(
					"fixed inset-x-4 top-20 z-40 overflow-hidden rounded-3xl bg-background/95 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-[max-height,opacity] duration-200 lg:hidden",
					menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
				)}>
				<nav className="flex flex-col gap-1 p-4">
					{menuItems.map((item) => {
						return (
							<Link
								key={item.href}
								to={item.href}
								onClick={() => setMenuOpen(false)}
								className={cn(
									"rounded-full px-3.5 py-2.5 text-sm font-medium transition-colors active:bg-accent/10",
								)}>
								{item.name}
							</Link>
						);
					})}

					<div className="mt-3 flex gap-4 border-t border-border pt-3">
						{/* <SignInButtonClerk /> */}
					</div>
				</nav>
			</div>
		</>
	);
}
