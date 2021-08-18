import React from 'react';
import './BestBooks.css';
import axios from "axios";
import { Carousel, Button } from 'react-bootstrap';
import { withAuth0 } from '@auth0/auth0-react';
import BookFormModal from './BookFormModal';
import UpdateFormModal from './UpdateFormModal';

class MyFavoriteBooks extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bookData: [],
      showModalForm: false,
      showUpdateModal: false,
      title: '',
      status: '',
      description: '',
      updateBookId: ''
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

    if (e.target.bookName.value) {
      this.showForm(false);
    }
    if (this.props.auth0.isAuthenticated) {
      this.props.auth0.getIdTokenClaims()
        .then(result => {
          const jwt = result.__raw;
          let data = {
            title: e.target.bookName.value,
            status: e.target.status.value,
            description: e.target.description.value,
            email: this.props.auth0.user.email
          }
          let config = {
            headers: { "Authorization": `Bearer ${jwt}` },
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
        })
        .catch((error) => console.log(error));
    }
  }

  deleteBook = (bookId) => {
    if (this.props.auth0.isAuthenticated) {
      this.props.auth0.getIdTokenClaims()
        .then(result => {
          const jwt = result.__raw;
          let config = {
            headers: { "Authorization": `Bearer ${jwt}` },
            method: 'delete',
            baseURL: "http://localhost:8000",
            url: `/books/${bookId}`,
          }
          axios(config).then(res => {
            this.setState({
              bookData: res.data
            })
          })
        })
        .catch((error) => console.log(error));
    }
  }

  showUpdateForm = (value, id, title, status, description) => {
    this.setState({
      showUpdateModal: value,
      updateBookId: id,
      title: title,
      status: status,
      description: description
    })
  }

  render() {
    return (
      <div className="jumbotron" >
        <h1 className="text-center mt-3">My Favorite Books</h1>
        <p className="text-center mt-2">
          This is a collection of my favorite books
        </p>
        {
          this.props.auth0.isAuthenticated &&
          <Button variant="primary" className="mx-auto p-2 mb-2 d-flex jusrify-content-center" size="sm" onClick={() => this.showForm(true)} >
            Add Book
          </Button>
        }
        {this.state.showModalForm &&
          < BookFormModal
            show={this.state.showModalForm}
            addBookForm={this.addBookForm}
            hideModalForm={() => this.showForm(false)}
          />
        }
        {this.state.showUpdateModal &&
          <UpdateFormModal
            show={this.state.showUpdateModal}
            hideModalForm={() => this.showUpdateForm(false)}
            title={this.state.title}
            status={this.state.status}
            description={this.state.description}
            updateBookId={this.state.updateBookId}
          />
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
                    <Button variant="success" className="mx-3"
                      onClick={() => this.showUpdateForm(true, element._id, element.title, element.status, element.description)}
                    >
                      Update Book
                    </Button>
                    <Button variant="danger" onClick={() => this.deleteBook(element._id)} >
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
      </div >
    )
  }
}

export default withAuth0(MyFavoriteBooks);
