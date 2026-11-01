import { Link } from '@tanstack/react-router'
import { ModeToggle } from '../mode-toggle'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur sd">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="font-semibold">Logo</Link>
        <ModeToggle />
        <div className="flex gap-4">
          <Link to="/" activeProps={{ className: 'font-bold' }}>Home</Link>
          <Link to="/about" activeProps={{ className: 'font-bold' }}>About</Link>
        </div>
      </nav>
    </header>
  )
}