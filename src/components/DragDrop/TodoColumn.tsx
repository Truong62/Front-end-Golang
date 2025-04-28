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

  const [{isOver}, drop] = useDrop(() => ({
    accept: 'TODO_ITEM',
    canDrop: (item: DragItem) => {
      if (columnType === ColumnType.TODO && item.source === ColumnType.DONE) return false;

      return true;
    },
    drop: (item: DragItem) => {
      onDrop(item.id, item.source, columnType);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  }));

  drop(ref);

  const getColumnStyle = () => {
    if (columnType === ColumnType.TODO) {
      return {
        title: 'To do',
        bgColor: isOver ? 'bg-blue-100' : 'bg-blue-50',
        borderColor: 'border-blue-200',
        headingColor: 'text-blue-700',
      };
    } else {
      return {
        title: 'Done',
        bgColor: isOver ? 'bg-green-100' : 'bg-green-50',
        borderColor: 'border-green-200',
        headingColor: 'text-green-700',
      };
    }
  };

  const {title, bgColor, borderColor, headingColor} = getColumnStyle();

  return (
    <div
      ref={ref}
      className={`flex flex-col w-full h-full min-h-[400px] ${bgColor} ${borderColor} border rounded-lg p-4 transition-colors`}
    >
      <h2 className={`text-xl font-semibold mb-4 ${headingColor}`}>{title}</h2>

      {todos.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-gray-400 border border-dashed rounded-md">
          Drag and drop task here
        </div>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <DraggableTodoItem key={todo.id} todo={todo} columnType={columnType} onDrop={onDrop} />
          ))}
        </ul>
      )}
    </div>
  );
};
