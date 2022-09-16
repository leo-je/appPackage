import dotenv from 'dotenv'
dotenv.config()

const config = {
    jwt: {
        secret: "hahaha",
        loginPath: "/oauth/login",
    },
    appRootDirPath: process.env.appRootDirPath,
    appreleaseDirPath: process.env.appreleaseDirPath,
    db: {
        connection: {
            mysql: {
                dev: {
                    host: "10.19.2.210",  //mysql的安装主机地址
                    port: 3306,
                    user: "cofficecaihdev",        //访问mysql的用户名
                    password: "7eZeY%Y&1", // 访问mysql的密码
                    database: "cofficecaihdev",    //访问mysql的数据库名
                    connectionLimit: 10
                },
                uat: {
                    host: "10.19.2.210",  //mysql的安装主机地址
                    port: 3307,
                    user: "cofficecaihuat",        //访问mysql的用户名
                    password: "EHRUetg!1", // 访问mysql的密码
                    database: "cofficecaihuat" ,   //访问mysql的数据库名
                    connectionLimit: 10
                }
            }
        }
    }
}

export { config }