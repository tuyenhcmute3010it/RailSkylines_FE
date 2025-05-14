// import http from "@/lib/http";
// import {
//   DashboardIndicatorQueryParamsType,
//   DashboardIndicatorResType,
// } from "@/schemaValidations/indicator.schema";
// import queryString from "query-string";

// const prefix = "/api/v1/total";

// const indicatorApiRequest = {
//   getDashboardIndicator: (queryParams: DashboardIndicatorQueryParamsType) => {
//     const query = queryString.stringify(
//       {
//         startDate: queryParams.fromDate?.toISOString(),
//         endDate: queryParams.toDate?.toISOString(),
//       },
//       { skipNull: true, skipEmptyString: true }
//     );
//     return http.get<DashboardIndicatorResType>(
//       `${prefix}${query ? `?${query}` : ""}`
//     );
//   },
// };

// export default indicatorApiRequest;

import http from "@/lib/http";
import {
  DashboardIndicatorQueryParamsType,
  DashboardIndicatorResType,
} from "@/schemaValidations/indicator.schema";
import queryString from "query-string";

const prefix = "/api/v1/total";

const indicatorApiRequest = {
  getDashboardIndicator: (queryParams: DashboardIndicatorQueryParamsType) => {
    const query = queryString.stringify(
      {
        startDate: queryParams.fromDate?.toISOString(),
        endDate: queryParams.toDate?.toISOString(),
      },
      { skipNull: true, skipEmptyString: true }
    );
    return http.get<DashboardIndicatorResType>(
      `${prefix}${query ? `?${query}` : ""}`
    );
  },
};

export default indicatorApiRequest;
