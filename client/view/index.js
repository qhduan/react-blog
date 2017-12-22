
import React from "react";
import {
    Layout, Menu, Modal, Button, Input, notification,
    Spin,
} from "antd";
const {Header, Content, Footer} = Layout;
import {Link, Redirect} from "react-router-dom";

export default class ViewPage extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            data: null,
            loading: false,
            removeModal: false,
            password: "",
            redirect: null,
        }
    }

    componentDidMount () {
        this.update();
    }

    componentDidUpdate (prevProps) {
        if (JSON.stringify(prevProps.match.params) !== JSON.stringify(this.props.match.params)) {
            this.update()
        }
    }

    parseParams () {
        // let {page, category} = this.props.params;
        const {postId} = this.props.match.params;

        return {postId};
    }

    update () {

        const {postId} = this.parseParams();

        this.setState({loading: true});

        console.log("fetch postId", postId);

        const m = postId.match(/(\d{4})(\d{2})(\d{4})/);
        const year = m[1];
        const month = m[2];
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
            .then(data => this.setState({data, loading: false}));
        });

    }


    remove () {

        const {password} = this.state;

        if (password.length <= 0) {
            return notification.open({
                message: "提示",
                description: "密码不能为空"
            });
        }

        const {postId} = this.parseParams();

        this.setState({
            loading: true
        });

        require.ensure([], require => {
            const secret = require("../../component/secret.js");
            fetch("/article/remove", {
                method: "post",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: secret.encode({ id: postId }, password)
                })
            })
            .then(response => response.json())
            .then(ret => {

                if (ret.success) {
                    notification.open({
                        message: "删除成功",
                        description: "",
                    });
                    this.setState({
                        redirect: "/"
                    });
                } else {
                    notification.open({
                        message: "删除失败",
                        description: ret.message || "未知错误",
                    });
                    this.setState({
                        loading: false
                    });
                }

            });
        });
    }


    render () {

        const {
            data,
            loading,
            removeModal,
            password,
            redirect,
        } = this.state;

        const {postId} = this.parseParams();

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

        if (data) {
            return (
                <div>
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
                                <Menu.Item>
                                    {data.title}
                                </Menu.Item>

                                <Menu.Item>
                                    <a
                                        onClick={e => {
                                            e.preventDefault();
                                            this.setState({
                                                password: "",
                                                removeModal: true
                                            });
                                        }}
                                    >
                                        删除
                                    </a>
                                </Menu.Item>

                                <Menu.Item>
                                    <Link to={`/update/${postId}`}>
                                        修改
                                    </Link>
                                </Menu.Item>

                            </Menu>
                        </Header>
                        <Content>
                            <div
                                style={{
                                    padding: "24px 50px"
                                }}
                                dangerouslySetInnerHTML={{
                                    __html: data.markdowned
                                }}
                            />
                        </Content>
                        <Footer>
                            {data.date ? (
                                <div>
                                    创建时间 {data.date}
                                </div>
                            ) : null}
                            {data.edit ? (
                                <div>
                                    修改时间 {data.edit}
                                </div>
                            ) : null}
                            {data.type ? (
                                <div>
                                    类型 {data.type}
                                </div>
                            ) : null}
                            {data.category ? (
                                <div>
                                    分类 {data.category}
                                </div>
                            ) : null}

                            <Button
                                onClick={() => this.setState({
                                    password: "",
                                    removeModal: true
                                })}
                            >
                                删除
                            </Button>

                            <Link to={`/update/${postId}`}>
                                <Button>修改</Button>
                            </Link>

                            <Modal
                                title="是否删除"
                                visible={removeModal}
                                onOk={() => {
                                    this.setState({
                                        removeModal: false
                                    });
                                    this.remove();
                                    console.log("onOK");
                                }}
                                onCancel={() => this.setState({
                                    removeModal: false
                                })}
                            >
                                <label>密码</label>
                                <Input
                                    value={password}
                                    onChange={e => this.setState({
                                        password: e.target.value
                                    })}
                                    />
                            </Modal>
                        </Footer>
                    </Layout>
                </div>
            );
        }

        return null;
    }

}
