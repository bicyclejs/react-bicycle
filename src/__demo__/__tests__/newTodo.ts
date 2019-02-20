import setup, {Options} from './setup';
import TestID from '../shared/TestID';
import {fireEvent} from 'react-testing-library';
import {ENTER_KEY, ESCAPE_KEY} from '../shared/constants';

export default function newTodo(opts: Options) {
  test('add a new todo', () => {
    const {clock, act, queryByTestId} = setup(opts);

    act(() => clock.tick(4000));
    act(() => clock.tick(4000));

    const input = queryByTestId(TestID.NewTodoInput);
    expect(input).toMatchInlineSnapshot(`
<input
  class="new-todo"
  data-testid="new-todo-input"
  placeholder="What needs to be done?"
  value=""
/>
`);

    fireEvent.change(input!, {target: {value: 'Example'}});
    expect(input).toMatchInlineSnapshot(`
<input
  class="new-todo"
  data-testid="new-todo-input"
  placeholder="What needs to be done?"
  value="Example"
/>
`);

    // escape key clears the input
    fireEvent.keyDown(input!, {keyCode: ESCAPE_KEY});
    expect(input).toMatchInlineSnapshot(`
<input
  class="new-todo"
  data-testid="new-todo-input"
  placeholder="What needs to be done?"
  value=""
/>
`);

    // enter key clears the input and adds the todo
    fireEvent.change(input!, {target: {value: 'New Entry'}});
    fireEvent.keyDown(input!, {keyCode: ENTER_KEY});
    expect(input).toMatchInlineSnapshot(`
<input
  class="new-todo"
  data-testid="new-todo-input"
  placeholder="What needs to be done?"
  value=""
/>
`);

    const list = queryByTestId(TestID.TodoList);
    expect(list).toMatchInlineSnapshot(`
<ul
  class="todo-list"
  data-testid="todo-list"
>
  <li
    class=""
  >
    <div
      class="view"
    >
      <input
        class="toggle"
        type="checkbox"
      />
      <label>
        Build Bicycle
      </label>
      <button
        class="destroy"
      />
    </div>
    <input
      class="edit"
      value="Build Bicycle"
    />
  </li>
  <li
    class=""
  >
    <div
      class="view"
    >
      <input
        class="toggle"
        type="checkbox"
      />
      <label>
        Create an example
      </label>
      <button
        class="destroy"
      />
    </div>
    <input
      class="edit"
      value="Create an example"
    />
  </li>
</ul>
`);

    act(() => clock.tick(8000));

    expect(list).toMatchInlineSnapshot(`
<ul
  class="todo-list"
  data-testid="todo-list"
>
  <li
    class=""
  >
    <div
      class="view"
    >
      <input
        class="toggle"
        type="checkbox"
      />
      <label>
        New Entry
      </label>
      <button
        class="destroy"
      />
    </div>
    <input
      class="edit"
      value="New Entry"
    />
  </li>
  <li
    class=""
  >
    <div
      class="view"
    >
      <input
        class="toggle"
        type="checkbox"
      />
      <label>
        Build Bicycle
      </label>
      <button
        class="destroy"
      />
    </div>
    <input
      class="edit"
      value="Build Bicycle"
    />
  </li>
  <li
    class=""
  >
    <div
      class="view"
    >
      <input
        class="toggle"
        type="checkbox"
      />
      <label>
        Create an example
      </label>
      <button
        class="destroy"
      />
    </div>
    <input
      class="edit"
      value="Create an example"
    />
  </li>
</ul>
`);
  });
}
