"use strict";


import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Link } from "react-router";
import { pushPath } from "redux-simple-router";

import { fetchData } from "../actions/home.js";
import Loading from "../component/Loading.js";
import "../css/Home.scss";

class Home extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(fetchData());
  }

  render () {
    const { isFetching, title, category, categories, articles, posts, page, maxPage, dispatch } = this.props;
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
        <div className="main">
          <aside className="left-side">
            <section>
              <h4>Articles</h4>
              <ul>
                { this.props.articles.map((element, index) => {
                  return (<li key={ index }><Link to={ "/view/" + element[0] }>{ element[1] }</Link></li>);
                }) }
              </ul>
            </section>
            <section>
              <h4>Categories</h4>
              <ul>
                { this.props.categories.map((element, index) => {
                  return (<li key={ index }><Link to={ "/category/" + element }>{ element }</Link></li>)
                }) }
              </ul>
            </section>
          </aside>
          <aside className="right-side">
            <section>
              <h4>{ category.length ? (<span>Category: { category }, <Link to="/">Back</Link> </span>) : (<span>Posts</span>) } </h4>
              <ul>
                { this.props.posts.map((element, index) => {
                  return (<li key={ index }><Link to={ "/view/" + element[0] }>{ element[1] }</Link></li>);
                }) }
              </ul>
              <div className="post-footer">
                <span>{ page } / { maxPage }</span>
                <span><Link to={ prevPage }>Prev</Link></span>
                <span><Link to={ nextPage }>Next</Link></span>
              </div>
            </section>
          </aside>
        </div>
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

function mapStateToProps (state) {
  const { home } = state;
  const {
    isFetching,
    title,
    category,
    categories,
    articles,
    posts,
    page,
    maxPage
  } = home;

  return {
    isFetching,
    title,
    category,
    categories,
    articles,
    posts,
    page,
    maxPage
  }
}

export default connect(mapStateToProps)(Home);
