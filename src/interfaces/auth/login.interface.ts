import {DeviceType} from "../../utils/enums";

export interface LoginRequestBody {
    email: string;
    password: string;
    deviceType: DeviceType;
}
