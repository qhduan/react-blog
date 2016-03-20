
# react-blog

使用react, redux, react-router, react-router-redux, webpack, babel等开发

## 坑

webpack ~1.12.9带的crypto-browserify版本太旧了，然后我自己装了browserify-cipher，用于实现component/secret.js

开始webpack没上hot-middleware，编译速度是相当慢啊，后来上了，就好了

redux和与之匹配的系列实在是太复杂了，不过总体来说，至少算是清晰了吧

个人理解redux，action算M，reducer算C，当然V就是react的component了

