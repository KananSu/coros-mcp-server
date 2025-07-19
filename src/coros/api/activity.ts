import axios from "axios";
import { formatDate, getSportNameByType, secondsToPace } from "../utils/utils.js";

const ANALYSE_DETAIL_URL = '/activity/query';
const ACTIVATY_DETAIL_QUERY = '/activity/detail/query'

export interface ActivityLapItemList {
  adjustedPace: string;
  avgPace: string;
  avgCadence: number;
  avgHr: number;
  avgPower: number;
  distance: number;
  lapIndex: number;
  avgStrideLength: number;
}

interface ActivityDetail {
  // Average pace
  avgSpeed: string;
  // Adjusted pace
  adjustedPace: string;
  // Ascent
  ascent: number;
  // Average cadence
  avgCadence: number;
  // Average heart rate
  avgHr: number;
  // Average power
  avgPower: number;
  // Best pace
  bestPace: string;
  // Calories
  calorie: number;
  // Date
  date: string;
  // Descent
  descent: number;
  // Distance
  distance: number;
  name: string;
  sportType: number;
  sportTypeName: string;
  totalDistance: number;
  totalTime: number;
  trainingLoad: number;
  // Activity label id
  labelId: number;
  // Activity detail for every km
  lapItem: ActivityLapItemList[];
}

export async function fetchLatestActivity(accessToken: string, size = 10, pageNumber = 1) {
  const options = {
    headers: {
      'Accesstoken': accessToken
    }
  };
  const res = await axios.get(`${process.env.COROS_API_URL}${ANALYSE_DETAIL_URL}?size=${size}&pageNumber=${pageNumber}`, options);
  const {
    dataList,
  } = res.data.data || {};
  const activities: Array<ActivityDetail> = new Array();
  if (!dataList) {
    return activities;
  }
  for (let index = 0; index < (dataList.length ?? 0); index++) {
    const item = dataList[index];
    const lapItem = await fetchActivityDetail(accessToken, item.labelId, item.sportType);
    activities.push({
      ...item,
      adjustedPace: secondsToPace(item.adjustedPace),
      avgSpeed: secondsToPace(item.avgSpeed),
      bestPace: secondsToPace(item.bestPace),
      sportTypeName: getSportNameByType(item.sportType),
      totalDistance: item.total,
      date: item.date ? formatDate(item.date) : '-',
      calorie: item.calorie ? item.calorie / 1000 : 0,
      lapItem: lapItem || []
    })
  }
  return activities;
}


export async function fetchActivityDetail(accessToken: string, labelId: number = 0, sportType: number = 100) {
  if (!labelId) {
    console.error('labelId is required');
    return [];
  }
  const options = {
    headers: {
      'Accesstoken': accessToken
    },
    params: {
      screenW: 769,
      screenH: 1117,
      labelId: labelId,
      sportType: sportType
    }
  };
  const res = await axios.post(`${process.env.COROS_API_URL}${ACTIVATY_DETAIL_QUERY}`, {}, options);
  const {
    lapList,
  } = res.data.data || {};
  const lapItems: Array<ActivityLapItemList> = new Array();
  if (lapList && Array.isArray(lapList)) {
    const lapListItem = lapList[0]?.lapItemList;
    if (lapListItem && Array.isArray(lapListItem)) {
      lapListItem.forEach((item: any) => {
            lapItems.push({
              adjustedPace: secondsToPace(item.adjustedPace || 0),
              avgPace: secondsToPace(item.avgPace || 0),
              avgCadence: item.avgCadence || 0,
              avgHr: item.avgHr || 0,
              avgPower: item.avgPower || 0,
              distance: Number(((item.distance ?? 0) / 1000 / 100).toFixed(2)),
              lapIndex: item.lapIndex || 0,
              avgStrideLength: Number(((item.avgStrideLength || 0)).toFixed(2)) // Convert mm to meters with 2 decimal places
            });
          });
    }
  }
  // Sort by lapIndex
  lapItems.sort((a, b) => a.lapIndex - b.lapIndex);
  return lapItems;
}