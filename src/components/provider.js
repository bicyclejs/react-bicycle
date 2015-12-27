import {Component, PropTypes, Children} from 'react';
import clientShape from '../client-shape';


let didWarnAboutReceivingClient = false;
function warnAboutReceivingClient() {
  if (didWarnAboutReceivingClient) {
    return;
  }

  didWarnAboutReceivingClient = true;
  console.error( // eslint-disable-line no-console
    '<Provider> does not support changing `client` on the fly.'
  );
}

export default class Provider extends Component {
  getChildContext() {
    return {bicycleClient: this.client};
  }

  constructor(props, context) {
    super(props, context);
    this.client = props.client;
  }

  componentWillReceiveProps(nextProps) {
    const client = this.client;
    const nextClient = nextProps.client;

    if (client !== nextClient) {
      warnAboutReceivingClient();
    }
  }

  render() {
    return Children.only(this.props.children);
  }
}

Provider.propTypes = {
  client: clientShape.isRequired,
  children: PropTypes.element.isRequired,
};
Provider.childContextTypes = {
  bicycleClient: clientShape.isRequired,
};
