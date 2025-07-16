import axios from 'axios';
import md5 from 'md5';
import { birthdayToAge } from '../utils/utils.js';

const LOGIN_URL = '/account/login';
const USER_ACCOUNT = '/account/query'

export function getAccessToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    const email = process.env.COROS_EMAIL;
    const password = process.env.COROS_PASSWORD;
    if (!email || !password) {
      reject(new Error('COROS_EMAIL or COROS_PASSWORD env is not set'));
    }
    axios.post(`${process.env.COROS_API_URL}${LOGIN_URL}`, {
      account: email,
      pwd: md5(password ?? ''),
      accountType: 2,
    }).then((res) => {
      const data = res.data;
      if (data.result === '0000') {
        resolve(data.data.accessToken);
      } else {
        reject(new Error(data.message));
      }
    }).catch((err) => {
      reject(err);
    });
  });
}

enum Sex {
  'Male' = 0,
  'Female' = 1,
}

interface UserAccount {
  age: number,
  sex: Sex,
  maxHeartRate: number,
  // Resting heart rate
  restingHeartRate: number,
  // Height
  height: number
  weight: number,
}


export async function fetchUserData(accessToken: string): Promise<UserAccount> {
  const options = {
    headers: {
      'X-No-Warnning': '1',
      'Accesstoken': accessToken
    }
  };
  const res = await axios.get(`${process.env.COROS_API_URL}${USER_ACCOUNT}`, options);
  const {
    birthday = 0,
    sex = 0,
    maxHr = 0,
    // Resting heart rate
    rhr = 0,
    // Height
    status = 170,
    weight =  70,
  } = res.data.data;
  const age = birthdayToAge(birthday);
  const userData: UserAccount = {
    age,
    sex: sex === 0 ? Sex.Male: Sex.Female,
    maxHeartRate: maxHr,
    restingHeartRate: rhr,
    height: status,
    weight,
  }
  return userData;
}

