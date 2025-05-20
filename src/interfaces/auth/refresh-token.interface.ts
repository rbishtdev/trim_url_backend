import {DeviceType} from "../../utils/enums";

export interface RefreshTokenRequestBody {
    refreshToken: string;
    deviceType: DeviceType;
}
