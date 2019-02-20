import setup, {Options} from './setup';

export default function initalRender(opts: Options) {
  test('initial render', () => {
    const {container, clock, act} = setup(opts);

    // doesn't render anything initially, while it attempts
    // to load data from the server.
    expect(container).toMatchInlineSnapshot(`<div />`);

    // displays a loading indicator if no data has loaded after 1 second
    act(() => clock.tick(1300));
    expect(container).toMatchInlineSnapshot(`
<div>
  <div>
    Loading...
  </div>
</div>
`);

    // Then loads all the data and renders that
    // because our demo actually requires a second
    // round trip to render the errors, we have to
    // call `act` twice as React doesn't apply the
    // state changes until `act` in tests.
    act(() => clock.tick(4000));
    act(() => clock.tick(4000));
    expect(container).toMatchInlineSnapshot(`
<div>
  <div>
    <header
      class="header"
    >
      <h1>
        todos
      </h1>
      <input
        class="new-todo"
        data-testid="new-todo-input"
        placeholder="What needs to be done?"
        value=""
      />
    </header>
    <section
      class="main"
    >
      <input
        class="toggle-all"
        type="checkbox"
      />
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
    </section>
    <footer
      class="footer"
    >
      <span
        class="todo-count"
      >
        <strong>
          2
        </strong>
         
        items
         left
      </span>
      <ul
        class="filters"
      >
        <li>
          <a
            class="selected"
            href="#/"
          >
            All
          </a>
        </li>
         
        <li>
          <a
            class=""
            href="#/active"
          >
            Active
          </a>
        </li>
         
        <li>
          <a
            class=""
            href="#/completed"
          >
            Completed
          </a>
        </li>
      </ul>
    </footer>
    <button
      style="padding: 20px; display: block;"
    >
      Run non existent mutation
    </button>
    <div>
      <div
        style="white-space: pre-wrap; font-family: monospace; font-size: 18px; padding: 9px; background: rgb(144, 0, 0); color: white;"
      >
        Field "ttle" does not exist on type "Todo" maybe you meant to use "title"
      </div>
      <div
        style="white-space: pre-wrap; font-family: monospace; font-size: 18px; padding: 9px; background: rgb(144, 0, 0); color: white;"
      >
        Field "completad" does not exist on type "Todo" maybe you meant to use "completed"
      </div>
    </div>
  </div>
</div>
`);
  });
}
