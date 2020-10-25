import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./components/App/App";
import configureStore from "./redux/configureStore";
import { Provider as ReduxProvider } from "react-redux";
import state from "./state.json";

const store = configureStore(state);

ReactDOM.render(
    <ReduxProvider store={store}>
        <Router>
            <App />
        </Router>
    </ReduxProvider>,
    document.getElementById("app")
);
