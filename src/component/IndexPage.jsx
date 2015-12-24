"use strict";

import "isomorphic-fetch";
import React    from "react";
import ReactDOM from "react-dom";

import { Link } from "react-router";

import "../css/IndexPage.scss";


import { Grid, Row, Col, PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";


class Item extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <ListGroupItem>
        <Link to={ this.props.url }>{ this.props.title }</Link>
      </ListGroupItem>
    );
  }
}


export default class IndexPage extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      articles: [],
      posts: [],
      categories: [],
      titie: "Blog Title",
      category: "",
      page: 1,
      maxPage: 1
    };

    this.result = null;

    document.querySelector("title").textContent = this.state.title;

  }

  fetch () {
    return new Promise( (resolve, reject) => {
      if (this.result) {
        resolve(this.result);
      } else {
        fetch("/index.json")
        .then( (response) => {
          return response.json();
        })
        .then( (result) => {
          console.log("result: ", result);
          this.result = result;
          resolve(result);
        })
        .catch( (err) => {
          reject();
        });
      }
    });

  }

  show () {
    let page = 1;
    let category = "";

    if (this.props && this.props.params && this.props.params.page) {
      page = parseInt(this.props.params.page);
      if ( isNaN(page) || page <= 0 ) {
        page = 1;
      }
    }

    if (this.props && this.props.params && this.props.params.category) {
      category = this.props.params.category;
    }

    console.log("category, page: ", "'" + category + "'", page);

    this.fetch().then( (result) => {

      result.articles.sort((a, b) => {
        if (a[2] > b[2]) return -1;
        else if (a[2] < b[2]) return 1;
        return 0;
      });

      let articles = result.articles.filter((elem) => {
        return elem[3] == "article"; // type
      });

      let posts = result.articles.filter((elem) => {
        return elem[3] == "post";
      });

      let categories = [];
      posts.forEach((elem) => {
        let category = elem[4];
        if (category.length && categories.indexOf(category) == -1) {
          categories.push(category);
        }
      });

      if (category.length) {
        posts = posts.filter((elem) => {
          return elem[4] == category;
        });
      }

      let maxPage = Math.ceil(posts.length / result.config.pageCount);
      maxPage = maxPage < 1 ? 1 : maxPage;
      if (page > maxPage) {
        page = maxPage;
      }

      posts = posts.slice(
        (page - 1) * result.config.pageCount,
        page * result.config.pageCount
      );
      console.log("maxPage, pageCount: ", page, maxPage, result.config.pageCount);

      document.querySelector("title").textContent = result.config.title;

      this.setState({
        page: page,
        category: category,
        maxPage: maxPage,
        articles: articles.map((elem) => {
          return <Item key={ elem[0] } url={ "/view/" + elem[0] } title={ elem[1] } />;
        }),
        posts: posts.map((elem) => {
          return <Item key={ elem[0] } url={ "/view/" + elem[0] } title={ elem[1] } />;
        }),
        categories: categories.map((elem) => {
          return <Item key={ elem } url={ "/category/" + elem + "/page/1" } title={ elem } />;
        }),
        title: result.config.title
      });
    }).catch( (err) => {
      console.log("fetch fail: " + err);
    });
  }

  componentDidMount () {
    this.show();
  }

  componentDidUpdate (prevProps) {
    let oldCategory = prevProps.params && prevProps.params.category;
    let newCategory = this.props.params && this.props.params.category;
    let oldPage = prevProps.params && prevProps.params.page;
    let newPage = this.props.params && this.props.params.page;
    console.log(oldCategory, newCategory, oldPage, newPage)
    if (oldCategory != newCategory || oldPage != newPage) {
      this.show();
    }
  }

  page (p) {
    if (p < 1) {
      p = 1;
    } else if (p > this.state.maxPage) {
      p = this.state.maxPage;
    }
    let url = "/";
    if (this.state.category.length) {
      url += `category/${this.state.category}/page/${p}`;
    } else {
      url += `page/${p}`;
    }
    return url;
  }

  render () {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12} mdOffset={1} md={10} lgOffset={2} lg={8}>

              <Row>
                <Col xs={12}>
                  <header>
                    <PageHeader>
                      <Link to="/">{ this.state.title }</Link>
                    </PageHeader>
                  </header>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={4} lg={4}>
                  <ListGroup style={ this.state.articles.length > 0 ? {} : { display: "none" } }>
                    { this.state.articles }
                  </ListGroup>
                  <ListGroup style={ this.state.categories.length > 0 ? {} : { display: "none" } }>
                    { this.state.categories }
                  </ListGroup>
                </Col>
                <Col xs={12} md={8} lg={8} style={ this.state.posts.length > 0 ? {} : { display: "none" } }>
                  <ListGroup>
                    { this.state.posts }
                  </ListGroup>

                  <Link to={ this.page(this.state.page - 1) } >Prev</Link> &nbsp;
                  <span>{ this.state.page } / { this.state.maxPage }</span> &nbsp;
                  <Link to={ this.page(this.state.page + 1) } >Next</Link>
                </Col>
              </Row>

              <Row>
                <Col className="footer" xs={12}>
                  <footer>
                    <hr />
                    <Link to="/create">Create</Link>
                  </footer>
                </Col>
              </Row>

            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
};
