import { Component } from "nea-boot";

@Component("userService")
export class UserService {

    getUserByUsername = (username: string) => {
        return { username: "admin", password: ".4321.5678" }
    }

}