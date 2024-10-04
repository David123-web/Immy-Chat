'use client'

import { forwardRef } from 'react'
import {
  DragDropContext,
  DragDropContextProps,
  Draggable,
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
  Droppable,
  DroppableProvidedProps
} from 'react-beautiful-dnd'

type FCC<Props = Record<string, unknown>> = React.FC<
  React.PropsWithChildren<Props>
>

const KanbanContext = forwardRef<
  React.ElementRef<typeof DragDropContext>,
  DragDropContextProps & { className?: string }
>(({ className, ...props }, ref) => {
  return (
    <div className={className}>
      <DragDropContext ref={ref} {...props} />
    </div>
  )
})
KanbanContext.displayName = 'KanbanContext'

const KanbanDroppable = forwardRef<
  React.ElementRef<typeof Droppable>,
  React.ComponentPropsWithoutRef<typeof Droppable>
>(({ ...props }, ref) => {
  return <Droppable ref={ref} {...props} />
})
KanbanDroppable.displayName = 'KanbanDroppable'

const KanbanDroppableContent: FCC<{
  className?: string
  provided: {
    innerRef: (element: HTMLElement | null) => void
    droppableProps: DroppableProvidedProps
  }
}> = ({ className, provided, ...props }) => {
  return (
    <div
      ref={provided.innerRef}
      className={className}
      {...provided.droppableProps}
      {...props}
    />
  )
}
KanbanDroppableContent.displayName = 'KanbanDroppableContent'

const KanbanDraggable = forwardRef<
  React.ElementRef<typeof Draggable>,
  React.ComponentPropsWithoutRef<typeof Draggable>
>(({ ...props }, ref) => {
  return <Draggable ref={ref} {...props} />
})
KanbanDraggable.displayName = 'KanbanDraggable'

const KanbanDraggableContent: FCC<{
  className?: string
  provided: {
    innerRef: (element: HTMLElement | null) => void
    draggableProps: DraggableProvidedDraggableProps
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
  }
}> = ({ className, provided, ...props }) => {
  return (
    <div
      ref={provided.innerRef}
      className={className}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      {...props}
    />
  )
}
KanbanDraggableContent.displayName = 'KanbanDraggableContent'

export {
  KanbanContext, KanbanDraggable,
  KanbanDraggableContent, KanbanDroppable,
  KanbanDroppableContent
}