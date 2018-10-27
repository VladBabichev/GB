//export interface UserCompany {
//    CompanyId: number;
//    CompanyName: string;
//    IsSelected: boolean;    
//}

//export interface UserCompanyTest {
//    userId: string;
//    userName: string;
//    companyId: number;
//    companyName: string;
//    roleId: string;
//    roleName: string;
//    isSelected: boolean;
//}
export interface Company {
    companyId: number;
    companyName: string;
}

export interface CompaniesResult {
    Companies: Company[];
}

export interface Role {

    roleId: string;
    roleName: string;

}
export interface RolesResult {
    Roles: UserRole[];
}

export interface UserRole {
    userId: string;
	userName: string;
	email: string;
	roleId: string;
	roleName: string;
    companyId: number;
    isAdmin: boolean;
    isOwner: boolean;
}
export interface User {

    userId: string;
    userName: string;
	email: string;
    roleId: string;
    companyId: number;
    isAdmin: boolean;
    isOwner: boolean;
    companyName: string;

}
export interface Project {
    id: number;
    name: string;
    isSelected: boolean;

}
export interface ResourceGroup {
    resourceGroupId: number;
    companyId: number;
    name: string;
}
export interface ResourceGroupsResult {
    resourceGroup: ResourceGroup[];
    companyId: number;
}
export interface Resource {
    resourceGroupId: number,
    resourceTypeId: number,
    resourceId: string,
    isSelected: boolean,
    name:string
}
export interface ResourceResult {
    resource: Resource[];
    resourceGroupId: number,
    resourceType: string,
}
//User Permission
export interface Permission {
    userId: string;
    resourceGroupId: number;   
    checked: boolean;
    resourceName: string;
}
export interface PermissionResult {
    permission: Permission[];
    userId: string;
}