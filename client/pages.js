
import React from "react";
import {Spin} from "antd";

class AsyncComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            c: null
        };
    }

    componentDidMount () {
        this.props.require(this);
    }

    render () {
        if (this.state.c) {
            const Component = this.state.c;
            const otherProps = this.props.otherProps;
            return (
                <Component {...otherProps} />
            );
        }
        return (
            <div className="loading">
                <Spin />
            </div>
        );
    };
}

const b = (requireFunc) => {
    const b = (props) => {
        return (
            <AsyncComponent otherProps={props} require={requireFunc} />
        );
    };
    return b;
};

const Pages = [

    {
        path: "/update",
        component: b((s) => require(["./update"], m => s.setState({c: m.default})))
    },
    {
        path: "/update/:postId",
        component: b((s) => require(["./update"], m => s.setState({c: m.default})))
    },

    {
        path: "/view/:postId",
        component: b((s) => require(["./view"], m => s.setState({c: m.default})))
    },

    {
        path: "/",
        component: b((s) => require(["./home"], m => s.setState({c: m.default})))
    },
    {
        path: "/page/:page",
        component: b((s) => require(["./home"], m => s.setState({c: m.default})))
    },
    {
        path: "/category/:category",
        component: b((s) => require(["./home"], m => s.setState({c: m.default})))
    },
    {
        path: "/category/:category/page/:page",
        component: b((s) => require(["./home"], m => s.setState({c: m.default})))
    },

];

export default Pages;
