export interface RouterInfo {
    id?: string,
    name?: string,
    children?: RouterInfo[],
    path?: string,
    iconName?: string,
    componentPath?: string,
    type?: string,
    statusChecked?: boolean,
    sort?: number,
    status?: string,
    pId?: string,
}


export interface UserInfo {
    id?: string,
    name?: string,
    nickName?: string,
    username?: string,
    statusChecked?: boolean,
    mainRole: MainRole,
    sex?: string,
    birthday?: any
}

interface MainRole {
    roleId: string,
    groupId: string,
}

export interface MainRoleGroupOptions {
    roles?: any,
    replaceFields: ReplaceFields,
    data?: any,
}

interface ReplaceFields {
    title: string,
    key: string,
}

export interface mainRoleOptions {
    roles?: string,
    data?: [],
}


export interface GroupInfo {
    id?: string,
    name?: string,
    type?: string,
    statusChecked?: boolean,
    status?: string,
    pId?: string,
}

export interface RoleInfo {
    id?: string,
    name?: string,
    statusChecked?: boolean,
    status?:string,
}