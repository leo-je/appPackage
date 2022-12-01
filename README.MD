# ui
```sh
 yarn create @vitejs/app ui --template vue-ts
 cnpm install
 npm run dev
```

# node-gm

```sh
# 安装jpeg包 
brew install libjpeg
# 安装jasper包 
brew install jasper
# 安装libpng 
brew install libpng
# 安装freetype包 
brew install freetype
# 安装GraphicsMagick 自动安装：
brew install GraphicsMagick

brew install ghostscript

yarn add gm
```

# 用@替代根路径
```sh
# 1.tsconfig.json
"baseUrl": "./",
"paths": {
    "@/*": [
    "*",
    ]
},
# 2.1添加包 module-alias
# 2.2入口文件 
require('module-alias/register')
```