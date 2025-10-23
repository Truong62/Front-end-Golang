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
  const {todos, moveTodo, deleteTodo, updateTodoIndex} = useTodo();

  const todoState: {[key in ColumnType]: Todo[]} = {
    [ColumnType.TODO]: todos[ColumnType.TODO],
    [ColumnType.DONE]: todos[ColumnType.DONE],
  };

  const handleDrop = (
    todoId: string,
    source: ColumnType,
    destination: ColumnType,
    draggedTodo: Todo,
    targetTodo?: Todo,
  ) => {
    if (source === destination && targetTodo) {
      if (draggedTodo && targetTodo) {
        const currentDraggedTodo = todos[source].find((t) => t.id === draggedTodo.id);
        const currentTargetTodo = todos[destination].find((t) => t.id === targetTodo.id);

        if (currentDraggedTodo && currentTargetTodo) {
          if (currentDraggedTodo.id !== currentTargetTodo.id) {
            console.log(
              'Swapping items:',
              currentDraggedTodo.title,
              'with',
              currentTargetTodo.title,
            );
            updateTodoIndex(currentDraggedTodo, currentTargetTodo);
          }
        }
      }
    } else {
      moveTodo(todoId, source, destination);
    }
  };

  const handleDelete = (todoId: string): void => {
    deleteTodo(todoId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8">
        <div className="flex items-center">
          <div className="mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-500"
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
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Todo Board</h1>
            <p className="text-gray-500">
              Drag and drop tasks between columns to update their status
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <div className="transition-all duration-300 hover:translate-y-[-4px]">
          <TodoColumn
            columnType={ColumnType.TODO}
            todos={todoState[ColumnType.TODO]}
            onDrop={handleDrop}
            onDelete={handleDelete}
          />
        </div>
        <div className="transition-all duration-300 hover:translate-y-[-4px]">
          <TodoColumn
            columnType={ColumnType.DONE}
            todos={todoState[ColumnType.DONE]}
            onDrop={handleDrop}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export const TodoBoard: React.FC<TodoBoardProps> = ({todos}) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <TodoProvider initialTodos={todos}>
        <div className="min-h-screen  py-10">
          <TodoBoardContent />
        </div>
      </TodoProvider>
    </DndProvider>
  );
};

declare global {
  interface Window {
    __INITIAL_TODOS__?: Todo[];
  }
}
