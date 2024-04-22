import { axios } from "../index.js";

export default {
  getFacilitiesEvent() {
    return axios.$get("/api/v1/facilities_events");
  },
  getFacilitiesEventDetail(id) {
    return axios.$get(`/api/v1/facilities_events/${id}`);
  },
  updateFacilitiesEventDetail(update_params) {
    return axios.$put(`/api/v1/facilities_events/${update_params.id}/update_facility_information`,
    { 
      "name" : update_params.name,
      "address": update_params.address, 
      "opening_hours": update_params.opening_hours, 
      "holiday": update_params.holiday, 
      "available_payment": update_params.available_payment,
      "offical_url": update_params.offical_url, 
      "outline":update_params.outline
    });
  },
};
