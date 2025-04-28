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
  | {type: 'UPDATE_TODO_STATUS'; payload: {todoId: string; completed: boolean}};

interface TodoContextType {
  todos: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  moveTodo: (todoId: string, source: ColumnType, destination: ColumnType) => void;
  updateTodoStatus: (todoId: string, data: Todo) => Promise<void>;
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
    console.log('Moving todo:', {todoId, source, destination});

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
      console.log('Updating todo with:', updatedTodo);
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

  return (
    <TodoContext.Provider value={{todos, dispatch, moveTodo, updateTodoStatus}}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) throw new Error('useTodo must be used within a TodoProvider');

  return context;
};
