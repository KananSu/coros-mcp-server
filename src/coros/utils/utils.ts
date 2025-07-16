export function secondsToTime(seconds: number) {
  const hour = Math.floor(seconds / 3600);
  const minute = Math.floor((seconds - hour * 3600) / 60);
  const second = seconds - hour * 3600 - minute * 60;
  return `${hour}:${minute}:${second}`;
}

export function secondsToPace(seconds: number) {
  const minute = Math.floor(seconds / 60);
  const second = seconds - minute * 60;
  return `${minute}:${second}`;
}

export function birthdayToAge(birthday: number) {
  const year = Math.floor(birthday / 10000);
  const month = Math.floor((birthday % 10000) / 100);
  const day = birthday % 100;
  const todayDate = new Date();
  let age = todayDate.getFullYear() - year;
  const monthDiff = todayDate.getMonth() - month;
  const dayDiff = todayDate.getDate() - day;
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }
  return age;
}

// day: YMD format, for example: 20250714
export function formatDate(day: number) {
  const year = Math.floor(day / 10000);
  const month = Math.floor((day % 10000) / 100);
  const date = day % 100;
  return `${year}-${month}-${date}`;
}

export function getSportNameByType(type: number | string) {
  // form coros web
  // "-100": "Category_Run",
  // "-104": "Category_Walk",
  // "-105": "Category_Climb",
  // "-200": "Category_Bike",
  // "-300": "Category_Swim",
  // "-400": "Category_Cardio",
  // "-402": "Category_Strength",
  // "-500": "Category_Ski",
  // "-10000": "Category_GroupSport",
  // "-700": "Category_Aquatics",
  // 0: "All",
  // 100: "Run",
  // 101: "Indoor_Run",
  // 102: "Trail_Run",
  // 103: "Track_Run",
  // 104: "Hike",
  // 105: "Mtn_Climb",
  // 200: "Bike",
  // 299: "Helmet_Bike",
  // 201: "Indoor_Bike",
  // 300: "Pool_Swim",
  // 301: "Open_Water",
  // 1e4: "Triathlon",
  // 402: "Strength",
  // 400: "Gym_Cardio",
  // 401: "GPS_Cardio",
  // 500: "Ski",
  // 501: "Snowboard",
  // 502: "XC_Ski",
  // 503: "Ski_Touring",
  // 10002: "Ski_Touring_Old",
  // 10001: "Multi_Sport",
  // 706: "Speedsurfing",
  // 705: "Windsurfing",
  // 700: "Row",
  // 701: "Indoor_Row",
  // 702: "Whitewater",
  // 704: "Flatwater",
  // 10003: "Multi_Pitch",
  // 106: "Climb",
  // 900: "Walk",
  // 901: "Jump_Rope"
  switch (type) {
    case 100: {
      return 'Run';
    }
    case 101: {
      return 'Indoor_Run';
    }
    case 102: {
      return 'Trail_Run'
    }
    case 200: {
      return 'Bike'
    }
    case 201: {
      return 'Indoor_Bike'
    }
    case 299: {
      return 'Helmet_Bike'
    }
    default: {
      return 'Other';
    }
  }
}
