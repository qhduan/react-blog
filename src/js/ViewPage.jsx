"use strict";

import React        from "react";
import ReactDOM     from "react-dom";
import $            from "jquery";

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

    document.querySelector("title").textContent = "";

    let id = document.URL.match(/#view\/(\d{4})([0-1]\d)([0-3]\d)(\d{2})$/);
    if (id) {
      let year = id[1];
      let month = id[2];
      let day = id[3];
      let number = id[4];

      id = year + month + day + number;
      this.state.id = id;

      $.get(`articles/${year}/${month}/${id}.md`).done((result) => {
        // console.log("result: ", result);
        let data = parseArticle(result);

        console.log(data);

        document.querySelector("title").textContent = data.title;

        this.setState({
          title:    data.title,
          date:     data.date,
          category: data.category,
          content:  markdown(data.content)
        });
      }).fail(() => {
        console.log("ajax fail: " + arguments);
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
      $.post("/article/remove", {
        data: secret.encode({
          id: this.state.id
        }, password)
      }).done((result) => {
        if (result.success) {
          alert(result.success);
          window.location.href = "/#";
        } else {
          alert(result.message || "Unknown Error");
        }
      }).fail(() => {
        alert("ajax error");
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
