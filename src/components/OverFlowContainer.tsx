import { Key, ReactNode, useLayoutEffect, useRef, useState } from "react"

type TOverFlowContainerProps<T> = {
  items: T[]
  getKey: (item: T) => Key
  renderItem: (item: T) => ReactNode
  renderOverFlow: (overflowAmount: number) => ReactNode
  className?: string
}

export function OverFlowContainer<T>({
  items,
  getKey,
  renderItem,
  renderOverFlow,
  className,
}: TOverFlowContainerProps<T>) {
  const [overflowAmount, setOverflowAmount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  console.log("hete")

  useLayoutEffect(() => {
    if (containerRef.current == null) return

    const observer = new ResizeObserver((entries) => {
      const containerElement = entries[0].target
      if (containerElement == null) return
      const children =
        containerElement.querySelectorAll<HTMLElement>("[data-item]")
      const overflowElement =
        containerElement.parentElement?.querySelector<HTMLElement>(
          "[data-overflow]"
        )

      if (overflowElement != null) overflowElement.style.display = "none"

      children.forEach((child) => child.style.removeProperty("display"))

      let overflowCount = 0
      for (let i = children.length - 1; i >= 0; i--) {
        const element = children[i]
        if (containerElement.scrollHeight <= containerElement.clientHeight)
          break

        console.log("sksk")
        element.style.display = "none"
        overflowElement?.style.removeProperty("display")
        overflowCount = children.length - i
      }
      setOverflowAmount(overflowCount)
    })
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
    }
  }, [items])

  return (
    <>
      <div className={className} ref={containerRef}>
        {items.map((item) => (
          <div data-item key={getKey(item)}>
            {renderItem(item)}
          </div>
        ))}
      </div>
      <div data-overflow>{renderOverFlow(overflowAmount)}</div>
    </>
  )
}
