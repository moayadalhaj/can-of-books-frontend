import React, { Component } from 'react';
import { withAuth0 } from '@auth0/auth0-react';

class Profile extends Component {
  render() {
    return (
      <div>
        <div>
          {
            this.props.auth0.isAuthenticated &&
            <>
              <h2>Username:{this.props.auth0.user.name}</h2>
              <h2>email:{this.props.auth0.user.email}</h2>
              <img src={this.props.auth0.user.picture} alt="userImage" />
            </>
          }
        </div>
      </div>
    )
  }
}

export default withAuth0(Profile);
