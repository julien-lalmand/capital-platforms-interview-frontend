import Consultant from "../domain/Consultant";
import IRepository from "./IRepository";
import Config from "../../CapitalPlatformsConfig.json";
import axios, { AxiosError } from "axios";
import CpApiErrorResponse from "../models/CpApiErrorResponse";

export default class ConsultantsRepository implements IRepository<Consultant> {
    async getAll() : Promise<Consultant[] | CpApiErrorResponse> {
        let response = await axios.get<Consultant[] | CpApiErrorResponse>(`${Config.backend.url}/api/Consultants`);
        return response instanceof AxiosError ? response.response?.data : response.data;
    }
    async get(id: number): Promise<Consultant | CpApiErrorResponse> {
        let response = await axios.get<Consultant | CpApiErrorResponse>(`${Config.backend.url}/api/Consultants/${id}`);
        return response instanceof AxiosError ? response.response?.data : response.data;
    }
    async create(entity: Consultant): Promise<number | CpApiErrorResponse> {
        let response = await axios.post<number | CpApiErrorResponse>(`${Config.backend.url}/api/Consultants`, entity);
        return response instanceof AxiosError ? response.response?.data : response.data;
    }
    async update(entity: Consultant): Promise<void | CpApiErrorResponse> {
        let response = await axios.put<void | CpApiErrorResponse>(`${Config.backend.url}/api/Consultants`, entity);
        return response instanceof AxiosError ? response.response?.data : response.data;
    }
    async delete(id: number): Promise<void | CpApiErrorResponse> {
        let response = await axios.delete<void | CpApiErrorResponse>(`${Config.backend.url}/api/Consultants`, {
            data: {
                "id": id
            }
        });
        return response.data;
    }
}