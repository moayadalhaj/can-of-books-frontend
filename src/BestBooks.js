import React from 'react';
import './BestBooks.css';
import axios from "axios";
import { Carousel, Button } from 'react-bootstrap';
import { withAuth0 } from '@auth0/auth0-react';
import BookFormModal from './BookFormModal';

class MyFavoriteBooks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bookData: [],
      showModalForm: false
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
            .then(axiosResponse => {
              this.setState({
                bookData: axiosResponse.data,
              });
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    };
  }

  showForm = (clicked) => {
    this.setState({
      showModalForm: clicked
    })
  }

  addBookForm = (e) => {
    e.preventDefault();
    if (e.target.bookName.value) {
      this.showForm(false);
    }
    let data = {
      title: e.target.bookName.value,
      status: e.target.status.value,
      description: e.target.description.value,
      email: this.props.auth0.user.email
    }
    let config = {
      method: 'post',
      baseURL: "http://localhost:8000",
      url: '/books',
      data: data
    }
    axios(config).then(res => {
      let bookData = this.state.bookData
      bookData.push(res.data)
      this.setState({
        bookData: bookData
      })
    });
  }

  deleteBook = (bookId) => {
    let config = {
      method: 'delete',
      baseURL: "http://localhost:8000",
      url: `/books/${bookId}`,
    }
    axios(config).then(res => {
      this.setState({
        bookData: res.data
      })
    })
  }


  render() {
    return (
      <div className="jumbotron">
        <h1>My Favorite Books</h1>
        <p>
          This is a collection of my favorite books
        </p>
        {
          this.props.auth0.isAuthenticated &&
          <Button variant="primary" className="mx-auto p-2 mb-2 d-flex jusrify-content-center" size="sm" onClick={() => this.showForm(true)} >
            Add Book
          </Button>
        }
        {
          <BookFormModal show={this.state.showModalForm} addBookForm={this.addBookForm} hideModalForm={() => this.showForm(false)} />
        }
        {
          this.state.bookData.length > 0 && (<Carousel>
            {this.state.bookData.map((element, index) => {
              return (

                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={`https://via.placeholder.com/800x400/000000/FFFFFF?text=${element.title}`}
                    alt="First slide"
                  />
                  <Carousel.Caption>
                    <h5>status:{element.status}</h5>
                    <p>{element.description}</p>
                    <Button variant="danger" onClick={() => this.deleteBook(element._id)}>
                      Delete Book
                    </Button>
                  </Carousel.Caption>
                </Carousel.Item>
              )
            })
            }
          </Carousel>
          )
        }
      </div>
    )
  }
}

export default withAuth0(MyFavoriteBooks);
