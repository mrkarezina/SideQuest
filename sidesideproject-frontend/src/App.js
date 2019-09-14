import React from 'react';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import SearchPage from './Pages/SeachPage';
import SubmitPage from './Pages/SubmitPage'

function App() {
    return (
        <div className="App">
            <Switch>
                <Route exact path="/" component={SubmitPage} />
            </Switch>
        </div>
    );
}

export default App;
