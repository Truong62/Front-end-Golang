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

  const [{}, drop] = useDrop({
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
    if (columnType === ColumnType.TODO) {
      return 'bg-blue-50';
    }
    return 'bg-green-50';
  };

  const getBorderColor = () => {
    if (columnType === ColumnType.TODO) {
      return 'border-blue-200';
    }
    return 'border-green-200';
  };

  return (
    <li
      ref={ref}
      className={`p-4 rounded-lg flex justify-between items-center 
        ${columnType === ColumnType.DONE ? 'cursor-default' : 'cursor-grab'} 
        ${getBgColor()} ${getBorderColor()} border shadow-sm hover:shadow-md
        transition-all duration-200`}
      style={{
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <span
        className={`font-medium ${
          todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
        } truncate max-w-[250px]`}
        title={todo.title}
      >
        {todo.title}
      </span>
      <div className="flex items-center flex-shrink-0 ml-2">
        <span
          className={`inline-block w-3 h-3 rounded-full mr-2 
            ${todo.completed ? 'bg-green-500' : 'bg-blue-500'}`}
        ></span>
        <span
          className={`text-xs ${todo.completed ? 'text-green-600' : 'text-blue-600'} font-medium`}
        >
          {todo.completed ? 'Done' : 'Doing'}
        </span>
      </div>
    </li>
  );
};
