'use client';

import React from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {ColumnType, TodoProvider, useTodo} from './TodoContext';
import {TodoColumn} from './TodoColumn';
import {Todo} from '@/types/todo';

interface TodoBoardProps {
  todos: Todo[];
}

const TodoBoardContent: React.FC = () => {
  const {todos, moveTodo} = useTodo();

  const todoState: {[key in ColumnType]: Todo[]} = {
    [ColumnType.TODO]: todos[ColumnType.TODO],
    [ColumnType.DONE]: todos[ColumnType.DONE],
  };

  const handleDrop = (todoId: string, source: ColumnType, destination: ColumnType) => {
    moveTodo(todoId, source, destination);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
      <TodoColumn
        columnType={ColumnType.TODO}
        todos={todoState[ColumnType.TODO]}
        onDrop={handleDrop}
      />
      <TodoColumn
        columnType={ColumnType.DONE}
        todos={todoState[ColumnType.DONE]}
        onDrop={handleDrop}
      />
    </div>
  );
};

export const TodoBoard: React.FC<TodoBoardProps> = ({todos}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <TodoProvider initialTodos={todos}>
        <TodoBoardContent />
      </TodoProvider>
    </DndProvider>
  );
};

declare global {
  interface Window {
    __INITIAL_TODOS__?: Todo[];
  }
}
