import React from 'react';

const NotificationBarContext = React.createContext(null);

export const withNotificationBar = Component => props => (
  <NotificationBarContext.Consumer>
    {snackbar => <Component {...props} snackbar={snackbar} />}
  </NotificationBarContext.Consumer>
);

export default NotificationBarContext;
