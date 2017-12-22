
import React from "react";
import {
    Layout, Input, Form, Radio, Button, Menu,
    notification, Spin,
} from "antd";
const FormItem = Form.Item;
const {Header, Content, Footer} = Layout;
import moment from "moment";
import {Link, Redirect} from "react-router-dom";

export default class UpdatePage extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            loading: false,
            postId: null,
            title: "",
            type: "post",
            date: moment().format("YYYY-MM-DD hh:mm:ss"),
            edit: moment().format("YYYY-MM-DD hh:mm:ss"),
            category: "",
            content: "",
            markdowned: "",
            password: "",
            redirect: null,
        };
    }

    componentDidMount () {

        const {postId} = this.props.match.params;
        if (_.isString(postId)) {
            this.fetch(postId);
        }

    }

    fetch (postId) {

        this.setState({
            postId,
            loading: true
        });

        let m = "";
        let year = "";
        let month = "";

        try {
            m = postId.match(/(\d{4})(\d{2})(\d{4})/);
            year = m[1];
            month = m[2];
        } catch (err) {
            notification.open({
                message: "警告",
                description: "解析postId错误"
            });
            this.setState({
                redirect: "/"
            });
            return;
        }

        require.ensure([], require => {
            const parseArticle = require("../../component/parseArticle.js");
            const markdown = require("../../component/markdown.js");
            fetch(`/articles/${year}/${month}/${postId}.md`)
            .then(response => response.text())
            .then(data => parseArticle(data))
            .then(data => {
                data.markdowned = markdown(data.content);
                return data;
            })
            .then(data => {
                console.log(data);
                this.setState({
                    loading: false,
                    title: data.title,
                    content: data.content,
                    markdowned: data.markdowned,
                    category: data.category,
                    type: data.type,
                    date: data.date,
                })
            })
            .catch(err => {
                notification.open({
                    message: "警告",
                    description: "获取post错误"
                });
                this.setState({
                    redirect: "/"
                });
            });
        });

    }

    render () {

        const {
            title,
            type,
            date,
            category,
            content,
            markdowned,
            password,
            loading,
            redirect,
            postId,
            edit,
        } = this.state;

        if (redirect) {
            return (
                <Redirect to={redirect} />
            );
        }

        if (loading) {
            return (
                <div className="loading">
                    <Spin />
                </div>
            );
        }

        const formItemLayout = {
            labelCol: {
                xs: { span: 2 },
                sm: { span: 2 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <Layout>
                <Header>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        style={{ lineHeight: "64px" }}
                        selectable={false}
                    >
                        <Menu.Item>
                            <Link to="/">
                                首页
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content
                    style={{padding: "24px 50px "}}
                >
                    <FormItem
                        label="标题"
                        {...formItemLayout}
                    >
                        <Input
                            placeholder="标题 必填"
                            value={title}
                            onChange={e => this.setState({
                                title: e.target.value
                            })}
                            />
                    </FormItem>
                    <FormItem
                        label="category"
                        {...formItemLayout}
                    >
                        <Input
                            placeholder="分类 选填"
                            value={category}
                            onChange={e => this.setState({
                                category: e.target.value
                            })}
                            />
                    </FormItem>
                    <FormItem
                        label="类型"
                        {...formItemLayout}
                    >
                        <Radio.Group
                            value={type}
                            onChange={e => this.setState({
                                type: e.target.value
                            })}
                        >
                            <Radio.Button value="post">
                                post
                            </Radio.Button>
                            <Radio.Button value="article">
                                article
                            </Radio.Button>
                        </Radio.Group>
                    </FormItem>
                    <FormItem
                        label="日期"
                        {...formItemLayout}
                    >
                        <Input
                            value={date}
                            onChange={e => this.setState({
                                date: e.target.value
                            })}
                            />
                    </FormItem>
                    {postId ? (
                        <FormItem
                            label="修改日期"
                            {...formItemLayout}
                        >
                            <Input
                                value={edit}
                                onChange={e => this.setState({
                                    edit: e.target.value
                                })}
                                />
                        </FormItem>
                    ) : null}
                    <FormItem
                        label="密码"
                        {...formItemLayout}
                    >
                        <Input
                            type="password"
                            value={password}
                            onChange={e => this.setState({
                                password: e.target.value
                            })}
                            />
                    </FormItem>

                    <FormItem
                        label="上传"
                        {...formItemLayout}
                    >
                        <input
                            onChange={event => this.updateFile(event)}
                            id="file"
                            type="file"
                            />
                        <Button
                            onClick={event => this.upload(event)}
                        >
                            上传文件
                        </Button>
                </FormItem>

                    <FormItem
                        label="正文"
                        {...formItemLayout}
                    >
                        <Input.TextArea
                            value={content}
                            onChange={e => {
                                this.setState({
                                    content: e.target.value
                                });
                                this.preview(e.target.value);
                            }}
                            autosize={{
                                minRows: 10
                            }}
                            />
                    </FormItem>
                    <FormItem
                        label=" "
                        {...formItemLayout}
                    >
                        <Button
                            onClick={() => {
                                if (postId) {
                                    this.edit();
                                } else {
                                    this.create();
                                }
                            }}
                        >
                            提交
                        </Button>
                    </FormItem>
                    <FormItem
                        label="预览"
                        {...formItemLayout}
                    >
                        <div
                            style={{
                                backgroundColor: "white",
                                padding: "0 10px",
                            }}
                            dangerouslySetInnerHTML={{
                                __html: markdowned
                            }}
                        />
                    </FormItem>
                </Content>
                <Footer>

                </Footer>
            </Layout>
        );
    }


    edit () {

        const {
            postId, title, type,
            date, edit, category, content,
            password,
        } = this.state;

        require.ensure([], require => {
            const secret = require("../../component/secret.js");
            fetch("/article/update", {
                method: "post",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: secret.encode({
                        id: postId,
                        title, type, date,
                        edit, category, content,
                    }, password)
                })
            })
            .then(response => response.json())
            .then(ret => {

                if (ret.success) {
                    this.setState({
                        redirect: "/",
                        loading: false
                    });
                    notification.open({
                        message: "修改成功",
                        description: ""
                    });
                } else {
                    this.setState({
                        loading: false
                    });
                    notification.open({
                        message: "修改失败",
                        description: ret.message || "未知错误"
                    });
                }

            })
            .catch(err => {
                this.setState({
                    loading: false
                });
                notification.open({
                    message: "修改失败",
                    description: err.message || "未知错误"
                });
            });
        });
    }


    create () {
        const {
            title, type, date,
            category, content, password
        } = this.state;
        this.setState({loading: true});
        require.ensure([], require => {
            const secret = require("../../component/secret.js");
            fetch("/article/create", {
                method: "post",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: secret.encode({
                        title,
                        type,
                        date,
                        category,
                        content,
                    }, password)
                })
            })
            .then(response => response.json())
            .then(ret => {

                if (ret.success) {
                    this.setState({
                        redirect: "/",
                        loading: false
                    });
                    notification.open({
                        message: "新建成功",
                        description: ""
                    });
                } else {
                    this.setState({
                        loading: false
                    });
                    notification.open({
                        message: "新建失败",
                        description: ret.message || "未知错误"
                    });
                }

            })
            .catch(err => {
                this.setState({
                    loading: false
                });
                notification.open({
                    message: "新建失败",
                    description: err.message || "未知错误"
                });
            });
        });
    }


    uploadAction (name, file) {

        const {
            content,
            date,
            password,
        } = this.state;

        this.setState({
            loading: true,
        });

        require.ensure([], require => {
            const secret = require("../../component/secret.js");
            const markdown = require("../../component/markdown.js");
            fetch("/upload", {
                method: "post",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                data: secret.encode({
                        name,
                        file,
                        date,
                    }, password)
                })
            })
            .then(response => response.json())
            .then(ret => {
                if (ret.success) {
                    const url = ret.success;
                    let add = `[${url}](${url})`;
                    if (url.match(/\.jpg$|\.png$|\.gif$|\.bmp$/ig)) {
                        add = "!" + add;
                    }
                    const newContent = `${content}\n\n${add}\n\n`;
                    const markdowned = markdown(newContent);
                    this.setState({
                        content: newContent,
                        markdowned,
                        loading: false,
                    });
                } else {
                    this.setState({
                        loading: false,
                    });
                    notification.open({
                        message: "上传错误",
                        description: ret.message || "未知错误"
                    });
                }
            })
            .catch(err => {
                this.setState({
                    loading: false,
                });
                notification.open({
                    message: "上传错误",
                    description: err.message || "未知错误"
                });
            });
        });

    }


    preview (content) {
        require.ensure([], require => {
            const markdown = require("../../component/markdown.js");
            this.setState({
                markdowned: markdown(content)
            });
        });
    }


    updateFile (event) {
        this.file = event.target.files[0];
    }


    upload (event) {
        if (this.file) {
            const name = this.file.name;
            let reader = new FileReader();
            reader.onload = () => {
                if (reader.result && reader.result.length && reader.result.match(/base64,/)) {
                    const pos = reader.result.indexOf("base64,");
                    const file = reader.result.substr(pos + 7);
                    this.uploadAction(name, file);
                }
            };
            reader.readAsDataURL(this.file);
        }
    }

}
