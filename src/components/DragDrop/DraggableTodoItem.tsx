'use client';

import React, {useRef} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import {ColumnType} from './TodoContext';
import {Todo} from '@/types/todo';

interface DraggableTodoItemProps {
  todo: Todo;
  columnType: ColumnType;
  onDrop: (todoId: string, source: ColumnType, destination: ColumnType) => void;
}

interface DragItem {
  id: string;
  source: ColumnType;
}

export const DraggableTodoItem: React.FC<DraggableTodoItemProps> = ({todo, columnType, onDrop}) => {
  const ref = useRef<HTMLLIElement>(null);

  const [{isDragging}, drag] = useDrag({
    type: 'TODO_ITEM',
    item: {id: todo.id, source: columnType} as DragItem,
    canDrag: columnType !== ColumnType.DONE,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{isOver}, drop] = useDrop({
    accept: 'TODO_ITEM',
    drop: (item: DragItem) => {
      if (item.id !== todo.id || item.source !== columnType) {
        onDrop(item.id, item.source, columnType);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const getBgColor = () => {
    if (isDragging) return 'bg-gray-200';
    if (isOver) return 'bg-gray-100';
    if (columnType === ColumnType.TODO) return 'bg-blue-50 border-blue-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <li
      ref={ref}
      className={`p-3 rounded-md flex justify-between items-center ${columnType === ColumnType.DONE ? 'cursor-default' : 'cursor-pointer hover:cursor-grab active:cursor-grabbing'} transition-colors ${getBgColor()} border`}
      style={{opacity: isDragging ? 0.5 : 1}}
    >
      <span className={todo.completed ? 'line-through' : ''}>{todo.title}</span>
      <div className="flex items-center">
        <span
          className={`inline-block w-3 h-3 rounded-full mr-2 ${todo.completed ? 'bg-green-500' : 'bg-blue-500'}`}
        ></span>
        <span className="text-xs text-gray-500">{todo.completed ? 'Done' : 'Doing'}</span>
      </div>
    </li>
  );
};
