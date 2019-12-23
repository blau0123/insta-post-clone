import React from 'react';

// redux imports
import {Provider} from 'react-redux';
import store from './redux/store';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Post from './components/Post';
import PostHorizontal from './components/PostHorizontal';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Route exact path='/' component={Post} />
        <Route path='/allcomments' component={PostHorizontal} />
      </Router>
    </Provider>
  );
}

export default App;
