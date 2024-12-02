import { useEffect } from "react"

export function useKeyboard(key, action) {
  useEffect(() => {
    const callback = (e) => {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action()
      }
    }

    document.addEventListener("keydown", callback)

    return function () {
      document.removeEventListener("keydown", callback)
    }
  }, [action, key])
}
