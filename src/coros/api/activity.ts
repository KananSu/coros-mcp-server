import axios from "axios";
import { formatDate, getSportNameByType, secondsToPace } from "../utils/utils.js";

const ANALYSE_DETAIL_URL = '/activity/query';

interface ActivityDetail {
  // Average pace
  avgSpeed: string,
  // Adjusted pace
  adjustedPace: string,
  // Ascent
  ascent: number,
  // Average cadence
  avgCadence: number,
  // Average heart rate
  avgHr: number,
  // Average power
  avgPower: number,
  // Best pace
  best: string
  // Calories
  calorie: number,
  // Date
  date: string,
  // Descent
  descent: number,
  // Distance
  distance: number
  name: 'string'
  sportType: string,
  totalDistance: number
  totalTime: number
  trainingLoad: number
}

export async function fetchLatestActivity(accessToken: string, size = 50, pageNumber = 1) {
  const options = {
    headers: {
      'Accesstoken': accessToken
    }

  };
  const res = await axios.get(`${process.env.COROS_API_URL}${ANALYSE_DETAIL_URL}?size=${size}&pageNumber=${pageNumber}`, options);
  const {
    dataList,
  } = res.data.data;
  const activities: Array<ActivityDetail> = new Array();
  dataList?.forEach((item: any) => {
    activities.push({
      ...item,
      adjustedPace: secondsToPace(item.adjustedPace),
      bestPace: secondsToPace(item.bestPace),
      sportType: getSportNameByType(item.sportType),
      totalDistance: item.total,
      date: item.date ? formatDate(item.date): '-',
    })
  })
  return activities;
}