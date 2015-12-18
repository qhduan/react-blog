
# react-blog

使用react, webpack, bootstrap, babel等开发

## 坑

webpack ~1.12.9带的crypto-browserify版本太旧了，然后我自己装了browserify-cipher，用于实现models/secret.js

wepack 开了uglifyjs真是慢啊，当然也是预料中的

没用react-router，因为这个不算官方的，觉得不是很爽，自己写个了简单的router，但是遇到了不少bug，主要是url hash更新的问题

## demo

http://qhduan.com
