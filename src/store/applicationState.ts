export default interface IApplicationState {
    appSettings: IAppSettings,
    connections: IConnection[],
    recentProjects: IProject[],
    currentProject: IProject
}

export interface IAppSettings {
    devToolsEnabled: boolean
}

export interface IProject {
    id: string,
    name: string,
    description: string,
    tags: ITag[],
    connection: IConnection,
    exportFormat: IExportFormat
}

export interface ITag{
    name: string,
    color: string
}

export interface IConnection {
    id: string,
    name: string,
    providerType: string,
    providerOptions: any
}

export interface IExportFormat {
    id: string,
    name: string,
    providerType: string,
    providerOptions: any
}