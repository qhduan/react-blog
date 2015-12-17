"use strict";

import React    from "react";
import ReactDOM from "react-dom";
import $        from "jquery";

import markdown from "../../models/markdown";
import secret   from "../../models/secret";

import "../css/CreatePage.scss";


import { Grid, Row, Col, PageHeader, Panel, Input, ButtonInput } from "react-bootstrap";


export default class CreatePage extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      title:    "",
      type:     "post",
      date:     new Date().toJSON().substr(0, 19).replace("T", " "),
      category: "",
      content:  "",
      view:     "",
      password: ""
    };

    document.querySelector("title").textContent = "Create";
  }

  updateTitle (e) {
    this.setState({ title: e.target.value });
  }

  updateType (e) {
    this.setState({ type: e.target.value });
  }

  updateDate (e) {
    this.setState({ date: e.target.value });
  }

  updateCategory (e) {
    this.setState({ category: e.target.value });
  }

  updateContent (e) {
    let value = e.target.value;
    this.setState({
      content: value,
      view: markdown(value) // Convert to markdown
    });
  }

  updatePassword (e) {
    this.setState({ password: e.target.value });
  }

  submit () {
    let data = {
      title:    this.state.title,
      type:     this.state.type,
      date:     this.state.date,
      category: this.state.category,
      content:  this.state.content
    };

    $.post("/article/create", {
      data: secret.encode(data, this.state.password)
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

  render () {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={12} mdOffset={1} md={10} lgOffset={2} lg={8}>

              <Row>
                <Col xs={12}>
                  <PageHeader>
                    <a href="/#">
                      >>
                    </a>
                    <a href="/#create/">
                      Create
                    </a>
                  </PageHeader>
                </Col>
              </Row>

              <Row>
                <Col xs={12}>
                  <form>
                    <Input type="text" label="Title" placeholder="Enter title" onChange={ this.updateTitle.bind(this) } />
                    <Input type="select" label="Type" placeholder="Type" onChange={ this.updateType.bind(this) } >
                      <option value="post">Post</option>
                      <option value="article">Article</option>
                    </Input>
                    <Input type="text" label="Date" value={ this.state.date } onChange={ this.updateDate.bind(this) } readOnly />
                    <Input type="text" label="Category" placeholder="Enter category" onChange={ this.updateCategory.bind(this) } />
                    <Input className="content" type="textarea" label="Content" placeholder="Enter content" onChange={ this.updateContent.bind(this) } />
                    <Panel>
                      <div className="view" dangerouslySetInnerHTML={ { __html: this.state.view } }></div>
                    </Panel>
                    <Input type="password" label="Password" onChange={ this.updatePassword.bind(this) } />
                    <ButtonInput value="Submit" onClick={ this.submit.bind(this) } />
                  </form>
                </Col>
              </Row>

            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
};
