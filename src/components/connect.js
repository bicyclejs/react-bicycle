import {Component, createElement} from 'react';
import hoistStatics from 'hoist-non-react-statics';
import {areDifferent} from 'bicycle/lib/utils';
import clientShape from '../client-shape';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default function (getQuery, getEventHandlers) {
  return WrappedComponent => {
    class Connect extends Component {
      constructor(props, context) {
        super(props, context);
        this._client = props.client || context.bicycleClient;

        if (!this._client) {
          throw new Error(
            `Could not find "client" in either the context or ` +
            `props of "${this.constructor.displayName}". ` +
            `Either wrap the root component in a <Provider>, ` +
            `or explicitly pass "client" as a prop to "${this.constructor.displayName}".`
          );
        }

        this._query = getQuery(props);
        const {result, notLoaded} = this._client.queryCache(this._query);
        this.state = {result, loaded: !notLoaded};
      }
      componentDidMount() {
        this._subscription = this._client.subscribe(this._query, this._onUpdate.bind(this));
      }
      componentWillReceiveProps(nextProps) {
        const newQuery = getQuery(nextProps);
        if (areDifferent(this._query, newQuery)) {
          this._subscription.unsubscribe();
          this._subscription = this.client.subscribe(this._query, this._onUpdate.bind(this));
        }
      }
      componentWillUnmount() {
        this._subscription.unsubscribe();
      }
      _onUpdate(result, loaded) {
        this.setState({result, loaded});
      }
      render() {
        const eventHandlers = getEventHandlers ? getEventHandlers(this._client, this.props) : {};
        return createElement(WrappedComponent, {
          ...this.props,
          ...this.state.result,
          loaded: this.state.loaded,
          ...eventHandlers,
        });
      }
    }

    Connect.displayName = `Connect(${getDisplayName(WrappedComponent)})`;
    Connect.WrappedComponent = WrappedComponent;
    Connect.contextTypes = {
      bicycleClient: clientShape,
    };
    Connect.propTypes = {
      client: clientShape,
    };
    return hoistStatics(Connect, WrappedComponent);
  };
}
