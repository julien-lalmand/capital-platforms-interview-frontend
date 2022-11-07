import Customer from "../domain/Customer";
import IRepository from "./IRepository";
import Config from "../../CapitalPlatformsConfig.json";
import axios, { AxiosError } from "axios";
import CpApiErrorResponse from "../models/CpApiErrorResponse";

export default class CustomersRepository implements IRepository<Customer> {
    async getAll() : Promise<Customer[] | CpApiErrorResponse> {
        let response = await axios.get<Customer[] | CpApiErrorResponse>(`${Config.backend.url}/api/Customers`);
        return response instanceof AxiosError ? response.response?.data : response.data;
    }
    async get(id: number): Promise<Customer | CpApiErrorResponse> {
        let response = await axios.get<Customer | CpApiErrorResponse>(`${Config.backend.url}/api/Customers/${id}`);
        return response instanceof AxiosError ? response.response?.data : response.data;
    }
    async create(entity: Customer): Promise<number | CpApiErrorResponse> {
        let response = await axios.post<number | CpApiErrorResponse>(`${Config.backend.url}/api/Customers`, entity);
        return response instanceof AxiosError ? response.response?.data : response.data;
    }
    async update(entity: Customer): Promise<void | CpApiErrorResponse> {
        let response = await axios.put<void | CpApiErrorResponse>(`${Config.backend.url}/api/Customers`, entity);
        return response instanceof AxiosError ? response.response?.data : response.data;
    }
    async delete(id: number): Promise<void | CpApiErrorResponse> {
        let response = await axios.delete<void | CpApiErrorResponse>(`${Config.backend.url}/api/Customers`, {
            data: {
                "id": id
            }
        });
        return response.data;
    }
}