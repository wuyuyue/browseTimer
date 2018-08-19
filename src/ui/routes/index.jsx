import React from 'react'
import { Router, Route, IndexRoute, Redirect } from 'react-router'


import App from '../layouts/app'
import Home from '../layouts/home/index'
import StaticPage from '../layouts/static/index'
import DetailPage from '../layouts/detail/index'

import NotFoundPage from '../layouts/error/index'

export default function(history) {
  return (
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={Home} />
        <Route path='/static' component={StaticPage} />
        <Route path='/detail' component={DetailPage} />
        <Route path='/404' component={NotFoundPage} />
        <Redirect from="*" to="/404" />
      </Route>
    </Router>
  )
}
