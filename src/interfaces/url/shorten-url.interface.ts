import {ExpirationType} from "../../utils/enums";

export interface ShortUrlRequestBody {
    targetUrl: string;
    expirationType?: ExpirationType;
    customExpiryDate?: string;
}