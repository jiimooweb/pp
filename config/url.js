import env from './env'

// const DEV_URL = 'http://localhost:8000'
const DEV_URL = 'https://www.zshjnyoa.com/rdoor_oa/public/'
// const DEV_URL = 'http://120.79.203.214/rdoor_oa/public/'
// const DEV_URL = 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/'
const PRO_URL = 'https://www.zshjnyoa.com/rdoor_oa/public/'

export default env === 'development' ? DEV_URL : PRO_URL
