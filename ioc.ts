import TestController from './test/contorller/controller';
import ProcessController from './AppApi/process/ProcessController'

export default {
    test: new TestController(),
    process: new ProcessController()
};