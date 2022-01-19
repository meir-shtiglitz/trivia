import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './components/header';
import manegQuestions from './components/copy_questions';
import Questions from './components/questions';
import Register from './components/register';
import Login from './components/login';
import Admin from './components/admin';
import Edit from './components/edit';
import Logame from './components/logame';
import Public_games from './components/public_games';
import Profile from './components/profile';
import Public_confirm from './components/public_confirm';
import Contact from './components/contact';
import PaSoket from './components/PaSocket';
import "./css/App.css";

function App() {
  return (
    <React.Fragment>
      <Header />
      <div className="container mt-3">
        <Switch>
          <Route path="/mng/:gameId/:time" exact component={manegQuestions} />
          <Route path="/socket" exact component={PaSoket} />
          <Route path="/" exact component={Public_games} />
          <Route path="/questions/:gameId" component={Questions} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/admin" component={Admin} />
          <Route path="/edit" component={Edit} />
          <Route path="/logame" component={Logame} />
          <Route path="/profile" component={Profile} />
          <Route path="/public_confirm" component={Public_confirm} />
          <Route path="/contact" component={Contact} />
        </Switch>
      </div>
    </React.Fragment>
  );
}

export default App;
