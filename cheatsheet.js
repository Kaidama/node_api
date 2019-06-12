//  RequestValidation {
//     assert: ValidatorFunction;
//     validate: ValidatorFunction;
//     check: ValidatorFunction;
//     checkBody: ValidatorFunction;
//     checkCookies: ValidatorFunction;
//     checkHeaders: ValidatorFunction;
//     checkParams: ValidatorFunction;
//     checkQuery: ValidatorFunction;

//     filter: SanitizerFunction;
//     sanitize: SanitizerFunction;
//     sanitizeBody: SanitizerFunction;
//     sanitizeQuery: SanitizerFunction;
//     sanitizeParams: SanitizerFunction;
//     sanitizeHeaders: SanitizerFunction;
//     sanitizeCookies: SanitizerFunction;

//     validationErrors(mapped?: boolean): Record<string, any> | any[];
//     validationErrors<T>(mapped?: boolean): Record<string, T> | T[];
//     asyncValidationErrors(mapped?: boolean): Promise<any[] | Record<string, any>>;
//     asyncValidationErrors<T>(mapped?: boolean): Promise<T[] | Record<string, T>>;
//     getValidationResult(): Promise<Result>
//   }