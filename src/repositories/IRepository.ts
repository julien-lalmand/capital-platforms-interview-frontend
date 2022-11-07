import CpApiErrorResponse from "../models/CpApiErrorResponse";

export default interface IRepository<T> {
    getAll(): Promise<T[] | CpApiErrorResponse>;
    get(id: number): Promise<T | CpApiErrorResponse>;
    create(entity: T): Promise<number | CpApiErrorResponse>;
    update(entity: T): Promise<void | CpApiErrorResponse>;
    delete(id: number): Promise<void | CpApiErrorResponse>;
}