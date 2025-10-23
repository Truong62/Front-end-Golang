'use client';

import React, {useRef} from 'react';
import {useDrop} from 'react-dnd';
import {ColumnType} from './TodoContext';
import {DraggableTodoItem} from './DraggableTodoItem';
import {Todo} from '@/types/todo';

interface TodoColumnProps {
  columnType: ColumnType;
  todos: Todo[];
  onDrop: (todoId: string, source: ColumnType, destination: ColumnType) => void;
}

interface DragItem {
  id: string;
  source: ColumnType;
}

export const TodoColumn: React.FC<TodoColumnProps> = ({columnType, todos, onDrop}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{isOver, canDrop}, drop] = useDrop(() => ({
    accept: 'TODO_ITEM',
    canDrop: (item: DragItem) => {
      if (columnType === ColumnType.TODO && item.source === ColumnType.DONE) return false;
      return true;
    },
    drop: (item: DragItem) => {
      onDrop(item.id, item.source, columnType);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  drop(ref);

  const isActive = isOver && canDrop;

  const getColumnStyle = () => {
    if (columnType === ColumnType.TODO) {
      return {
        title: 'To do',
        bgColor: isActive ? 'bg-blue-100' : 'bg-white',
        borderColor: isActive ? 'border-blue-300' : 'border-blue-200',
        headingColor: 'text-blue-700',
        iconColor: 'text-blue-500',
        badgeColor: 'bg-blue-100 text-blue-700',
      };
    } else {
      return {
        title: 'Done',
        bgColor: isActive ? 'bg-green-100' : 'bg-white',
        borderColor: isActive ? 'border-green-300' : 'border-green-200',
        headingColor: 'text-green-700',
        iconColor: 'text-green-500',
        badgeColor: 'bg-green-100 text-green-700',
      };
    }
  };

  const {title, bgColor, borderColor, headingColor, iconColor, badgeColor} = getColumnStyle();

  const getColumnIcon = () => {
    if (columnType === ColumnType.TODO) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    }
  };

  return (
    <div
      ref={ref}
      className={`flex flex-col w-full h-full min-h-[500px] ${bgColor} 
        ${borderColor} border-2 rounded-xl p-5 transition-all 
        duration-300 ease-in-out shadow-md`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <span className={`${iconColor} mr-2 flex-shrink-0`}>{getColumnIcon()}</span>
          <h2 className={`text-xl font-bold ${headingColor} truncate`}>{title}</h2>
        </div>
        <span
          className={`${badgeColor} px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ml-2`}
        >
          {todos.length}
        </span>
      </div>

      {todos.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center h-64 text-gray-400 
            border-2 border-dashed rounded-lg p-6 mt-4 
            transition-all duration-300 ${isActive ? borderColor : 'hover:border-gray-400'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-sm font-medium">No tasks yet</p>
        </div>
      ) : (
        <ul
          className="space-y-3 overflow-y-auto px-1 py-2"
          style={{maxHeight: 'calc(100vh - 200px)'}}
        >
          {todos.map((todo) => (
            <DraggableTodoItem key={todo.id} todo={todo} columnType={columnType} onDrop={onDrop} />
          ))}
        </ul>
      )}
    </div>
  );
};
