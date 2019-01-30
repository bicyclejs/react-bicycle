import * as React from 'react';
import ErrorStyle from '../helpers/ErrorStyle';

export default function DefaultErrorRenderer(props: {
  errors: ReadonlyArray<string>;
}) {
  return (
    <div>
      {props.errors.map((err, i) => {
        return React.createElement(
          'div',
          {key: i, style: ErrorStyle},
          err + '',
        );
      })}
    </div>
  );
}
