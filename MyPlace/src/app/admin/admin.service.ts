import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Company, CompaniesResult, RolesResult, Role, UserRole, User, Project, ResourceGroupsResult, ResourceGroup, Resource, ResourceResult,Permission,PermissionResult } from "../admin/model/interfaces";

export class Tab {
	id: number;
	text: string;
	icon: string;
}

@Injectable()
export class AdminService {

    constructor(
        private http: HttpClient) { }

     public getRoles(): Observable<Role[]> {
        const url = `${environment.serverBaseUrl}api/admin/roles`;
        return this.http.get<Role[]>(url, { withCredentials: true });
    }

    public getCompanies(isAddUndefined: number): Observable<Company[]> {     
		const url = `${environment.serverBaseUrl}api/admin/companies/${isAddUndefined}`;
        return this.http.get<Company[]>(url, { withCredentials: true });
    }

    public deleteCompany(company:Company): Observable<any> {
        const url = `${environment.serverBaseUrl}api/admin/deleteCompany`;
        return this.http.post<any>(url, company, { withCredentials: true });
	}

    public saveRoles(roles: RolesResult): Observable<any> {
        const url = `${environment.serverBaseUrl}api/admin/saveRoles`;
        return this.http.post<any>(url, roles, { withCredentials: true });
	}

	public saveRole(role: UserRole): Observable<any> {
		const url = `${environment.serverBaseUrl}api/admin/saveRole`;
		return this.http.post<any>(url, role, { withCredentials: true });
	}

	public updateUser(model: any): Observable<any> {
		const url = `${environment.serverBaseUrl}api/admin/users/${model.userId}`;
		return this.http.put<any>(url, model, { withCredentials: true });
	}

	public deleteUser(userId: string): Observable<Permission[]> {
		if (userId == null || userId == undefined)
			userId = "a";
		const url = `${environment.serverBaseUrl}api/admin/deleteUser/${userId}`;
		return this.http.get<Permission[]>(url, { withCredentials: true });
	}

    public getUserRoles(isActive: boolean = true): Observable<UserRole[]> {
        const url = `${environment.serverBaseUrl}api/admin/userRoles?active=${isActive}`;
        return this.http.get<UserRole[]>(url, { withCredentials: true });
    }
	public getContributors(): Observable<UserRole[]> {
		const url = `${environment.serverBaseUrl}api/admin/contributors`;
		return this.http.get<UserRole[]>(url, { withCredentials: true });
	}

    public getUser(): Observable<User> {
        const url = `${environment.serverBaseUrl}api/admin/user`;
        return this.http.get<User>(url, { withCredentials: true });
    }

    public getResouceGroups(): Observable<ResourceGroup[]> {
        const url = `${environment.serverBaseUrl}api/admin/resourceGroups`;
        return this.http.get<ResourceGroup[]>(url, { withCredentials: true });
    }

    //public getProjects(): Observable<Project[]> {
    //    const url = `${environment.serverBaseUrl}api/admin/projects`;
    //    return this.http.get<Project[]>(url, { withCredentials: true });
    //}

 	public saveResourceGroup(result: ResourceGroup): Observable<any> {
		const url = `${environment.serverBaseUrl}api/admin/updateResourceGroup`;
		return this.http.post<any>(url, result, { withCredentials: true });
	}

    public deleteResourceGroup(resourceGroup: ResourceGroup): Observable<any> {
        const url = `${environment.serverBaseUrl}api/admin/deleteResourceGroup`;
        return this.http.post<any>(url, resourceGroup, { withCredentials: true });
	}

	getResouceProjects(resourceGroupId: any): Observable<Resource[]> {
		if (resourceGroupId == NaN || resourceGroupId == null || resourceGroupId == undefined || typeof (resourceGroupId) != "number")
			resourceGroupId = 0;
        const url = `${environment.serverBaseUrl}api/admin/resourceProject/${resourceGroupId}`;
        return this.http.get<Resource[]>(url, { withCredentials: true });
	}

	getResouceTemplates(resourceGroupId: any): Observable<Resource[]> {
		if (resourceGroupId == NaN || resourceGroupId == null || resourceGroupId == undefined || typeof (resourceGroupId) != "number")
			resourceGroupId = 0;
		const url = `${environment.serverBaseUrl}api/admin/resourceTemplate/${resourceGroupId}`;
		return this.http.get<Resource[]>(url, { withCredentials: true });
	}

	getResouceViews(resourceGroupId: any): Observable<Resource[]> {
		if (resourceGroupId == NaN || resourceGroupId == null || resourceGroupId == undefined || typeof (resourceGroupId) != "number")
			resourceGroupId = 0;
		const url = `${environment.serverBaseUrl}api/admin/resourceView/${resourceGroupId}`;
		return this.http.get<Resource[]>(url, { withCredentials: true });
	}
	
	getResouceSpecifications(resourceGroupId: any): Observable<Resource[]> {
		if (resourceGroupId == NaN || resourceGroupId == null || resourceGroupId == undefined || typeof (resourceGroupId) != "number")
			resourceGroupId = 0;
		const url = `${environment.serverBaseUrl}api/admin/resourceSpec/${resourceGroupId}`;
		return this.http.get<Resource[]>(url, { withCredentials: true });
	}

	getResouceDashboards(resourceGroupId: any): Observable<Resource[]> {
		if (resourceGroupId == NaN || resourceGroupId == null || resourceGroupId == undefined || typeof (resourceGroupId) != "number")
			resourceGroupId = 0;
		const url = `${environment.serverBaseUrl}api/admin/resourceDash/${resourceGroupId}`;
		return this.http.get<Resource[]>(url, { withCredentials: true });
	}

    public saveResource(result: Resource): Observable<any> {
        const url = `${environment.serverBaseUrl}api/admin/updateResource`;
        return this.http.post<Resource>(url, result, { withCredentials: true });
    }
	public saveCompany(comp: Company): Observable<any> {
		const url = `${environment.serverBaseUrl}api/admin/saveCompany`;
		return this.http.post<any>(url, comp, { withCredentials: true });
	}

    getUserPermissions(userId: string): Observable<Permission[]> {
		if (userId == null || userId == undefined)
			userId = "a";
        const url = `${environment.serverBaseUrl}api/admin/permission/${userId}`;
        return this.http.get<Permission[]>(url, { withCredentials: true });
    }

	public saveUserPermission(result: Permission): Observable<any> {
		const url = `${environment.serverBaseUrl}api/admin/updatePermission`;
		return this.http.post<Permission>(url, result, { withCredentials: true });
	}
}