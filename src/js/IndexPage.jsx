"use strict";

import React    from "react";
import ReactDOM from "react-dom";
import $        from "jquery";

import "../css/IndexPage.scss";


import { Grid, Row, Col, PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";


class Item extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <ListGroupItem>
        <a href={ this.props.url }>
          { this.props.title }
        </a>
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

    document.querySelector("title").textContent = this.state.title;

  }

  componentWillUnmount() {
    this.willUnmount = true;
  }

  refresh () {

    if (this.willUnmount) return;

    let m = document.URL.match(/\/page\/(\d{1,10})/);
    if (m) {
      this.state.page = parseInt(m[1]);
    } else {
      this.state.page = 1;
    }
    m = document.URL.match(/\/category\/([^\/]+)/);
    if (m) {
      this.state.category = decodeURIComponent(m[1]);
    } else {
      this.state.category = "";
    }
    console.log("cate, page: ", this.state.category, this.state.page);


    $.get("/index.json").done((result) => {

      if (this.willUnmount) return;
      console.log("result: ", result);

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

      if (this.state.category.length) {
        posts = posts.filter((elem) => {
          return elem[4] == this.state.category;
        });
      }

      let categories = [];
      posts.forEach((elem) => {
        let category = elem[4];
        if (category.length && categories.indexOf(category) == -1) {
          categories.push(category);
        }
      });

      let maxPage = Math.ceil(posts.length / result.config.pageCount);
      maxPage = maxPage < 1 ? 1 : maxPage;
      this.setState({ maxPage: maxPage });
      if (this.state.page > this.state.maxPage) {
        this.setState({ page: this.state.maxPage });
      }

      posts = posts.slice(
        (this.state.page - 1) * result.config.pageCount,
        this.state.page * result.config.pageCount
      );
      console.log("cate, page: ", this.state.page, this.state.maxPage, result.config.pageCount);

      document.querySelector("title").textContent = result.config.title;

      this.setState({
        articles: articles.map((elem) => {
          return <Item key={ elem[0] } url={ "/#view/" + elem[0] } title={ elem[1] } />;
        }),
        posts: posts.map((elem) => {
          return <Item key={ elem[0] } url={ "/#view/" + elem[0] } title={ elem[1] } />;
        }),
        categories: categories.map((elem) => {
          return <Item key={ elem } url={ "/#/category/" + elem + "/page/1" } title={ elem } />;
        }),
        title: result.config.title
      });
    }).fail(() => {
      console.log("ajax fail: " + arguments);
    });
  }

  componentDidMount () {
    this.refresh();
  }

  page (p) {
    if (p < 1) {
      p = 1;
    } else if (p > this.state.maxPage) {
      p = this.state.maxPage;
    }
    let url = "/#";
    if (this.state.category.length) {
      url += `/category/${this.state.category}/page/${p}`;
    } else {
      url += `/page/${p}`;
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
                      <a href="/#">{ this.state.title }</a>
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

                  <a href={ this.page(this.state.page - 1) } >Prev</a> &nbsp;
                  <span>{ this.state.page } / { this.state.maxPage }</span> &nbsp;
                  <a href={ this.page(this.state.page + 1) } >Next</a>
                </Col>
              </Row>

              <Row>
                <Col className="footer" xs={12}>
                  <footer>
                    <hr />
                    <a href="/#create">Create</a>
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
