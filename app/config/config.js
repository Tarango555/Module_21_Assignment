export const PORT=5050;
export const DATABASE='mongodb+srv://tarango:Tarango_007@cluster0.u1qhi.mongodb.net/StudentRegistrationProject';

//Access Token
export const ACCESS_TOKEN_SECRET_KEY= 'A#442@!|{/.,R0987*$@~' ; 
export const ACCESS_TOKEN_EXPIRE_TIME='7d';

//Refresh Token
export const REFRESH_TOKEN_SECRET_KEY='fs2dd3fdf45D0op[@j77*'; 
export const REFRESH_TOKEN_EXPIRE_TIME='30d';

//Refresh TOken cookieOptions
export const HTTP_ONLY= true;         
export const IS_PRODUCTION= false;          
export const MAX_AGE= 7 * 24 * 60 * 60 * 1000;  
export const SAME_SITE= 'Lax';


export const WEB_CACHE=false;
export const MAX_JSON_SIZE="10MB";
export const URL_ENCODE=true;

// App use limiter (express-rate-limit)
export const REQUEST_TIME = 15*60*1000;  
export const REQUEST_NUMBER = 1000; 
export const MESSAGE = "Too many requests, please try again later.";
