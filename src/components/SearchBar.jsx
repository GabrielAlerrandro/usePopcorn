import { useRef } from "react"
import { useKeyboard } from "../hooks/useKeyboard"

export default function SearchBar({ query, setQuery }) {
  const inputElement = useRef(null)

  useKeyboard("Enter", () => {
    if (document.activeElement === inputElement.current) return

    inputElement.current.focus()
    setQuery("")
  })

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputElement}
    />
  )
}
