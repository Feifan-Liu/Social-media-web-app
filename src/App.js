import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import MainNav from './components/navigation/mainNav'
import mainpage from './components/main/mainpage'
import momentDetails from './components/moments/momentDetails'
import login from './components/authentication/login'
import register from './components/authentication/register'
import addMoment from './components/moments/addMoment'
import AddComment from './components/comments/addComment'
import DeleteComment from './components/comments/deleteComment'
import UpdateComment from './components/comments/updateComment'
import updateMoment from './components/moments/updateMoment'
import DeleteMoment from './components/moments/deleteMoment'
import friend from './components/friend/friendMain'
import User from './components/user/user'
import RedirectPage from './components/main/redirectPage'
import RedirectUserPage from './components/main/redirectUserPage'
import At from './components/main/at'


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <MainNav />
          <Switch>
            <Route exact path='/'component={mainpage} />
            <Route path='/moment/:id' component={momentDetails} />
            <Route path='/login' component={login} />
            <Route path='/register' component={register} />
            <Route path='/friend' component={friend} />
            <Route path='/at' component={At} />
            <Route path='/addMoment' component={addMoment} />
            <Route path='/addComment' component={AddComment} />
            <Route path='/deleteComment' component={DeleteComment} />
            <Route path='/updateComment' component={UpdateComment} />
            <Route path='/updateMoment/:id' component={updateMoment} />
            <Route path='/deleteMoment' component={DeleteMoment} />
            <Route path='/user/:id' component={User} />
            <Route path='/redirectPage/:id' component={RedirectPage} />
            <Route path='/redirectUserPage/:id' component={RedirectUserPage} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
