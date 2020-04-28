import React from 'react';
import { Router, Route, Switch } from "react-router-dom";
import createHistory from 'history/createBrowserHistory';


import NotFoundPage from '../components/NotFoundPage';
import LoginPage from '../components/LoginPage';
import LayoutCover from '../layout/layout';
import Insight from '../components/Insight';
import Post from '../components/Post';
import Dashboard from '../components/Dashboard'
import Comment from '../components/Comment';

import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export const history = createHistory();

const AppRouter = () => {
 return (
  <Router history={history}>
   <div>
    <Switch>
     <PublicRoute exact={true} path="/" component={LoginPage} />
     <PrivateRoute path="/dashboard" component={Dashboard} />
     <PrivateRoute path="/insight" component={Insight} />
     <PrivateRoute path="/post" component={Post} />
     <PrivateRoute path="/comment" component={Comment} />
     <Route component={NotFoundPage} />
    </Switch>
   </div>
  </Router>
 );
}

export default AppRouter;
