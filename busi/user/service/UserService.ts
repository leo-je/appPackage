import { Component } from "@ohuo_ozn/nea";

@Component("userService")
export class UserService {

    getUserByUsername = (username: string) => {
        return { username: "admin", password: ".4321.5678" }
    }

}