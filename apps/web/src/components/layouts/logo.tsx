import { Link } from "@tanstack/react-router";

const Logo = () => {
	return (
		<Link to="/" className="flex items-center gap-2 ">
			<img
				className="h-auto w-auto hidden dark:block"
				src="/vite.svg" // or your public path
				alt="amanises Logo"
				width={120}
				height={50}
			/>
			<img
				src="/vite.svg" // or your public path
				alt="amanises Logo"

				width={120}
				height={50}

				className="h-auto w-auto object-contain dark:hidden block"
			/>
		</Link>
	);
};

export default Logo;
