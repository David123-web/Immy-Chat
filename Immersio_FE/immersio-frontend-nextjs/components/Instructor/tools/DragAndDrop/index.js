import { Tooltip } from 'antd'
import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

export const TooltipDragAndDrop = ({ iconDragAndDropTooltip, ...props }) => {
  return (
    <div {...props}>
      <Tooltip mouseEnterDelay={0.5} overlayClassName="tooltip-modal" placement="topLeft" title={iconDragAndDropTooltip}>
        <div className="tooltip-modal-icon">
          <svg width="8" height="13" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#BFBFBF" />
            <circle cx="1.5" cy="6.5" r="1.5" fill="#BFBFBF" />
            <circle cx="1.5" cy="11.5" r="1.5" fill="#BFBFBF" />
            <circle cx="6.5" cy="1.5" r="1.5" fill="#BFBFBF" />
            <circle cx="6.5" cy="6.5" r="1.5" fill="#BFBFBF" />
            <circle cx="6.5" cy="11.5" r="1.5" fill="#BFBFBF" />
          </svg>
        </div>
      </Tooltip>
    </div>
  )
}

const DragAndDrop = ({ children, sourceState, onDragStart, onBeforeCapture, onBeforeDragStart, onDragEnd, onDragUpdate }) => {
  return (
    <DragDropContext
      onBeforeCapture={onBeforeCapture}
      onBeforeDragStart={onBeforeDragStart}
      onDragStart={onDragStart}
      onDragUpdate={onDragUpdate}
      onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {sourceState.map((item, index) => {
              const { attributes } = item
              return (
                <Draggable
                  key={item?.id?.toString() || `list-item-${index}`}
                  draggableId={item?.id?.toString() || `list-item-${index}`}
                  index={index}>
                  {(provided) => (
                    <div className="drag-and-drop-item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      {children({ index, attributes, item })}
                    </div>
                  )}
                </Draggable>
              )
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default DragAndDrop