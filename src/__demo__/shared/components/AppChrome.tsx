import * as React from 'react';
import NewTodo from "./NewTodo";

export interface Props {
  errors: ReadonlyArray<string>;
  children: React.ReactNode;
  onAddTodo: (value: string) => void;
}
export default function AppChrome(props: Props) {
  return (
    <div>
      <header className="header">
        <h1>todos</h1>
        {props.errors.map((error, i) => {
          return <div key={i} style={{background: 'red', color: 'white', padding: 50, fontSize: 20}}>{error}</div>;
        })}
        <NewTodo
        onAddTodo={props.onAddTodo}
        />
      </header>
      {props.children}
    </div>
  );
}