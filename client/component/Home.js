"use strict";


import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Link } from "react-router";

import { fetchData } from "../actions/home.js";
import Loading from "../component/Loading.js";
import Article from "../component/Article.js";
import "../scss/Home.scss";


class Home extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(fetchData());
  }

  render () {
    const {
      isFetching,
      title,
      category,
      categories,
      articles,
      posts,
      page,
      maxPage,
      dispatch
    } = this.props;
    let prevPage = page > 1 ? page - 1 : 1;
    let nextPage = page < maxPage ? page + 1 : maxPage;
    prevPage = prevPage == 1 ? "/" : "/page/" + prevPage;
    nextPage = nextPage == 1 ? "/" : "/page/" + nextPage;
    if (category.length) {
      prevPage = "/category/" + category + prevPage;
      nextPage = "/category/" + category + nextPage;
    }
    document.title = title;
    return (
      <div className="home container">
        <Loading isFetching={ isFetching } />
        <header>
          <h1><Link to="/">{ title }</Link></h1>
        </header>

        <nav>
          {
            articles.map((element, index) => {
              return (
                <Link
                  key={ index }
                  to={ "/view/" + element[0] }>
                  { element[1] }
                </Link>
              );
            })
          }
        </nav>

        {
          category.length ? (
            <div className="category-hint">
              Current category is: { category }.&nbsp;
              <Link to="/">Cancel</Link>
            </div>
          ) : ""
        }

        <section className="articles-list">

          <div className="scroll scroll-down">
            <a onClick={ event => { event.preventDefault(); window.scroll(0, 9002); } } href="">↓</a>
          </div>

          <div className="scroll scroll-up">
            <a onClick={ event => { event.preventDefault(); window.scroll(0, 0); } } href="">↑</a>
          </div>

          {
            posts.map((element, index) => {
              const id = element[0];
              const title = element[1];
              const content = element[5];
              return (
                <Article
                  key={index}
                  id={id}
                  title={title}
                  content={content}
                />
              );
            })
          }

          <div className="post-footer">
            <span>{page} / {maxPage}</span>
            <span>
              <Link
                onClick={event => window.scroll(0, 0)}
                to={prevPage}>
                Prev
              </Link>
            </span>
            <span>
              <Link
                onClick={event => window.scroll(0, 0)}
                to={nextPage}>
                Next
              </Link>
            </span>
          </div>
        </section>

        <section className="categories-list">
          Categories:
          {
            categories.map((element, index) => {
              return (
                <Link
                  key={index}
                  onClick={event => window.scroll(0, 0)}
                  to={"/category/" + element}>
                  {element}
                </Link>
              );
            })
          }
        </section>

        <footer>
          <Link to="/create">Create</Link>
        </footer>
      </div>
    );
  }

}

Home.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  title:      PropTypes.string.isRequired,
  category:   PropTypes.string.isRequired,
  categories: PropTypes.array.isRequired,
  articles:   PropTypes.array.isRequired,
  posts:      PropTypes.array.isRequired,
  page:       PropTypes.number.isRequired,
  maxPage:    PropTypes.number.isRequired,
  dispatch:   PropTypes.func.isRequired
};

export default connect(state => state.home)(Home);
