export const PORT=5050;
export const DATABASE='mongodb+srv://tarango:Tarango_007@cluster0.u1qhi.mongodb.net/StudentRegistrationProject';

//Access Token
export const ACCESS_TOKEN_SECRET_KEY= 'A#442@!|{/.,R0987*$@~' ; //this should be saved in environment variable
export const ACCESS_TOKEN_EXPIRE_TIME='7d'; // standard is 15m

//Refresh Token
export const REFRESH_TOKEN_SECRET_KEY='fs2dd3fdf45D0op[@j77*'; //this should be saved in environment variable
export const REFRESH_TOKEN_EXPIRE_TIME='30d'; //Defined in seconds (s) and should be higher than access token time

//Refresh TOken cookieOptions
export const HTTP_ONLY= true;          // Prevent JavaScript access (good for security, Postman will handle this automatically)
export const IS_PRODUCTION= false;           // Set to false because Postman is using HTTP (not HTTPS) during development
export const MAX_AGE= 7 * 24 * 60 * 60 * 1000;  // 7 days expiration (in milliseconds) time for refresh token
export const SAME_SITE= 'Lax';          // 'Strict', 'None'. Good CSRF protection, works with most same-site requests // prevents CSRF attacks

// export const EMAIL_HOST="mail.teamrabbil.com";
// export const EMAIL_PORT=587;
// export const EMAIL_SECURITY=false;
// export const EMAIL_USER="info@teamrabbil.com";
// export const EMAIL_PASS="~sR4[bhaC[Qs";
// export const EMAIL_UN_AUTH=false;

export const WEB_CACHE=false;
export const MAX_JSON_SIZE="10MB";
export const URL_ENCODE=true;

// App use limiter (express-rate-limit)
export const REQUEST_TIME = 15*60*1000;  // 15 minutes
export const REQUEST_NUMBER = 1000;     // Limit to 1000 requests per 15 minutes per IP
export const MESSAGE = "Too many requests, please try again later.";
