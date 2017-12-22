
import React from "react";
import {Layout, Row, Col, Menu, Card, Button, Pagination, Spin} from "antd";
const {Header, Footer, Content} = Layout;
import {Link, Redirect} from "react-router-dom";

export default class HomePage extends React.Component {

    constructor (props) {
        super(props);

        this.state = {
            title: "",
            posts: [],
            articles: [],
            page: 1,
            category: "",
            categories: [],
            maxPage: 1,
            loading: false,
            redirect: null,
            pageCount: 1,
        };
        // const {page, category} = this.parseParams();
    }

    componentDidMount () {
        this.update();
    }

    componentDidUpdate (prevProps) {
        if (JSON.stringify(prevProps.match.params) !== JSON.stringify(this.props.match.params)) {
            this.update();
        }
    }

    parseParams () {
        // let {page, category} = this.props.params;
        let {page, category} = this.props.match.params;

        if (_.isString(category) && category.length > 0) {
            // pass
        } else {
            category = "";
        }

        if (_.isString(page) && page.match(/^\d+$/) && Number.parseInt(page) > 0) {
            page = Number.parseInt(page);
        } else {
            page = 1;
        }

        return {page, category};
    }

    update () {

        const {page, category} = this.parseParams();

        this.setState({loading: true});

        console.log("load", category, page);

        fetch("/index.json")
        .then(response => response.json())
        .then(json => {

            require.ensure([], require => {

                // 调用两个 node server 和 client 都要用的库
                const parseArticle = require("../../component/parseArticle.js");
                const markdown = require("../../component/markdown.js");

                let promies = [];
                const title = json.title;
                const pageCount = json.pageCount;

                let articles = json.articles.filter(element => {
                    return element[3] == "article";
                });

                let posts = json.articles.filter(element => {
                    return element[3] == "post";
                });

                posts.sort((a, b) => {
                    if (a[2] > b[2]) return -1;
                    else if (a[2] < b[2]) return 1;
                    return 0;
                });

                const categories = [[], ...posts].reduce((arr, element) => {
                    if (element[4].length && arr.indexOf(element[4]) == -1) {
                        arr.push(element[4]);
                    }
                    return arr;
                });

                if (category && category.length) {
                    posts = posts.filter(e => e[4] == category);
                }

                // const maxPage = Math.ceil(posts.length / pageCount);
                const maxPage = posts.length;

                // console.log("maxPage", maxPage);

                posts = posts.slice((page - 1) * pageCount, page * pageCount);
                for (let p of posts) {
                    (p => {
                        const id = p[0];
                        const m = id.match(/(\d{4})(\d{2})(\d{4})/);
                        const year = m[1];
                        const month = m[2];
                        promies.push(new Promise(resolve => {
                            fetch(`/articles/${year}/${month}/${id}.md`)
                            .then(response => response.text())
                            .then(data => parseArticle(data))
                            .then(data => {
                                p[5] = markdown(data.content);
                                resolve();
                            });
                        }));
                    })(p);
                }

                Promise.all(promies).then(() => {
                    // console.log(posts.length, pageCount, maxPage, page);
                    // dispatch(receiveData({title, posts, articles, page, category, categories, maxPage}));
                    this.setState({
                        title,
                        posts,
                        articles,
                        page,
                        category,
                        categories,
                        maxPage,
                        pageCount,
                        loading: false,
                    });
                });
            });
        });
    }

    render () {

        const {
            category,
            loading,
            title,
            posts,
            articles,
            categories,
            maxPage,
            page,
            redirect,
            pageCount,
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
                                    {title}
                                </Link>
                            </Menu.Item>
                            {articles.map(item => (
                                <Menu.Item key={item[0]}>
                                    <Link to={`/view/${item[0]}`}>
                                        {item[1]}
                                    </Link>
                                </Menu.Item>
                            ))}
                        </Menu>
                    </Header>
                    <Content>

                        <div
                            style={{
                                padding: "24px 50px"
                            }}
                        >
                            {posts.map(item => (
                                <Card
                                    style={{marginBottom: "20px"}}
                                    key={item[0]}
                                    title={
                                        <div>
                                            <Link to={`/view/${item[0]}`}>
                                                {item[1]}
                                            </Link>
                                            <span style={{float: "right"}}>
                                                {item[2]}
                                            </span>
                                        </div>
                                    }
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: item[5]
                                        }}
                                    />
                                </Card>
                            ))}

                            <Pagination
                                defaultCurrent={page}
                                defaultPageSize={pageCount}
                                total={maxPage}
                                onChange={page => {
                                    if (category) {
                                        this.props.history.push(
                                            `/category/${category}/page/${page}`
                                        );
                                        // this.setState({
                                        //     redirect: `/category/${category}/page/${page}`
                                        // });
                                    } else {
                                        this.props.history.push(
                                            `/page/${page}`
                                        );
                                        // this.setState({
                                        //     redirect: `/page/${page}`
                                        // });
                                    }
                                }}
                                />
                        </div>

                    </Content>
                    <Footer>
                        <p>
                            {categories.map(item => (
                                <Link
                                    to={`/category/${item}`}
                                    key={item}
                                    style={{padding: "10px"}}
                                >
                                    {item}
                                </Link>
                            ))}
                        </p>

                        <p>

                            <a
                                style={{float: "right"}}
                            >
                                mail
                                <span
                                    style={{
                                        border: "1px solid #283593",
                                        borderRadius: "10px",
                                        paddingLeft: "5px",
                                        paddingRight: "5px",
                                        marginLeft: "5px",
                                        marginRight: "5px",
                                    }}
                                >
                                    a
                                </span>
                                qhduan.com
                            </a>

                            <Link to="/update">
                                <Button>新建</Button>
                            </Link>
                        </p>


                    </Footer>
                </Layout>
            </div>
        );
    }

}
