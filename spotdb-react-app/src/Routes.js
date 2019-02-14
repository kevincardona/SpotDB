import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import SongMap from './pages/SongMap';
import Me from './pages/Me';
import Account from './pages/Account';
import Search from './pages/Search';
import NoMatch from './pages/NoMatch';

const Routes = () => (
	<div id="Routes">
		<Navbar isLoggedIn="false" /> {/* This need to be updated to take in a proper value */}
		<Switch>
			<Route exact path="/" component={Home} />
			<Route exact path="/home" render={() => (<Redirect to="/" />)} />
			<Route exact path="/login" component={Login} />
			<Route exact path="/me" component={Me} />
			<Route exact path="/map" component={SongMap} />
			<Route exact path="/account" component={Account} />
			<Route exact path="/search" component={Search} />
			<Route path="*" component={NoMatch} />
		</Switch>
	</div>
);

export default Routes;