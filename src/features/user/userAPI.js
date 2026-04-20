import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "../../shared/constants/apiEndpoints";

const updateUserProfile = async (formData) => {
    const res = await api.patch(API_ENDPOINTS.User.UPDATE, formData);
    console.log("Log from userApi: ", res);

    return res.data;
};

export { updateUserProfile };
