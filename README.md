
# react-blog

使用 react, react-router, webpack, babel, antd 等开发

## 坑


[20171223]

删除了redux，这东西……没法更新，本来也没复杂到需要redux就是了。  
或者说redux更新之后我已经完全无法（简单）理解了。  
然后干脆花了3个小时重新写了一遍前端。

[old]

webpack ~1.12.9带的crypto-browserify版本太旧了，然后我自己装了browserify-cipher，用于实现component/secret.js

开始webpack没上hot-middleware，编译速度是相当慢啊，后来上了，就好了

redux和与之匹配的系列实在是太复杂了，不过总体来说，至少算是清晰了吧

个人理解redux，action算M，reducer算C，当然V就是react的component了
