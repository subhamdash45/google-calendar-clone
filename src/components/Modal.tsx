import { ReactNode, useEffect } from "react"
import { createPortal } from "react-dom"

export type TModalProps = {
  children: ReactNode
  isOpen: boolean
  onClose: () => void
}
export function Modal({ children, isOpen, onClose }: TModalProps) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handler)

    return () => document.removeEventListener("keydown", handler)
  }, [onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="modal">
      <div className="overlay" onClick={onClose}></div>
      <div className="modal-body">{children}</div>
    </div>,
    document.querySelector("#modal-container") as Element
  )
}
