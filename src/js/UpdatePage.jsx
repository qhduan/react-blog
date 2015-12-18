"use strict";

import React    from "react";
import ReactDOM from "react-dom";
import $        from "jquery";

import markdown from "../../models/markdown";
import parseArticle from "../../models/parseArticle";
import secret   from "../../models/secret";

import "../css/UpdatePage.scss";


import { Grid, Row, Col, PageHeader, Panel, Input, ButtonInput, Button, Alert } from "react-bootstrap";


export default class UpdatePage extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      id:       "",
      title:    "",
      type:     "post",
      date:     "",
      category: "",
      content:  "",
      view:     "",
      edit:     new Date().toJSON().substr(0, 19).replace("T", " "),
      password: "",
      file:     null,
      message:  ""
    };

    let id = document.URL.match(/#update\/(\d{4})([0-1]\d)([0-3]\d)(\d{2})$/);
    if (id) {
      let year = id[1];
      let month = id[2];
      let day = id[3];
      let number = id[4];

      id = year + month + day + number;
      this.state.id = id;
      console.log(id);

      $.get(`articles/${year}/${month}/${id}.md`).done((result) => {
        // console.log("result: ", result);
        let data = parseArticle(result);

        document.querySelector("title").textContent = data.title;

        this.setState({
          title:    data.title,
          type:     data.type,
          date:     data.date,
          category: data.category,
          content:  data.content
        });
      }).fail(() => {
        console.log("ajax fail: " + arguments);
      });
    } else {
      console.log("wrong id");
      window.location.href = "/#";
    }

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

  updateEdit (e) {
    this.setState({ edit: e.target.value });
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

  updateFile(e) {
    this.setState({ file: e.target.files[0] });
  }

  hideAlert (e) {
    this.setState({ message: "" });
  }

  upload (e) {
    if ( !this.state.file ) {
      this.setState({
        message: "No file selected"
      });
    } else {
      let name = this.state.file.name;
      let reader = new FileReader();
      reader.onload = () => {
        if (reader.result && reader.result.length && reader.result.match(/base64,/)) {
          let pos = reader.result.indexOf("base64,");
          let data = reader.result.substr(pos + 7);
          $.post("/upload", {
            data: secret.encode({
              name: name,
              file: data,
              date: this.state.date
            }, this.state.password)
          }).done((result) => {
            if (result.success) {
              alert("uploaded " + result.success);
              this.setState({
                content: this.state.content + "\n\n" + result.success
              });
            } else {
              // alert(result.message || "Unknown Error");
              this.setState({
                message: result.message || "Unknown Error"
              });
            }
          }).fail(() => {
            alert("ajax error");
          });
        }
      };
      reader.readAsDataURL(this.state.file)
    }
  }

  submit () {
    let data = {
      id:       this.state.id,
      title:    this.state.title,
      type:     this.state.type,
      date:     this.state.date,
      category: this.state.category,
      content:  this.state.content,
      edit:     this.state.edit
    };

    console.log(data);

    $.post("/article/update", {
      data: secret.encode(data, this.state.password)
    }).done((result) => {
      if (result.success) {
        alert(result.success);
        window.location.href = "/#";
      } else {
        // alert(result.message || "Unknown Error");
        this.setState({
          message: result.message || "Unknown Error"
        });
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
                  <Panel>
                    <Input type="text" label="Title" value={ this.state.title } onChange={ this.updateTitle.bind(this) } />
                    <Input type="select" label="Type" value={ this.state.type } onChange={ this.updateType.bind(this) } >
                      <option value="post">Post</option>
                      <option value="article">Article</option>
                    </Input>
                    <Input type="text" label="Date" value={ this.state.date } onChange={ this.updateDate.bind(this) } readOnly />
                    <Input type="text" label="Edit Date" value={ this.state.edit } onChange={ this.updateEdit.bind(this) } readOnly />
                    <Input type="text" label="Category" value={ this.state.category } onChange={ this.updateCategory.bind(this) } />
                    <Input className="content" type="textarea" label="Content" value={ this.state.content } onChange={ this.updateContent.bind(this) } />
                    <Panel>
                      <div className="view" dangerouslySetInnerHTML={ { __html: this.state.view } }></div>
                    </Panel>
                    <Input type="password" label="Password" onChange={ this.updatePassword.bind(this) } />

                    <Alert style={ this.state.message.length ? {} : { display: "none" } } bsStyle="danger">
                      <p>
                        { this.state.message }
                      </p>
                      <Button onClick={ this.hideAlert.bind(this) }>Close</Button>
                    </Alert>

                    <ButtonInput value="Submit" onClick={ this.submit.bind(this) } />
                  </Panel>

                  <Panel>
                    <Input type="file" onChange={ this.updateFile.bind(this) } />
                    <ButtonInput value="Upload" onClick={ this.upload.bind(this) } />
                  </Panel>
                </Col>
              </Row>

            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
};
