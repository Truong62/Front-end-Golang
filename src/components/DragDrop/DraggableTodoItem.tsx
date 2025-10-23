'use client';

import React, {useRef} from 'react';
import {useDrag, useDrop} from 'react-dnd';
import {ColumnType} from './TodoContext';
import {Todo} from '@/types/todo';
import {Button} from '../ui/button';
import {Trash2} from 'lucide-react';

interface DraggableTodoItemProps {
  todo: Todo;
  columnType: ColumnType;
  onDrop: (
    todoId: string,
    source: ColumnType,
    destination: ColumnType,
    draggedTodo: Todo,
    targetTodo?: Todo,
  ) => void;
  onDelete: (todoId: string) => void;
}

interface DragItem {
  id: string;
  source: ColumnType;
  todo: Todo;
}

export const DraggableTodoItem: React.FC<DraggableTodoItemProps> = ({
  todo,
  columnType,
  onDrop,
  onDelete,
}) => {
  const ref = useRef<HTMLLIElement>(null);

  const [{isDragging}, drag] = useDrag({
    type: 'TODO_ITEM',
    item: {id: todo.id, source: columnType, todo: todo} as DragItem,
    canDrag: columnType !== ColumnType.DONE,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{}, drop] = useDrop({
    accept: 'TODO_ITEM',
    drop: (item: DragItem) => {
      if (item.id !== todo.id || item.source !== columnType) {
        onDrop(item.id, item.source, columnType, item.todo, todo);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const [{isOver}, dropTarget] = useDrop({
    accept: 'TODO_ITEM',
    canDrop: (item: DragItem) => item.id !== todo.id && item.source === columnType,
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  });

  drag(drop(dropTarget(ref)));

  const getBgColor = () => {
    if (isOver) {
      return columnType === ColumnType.TODO ? 'bg-blue-200' : 'bg-green-200';
    }
    return columnType === ColumnType.TODO ? 'bg-blue-50' : 'bg-green-50';
  };

  const getBorderColor = () => {
    if (isOver) {
      return columnType === ColumnType.TODO ? 'border-blue-400' : 'border-green-400';
    }
    return columnType === ColumnType.TODO ? 'border-blue-200' : 'border-green-200';
  };

  return (
    <li
      ref={ref}
      className={`p-4 rounded-lg flex justify-between items-center 
        ${columnType === ColumnType.DONE ? 'cursor-default' : 'cursor-grab'} 
        ${getBgColor()} ${getBorderColor()} border shadow-sm hover:shadow-md
        transition-all duration-200 overflow-hidden relative ${
          isOver ? 'transform scale-105 z-10 shadow-lg' : ''
        } ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{
        transition: 'all 0.2s ease',
      }}
    >
      {isOver && (
        <>
          <div className="absolute inset-0 border-2 border-dashed border-yellow-400 rounded-lg pointer-events-none"></div>
          <div className="absolute -left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </>
      )}
      <div className="flex-1 min-w-0 mr-2">
        <p
          className={`font-medium ${
            todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
          } truncate`}
          title={todo.title}
        >
          {todo.title}
        </p>
      </div>
      <div className="flex items-center flex-shrink-0">
        <span
          className={`inline-block w-3 h-3 rounded-full mr-2 
            ${todo.completed ? 'bg-green-500' : 'bg-blue-500'}`}
        ></span>
        <span
          className={`text-xs ${todo.completed ? 'text-green-600' : 'text-blue-600'} font-medium`}
        >
          {todo.completed ? 'Done' : 'Doing'}
        </span>

        <Button variant="ghost" size="icon" onClick={() => onDelete(todo.id)}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </li>
  );
};
