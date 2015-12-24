"use strict";

import "isomorphic-fetch";
import React        from "react";
import ReactDOM     from "react-dom";

import markdown     from "../../models/markdown";
import parseArticle from "../../models/parseArticle";
import secret   from "../../models/secret";

import "../css/ViewPage.scss";


import { Grid, Row, Col, Panel, PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";

export default class ViewPage extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      id:      "",
      date:    "",
      title:   "",
      content: ""
    };
  }

  componentDidMount () {
    const id = this.props.params.id;

    const match = id.match(/^(\d{4})([0-1]\d)([0-3]\d)(\d{2})$/);
    if (match) {

      const [, year, month, day, number] = match;

      const url = `articles/${year}/${month}/${id}.md`;

      fetch(url)
      .then( (response) => {
        if ( response.status >= 400 ) {
          throw new Error("Bad response from server");
        }

        return response.text();
      }).then( (result) => {
        let data = parseArticle(result);
        console.log("data: ", data);
        document.querySelector("title").textContent = data.title;
        this.setState({
          id:       id,
          title:    data.title,
          date:     data.date,
          category: data.category,
          content:  markdown(data.content)
        });
      }).catch( (err) => {
        console.log("fetch fail: ", err);
      });
    } else {
      console.log("wrong id");
      window.location.href = "/#";
    }
  }

  remove (e) {
    e.preventDefault();
    let password = window.prompt("Password please", "");
    if (password != null) {

      const url = "/article/remove";

      fetch(url, {
        method: "post",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: secret.encode({ id: this.state.id }, password)
        })
      })
      .then( (response) => {
        return response.json();
      })
      .then( (result) => {
        if (result.success) {
          alert(result.success);
          window.location.href = "/#";
        } else {
          alert(result.message || "Unknown Error");
        }
      })
      .catch( (err) => {
        console.log("fetch fail: ", err);
      });

    }
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
                      <a href="/#">
                        >>
                      </a>
                      <a href={ "/#view/" + this.state.id }>
                        { this.state.title }
                      </a>
                    </PageHeader>
                  </header>
                </Col>
              </Row>
              <Row>
                <Col xs={12}>
                  <Panel>
                    <article dangerouslySetInnerHTML={ { __html: this.state.content } }></article>
                  </Panel>
                </Col>
              </Row>
              <Row>
                <Col className="footer" xs={12}>
                  <footer>
                    <span>{ this.state.category }</span>
                    <br />
                    <span>{ this.state.date }</span>
                    <br />
                    <a href={ "/#update/" + this.state.id }>Edit</a>
                    &nbsp;
                    <a href="/#create">Create</a>
                    &nbsp;
                    <a href="" onClick={ this.remove.bind(this) } >Remove</a>
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
