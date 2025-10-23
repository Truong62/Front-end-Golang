'use client';

import React, {createContext, useContext, useReducer, ReactNode} from 'react';
import {useUpdateTodoApi} from '@/hook/useUpdateTodoApi';
import {Todo} from '@/types/todo';

export enum ColumnType {
  TODO = 'todo',
  DONE = 'done',
}

interface TodoState {
  [ColumnType.TODO]: Todo[];
  [ColumnType.DONE]: Todo[];
}

type TodoAction =
  | {type: 'SET_TODOS'; payload: {todos: Todo[]}}
  | {type: 'MOVE_TODO'; payload: {todoId: string; source: ColumnType; destination: ColumnType}}
  | {type: 'UPDATE_TODO_STATUS'; payload: {todoId: string; completed: boolean}}
  | {type: 'DELETE_TODO'; payload: {todoId: string}}
  | {type: 'UPDATE_TODO_INDEX'; payload: {valueTodo: Todo; valueTodoChanged: Todo}};

interface TodoContextType {
  todos: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  moveTodo: (todoId: string, source: ColumnType, destination: ColumnType) => void;
  updateTodoStatus: (todoId: string, data: Todo) => Promise<void>;
  deleteTodo: (todoId: string) => void;
  updateTodoIndex: (valueTodo: Todo, valueTodoChanged: Todo) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'SET_TODOS':
      const todoItems = action.payload.todos.filter((todo) => !todo.completed);
      const doneItems = action.payload.todos.filter((todo) => todo.completed);
      return {
        [ColumnType.TODO]: todoItems,
        [ColumnType.DONE]: doneItems,
      };

    case 'MOVE_TODO': {
      const {todoId, source, destination} = action.payload;
      if (source === destination) return state;

      const todoToMove = state[source].find((todo) => todo.id === todoId);
      if (!todoToMove) return state;

      const sourceColumn = state[source].filter((todo) => todo.id !== todoId);

      const updatedTodo = {
        ...todoToMove,
        completed: destination === ColumnType.DONE,
      };

      const destinationColumn = [...state[destination], updatedTodo];

      return {
        ...state,
        [source]: sourceColumn,
        [destination]: destinationColumn,
      };
    }

    case 'UPDATE_TODO_STATUS': {
      const {todoId, completed} = action.payload;
      const source = completed ? ColumnType.TODO : ColumnType.DONE;
      const destination = completed ? ColumnType.DONE : ColumnType.TODO;

      return todoReducer(state, {
        type: 'MOVE_TODO',
        payload: {todoId, source, destination},
      });
    }

    case 'DELETE_TODO': {
      const {todoId} = action.payload;
      return {
        [ColumnType.TODO]: state[ColumnType.TODO].filter((todo) => todo.id !== todoId),
        [ColumnType.DONE]: state[ColumnType.DONE].filter((todo) => todo.id !== todoId),
      };
    }

    case 'UPDATE_TODO_INDEX': {
      const {valueTodo, valueTodoChanged} = action.payload;
      const column = valueTodo.completed ? ColumnType.DONE : ColumnType.TODO;

      const updatedColumn = [...state[column]];

      const draggedIndex = updatedColumn.findIndex((todo) => todo.id === valueTodo.id);
      const targetIndex = updatedColumn.findIndex((todo) => todo.id === valueTodoChanged.id);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        [updatedColumn[draggedIndex], updatedColumn[targetIndex]] = [
          updatedColumn[targetIndex],
          updatedColumn[draggedIndex],
        ];

        const draggedIndexValue = updatedColumn[draggedIndex].index;
        const targetIndexValue = updatedColumn[targetIndex].index;

        updatedColumn[draggedIndex] = {...updatedColumn[draggedIndex], index: draggedIndexValue};
        updatedColumn[targetIndex] = {...updatedColumn[targetIndex], index: targetIndexValue};
      }

      const sortedColumn = [...updatedColumn].sort((a, b) => a.index - b.index);

      return {
        ...state,
        [column]: sortedColumn,
      };
    }

    default:
      return state;
  }
};

interface TodoProviderProps {
  children: ReactNode;
  initialTodos: Todo[];
}

export const TodoProvider: React.FC<TodoProviderProps> = ({children, initialTodos}) => {
  const [todos, dispatch] = useReducer(todoReducer, {
    [ColumnType.TODO]: initialTodos.filter((todo) => !todo.completed),
    [ColumnType.DONE]: initialTodos.filter((todo) => todo.completed),
  });

  const updateTodoMutation = useUpdateTodoApi();

  const moveTodo = (todoId: string, source: ColumnType, destination: ColumnType) => {
    dispatch({
      type: 'MOVE_TODO',
      payload: {todoId, source, destination},
    });

    const todoToUpdate = todos[source].find((todo) => todo.id === todoId);
    if (todoToUpdate) {
      const updatedTodo = {
        ...todoToUpdate,
        completed: destination === ColumnType.DONE,
      };
      updateTodoMutation.mutate({todoId, data: updatedTodo});
    } else {
      console.warn('Todo not found:', todoId);
    }
  };

  const updateTodoStatus = async (todoId: string, data: Todo) => {
    dispatch({
      type: 'UPDATE_TODO_STATUS',
      payload: {todoId, completed: data.completed},
    });

    try {
      await updateTodoMutation.mutateAsync({todoId, data});
    } catch (error) {
      console.error('Failed to update todo status', error);
      dispatch({
        type: 'UPDATE_TODO_STATUS',
        payload: {todoId, completed: !data.completed},
      });
    }
  };

  const updateTodoIndex = async (valueTodo: Todo, valueTodoChanged: Todo): Promise<void> => {
    const originalDraggedIndex = valueTodo.index;
    const originalTargetIndex = valueTodoChanged.index;

    dispatch({
      type: 'UPDATE_TODO_INDEX',
      payload: {valueTodo, valueTodoChanged},
    });

    try {
      await updateTodoMutation.mutateAsync({
        todoId: valueTodo.id,
        data: {...valueTodo, index: originalTargetIndex},
      });
      await updateTodoMutation.mutateAsync({
        todoId: valueTodoChanged.id,
        data: {...valueTodoChanged, index: originalDraggedIndex},
      });
    } catch (error) {
      console.error('Failed to update todo index', error);
      dispatch({
        type: 'UPDATE_TODO_INDEX',
        payload: {
          valueTodo: {...valueTodo, index: originalDraggedIndex},
          valueTodoChanged: {...valueTodoChanged, index: originalTargetIndex},
        },
      });
    }
  };

  const deleteTodo = (todoId: string) => {
    dispatch({
      type: 'DELETE_TODO',
      payload: {todoId},
    });
  };

  return (
    <TodoContext.Provider
      value={{todos, dispatch, moveTodo, updateTodoStatus, deleteTodo, updateTodoIndex}}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) throw new Error('useTodo must be used within a TodoProvider');

  return context;
};
