import DiscretionaryRule from "../domain/DiscretionaryRule";
import IRepository from "./IRepository";
import Config from "../../CapitalPlatformsConfig.json";
import axios, { AxiosError } from "axios";
import CpApiErrorResponse from "../models/CpApiErrorResponse";

export default class DiscretionaryRulesRepository implements IRepository<DiscretionaryRule> {
    async getAll() : Promise<DiscretionaryRule[] | CpApiErrorResponse> {
        let response = await axios.get<DiscretionaryRule[] | CpApiErrorResponse>(`${Config.backend.url}/api/DiscretionaryRules`);
        return response instanceof AxiosError ? response.response?.data : response.data;
    }
    async get(id: number): Promise<DiscretionaryRule | CpApiErrorResponse> {
        let response = await axios.get<DiscretionaryRule | CpApiErrorResponse>(`${Config.backend.url}/api/DiscretionaryRules/${id}`);
        return response instanceof AxiosError ? response.response?.data : response.data;
    }
    async create(entity: DiscretionaryRule): Promise<number | CpApiErrorResponse> {
        let response = await axios.post<number | CpApiErrorResponse>(`${Config.backend.url}/api/DiscretionaryRules`, entity);
        return response instanceof AxiosError ? response.response?.data : response.data;
    }
    async update(entity: DiscretionaryRule): Promise<void | CpApiErrorResponse> {
        let response = await axios.put<void | CpApiErrorResponse>(`${Config.backend.url}/api/DiscretionaryRules`, entity);
        return response instanceof AxiosError ? response.response?.data : response.data;
    }
    async delete(id: number): Promise<void | CpApiErrorResponse> {
        let response = await axios.delete<void | CpApiErrorResponse>(`${Config.backend.url}/api/DiscretionaryRules`, {
            data: {
                "id": id
            }
        });
        return response.data;
    }
}