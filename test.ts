// 定义一个注入装饰器
function Injectable(target: any) {
    target.injectable = true;
  }
  
  // 定义一个注入标记装饰器
  function Inject(token: any) {
    return function(target: any, key: string) {
      target.injections = target.injections || {};
      target[key] = token;
    }
  }
  
  // 定义一个服务
  @Injectable
  class UserService {
    public getUsers(): string[] {
      return ['User 1', 'User 2', 'User 3'];
    }
  }
  
  // 定义一个控制器
  @Injectable
  class UserController {
    @Inject(UserService) 
    private userService: UserService
    constructor() {}
  
    public getUsers(): string[] {
      return this.userService.getUsers();
    }
  }
  
  // 创建一个控制器的实例
  const controller = new UserController();
  console.log(controller.getUsers()); // ['User 1', 'User 2', 'User 3']
  