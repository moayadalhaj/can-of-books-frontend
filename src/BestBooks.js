import React from 'react';
import './BestBooks.css';
import axios from "axios";
// import { Carousel } from 'react-bootstrap';
import { withAuth0 } from '@auth0/auth0-react';

class MyFavoriteBooks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bookData: []
    };
  }

  componentDidMount = () => {
    if (this.props.auth0.isAuthenticated) {

      this.props.auth0.getIdTokenClaims()
        .then(result => {
          const jwt = result.__raw;
          const config = {
            headers: { "Authorization": `Bearer ${jwt}` },
            method: 'get',
            baseURL: process.env.REACT_APP_SERVER_URL,
            url: '/books'
          }
          axios(config)
            .then((axiosResponse) => {
              this.setState({
                bookData: axiosResponse.data,
              });
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    };
  }

  render() {
    console.log(this.state.books);
    return (
      <div className="jumbotron">
        <h1>My Favorite Books</h1>
        <p>
          This is a collection of my favorite books
        </p>
        {/* {
          this.props.auth0.isAuthenticated && this.bookData.map((element, index) => {
            return (
              <Carousel key={index} variant="dark">
                <Carousel.Item>
                  <h2>
                    {element.title}
                  </h2>
                  <Carousel.Caption>
                    <h5>status:{element.status}</h5>
                    <p>{element.description}</p>
                  </Carousel.Caption>
                </Carousel.Item>
              </Carousel>
            )
          })
        } */}
      </div>
    )
  }
}

export default withAuth0(MyFavoriteBooks);
