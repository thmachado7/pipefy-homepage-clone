import { useContext, useRef } from 'react'
import {
  DragSourceMonitor,
  DropTargetMonitor,
  useDrag,
  useDrop,
  XYCoord,
} from 'react-dnd'

import BoardContext from '../Board/context'
import { Container, Label } from './styles'

interface CardProps {
  data: any
  index: number
  listIndex: number
}

const Card = ({ data, index, listIndex }: CardProps): JSX.Element => {
  const ref = useRef<HTMLDivElement>(null)
  const { move } = useContext(BoardContext)

  const [{ isDragging }, dragRef] = useDrag({
    type: 'CARD',
    item: {
      id: data.id,
      index,
      content: data.content,
      listIndex,
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, dropRef] = useDrop({
    accept: 'CARD',
    hover(item: any, monitor: DropTargetMonitor) {
      const draggedListIndex = item.listIndex
      const targetListIndex = listIndex

      const draggedIndex = item.index
      const targetIndex = index

      if (
        draggedIndex === targetIndex &&
        draggedListIndex === targetListIndex
      ) {
        return
      }

      const targetSize = ref?.current?.getBoundingClientRect() as DOMRect
      const targetCenter = (targetSize.bottom - targetSize.top) / 2

      const draggedOffset = monitor.getClientOffset() as XYCoord
      const draggedTop = draggedOffset.y - targetSize.top

      if (draggedIndex < targetIndex && draggedTop < targetCenter) {
        return
      }

      if (draggedIndex > targetIndex && draggedTop > targetCenter) {
        return
      }

      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex)
      item.index = targetIndex
      item.listIndex = targetListIndex
    },
  })

  dragRef(dropRef(ref))

  return (
    <Container ref={ref} isDragging={isDragging}>
      <header>
        {data.labels.map((label: any) => (
          <Label key={label} color={label} />
        ))}
      </header>
      <p>{data.content}</p>
      {data.user && <img src={data.user} alt="" />}
    </Container>
  )
}

export default Card
