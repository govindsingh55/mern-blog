import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import PBlogs from "../Pages/Public/PBlogs";
import Login from "../Pages/Login";
import Blogs from "../Pages/Private/Blogs";
import PBlog from "../Pages/Public/PBlog";
import User from "../Pages/Private/User";
import AddNewUser from "../Pages/Private/AddNewUser"
import { useAuth } from "../hooks/useAuth";

function PrivateRoute({ children, ...rest }) {
  const { user } = useAuth();
  return (
    <Route
      {...rest}
      render={() => {
        if (user) {
          return children
        }
        return <Redirect to="/login" />
      }}
    />
  )
}

const Routes = () => {
  return (
    <Switch>
      <Route exact path="/login" >
        <Login />
      </Route>
      <Route exact path="/" >
        <PBlogs />
      </Route>
      <Route exact path="/blog/:blogSlugs" >
        <PBlog />
      </Route>

      <PrivateRoute exact path="/blogs">
        <Blogs />
      </PrivateRoute>
      <PrivateRoute exact path="/users">
        <User />
      </PrivateRoute>
      {/* <PrivateRoute path="/new-user">
        <AddNewUser />
      </PrivateRoute> */}
      <Route exact path="/new-user">
        <AddNewUser />
      </Route>
    </Switch>
  )
}

export default Routes